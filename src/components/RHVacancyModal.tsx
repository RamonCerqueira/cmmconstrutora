'use client';

import { useState, useEffect } from 'react';
import { X, Info, Award, FileText, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RHVacancyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  mode: 'create' | 'edit';
  vacancy?: any;
  isPending: boolean;
  error: string;
}

export default function RHVacancyModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  vacancy,
  isPending,
  error,
}: RHVacancyModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'requirements' | 'details'>('basic');
  const [validationError, setValidationError] = useState('');

  // Reset tab when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setActiveTab('basic');
      setValidationError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Custom validation before submitting or moving forward
  const validateTab = (tab: 'basic' | 'requirements' | 'details'): boolean => {
    setValidationError('');
    
    // We can check if fields in the tab are valid
    const form = document.getElementById('vacancy-form') as HTMLFormElement;
    if (!form) return true;

    if (tab === 'basic') {
      const title = (form.querySelector('input[name="title"]') as HTMLInputElement)?.value;
      const city = (form.querySelector('input[name="city"]') as HTMLInputElement)?.value;
      const state = (form.querySelector('input[name="state"]') as HTMLInputElement)?.value;
      
      if (!title || !city || !state) {
        setValidationError('Por favor, preencha todos os campos obrigatórios (*) desta etapa.');
        return false;
      }
    } else if (tab === 'details') {
      const description = (form.querySelector('textarea[name="description"]') as HTMLTextAreaElement)?.value;
      const requirements = (form.querySelector('textarea[name="requirements"]') as HTMLTextAreaElement)?.value;
      
      if (!description || !requirements) {
        setValidationError('Por favor, preencha a descrição detalhada e os requisitos básicos.');
        return false;
      }
    }
    return true;
  };

  const handleNext = (nextTab: 'basic' | 'requirements' | 'details') => {
    // Validate current tab before moving
    if (activeTab === 'basic' && nextTab !== 'basic') {
      if (!validateTab('basic')) return;
    }
    if (activeTab === 'requirements' && nextTab === 'details') {
      if (!validateTab('requirements')) return;
    }
    setActiveTab(nextTab);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError('');

    // Validate everything
    if (!validateTab('basic')) {
      setActiveTab('basic');
      return;
    }
    if (!validateTab('details')) {
      setActiveTab('details');
      return;
    }

    onSubmit(e);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-gradient-to-b from-[#16203a] to-[#0d1527] text-white rounded-2xl w-full max-w-2xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/[0.08] flex justify-between items-center relative z-10 bg-white/[0.01]">
            <div>
              <span className="text-[9px] font-sans font-bold text-accent uppercase tracking-widest block mb-1">
                {mode === 'create' ? 'NOVA VAGA' : 'EDIÇÃO DE VAGA'}
              </span>
              <h3 className="font-heading font-extrabold text-white text-lg sm:text-xl leading-tight">
                {mode === 'create' ? 'Cadastrar Nova Oportunidade' : `Editar Oportunidade: ${vacancy?.title}`}
              </h3>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper / Tab Nav */}
          <div className="bg-[#111827]/40 px-6 py-4 border-b border-white/[0.05] flex justify-between items-center gap-1.5 sm:gap-4 relative z-10">
            {/* Step 1 */}
            <button
              type="button"
              onClick={() => handleNext('basic')}
              className={`flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'basic'
                  ? 'bg-accent/15 border border-accent/30 text-accent'
                  : 'text-gray-400 hover:text-white border border-transparent'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                activeTab === 'basic' ? 'bg-accent text-primary' : 'bg-gray-800 text-gray-400'
              }`}>
                1
              </span>
              <span className="hidden sm:inline">Dados Básicos</span>
            </button>

            <div className="h-[1px] flex-grow bg-white/10" />

            {/* Step 2 */}
            <button
              type="button"
              onClick={() => handleNext('requirements')}
              className={`flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'requirements'
                  ? 'bg-accent/15 border border-accent/30 text-accent'
                  : 'text-gray-400 hover:text-white border border-transparent'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                activeTab === 'requirements' ? 'bg-accent text-primary' : 'bg-gray-800 text-gray-400'
              }`}>
                2
              </span>
              <span className="hidden sm:inline">Requisitos & Salário</span>
            </button>

            <div className="h-[1px] flex-grow bg-white/10" />

            {/* Step 3 */}
            <button
              type="button"
              onClick={() => handleNext('details')}
              className={`flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'details'
                  ? 'bg-accent/15 border border-accent/30 text-accent'
                  : 'text-gray-400 hover:text-white border border-transparent'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                activeTab === 'details' ? 'bg-accent text-primary' : 'bg-gray-800 text-gray-400'
              }`}>
                3
              </span>
              <span className="hidden sm:inline">Prazos & Detalhes</span>
            </button>
          </div>

          {/* Form Content */}
          <form id="vacancy-form" onSubmit={handleFormSubmit} className="flex-grow overflow-y-auto p-6 sm:p-8 space-y-6 relative z-10 scrollbar-thin">
            {/* Error alerts */}
            {(error || validationError) && (
              <div className="bg-red-950/60 border border-red-800 text-red-300 p-4 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 animate-pulse shadow-lg shadow-red-950/20">
                <X className="w-5 h-5 text-red-500 shrink-0" />
                <span>{validationError || error}</span>
              </div>
            )}

            {/* Tab Panels */}
            <div className="min-h-[280px]">
              {/* TAB 1: BASIC INFO */}
              {activeTab === 'basic' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-sans font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Título da Vaga *</label>
                      <input
                        type="text"
                        name="title"
                        required
                        defaultValue={mode === 'edit' ? vacancy?.title : ''}
                        placeholder="Ex: Mestre de Obras"
                        className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-all focus:ring-1 focus:ring-accent/20"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Área de Atuação *</label>
                      <select
                        name="area"
                        required
                        defaultValue={mode === 'edit' ? vacancy?.area : 'ENGENHARIA'}
                        className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-all"
                      >
                        <option value="ENGENHARIA">Engenharia</option>
                        <option value="OBRAS_CAMPO">Obras de Campo</option>
                        <option value="ADMINISTRATIVO">Administrativo</option>
                        <option value="OUTROS">Outros</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-[10px] font-sans font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Cidade *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        defaultValue={mode === 'edit' ? vacancy?.city : ''}
                        placeholder="Ex: Belo Horizonte"
                        className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-all focus:ring-1 focus:ring-accent/20"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Estado *</label>
                      <input
                        type="text"
                        name="state"
                        required
                        maxLength={2}
                        defaultValue={mode === 'edit' ? vacancy?.state : ''}
                        placeholder="Ex: MG"
                        className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-all focus:ring-1 focus:ring-accent/20 uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Modalidade *</label>
                      <select
                        name="modality"
                        required
                        defaultValue={mode === 'edit' ? vacancy?.modality : 'PRESENCIAL'}
                        className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-all"
                      >
                        <option value="PRESENCIAL">Presencial</option>
                        <option value="HIBRIDO">Híbrido</option>
                        <option value="REMOTO">Remoto</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-white/[0.04]">
                    <div>
                      <label className="block text-[10px] font-sans font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Quantidade de Vagas</label>
                      <input
                        type="number"
                        name="quantity"
                        defaultValue={mode === 'edit' ? vacancy?.quantity : 1}
                        className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-all"
                      />
                    </div>
                    {mode === 'edit' && (
                      <div>
                        <label className="block text-[10px] font-sans font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Status do Recrutamento *</label>
                        <select
                          name="isActive"
                          required
                          defaultValue={vacancy?.isActive ? 'true' : 'false'}
                          className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-all"
                        >
                          <option value="true">Ativa (Recebendo Candidaturas)</option>
                          <option value="false">Inativa (Encerrada)</option>
                        </select>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 2: REQUIREMENTS */}
              {activeTab === 'requirements' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-sans font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Salário Oferecido (R$)</label>
                      <input
                        type="number"
                        name="salary"
                        defaultValue={mode === 'edit' && vacancy?.salary ? vacancy.salary : ''}
                        placeholder="Ex: 4500 (Opcional)"
                        className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Escolaridade Mínima</label>
                      <select
                        name="minEducation"
                        defaultValue={mode === 'edit' ? vacancy?.minEducation : 'ENSINO_MEDIO'}
                        className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-all"
                      >
                        <option value="ENSINO_MEDIO">Ensino Médio</option>
                        <option value="TECNICO">Ensino Técnico</option>
                        <option value="GRADUACAO">Graduação Superior</option>
                        <option value="POS_GRADUACAO">Pós Graduação</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-sans font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Experiência Necessária (Meses)</label>
                      <input
                        type="number"
                        name="minExperienceMonths"
                        defaultValue={mode === 'edit' ? vacancy?.minExperienceMonths : 0}
                        className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans font-bold text-gray-400 mb-1.5 uppercase tracking-wider">CNH Obrigatória</label>
                      <input
                        type="text"
                        name="cnhRequired"
                        defaultValue={mode === 'edit' && vacancy?.cnhRequired ? vacancy.cnhRequired : ''}
                        placeholder="Ex: B ou D (Deixe vazio se não aplicável)"
                        className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-all"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-[#0F172A]/40 rounded-xl border border-white/[0.05] flex items-center justify-between mt-3">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white block">Exigência de CREA Ativo</span>
                      <span className="text-[10px] text-gray-450">Marque se a vaga exigir registro profissional no Conselho regional de Engenharia.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="creaRequired"
                        value="true"
                        defaultChecked={mode === 'edit' ? vacancy?.creaRequired : false}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 peer-checked:after:bg-primary after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: DETAILS */}
              {activeTab === 'details' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-sans font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Início das Inscrições</label>
                      <input
                        type="date"
                        name="startDate"
                        defaultValue={mode === 'edit' && vacancy?.startDate ? vacancy.startDate : ''}
                        className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Data de Encerramento (Prazo)</label>
                      <input
                        type="date"
                        name="deadline"
                        defaultValue={mode === 'edit' && vacancy?.deadline ? vacancy.deadline : ''}
                        className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Descrição Detalhada *</label>
                    <textarea
                      name="description"
                      required
                      rows={3}
                      defaultValue={mode === 'edit' ? vacancy?.description : ''}
                      placeholder="Descreva as principais funções, atribuições e informações da vaga..."
                      className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent resize-none min-h-[90px] focus:ring-1 focus:ring-accent/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Requisitos Básicos * (Um por linha)</label>
                    <textarea
                      name="requirements"
                      required
                      rows={2.5}
                      defaultValue={mode === 'edit' ? vacancy?.requirements : ''}
                      placeholder="Exemplo:&#10;Experiência de 5 anos em obras de edifícios&#10;Disponibilidade para residir em outra cidade"
                      className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent resize-none min-h-[80px] focus:ring-1 focus:ring-accent/20"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer / Buttons Controls */}
            <div className="pt-6 border-t border-white/[0.08] flex justify-between items-center gap-3">
              {/* Back Button */}
              {activeTab !== 'basic' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'requirements') setActiveTab('basic');
                    if (activeTab === 'details') setActiveTab('requirements');
                  }}
                  className="flex items-center gap-1.5 border border-white/10 text-gray-300 hover:bg-white/5 font-sans font-bold px-5 py-3.5 rounded-xl text-xs uppercase transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  type="button"
                  className="border border-transparent text-gray-400 hover:text-white font-sans font-bold px-5 py-3.5 rounded-xl text-xs uppercase transition-all"
                >
                  Cancelar
                </button>

                {activeTab !== 'details' ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === 'basic') handleNext('requirements');
                      else if (activeTab === 'requirements') handleNext('details');
                    }}
                    className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-white hover:bg-white/10 font-sans font-bold px-6 py-3.5 rounded-xl text-xs uppercase transition-all"
                  >
                    Avançar
                    <ChevronRight className="w-4 h-4 text-accent" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 bg-gradient-to-r from-accent to-[#b8974a] text-primary font-sans font-bold px-8 py-3.5 rounded-xl text-xs uppercase hover:shadow-lg hover:shadow-accent/20 transition-all"
                  >
                    {isPending ? (
                      'Gravando...'
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        {mode === 'create' ? 'Cadastrar Oportunidade' : 'Salvar Alterações'}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
