import { projects } from '@/lib/projects-data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Layers, Calendar, User, Cpu, Activity, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) return { title: 'Projeto Não Encontrado | CMM Construtora' };

  return {
    title: `${project.title} | Portfólio CMM Construtora`,
    description: project.description,
  };
}

export default async function ProjetoDetalhesPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-neutral-light min-h-screen pt-28 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back button */}
        <div className="mb-8">
          <Link
            href="/#projetos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-accent" />
            Voltar para o Portfólio
          </Link>
        </div>

        {/* Title & Headline */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-semibold tracking-wider px-3.5 py-1.5 rounded-full bg-primary text-accent uppercase">
              {project.category === 'OBRAS_PUBLICAS' ? 'Pública' : 'Privada'}
            </span>
            <span
              className={`text-xs font-bold tracking-wider px-3.5 py-1.5 rounded-full uppercase ${
                project.status === 'FINALIZADOS' ? 'bg-green-600 text-white' : 'bg-accent text-primary'
              }`}
            >
              {project.status === 'FINALIZADOS' ? 'Concluída' : 'Em andamento'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-primary leading-tight">
            {project.title}
          </h1>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column (2/3): Gallery, Video & Description */}
          <div className="lg:col-span-2 space-y-12">
            {/* Main Project Hero Image */}
            <div className="relative h-[300px] sm:h-[480px] rounded-2xl overflow-hidden border border-gray-150 shadow-lg">
              <img src={project.mainImage} alt={project.title} className="w-full h-full object-cover" />
            </div>

            {/* Description */}
            <div className="bg-white p-8 sm:p-10 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-2xl font-heading font-extrabold text-primary">Descrição Detalhada</h2>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{project.description}</p>
            </div>

            {/* Gallery Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-extrabold text-primary">Galeria da Obra</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {project.galleryImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative h-44 rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300"
                  >
                    <img src={img} alt={`${project.title} - Galeria ${index}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Video Section */}
            {project.videoUrl && (
              <div className="space-y-6">
                <h2 className="text-2xl font-heading font-extrabold text-primary">Vídeo da Obra (Acompanhamento)</h2>
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-black">
                  <video src={project.videoUrl} controls poster={project.mainImage} className="w-full h-full" />
                </div>
              </div>
            )}
          </div>

          {/* Right Column (1/3): Technical Specs & Sidebar */}
          <div className="space-y-8">
            {/* Technical Specifications Card */}
            <div className="bg-primary text-white p-8 rounded-2xl border border-white/5 shadow-xl space-y-6">
              <h3 className="text-lg font-heading font-bold text-accent border-b border-white/10 pb-4">
                Especificações Técnicas
              </h3>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <User className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Cliente</span>
                    <span className="text-sm font-semibold">{project.client}</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Localização</span>
                    <span className="text-sm font-semibold">{project.location}</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Layers className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Área Construída</span>
                    <span className="text-sm font-semibold">{project.area}</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Calendar className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Prazo de Execução</span>
                    <span className="text-sm font-semibold">{project.duration}</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Activity className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Status Físico</span>
                    <span className="text-sm font-semibold">
                      {project.status === 'FINALIZADOS' ? '100% Concluída' : 'Em andamento'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Technologies Card */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-heading font-extrabold text-primary border-b border-gray-50 pb-4">
                Tecnologias Utilizadas
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1.5 bg-neutral-light border border-gray-150 text-xs font-semibold text-primary px-3.5 py-2 rounded-lg"
                  >
                    <Cpu className="w-3.5 h-3.5 text-accent shrink-0" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
