'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Layers, Calendar, ArrowRight, User } from 'lucide-react';
import { Project } from '@/lib/projects-data';

type FilterType = 'TODOS' | 'EM_ANDAMENTO' | 'FINALIZADOS' | 'OBRAS_PUBLICAS' | 'OBRAS_PRIVADAS';

interface ProjetosPageClientProps {
  initialProjects: Project[];
}

export default function ProjetosPageClient({ initialProjects }: ProjetosPageClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('TODOS');

  const filteredProjects = initialProjects.filter((project) => {
    if (activeFilter === 'TODOS') return true;
    if (activeFilter === 'EM_ANDAMENTO') return project.status === 'EM_ANDAMENTO';
    if (activeFilter === 'FINALIZADOS') return project.status === 'FINALIZADOS';
    if (activeFilter === 'OBRAS_PUBLICAS') return project.category === 'OBRAS_PUBLICAS';
    if (activeFilter === 'OBRAS_PRIVADAS') return project.category === 'OBRAS_PRIVADAS';
    return true;
  });

  const filters: { value: FilterType; label: string }[] = [
    { value: 'TODOS', label: 'Todos' },
    { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
    { value: 'FINALIZADOS', label: 'Finalizados' },
    { value: 'OBRAS_PUBLICAS', label: 'Obras Públicas' },
    { value: 'OBRAS_PRIVADAS', label: 'Obras Privadas' },
  ];

  return (
    <div className="bg-neutral-light min-h-screen pt-28 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title / Banner */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent text-xs tracking-[0.25em] font-bold uppercase block mb-3">Portfólio CMM</span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-primary leading-tight">
            Nossos Grandes Empreendimentos
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-500">
            Conheça as obras públicas e privadas executadas pela CMM Construtora. Projetos marcados pela excelência de engenharia, compromisso e segurança jurídica.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.value;
            return (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-5 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-305 focus:outline-none ${
                  isActive
                    ? 'bg-accent text-primary shadow-lg shadow-accent/15'
                    : 'bg-white border border-gray-150 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={project.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:border-accent/10 transition-all duration-500 flex flex-col justify-between group"
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={project.mainImage}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
                  />
                  {/* Category overlay */}
                  <span className="absolute top-4 left-4 text-[10px] sm:text-xs font-semibold tracking-wider px-3.5 py-1.5 rounded-full bg-primary/90 text-accent border border-white/5 uppercase">
                    {project.category === 'OBRAS_PUBLICAS' ? 'Pública' : 'Privada'}
                  </span>
                  {/* Status overlay */}
                  <span className={`absolute top-4 right-4 text-[10px] sm:text-xs font-bold tracking-wider px-3.5 py-1.5 rounded-full uppercase ${
                    project.status === 'FINALIZADOS'
                      ? 'bg-green-600 text-white'
                      : 'bg-accent text-primary'
                  }`}>
                    {project.status === 'FINALIZADOS' ? 'Concluída' : 'Em andamento'}
                  </span>
                </div>

                <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="font-heading font-extrabold text-primary text-lg sm:text-xl leading-snug group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-sans leading-relaxed line-clamp-2">
                      {project.description}
                    </p>

                    {/* Metadata specs */}
                    <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4 text-xs font-sans text-gray-500">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-accent shrink-0" />
                        <span className="truncate">{project.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-accent shrink-0" />
                        <span className="truncate">{project.area}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-accent shrink-0" />
                        <span className="truncate">{project.client}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-accent shrink-0" />
                        <span className="truncate">{project.duration}</span>
                      </div>
                    </div>

                    {/* Progress Bar for Em Andamento */}
                    {project.status === 'EM_ANDAMENTO' && (
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-[10px] font-sans font-semibold text-gray-500">
                          <span>Progresso Físico</span>
                          <span>{project.completionPercentage}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${project.completionPercentage}%` }}
                            className="h-full bg-accent rounded-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-50">
                    <Link
                      href={`/projetos/${project.id}`}
                      className="w-full flex items-center justify-center gap-2 border border-primary/10 text-primary group-hover:bg-primary group-hover:text-white font-sans font-bold py-3.5 rounded-xl hover:shadow-lg transition-all duration-300 text-sm"
                    >
                      Ver Detalhes Construtivos
                      <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
