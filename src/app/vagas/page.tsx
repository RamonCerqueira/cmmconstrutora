import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import VacanciesClient from '@/components/VacanciesClient';

// Helper to seed database with active opportunities if empty
async function seedSampleVacancies() {
  const count = await prisma.vacancy.count();
  if (count === 0) {
    await prisma.vacancy.createMany({
      data: [
        {
          title: 'Engenheiro Civil Residente',
          area: 'ENGENHARIA',
          city: 'São Paulo',
          state: 'SP',
          modality: 'PRESENCIAL',
          salary: 9500,
          benefits: 'Vale Refeição, Seguro de Vida, Plano de Saúde Premium, Participação nos Lucros',
          requirements: 'Registro no CREA ativo.\nCNH Categoria B.\nExperiência mínima de 36 meses em execução de obras residenciais verticais de alto padrão.\nConhecimento avançado em compatibilização BIM e MS Project.',
          description: 'Responsável pela gestão técnica do canteiro de obras, compatibilização tridimensional de projetos executivos, coordenação de empreiteiros de fundações e superestruturas, e controle rigoroso de cronograma físico-financeiro.',
          responsibilities: 'Coordenar equipes operacionais e fiscais de campo.\nValidar ensaios tecnológicos de concreto e materiais.\nEmitir relatórios diários de obras (RDO).\nGarantir conformidade total com as normas ISO 9001 e NR-18.',
          minEducation: 'GRADUACAO',
          minExperienceMonths: 36,
          cnhRequired: 'B',
          creaRequired: true,
        },
        {
          title: 'Mestre de Obras (Fundações e Estruturas)',
          area: 'OBRAS_CAMPO',
          city: 'São Paulo',
          state: 'SP',
          modality: 'PRESENCIAL',
          salary: 5800,
          benefits: 'Cesta Básica, Vale Refeição, Plano de Saúde, Seguro de Vida Coletivo',
          requirements: 'Ensino Médio completo.\nCursos profissionalizantes em leitura de projetos estruturais, carpintaria ou armação.\nExperiência mínima comprovada de 48 meses na função de mestre de obras.',
          description: 'Liderar as frentes de trabalho de infraestrutura (estacas, blocos de fundação, contenções) e superestrutura (lajes protendidas, formas, armação). Garantir que a execução física atenda estritamente aos projetos de engenharia.',
          responsibilities: 'Distribuir tarefas diárias para pedreiros, carpinteiros e armadores.\nControlar o recebimento e consumo de concreto usinado.\nZelar pelo uso contínuo de EPIs da equipe e manter o canteiro limpo.',
          minEducation: 'ENSINO_MEDIO',
          minExperienceMonths: 48,
          cnhRequired: null,
          creaRequired: false,
        },
        {
          title: 'Técnico em Segurança do Trabalho',
          area: 'OBRAS_CAMPO',
          city: 'Campinas',
          state: 'SP',
          modality: 'PRESENCIAL',
          salary: 4200,
          benefits: 'Vale Refeição, Plano de Saúde, Seguro de Vida, Vale Transporte',
          requirements: 'Curso Técnico em Segurança do Trabalho completo.\nRegistro ativo no Ministério do Trabalho.\nExperiência de 18 meses em canteiros de obras de médio/grande porte.',
          description: 'Desenvolver ações de prevenção de acidentes de trabalho e doenças ocupacionais em canteiros de obras, realizando vistorias frequentes e emitindo relatórios de inconformidades.',
          responsibilities: 'Ministrar o Diálogo Diário de Segurança (DDS).\nControlar e distribuir EPIs e fiscalizar o uso adequado.\nOrganizar SIPAT e apoiar a CIPA da obra.\nInvestigar incidentes e propor medidas preventivas.',
          minEducation: 'TECNICO',
          minExperienceMonths: 18,
          cnhRequired: null,
          creaRequired: false,
        },
      ],
    });
    console.log('Sample vacancies seeded in database successfully.');
  }
}

export default async function VagasPage() {
  // Check and seed opportunities dynamically if table is empty
  await seedSampleVacancies();

  const user = await getSessionUser();
  const now = new Date();
  const vacancies = await prisma.vacancy.findMany({
    where: {
      isActive: true,
      AND: [
        {
          OR: [
            { startDate: null },
            { startDate: { lte: now } }
          ]
        },
        {
          OR: [
            { deadline: null },
            { deadline: { gte: now } }
          ]
        }
      ]
    },
    orderBy: { createdAt: 'desc' },
  });

  let appliedVacancyIds: number[] = [];
  if (user) {
    const apps = await prisma.application.findMany({
      where: { candidateId: user.userId },
      select: { vacancyId: true },
    });
    appliedVacancyIds = apps.map((a: any) => a.vacancyId);
  }

  // Map to clean client structure containing serialized dates
  const serializedVacancies = vacancies.map((v: any) => ({
    id: v.id,
    title: v.title,
    area: v.area,
    city: v.city,
    state: v.state,
    modality: v.modality,
    salary: v.salary,
    benefits: v.benefits,
    requirements: v.requirements,
    description: v.description,
    responsibilities: v.responsibilities,
    minEducation: v.minEducation,
    minExperienceMonths: v.minExperienceMonths,
    cnhRequired: v.cnhRequired,
    creaRequired: v.creaRequired,
    startDate: v.startDate ? v.startDate.toISOString().split('T')[0] : null,
    deadline: v.deadline ? v.deadline.toISOString().split('T')[0] : null,
  }));

  return (
    <VacanciesClient
      vacancies={serializedVacancies}
      user={user}
      appliedVacancyIds={appliedVacancyIds}
    />
  );
}
