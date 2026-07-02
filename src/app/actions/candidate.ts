'use server';

import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { calculateMatchScore } from '@/lib/score';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';


export async function saveProfileAct(formData: FormData) {
  const user = await getSessionUser();
  if (!user) return { success: false, error: 'Sessão inválida' };

  try {
    const cpf = formData.get('cpf') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const cep = formData.get('cep') as string;
    const desiredArea = formData.get('desiredArea') as string;
    const desiredRole = formData.get('desiredRole') as string;
    const education = formData.get('education') as string;

    const rg = (formData.get('rg') as string) || null;
    const gender = (formData.get('gender') as string) || null;
    const maritalStatus = (formData.get('maritalStatus') as string) || null;
    const whatsapp = (formData.get('whatsapp') as string) || null;
    const birthDateStr = formData.get('birthDate') as string;
    const salaryExpectationStr = formData.get('salaryExpectation') as string;
    const availability = (formData.get('availability') as string) || null;
    const degree = (formData.get('degree') as string) || null;
    const courses = (formData.get('courses') as string) || null;
    const certifications = (formData.get('certifications') as string) || null;
    const crea = (formData.get('crea') as string) || null;
    const cnh = (formData.get('cnh') as string) || null;
    const hasVehicle = formData.get('hasVehicle') === 'true';
    const skills = (formData.get('skills') as string) || null;
    const languages = (formData.get('languages') as string) || null;
    const linkedin = (formData.get('linkedin') as string) || null;
    const portfolio = (formData.get('portfolio') as string) || null;

    // Parse experiences & educations text inputs (JSON stringified)
    const experiencesJson = formData.get('experiences') as string;
    const educationsJson = formData.get('educations') as string;

    let experiencesList = [];
    let educationsList = [];
    if (experiencesJson) experiencesList = JSON.parse(experiencesJson);
    if (educationsJson) educationsList = JSON.parse(educationsJson);

    const birthDate = birthDateStr ? new Date(birthDateStr) : new Date();
    const salaryExpectation = salaryExpectationStr ? parseFloat(salaryExpectationStr) : null;

    // Handle File Uploads (Photo and Resume)
    let photoUrl = formData.get('photoUrlHidden') as string || null;
    let resumeUrl = formData.get('resumeUrlHidden') as string || null;

    const photoFile = formData.get('photo') as File | null;
    if (photoFile && photoFile.size > 0) {
      const arrayBuffer = await photoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName = `${Date.now()}-${photoFile.name.replace(/\s+/g, '_')}`;
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.promises.mkdir(uploadsDir, { recursive: true });
      await fs.promises.writeFile(path.join(uploadsDir, fileName), buffer);
      photoUrl = `/uploads/${fileName}`;
    }

    const resumeFile = formData.get('resume') as File | null;
    if (resumeFile && resumeFile.size > 0) {
      const arrayBuffer = await resumeFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName = `${Date.now()}-${resumeFile.name.replace(/\s+/g, '_')}`;
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.promises.mkdir(uploadsDir, { recursive: true });
      await fs.promises.writeFile(path.join(uploadsDir, fileName), buffer);
      resumeUrl = `/uploads/${fileName}`;
    }

    // Upsert Profile
    const profile = await prisma.profile.upsert({
      where: { userId: user.userId },
      create: {
        userId: user.userId,
        cpf,
        rg,
        birthDate,
        gender,
        maritalStatus,
        phone,
        whatsapp,
        photo: photoUrl,
        address,
        city,
        state,
        cep,
        salaryExpectation,
        availability,
        education,
        degree,
        courses,
        certifications,
        crea,
        cnh,
        hasVehicle,
        desiredArea,
        desiredRole,
        skills,
        languages,
        linkedin,
        portfolio,
        resumeUrl,
      },
      update: {
        cpf,
        rg,
        birthDate,
        gender,
        maritalStatus,
        phone,
        whatsapp,
        photo: photoUrl || undefined,
        address,
        city,
        state,
        cep,
        salaryExpectation,
        availability,
        education,
        degree,
        courses,
        certifications,
        crea,
        cnh,
        hasVehicle,
        desiredArea,
        desiredRole,
        skills,
        languages,
        linkedin,
        portfolio,
        resumeUrl: resumeUrl || undefined,
      },
    });

    // Reset and save experiences
    await prisma.experience.deleteMany({ where: { profileId: profile.id } });
    if (experiencesList.length > 0) {
      await prisma.experience.createMany({
        data: experiencesList.map((exp: any) => ({
          profileId: profile.id,
          company: exp.company,
          role: exp.role,
          startDate: new Date(exp.startDate),
          endDate: exp.endDate ? new Date(exp.endDate) : null,
          isCurrent: exp.isCurrent || false,
        })),
      });
    }

    // Reset and save academic background
    await prisma.education.deleteMany({ where: { profileId: profile.id } });
    if (educationsList.length > 0) {
      await prisma.education.createMany({
        data: educationsList.map((edu: any) => ({
          profileId: profile.id,
          institution: edu.institution,
          degree: edu.degree,
          fieldOfStudy: edu.fieldOfStudy || null,
          startDate: new Date(edu.startDate),
          endDate: edu.endDate ? new Date(edu.endDate) : null,
          isCurrent: edu.isCurrent || false,
        })),
      });
    }

    // Update Scores for any existing applications this candidate has, since profile changed!
    const applications = await prisma.application.findMany({
      where: { candidateId: user.userId },
      include: { vacancy: true },
    });

    const fullProfile = await prisma.profile.findUnique({
      where: { id: profile.id },
      include: { experiences: true },
    });

    for (const app of applications) {
      const newScore = calculateMatchScore(fullProfile, app.vacancy);
      await prisma.application.update({
        where: { id: app.id },
        data: { score: newScore },
      });
    }

    revalidatePath('/dashboard/candidato');
    return { success: true };
  } catch (error: any) {
    console.error('Error saving profile:', error);
    return { success: false, error: error.message || 'Erro ao salvar currículo.' };
  }
}

export async function applyToVacancyAction(vacancyId: number) {
  const user = await getSessionUser();
  if (!user) return { success: false, error: 'Precisa estar logado para se candidatar.' };

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: user.userId },
      include: { experiences: true },
    });

    if (!profile) {
      return { success: false, error: 'Por favor, preencha seu currículo antes de se candidatar.' };
    }

    // Check if already applied
    const existing = await prisma.application.findFirst({
      where: { candidateId: user.userId, vacancyId },
    });

    if (existing) {
      return { success: false, error: 'Você já se candidatou a esta vaga.' };
    }

    const vacancy = await prisma.vacancy.findUnique({
      where: { id: vacancyId },
    });

    if (!vacancy) return { success: false, error: 'Vaga não encontrada' };

    const score = calculateMatchScore(profile, vacancy);

    const app = await prisma.application.create({
      data: {
        candidateId: user.userId,
        vacancyId,
        status: 'NOVO',
        score,
      },
    });

    // Register Status History
    await prisma.statusHistory.create({
      data: {
        applicationId: app.id,
        oldStatus: 'NOVO',
        newStatus: 'NOVO',
        changedBy: 'Sistema',
        comment: 'Candidatura realizada online pelo portal.',
      },
    });

    revalidatePath('/vagas');
    revalidatePath('/dashboard/candidato');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao realizar candidatura.' };
  }
}

export async function deleteCandidateAccountAction() {
  const user = await getSessionUser();
  if (!user) return { success: false, error: 'Sessão inválida' };

  try {
    // Delete user (cascade will automatically delete profile, applications, etc.)
    await prisma.user.delete({
      where: { id: user.userId },
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: 'Erro ao excluir conta. Contate o suporte.' };
  }
}
