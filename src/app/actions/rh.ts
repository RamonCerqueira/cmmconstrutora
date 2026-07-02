'use server';

import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// Create a new Job Vacancy
export async function createVacancyAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') return { success: false, error: 'Não autorizado' };

  try {
    const title = formData.get('title') as string;
    const area = formData.get('area') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const modality = formData.get('modality') as string;
    const salaryStr = formData.get('salary') as string;
    const benefits = (formData.get('benefits') as string) || null;
    const quantityStr = formData.get('quantity') as string;
    const requirements = formData.get('requirements') as string;
    const description = formData.get('description') as string;
    const responsibilities = (formData.get('responsibilities') as string) || null;
    const minEducation = formData.get('minEducation') as string;
    const minExperienceMonthsStr = formData.get('minExperienceMonths') as string;
    const cnhRequired = (formData.get('cnhRequired') as string) || null;
    const creaRequired = formData.get('creaRequired') === 'true';

    const salary = salaryStr ? parseFloat(salaryStr) : null;
    const quantity = quantityStr ? parseInt(quantityStr) : 1;
    const minExperienceMonths = minExperienceMonthsStr ? parseInt(minExperienceMonthsStr) : 0;

    await prisma.vacancy.create({
      data: {
        title,
        area,
        city,
        state,
        modality,
        salary,
        benefits,
        quantity,
        requirements,
        description,
        responsibilities,
        minEducation,
        minExperienceMonths,
        cnhRequired,
        creaRequired,
      },
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        action: 'CREATE_VACANCY',
        details: `Criou a vaga: ${title} em ${city}/${state}`,
      },
    });

    revalidatePath('/vagas');
    revalidatePath('/dashboard/rh');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao criar vaga' };
  }
}

// Update Application Status in Pipeline
export async function updateApplicationStatusAction(
  applicationId: number,
  newStatus: string,
  comment?: string
) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') return { success: false, error: 'Não autorizado' };

  try {
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { candidate: true, vacancy: true },
    });

    if (!app) return { success: false, error: 'Inscrição não encontrada' };

    const oldStatus = app.status;

    // Update Status
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: newStatus },
    });

    // Record in History
    await prisma.statusHistory.create({
      data: {
        applicationId,
        oldStatus,
        newStatus,
        changedBy: user.name,
        comment: comment || `Status alterado de ${oldStatus} para ${newStatus} pelo RH.`,
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        action: 'UPDATE_PIPELINE',
        details: `Alterou status do candidato ${app.candidate.name} na vaga ${app.vacancy.title} para ${newStatus}`,
      },
    });

    revalidatePath('/dashboard/rh');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao atualizar status' };
  }
}

// Send Chat/Internal message from RH to Candidate
export async function sendRHMessageAction(candidateId: number, content: string) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') return { success: false, error: 'Não autorizado' };

  try {
    await prisma.message.create({
      data: {
        senderId: user.userId,
        receiverId: candidateId,
        content,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        action: 'SEND_MESSAGE',
        details: `Enviou mensagem para candidato ID: ${candidateId}`,
      },
    });

    revalidatePath('/dashboard/rh');
    revalidatePath('/dashboard/candidato');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao enviar mensagem' };
  }
}
