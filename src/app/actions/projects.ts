'use server';

import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Create a new Project
export async function createProjectAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') return { success: false, error: 'Não autorizado' };

  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const status = formData.get('status') as string;
    const client = formData.get('client') as string;
    const location = formData.get('location') as string;
    const area = formData.get('area') as string;
    const duration = formData.get('duration') as string;
    const technologies = formData.get('technologies') as string;
    const mainImage = formData.get('mainImage') as string;
    const galleryImages = formData.get('galleryImages') as string;
    const videoUrl = (formData.get('videoUrl') as string) || null;
    const completionPctStr = formData.get('completionPercentage') as string;

    const completionPercentage = completionPctStr ? parseInt(completionPctStr) : 0;
    
    // Auto-generate unique slug
    let slug = slugify(title);
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    await prisma.project.create({
      data: {
        slug,
        title,
        description,
        category,
        status,
        client,
        location,
        area,
        duration,
        technologies,
        mainImage,
        galleryImages,
        videoUrl,
        completionPercentage,
      },
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        action: 'CREATE_PROJECT',
        details: `Criou o projeto: ${title}`,
      },
    });

    revalidatePath('/');
    revalidatePath('/projetos');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao criar projeto' };
  }
}

// Update an existing Project
export async function updateProjectAction(projectId: number, formData: FormData) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') return { success: false, error: 'Não autorizado' };

  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const status = formData.get('status') as string;
    const client = formData.get('client') as string;
    const location = formData.get('location') as string;
    const area = formData.get('area') as string;
    const duration = formData.get('duration') as string;
    const technologies = formData.get('technologies') as string;
    const mainImage = formData.get('mainImage') as string;
    const galleryImages = formData.get('galleryImages') as string;
    const videoUrl = (formData.get('videoUrl') as string) || null;
    const completionPctStr = formData.get('completionPercentage') as string;

    const completionPercentage = completionPctStr ? parseInt(completionPctStr) : 0;

    await prisma.project.update({
      where: { id: projectId },
      data: {
        title,
        description,
        category,
        status,
        client,
        location,
        area,
        duration,
        technologies,
        mainImage,
        galleryImages,
        videoUrl,
        completionPercentage,
      },
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        action: 'UPDATE_PROJECT',
        details: `Atualizou o projeto ID ${projectId}: ${title}`,
      },
    });

    revalidatePath('/');
    revalidatePath('/projetos');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao atualizar projeto' };
  }
}

// Delete an existing Project
export async function deleteProjectAction(projectId: number) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') return { success: false, error: 'Não autorizado' };

  try {
    const project = await prisma.project.delete({
      where: { id: projectId },
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        action: 'DELETE_PROJECT',
        details: `Excluiu o projeto: ${project.title}`,
      },
    });

    revalidatePath('/');
    revalidatePath('/projetos');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao excluir projeto' };
  }
}
