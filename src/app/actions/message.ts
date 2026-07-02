'use server';

import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function sendMessageAction(receiverId: number, content: string) {
  const user = await getSessionUser();
  if (!user) return { success: false, error: 'Sessão inválida' };

  try {
    const message = await prisma.message.create({
      data: {
        senderId: user.userId,
        receiverId,
        content,
      },
    });

    revalidatePath('/dashboard/candidato');
    revalidatePath('/dashboard/rh');
    return { success: true, message };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao enviar mensagem.' };
  }
}

export async function markMessagesAsReadAction(senderId: number) {
  const user = await getSessionUser();
  if (!user) return { success: false };

  try {
    await prisma.message.updateMany({
      where: {
        senderId,
        receiverId: user.userId,
        isRead: false,
      },
      data: { isRead: true },
    });
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}
