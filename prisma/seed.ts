import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  console.log('Iniciando limpeza do banco de dados...');
  
  // Limpar tabelas dependentes
  await prisma.statusHistory.deleteMany();
  await prisma.application.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.message.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.vacancy.deleteMany();

  console.log('Limpeza concluída. Populando dados de demonstração...');

  // 1. Criar Administradores do RH
  const adminHashed = hashPassword('admin123');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@cmmconstrutora.com.br',
      password: adminHashed,
      name: 'RH Administrador',
      role: 'ADMIN',
    },
  });
  console.log('✔ Administrador criado: admin@cmmconstrutora.com.br');

  // 2. Criar Candidatos
  const passwordCarlos = hashPassword('carlos123');
  const userCarlos = await prisma.user.create({
    data: {
      email: 'carlos.silva@gmail.com',
      password: passwordCarlos,
      name: 'Carlos Silva',
      role: 'CANDIDATE',
    },
  });

  const profileCarlos = await prisma.profile.create({
    data: {
      userId: userCarlos.id,
      cpf: '123.456.789-00',
      rg: 'MG-12.345.678',
      birthDate: new Date('1992-04-12'),
      gender: 'MASCULINO',
      maritalStatus: 'CASADO',
      phone: '(31) 98888-7777',
      whatsapp: '(31) 98888-7777',
      address: 'Avenida Contorno, 5000',
      city: 'Belo Horizonte',
      state: 'MG',
      cep: '30110-017',
      salaryExpectation: 9000.00,
      availability: 'IMMEDIATE',
      education: 'GRADUACAO',
      degree: 'Engenharia Civil',
      courses: 'Gestão de Obras Prediais, MS Project Avançado',
      certifications: 'PMP - Project Management Professional',
      crea: '123456/D-MG',
      cnh: 'B',
      hasVehicle: true,
      desiredArea: 'ENGENHARIA',
      desiredRole: 'Engenheiro Civil',
      skills: 'Autocad, Revit, Gestão de Canteiro, Orçamentação, Controle de Cronograma',
      languages: 'Inglês Intermediário, Espanhol Básico',
      linkedin: 'https://linkedin.com/in/carlos-silva-demo',
      portfolio: 'https://portfolio-carlos-demo.vercel.app',
    },
  });

  await prisma.experience.createMany({
    data: [
      {
        profileId: profileCarlos.id,
        company: 'Construtora Alfa',
        role: 'Engenheiro Civil Residente',
        startDate: new Date('2020-03-10'),
        endDate: new Date('2024-02-28'),
        isCurrent: false,
        description: 'Responsável pelo canteiro de obras de um edifício residencial de 15 andares. Gestão de 40 colaboradores diretos.',
      },
      {
        profileId: profileCarlos.id,
        company: 'Beta Engenharia',
        role: 'Engenheiro de Planejamento',
        startDate: new Date('2018-05-02'),
        endDate: new Date('2020-03-01'),
        isCurrent: false,
        description: 'Desenvolvimento de cronogramas físico-financeiros de obras públicas e controle de insumos.',
      }
    ],
  });

  await prisma.education.create({
    data: {
      profileId: profileCarlos.id,
      institution: 'UFMG - Universidade Federal de Minas Gerais',
      degree: 'Bacharelado',
      fieldOfStudy: 'Engenharia Civil',
      startDate: new Date('2013-02-15'),
      endDate: new Date('2017-12-15'),
      isCurrent: false,
    },
  });
  console.log('✔ Candidato Engenheiro criado: carlos.silva@gmail.com');

  const passwordMariana = hashPassword('mariana123');
  const userMariana = await prisma.user.create({
    data: {
      email: 'mariana.costa@hotmail.com',
      password: passwordMariana,
      name: 'Mariana Costa',
      role: 'CANDIDATE',
    },
  });

  const profileMariana = await prisma.profile.create({
    data: {
      userId: userMariana.id,
      cpf: '987.654.321-11',
      rg: 'MG-98.765.432',
      birthDate: new Date('1996-09-22'),
      gender: 'FEMININO',
      maritalStatus: 'SOLTEIRA',
      phone: '(31) 97777-6666',
      whatsapp: '(31) 97777-6666',
      address: 'Rua da Bahia, 1000',
      city: 'Belo Horizonte',
      state: 'MG',
      cep: '30160-011',
      salaryExpectation: 3200.00,
      availability: '15_DAYS',
      education: 'GRADUACAO',
      degree: 'Administração de Empresas',
      courses: 'Excel Avançado, Rotinas de Departamento Pessoal',
      certifications: 'Gestão Ágil de Processos',
      cnh: 'A',
      hasVehicle: false,
      desiredArea: 'ADMINISTRATIVO',
      desiredRole: 'Assistente Administrativo',
      skills: 'Faturamento, Organização de Arquivos, Atendimento ao Cliente, Organização de Fluxo de Caixa',
      languages: 'Inglês Básico',
    },
  });

  await prisma.experience.create({
    data: {
      profileId: profileMariana.id,
      company: 'Logística Express',
      role: 'Auxiliar Administrativo',
      startDate: new Date('2021-08-01'),
      isCurrent: true,
      description: 'Lançamento de notas fiscais, controle de planilhas de faturamento e atendimento ao público.',
    },
  });
  console.log('✔ Candidata Administrativo criada: mariana.costa@hotmail.com');

  const passwordPedro = hashPassword('pedro123');
  const userPedro = await prisma.user.create({
    data: {
      email: 'pedro.santos@outlook.com',
      password: passwordPedro,
      name: 'Pedro Santos',
      role: 'CANDIDATE',
    },
  });

  const profilePedro = await prisma.profile.create({
    data: {
      userId: userPedro.id,
      cpf: '456.789.123-22',
      birthDate: new Date('1985-11-05'),
      gender: 'MASCULINO',
      maritalStatus: 'CASADO',
      phone: '(31) 96666-5555',
      address: 'Rua Platina, 400',
      city: 'Belo Horizonte',
      state: 'MG',
      cep: '30411-131',
      salaryExpectation: 5000.00,
      availability: 'IMMEDIATE',
      education: 'ENSINO_MEDIO',
      desiredArea: 'OBRAS_CAMPO',
      desiredRole: 'Mestre de Obras',
      skills: 'Leitura de Projetos Estruturais, Alvenaria, Armação, Concretagem, Gestão de Operários',
      hasVehicle: true,
    },
  });

  await prisma.experience.createMany({
    data: [
      {
        profileId: profilePedro.id,
        company: 'Gama Empreendimentos',
        role: 'Mestre de Obras',
        startDate: new Date('2019-01-10'),
        endDate: new Date('2023-12-15'),
        isCurrent: false,
        description: 'Supervisão de obra residencial vertical. Coordenação dos encarregados de carpintaria, armação e pedreiros.',
      },
      {
        profileId: profilePedro.id,
        company: 'Sigma Engenharia',
        role: 'Encarregado de Obras',
        startDate: new Date('2014-03-01'),
        endDate: new Date('2018-12-20'),
        isCurrent: false,
        description: 'Leitura de projetos e distribuição de tarefas para a equipe de produção direta.',
      }
    ],
  });
  console.log('✔ Candidato Mestre de Obras criado: pedro.santos@outlook.com');

  // 3. Criar Vagas
  const vacancy1 = await prisma.vacancy.create({
    data: {
      title: 'Engenheiro Civil de Obras',
      area: 'ENGENHARIA',
      city: 'Belo Horizonte',
      state: 'MG',
      modality: 'PRESENCIAL',
      salary: 8500.00,
      benefits: 'Vale Refeição (R$ 35/dia), Plano de Saúde Unimed, Seguro de Vida, Auxílio Combustível',
      quantity: 1,
      requirements: 'Graduação completa em Engenharia Civil. Registro ativo no CREA-MG. Experiência comprovada de no mínimo 3 anos em canteiro de obras de edificações verticais. CNH B.',
      description: 'Gerenciamento completo do canteiro de obras. Garantir o cumprimento de prazos, controle de qualidade dos materiais e serviços, e cumprimento das normas de segurança do trabalho.',
      responsibilities: 'Coordenar equipes de produção e empreiteiros terceirizados. Fazer medições periódicas. Controlar cronograma físico-financeiro da obra.',
      minEducation: 'GRADUACAO',
      minExperienceMonths: 36,
      cnhRequired: 'B',
      creaRequired: true,
      deadline: new Date('2026-09-30'),
      isActive: true,
    },
  });

  const vacancy2 = await prisma.vacancy.create({
    data: {
      title: 'Assistente Administrativo de Obras',
      area: 'ADMINISTRATIVO',
      city: 'Belo Horizonte',
      state: 'MG',
      modality: 'HIBRIDO',
      salary: 2800.00,
      benefits: 'Vale Refeição, Vale Transporte, Seguro de Vida',
      quantity: 1,
      requirements: 'Ensino Médio completo. Conhecimento intermediário em informática (Excel, Word). Organização, proatividade e facilidade de comunicação. Experiência prévia em almoxarifado ou compras de obras é um diferencial.',
      description: 'Auxiliar nas rotinas administrativas do escritório de campo. Controle de ponto, recebimento de materiais e conferência de notas fiscais.',
      responsibilities: 'Fazer recebimento de notas fiscais no sistema. Organizar documentação de integração de funcionários terceirizados. Controle de almoxarifado de EPIs.',
      minEducation: 'ENSINO_MEDIO',
      minExperienceMonths: 12,
      isActive: true,
    },
  });

  const vacancy3 = await prisma.vacancy.create({
    data: {
      title: 'Mestre de Obras',
      area: 'OBRAS_CAMPO',
      city: 'Belo Horizonte',
      state: 'MG',
      modality: 'PRESENCIAL',
      salary: 4500.00,
      benefits: 'Cesta Básica, Vale Transporte, Seguro de Vida, Seguro Saúde participativo',
      quantity: 2,
      requirements: 'Ensino Fundamental completo. Experiência de pelo menos 5 anos como mestre de obras. Excelente habilidade de leitura e interpretação de projetos estruturais, elétricos e hidráulicos.',
      description: 'Responsável direto pela execução dos serviços de produção na obra. Orientação das frentes de serviço (forma, armação, concretagem e alvenaria).',
      responsibilities: 'Interpretar e repassar projetos para a equipe. Controlar desperdício de materiais. Garantir a ordem e limpeza do canteiro.',
      minEducation: 'ENSINO_MEDIO',
      minExperienceMonths: 60,
      isActive: true,
    },
  });
  console.log('✔ Vagas criadas no banco de dados');

  // 4. Criar Candidaturas (Applications)
  const appCarlos = await prisma.application.create({
    data: {
      candidateId: userCarlos.id,
      vacancyId: vacancy1.id,
      status: 'TRIAGEM',
      score: 8.5,
    },
  });

  await prisma.statusHistory.create({
    data: {
      applicationId: appCarlos.id,
      oldStatus: 'NOVO',
      newStatus: 'TRIAGEM',
      changedBy: 'RH Administrador',
      comment: 'Candidato com currículo excelente e certificação PMP. Passou para a triagem.',
    },
  });

  const appMariana = await prisma.application.create({
    data: {
      candidateId: userMariana.id,
      vacancyId: vacancy2.id,
      status: 'NOVO',
      score: 7.2,
    },
  });

  await prisma.statusHistory.create({
    data: {
      applicationId: appMariana.id,
      oldStatus: 'NOVO',
      newStatus: 'NOVO',
      changedBy: 'Sistema',
      comment: 'Candidatura registrada automaticamente pelo portal.',
    },
  });

  const appPedro = await prisma.application.create({
    data: {
      candidateId: userPedro.id,
      vacancyId: vacancy3.id,
      status: 'ENTREVISTA',
      score: 9.0,
    },
  });

  await prisma.statusHistory.createMany({
    data: [
      {
        applicationId: appPedro.id,
        oldStatus: 'NOVO',
        newStatus: 'TRIAGEM',
        changedBy: 'RH Administrador',
        comment: 'Candidato com ampla experiência em obras residenciais verticais.',
      },
      {
        applicationId: appPedro.id,
        oldStatus: 'TRIAGEM',
        newStatus: 'ENTREVISTA',
        changedBy: 'RH Administrador',
        comment: 'Agendada entrevista técnica com o Engenheiro Residente para amanhã às 14:00.',
      }
    ],
  });
  console.log('✔ Candidaturas de exemplo geradas');

  console.log('População do banco de dados concluída com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao executar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
