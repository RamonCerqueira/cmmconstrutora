import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const admin = await getSessionUser();
  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const candidateIdStr = searchParams.get('candidateId');
  if (!candidateIdStr) {
    return NextResponse.json({ error: 'Candidato inválido' }, { status: 400 });
  }

  const candidateId = parseInt(candidateIdStr);

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: candidateId, receiverId: admin.userId },
          { senderId: admin.userId, receiverId: candidateId },
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

    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
