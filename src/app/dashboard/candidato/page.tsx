import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CandidateDashboardClient from '@/components/CandidateDashboardClient';

export default async function CandidateDashboardPage() {
  const user = await getSessionUser();

  if (!user || user.role !== 'CANDIDATE') {
    redirect('/auth?mode=login');
  }

  // Fetch full profile details
  const profile = await prisma.profile.findUnique({
    where: { userId: user.userId },
    include: {
      experiences: {
        orderBy: { startDate: 'desc' },
      },
      educations: {
        orderBy: { startDate: 'desc' },
      },
    },
  });

  // Fetch job applications
  const applications = await prisma.application.findMany({
    where: { candidateId: user.userId },
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
    },
    orderBy: { createdAt: 'desc' },
  });

  // Fetch chat/messages between candidate and admin
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { receiverId: user.userId },
        { senderId: user.userId },
      ],
    },
    include: {
      sender: {
        select: {
          name: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  // Serialize profile dates for Client Component parsing safety
  let serializedProfile = null;
  if (profile) {
    serializedProfile = {
      ...profile,
      birthDate: profile.birthDate.toISOString(),
      experiences: profile.experiences.map((exp: any) => ({
        company: exp.company,
        role: exp.role,
        startDate: exp.startDate.toISOString().split('T')[0],
        endDate: exp.endDate ? exp.endDate.toISOString().split('T')[0] : undefined,
        isCurrent: exp.isCurrent,
      })),
      educations: profile.educations.map((edu: any) => ({
        institution: edu.institution,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy || undefined,
        startDate: edu.startDate.toISOString().split('T')[0],
        endDate: edu.endDate ? edu.endDate.toISOString().split('T')[0] : undefined,
        isCurrent: edu.isCurrent,
      })),
    };
  }

  return (
    <CandidateDashboardClient
      initialProfile={serializedProfile}
      applications={applications}
      messages={messages}
      user={user}
    />
  );
}
