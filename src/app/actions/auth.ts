'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword, setSession, destroySession } from '@/lib/auth';

const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Digite a senha'),
});

// Helper to seed default admin if database is empty
async function seedDefaultAdmin() {
  try {
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' },
    });
    if (adminCount === 0) {
      const hashedPassword = hashPassword('admin123');
      await prisma.user.create({
        data: {
          email: 'admin@cmmconstrutora.com.br',
          password: hashedPassword,
          name: 'RH Administrador',
          role: 'ADMIN',
        },
      });
      console.log('Default admin seeded successfully: admin@cmmconstrutora.com.br / admin123');
    }
  } catch (error) {
    console.error('Error seeding default admin:', error);
  }
}

export async function registerAction(prevState: any, formData: FormData) {
  await seedDefaultAdmin(); // Proactively seed admin if database is empty

  const rawName = formData.get('name') as string;
  const rawEmail = formData.get('email') as string;
  const rawPassword = formData.get('password') as string;

  const result = registerSchema.safeParse({
    name: rawName,
    email: rawEmail,
    password: rawPassword,
  });

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const { name, email, password } = result.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: 'E-mail já cadastrado' };
    }

    const hashedPassword = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'CANDIDATE',
      },
    });

    await setSession({ id: user.id, email: user.email, role: user.role, name: user.name });
    return { success: true, role: user.role };
  } catch (e) {
    return { success: false, error: 'Erro ao criar conta. Tente novamente.' };
  }
}

export async function loginAction(prevState: any, formData: FormData) {
  await seedDefaultAdmin(); // Proactively seed admin if database is empty

  const rawEmail = formData.get('email') as string;
  const rawPassword = formData.get('password') as string;

  const result = loginSchema.safeParse({
    email: rawEmail,
    password: rawPassword,
  });

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const { email, password } = result.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !verifyPassword(password, user.password)) {
      return { success: false, error: 'Credenciais inválidas' };
    }

    await setSession({ id: user.id, email: user.email, role: user.role, name: user.name });
    return { success: true, role: user.role };
  } catch (e) {
    return { success: false, error: 'Erro ao realizar login. Tente novamente.' };
  }
}

export async function logoutAction() {
  await destroySession();
  return { success: true };
}
