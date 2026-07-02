'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { applyToVacancyAction } from '@/app/actions/candidate';
import { MapPin, Briefcase, DollarSign, Calendar, FileText, CheckCircle2, ShieldAlert, ArrowRight, X, User } from 'lucide-react';
import Link from 'next/link';

interface Vacancy {
  id: number;
  title: string;
  area: string;
  city: string;
  state: string;
  modality: string;
  salary: number | null;
  benefits: string | null;
  requirements: string;
  description: string;
  responsibilities: string | null;
  minEducation: string | null;
  minExperienceMonths: number;
  cnhRequired: string | null;
  creaRequired: boolean;
  deadline: Date | null;
}

interface VacanciesClientProps {
  vacancies: Vacancy[];
  user: {
    userId: number;
    email: string;
    role: string;
    name: string;
  } | null;
  appliedVacancyIds: number[];
}

export default function VacanciesClient({ vacancies, user, appliedVacancyIds }: VacanciesClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('TODAS');
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [applyStatus, setApplyStatus] = useState<{ vacancyId: number; success: boolean; message: string } | null>(null);
  const [applyingId, setApplyingId] = useState<number | null>(null);

  const areas = [
    { value: 'TODAS', label: 'Todas as Áreas' },
    { value: 'ENGENHARIA', label: 'Engenharia' },
    { value: 'OBRAS_CAMPO', label: 'Obras de Campo' },
    { value: 'ADMINISTRATIVO', label: 'Administrativo' },
    { value: 'OUTROS', label: 'Outros' },
  ];

  const filteredVacancies = vacancies.filter((v) => {
    const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.requirements && v.requirements.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesArea = selectedArea === 'TODAS' || v.area === selectedArea;

    return matchesSearch && matchesArea;
  });

  const handleApply = async (vacancyId: number) => {
    if (!user) {
      // Prompt login
      window.location.href = `/auth?mode=login&callback=/vagas`;
      return;
    }
    setApplyingId(vacancyId);
    setApplyStatus(null);
    
    const res = await applyToVacancyAction(vacancyId);
    setApplyingId(null);
    if (res.success) {
      setApplyStatus({ vacancyId, success: true, message: 'Candidatura enviada com sucesso!' });
      // Reload page after success to refresh applications
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      setApplyStatus({ vacancyId, success: false, message: res.error || 'Erro ao se candidatar.' });
    }
  };

  return (
    <div className="bg-neutral-light min-h-screen pt-28 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent text-xs tracking-[0.25em] font-bold uppercase block mb-3">Trabalhe Conosco CMM</span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-primary leading-tight">
            Portal de Oportunidades
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-500">
            Cadastre seu perfil profissional em nosso banco de talentos e candidate-se às vagas ativas de engenharia e operações.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 mb-12">
          <div className="flex-grow">
            <label className="block text-xs font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Buscar por cargo ou cidade</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ex: Engenheiro Civil, São Paulo..."
              className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent transition-all"
            />
          </div>
          <div className="w-full md:w-64">
            <label className="block text-xs font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Filtrar por Área</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent transition-all"
            >
              {areas.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Vacancies List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredVacancies.length === 0 ? (
            <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-heading font-bold text-primary text-lg">Nenhuma vaga aberta encontrada</h3>
              <p className="text-gray-500 text-sm mt-1">Tente ajustar seus termos de pesquisa ou selecionar outra área.</p>
            </div>
          ) : (
            filteredVacancies.map((vacancy) => {
              const isApplied = appliedVacancyIds.includes(vacancy.id);
              return (
                <div
                  key={vacancy.id}
                  className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 hover:border-accent/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-[10px] font-bold tracking-wider px-3 py-1 rounded-full bg-primary/5 text-accent border border-accent/10 uppercase">
                        {vacancy.area === 'ENGENHARIA' ? 'Engenharia' : vacancy.area === 'OBRAS_CAMPO' ? 'Obras de Campo' : 'Administração'}
                      </span>
                      <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-1 uppercase">
                        {vacancy.modality}
                      </span>
                    </div>

                    <h3 className="font-heading font-extrabold text-primary text-xl leading-tight">
                      {vacancy.title}
                    </h3>

                    {/* Metadata line */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500 font-sans">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-accent shrink-0" />
                        <span>{vacancy.city} - {vacancy.state}</span>
                      </div>
                      {vacancy.salary && (
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-accent shrink-0" />
                          <span>R$ {vacancy.salary.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 font-sans leading-relaxed line-clamp-3">
                      {vacancy.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-50 flex items-center gap-4">
                    <button
                      onClick={() => setSelectedVacancy(vacancy)}
                      className="flex-grow text-center text-xs font-bold font-sans border border-primary/10 text-primary py-3 rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      Ler Detalhes da Vaga
                    </button>

                    {isApplied ? (
                      <span className="bg-green-50 border border-green-200 text-green-700 font-sans font-bold px-4 py-3 rounded-lg text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Inscrito
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApply(vacancy.id)}
                        disabled={applyingId === vacancy.id}
                        className="bg-accent text-primary hover:bg-accent-hover font-sans font-bold px-5 py-3 rounded-lg text-xs hover:shadow-lg transition-all"
                      >
                        {applyingId === vacancy.id ? 'Aguarde...' : 'Candidatar-se'}
                      </button>
                    )}
                  </div>
                  
                  {applyStatus && applyStatus.vacancyId === vacancy.id && (
                    <div className={`mt-4 p-3 rounded-lg text-xs font-sans flex items-center gap-1.5 border ${
                      applyStatus.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                      {applyStatus.success ? <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" /> : <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />}
                      <span>{applyStatus.message}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Vacancy Details Modal */}
      <AnimatePresence>
        {selectedVacancy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-gray-200 shadow-2xl p-6 sm:p-8 relative"
            >
              <button
                onClick={() => setSelectedVacancy(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-primary transition-colors focus:outline-none"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold tracking-wider px-3 py-1 rounded-full bg-primary/5 text-accent border border-accent/10 uppercase">
                    {selectedVacancy.area}
                  </span>
                  <h2 className="text-2xl font-heading font-extrabold text-primary mt-3 leading-snug">
                    {selectedVacancy.title}
                  </h2>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500 font-sans mt-2">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-accent" />{selectedVacancy.city} - {selectedVacancy.state}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-4 h-4 text-accent" />{selectedVacancy.modality}</span>
                    {selectedVacancy.salary && <span className="flex items-center gap-1"><DollarSign className="w-4 h-4 text-accent" />R$ {selectedVacancy.salary.toLocaleString()}</span>}
                  </div>
                </div>

                <div className="space-y-4 font-sans text-sm text-gray-600 leading-relaxed">
                  <div>
                    <h4 className="font-heading font-bold text-primary text-base">Descrição da Função</h4>
                    <p className="mt-1 text-xs sm:text-sm">{selectedVacancy.description}</p>
                  </div>

                  {selectedVacancy.responsibilities && (
                    <div>
                      <h4 className="font-heading font-bold text-primary text-base">Responsabilidades</h4>
                      <p className="mt-1 text-xs sm:text-sm whitespace-pre-line">{selectedVacancy.responsibilities}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-heading font-bold text-primary text-base">Requisitos & Competências</h4>
                    <p className="mt-1 text-xs sm:text-sm whitespace-pre-line">{selectedVacancy.requirements}</p>
                  </div>

                  <div className="bg-neutral-light p-4 rounded-xl border border-gray-150 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-gray-500">
                    <div>
                      <span className="block text-gray-400 uppercase tracking-wider text-[9px] font-bold">Escolaridade Mínima</span>
                      <span className="font-semibold text-primary">
                        {selectedVacancy.minEducation === 'ENSINO_MEDIO' ? 'Ensino Médio' : selectedVacancy.minEducation === 'TECNICO' ? 'Ensino Técnico' : 'Graduação Superior'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-400 uppercase tracking-wider text-[9px] font-bold">Experiência Necessária</span>
                      <span className="font-semibold text-primary">{selectedVacancy.minExperienceMonths} meses</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 uppercase tracking-wider text-[9px] font-bold">CNH Exigida</span>
                      <span className="font-semibold text-primary">{selectedVacancy.cnhRequired || 'Não aplicável'}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 uppercase tracking-wider text-[9px] font-bold">Registro no CREA</span>
                      <span className="font-semibold text-primary">{selectedVacancy.creaRequired ? 'Obrigatório' : 'Isento'}</span>
                    </div>
                  </div>

                  {selectedVacancy.benefits && (
                    <div>
                      <h4 className="font-heading font-bold text-primary text-sm">Benefícios</h4>
                      <p className="mt-1 text-xs text-gray-500">{selectedVacancy.benefits}</p>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedVacancy(null)}
                    className="border border-gray-200 text-gray-600 hover:bg-gray-50 font-sans font-bold px-6 py-3 rounded-lg text-sm transition-colors"
                  >
                    Fechar
                  </button>
                  {appliedVacancyIds.includes(selectedVacancy.id) ? (
                    <span className="bg-green-50 border border-green-200 text-green-700 font-sans font-bold px-6 py-3 rounded-lg text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Inscrito
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        handleApply(selectedVacancy.id);
                        setSelectedVacancy(null);
                      }}
                      className="bg-accent text-primary hover:bg-accent-hover font-sans font-bold px-6 py-3 rounded-lg text-sm hover:shadow-lg transition-all"
                    >
                      Confirmar Inscrição
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
