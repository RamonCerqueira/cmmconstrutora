import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import RHDashboardClient from '@/components/RHDashboardClient';

export default async function RHDashboardPage() {
  const user = await getSessionUser();

  if (!user || user.role !== 'ADMIN') {
    redirect('/auth?mode=login');
  }

  // Fetch job vacancies
  const vacancies = await prisma.vacancy.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Fetch applications with candidate profile, experiences, educations
  const applications = await prisma.application.findMany({
    include: {
      vacancy: {
        select: {
          id: true,
          title: true,
          city: true,
          state: true,
          modality: true,
        },
      },
      candidate: {
        select: {
          id: true,
          email: true,
          name: true,
          profile: {
            include: {
              experiences: {
                orderBy: { startDate: 'desc' },
              },
              educations: {
                orderBy: { startDate: 'desc' },
              },
            },
          },
        },
      },
    },
    orderBy: { score: 'desc' }, // Order candidates by score of match!
  });

  // Fetch audit logs
  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 30, // Get last 30 log events
  });

  // Serialize models for client component safety (dealing with dates)
  const serializedVacancies = vacancies.map((v: any) => ({
    id: v.id,
    title: v.title,
    area: v.area,
    city: v.city,
    state: v.state,
    modality: v.modality,
    salary: v.salary,
    benefits: v.benefits,
    quantity: v.quantity,
    requirements: v.requirements,
    description: v.description,
    responsibilities: v.responsibilities,
    minEducation: v.minEducation,
    minExperienceMonths: v.minExperienceMonths,
    cnhRequired: v.cnhRequired,
    creaRequired: v.creaRequired,
    isActive: v.isActive,
  }));

  const serializedApplications = applications.map((app: any) => ({
    id: app.id,
    candidateId: app.candidateId,
    vacancyId: app.vacancyId,
    status: app.status,
    score: app.score,
    createdAt: app.createdAt.toISOString(),
    vacancy: app.vacancy,
    candidate: {
      id: app.candidate.id,
      email: app.candidate.email,
      name: app.candidate.name,
      profile: app.candidate.profile
        ? {
            ...app.candidate.profile,
            birthDate: app.candidate.profile.birthDate.toISOString(),
            experiences: app.candidate.profile.experiences.map((exp: any) => ({
              company: exp.company,
              role: exp.role,
              startDate: exp.startDate.toISOString().split('T')[0],
              endDate: exp.endDate ? exp.endDate.toISOString().split('T')[0] : null,
              isCurrent: exp.isCurrent,
            })),
            educations: app.candidate.profile.educations.map((edu: any) => ({
              institution: edu.institution,
              degree: edu.degree,
              fieldOfStudy: edu.fieldOfStudy || null,
              startDate: edu.startDate.toISOString().split('T')[0],
              endDate: edu.endDate ? edu.endDate.toISOString().split('T')[0] : null,
              isCurrent: edu.isCurrent,
            })),
          }
        : null,
    },
  }));

  const serializedAuditLogs = auditLogs.map((log: any) => ({
    id: log.id,
    action: log.action,
    details: log.details,
    createdAt: log.createdAt.toISOString(),
  }));

  return (
    <RHDashboardClient
      initialVacancies={serializedVacancies}
      initialApplications={serializedApplications}
      auditLogs={serializedAuditLogs}
      user={user}
    />
  );
}
