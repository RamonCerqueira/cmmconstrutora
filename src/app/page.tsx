import HomeClient from '@/components/HomeClient';
import { prisma } from '@/lib/prisma';
import { seedSampleProjects } from '@/lib/projects-seed';

export default async function Home() {
  // Dynamically seed projects if empty
  await seedSampleProjects();

  const dbProjects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Map to clean client format with split arrays
  const serializedProjects = dbProjects.map((p) => ({
    id: p.slug,
    dbId: p.id,
    title: p.title,
    description: p.description,
    category: p.category as any,
    status: p.status as any,
    client: p.client,
    location: p.location,
    area: p.area,
    duration: p.duration,
    technologies: p.technologies ? p.technologies.split(';') : [],
    mainImage: p.mainImage,
    galleryImages: p.galleryImages ? p.galleryImages.split(';') : [],
    videoUrl: p.videoUrl ?? undefined,
    completionPercentage: p.completionPercentage,
  }));

  return <HomeClient initialProjects={serializedProjects} />;
}
