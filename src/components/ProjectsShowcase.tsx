'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { projects } from '@/lib/projects-data';
import { MapPin, ArrowRight, X, Play, Calendar, Building, Layers, Award } from 'lucide-react';
import { Project } from '@/lib/projects-data';


interface ProjectsShowcaseProps {
  projects: Project[];
}
export default function ProjectsShowcase({
  projects,
}: ProjectsShowcaseProps) {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [activeProjectFilter, setActiveProjectFilter] = useState<'TODOS' | 'OBRAS_PUBLICAS' | 'OBRAS_PRIVADAS'>('TODOS');
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const filteredProjects = projects.filter((project) => {
    if (activeProjectFilter === 'TODOS') return true;
    if (activeProjectFilter === 'OBRAS_PUBLICAS') return project.category === 'OBRAS_PUBLICAS';
    if (activeProjectFilter === 'OBRAS_PRIVADAS') return project.category === 'OBRAS_PRIVADAS';
    return true;
  });

  return (
    <div className="bg-[#0B0F19] relative overflow-hidden py-24 border-y border-white/5" id="projetos">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-accent font-sans text-xs tracking-[0.25em] font-bold uppercase">
              Portfólio CMM
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
            Nossos Grandes Empreendimentos
          </h2>
          <p className="text-gray-400 mt-4 font-sans text-sm sm:text-base leading-relaxed">
            Conheça as obras públicas e privadas executadas pela CMM Construtora. Engenharia de ponta que viabiliza projetos de grande relevância nacional.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-3 sm:gap-4 mb-12 flex-wrap">
          {[
            { value: 'TODOS', label: 'Todos' },
            { value: 'OBRAS_PUBLICAS', label: 'Obras Públicas' },
            { value: 'OBRAS_PRIVADAS', label: 'Obras Privadas' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveProjectFilter(f.value as any)}
              className={`px-6 py-3 rounded-full text-xs font-bold transition-all duration-300 ${activeProjectFilter === f.value
                  ? 'bg-accent text-primary shadow-lg shadow-accent/20 border border-accent'
                  : 'bg-[#131B2E]/60 border border-white/5 text-gray-400 hover:text-white hover:bg-[#1e293b]/60'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ y: -6, scale: 1.01 }}
              onClick={() => {
                setSelectedProject(p);
                setActivePhotoIndex(0);
              }}
              className="bg-[#131B2E]/40 border border-white/[0.05] backdrop-blur-md rounded-2xl overflow-hidden shadow-xl hover:border-accent/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer group relative"
            >
              <div>
                {/* Image Showcase */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={p.mainImage}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/80 via-transparent to-transparent" />

                  <span className="absolute top-4 left-4 text-[9px] font-sans font-bold tracking-wider px-3 py-1 rounded-full bg-primary/90 text-accent border border-white/5 uppercase">
                    {p.category === 'OBRAS_PUBLICAS' ? 'Pública' : 'Privada'}
                  </span>
                  <span className={`absolute top-4 right-4 text-[9px] font-sans font-bold tracking-wider px-3 py-1 rounded-full uppercase ${p.status === 'FINALIZADOS'
                      ? 'bg-green-600/90 text-white'
                      : 'bg-accent text-primary'
                    }`}>
                    {p.status === 'FINALIZADOS' ? 'Concluída' : 'Em andamento'}
                  </span>
                </div>

                {/* Content info */}
                <div className="p-6 space-y-4">
                  <h3 className="font-heading font-extrabold text-white text-lg leading-snug group-hover:text-accent transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-sans line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-sans pt-2 border-t border-white/[0.03]">
                    <MapPin className="w-4 h-4 text-accent shrink-0" />
                    <span>{p.location}</span>
                  </div>

                  {/* Completion bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[10px] font-sans font-bold text-gray-500">
                      <span>Progresso da Obra</span>
                      <span>{p.completionPercentage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${p.completionPercentage}%` }}
                        className="h-full bg-gradient-to-r from-accent to-[#b8974a] rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="px-6 py-4.5 flex justify-between items-center text-xs font-bold text-accent border-t border-white/[0.04] bg-white/[0.01] group-hover:bg-accent/5 transition-all">
                <span>Visualizar Detalhes</span>
                <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-gradient-to-b from-[#16203a] to-[#0d1527] border border-white/10 text-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative scrollbar-thin flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/[0.08] flex justify-between items-center bg-white/[0.01] sticky top-0 z-20 backdrop-blur-md">
                <div>
                  <span className="text-[10px] font-sans font-bold text-accent uppercase tracking-widest block mb-1">
                    Detalhes do Empreendimento
                  </span>
                  <h3 className="font-heading font-extrabold text-white text-xl leading-tight">
                    {selectedProject.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side (2/3) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Photo Viewer */}
                  <div className="relative h-64 sm:h-[350px] rounded-xl overflow-hidden shadow-lg border border-white/10 bg-gray-950 flex items-center justify-center">
                    <img
                      src={
                        activePhotoIndex === 0
                          ? selectedProject.mainImage
                          : selectedProject.galleryImages[activePhotoIndex - 1]
                      }
                      alt={selectedProject.title}
                      className="w-full h-full object-cover transition-all duration-300"
                    />
                    <span className="absolute bottom-4 left-4 bg-primary/95 text-white text-[10px] font-sans px-3 py-1.5 rounded-lg flex items-center gap-1 border border-white/5 shadow-md">
                      Foto {activePhotoIndex + 1} de {selectedProject.galleryImages.length + 1}
                    </span>
                  </div>

                  {/* Thumbnail Carousel */}
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                    <button
                      onClick={() => setActivePhotoIndex(0)}
                      className={`relative w-20 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${activePhotoIndex === 0 ? 'border-accent scale-[1.02]' : 'border-transparent hover:border-gray-500'
                        }`}
                    >
                      <img src={selectedProject.mainImage} className="w-full h-full object-cover" />
                    </button>
                    {selectedProject.galleryImages.map((img: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setActivePhotoIndex(idx + 1)}
                        className={`relative w-20 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${activePhotoIndex === idx + 1 ? 'border-accent scale-[1.02]' : 'border-transparent hover:border-gray-500'
                          }`}
                      >
                        <img src={img} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>

                  {/* Description */}
                  <div className="space-y-3 font-sans">
                    <h4 className="font-heading font-extrabold text-white text-base">Descrição do Projeto</h4>
                    <p className="text-sm text-gray-300 leading-relaxed text-justify">
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* Video Acompanhamento */}
                  {selectedProject.videoUrl && (
                    <div className="space-y-3">
                      <h4 className="font-heading font-extrabold text-white text-base flex items-center gap-2">
                        <Play className="w-4 h-4 text-accent fill-accent" />
                        Vídeo de Acompanhamento Técnico
                      </h4>
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10 shadow-md">
                        <video src={selectedProject.videoUrl} controls className="w-full h-full" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side (1/3) */}
                <div className="space-y-6">
                  {/* Ficha Técnica */}
                  <div className="bg-[#0F172A]/85 p-6 rounded-2xl border border-white/5 space-y-4 font-sans text-sm text-gray-300">
                    <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider border-b border-white/[0.05] pb-2">
                      Ficha Técnica
                    </h4>

                    <div className="space-y-3.5">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs">Cliente</span>
                        <span className="font-bold text-white text-right max-w-[150px] truncate">{selectedProject.client}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs">Localização</span>
                        <span className="font-bold text-white text-right">{selectedProject.location}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs">Área Construída</span>
                        <span className="font-bold text-accent">{selectedProject.area}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs">Prazo Execução</span>
                        <span className="font-bold text-white">{selectedProject.duration}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs">Categoria</span>
                        <span className="font-bold text-white uppercase text-xs">
                          {selectedProject.category === 'OBRAS_PUBLICAS' ? 'Pública' : 'Privada'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/[0.05]">
                      <div className="flex justify-between text-xs font-bold text-gray-400">
                        <span>Fase de Conclusão</span>
                        <span>{selectedProject.completionPercentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${selectedProject.completionPercentage}%` }}
                          className="h-full bg-gradient-to-r from-accent to-[#b8974a] rounded-full animate-pulse"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="space-y-3">
                    <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider">
                      Tecnologia & Métodos
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((t: string, i: number) => (
                        <span
                          key={i}
                          className="text-[10px] font-sans font-bold px-3 py-1.5 rounded-lg bg-white/5 text-white border border-white/10 shadow-sm"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Lead Capture card */}
                  <div className="bg-gradient-to-br from-[#1E293B] to-[#131B2E] text-white p-6 rounded-2xl border border-white/[0.08] space-y-4 shadow-xl relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-accent/10 rounded-full blur-xl" />
                    <h4 className="font-heading font-extrabold text-white text-base">Gostou deste projeto?</h4>
                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                      A CMM Construtora viabiliza empreendimentos residenciais de luxo e galpões industriais com alta previsibilidade de custos.
                    </p>
                    <a
                      href="#contato"
                      onClick={() => setSelectedProject(null)}
                      className="w-full bg-gradient-to-r from-accent to-[#b8974a] text-primary hover:shadow-lg hover:shadow-accent/20 py-3.5 rounded-xl text-center text-xs font-bold font-sans block transition-all uppercase"
                    >
                      Solicitar Orçamento
                    </a>
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="p-6 border-t border-white/[0.08] bg-white/[0.01] flex justify-end sticky bottom-0 z-20">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="border border-white/10 text-gray-300 hover:bg-white/5 font-sans font-bold px-6 py-3 rounded-xl text-xs uppercase transition-all"
                >
                  Fechar Visualização
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
