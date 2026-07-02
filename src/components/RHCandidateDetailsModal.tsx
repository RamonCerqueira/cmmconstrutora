'use client';

import { X, FileText, MapPin, Award, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface RHCandidateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: any;
  user: any;
  pipelineStages: any[];
  chatLog: any[];
  rhMessage: string;
  onRhMessageChange: (val: string) => void;
  onSendChatMessage: (e: React.FormEvent) => void;
  onStatusChange: (status: string) => void;
}

export default function RHCandidateDetailsModal({
  isOpen,
  onClose,
  candidate,
  user,
  pipelineStages,
  chatLog,
  rhMessage,
  onRhMessageChange,
  onSendChatMessage,
  onStatusChange,
}: RHCandidateDetailsModalProps) {
  if (!isOpen || !candidate) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-[#131B2E] text-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto border border-white/10 shadow-2xl p-6 sm:p-8 relative scrollbar-thin"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors focus:outline-none"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="font-heading font-extrabold text-white text-xl border-b border-white/[0.05] pb-4 mb-6 flex flex-wrap items-center gap-2">
          Avaliação Detalhada: {candidate.candidate.name}
          <span className="text-xs font-bold bg-accent/20 text-accent px-3 py-1 rounded-full uppercase ml-2 border border-accent/20">
            Score: {candidate.score}% Match
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column (2/3): Profile details */}
          <div className="md:col-span-2 space-y-6 font-sans text-sm text-gray-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block text-[9px] font-bold text-gray-500 uppercase">CPF</span>
                <span className="font-semibold text-white">{candidate.candidate.profile?.cpf}</span>
              </div>
              <div>
                <span className="block text-[9px] font-bold text-gray-500 uppercase">Data de Nascimento</span>
                <span className="font-semibold text-white">
                  {candidate.candidate.profile?.birthDate
                    ? new Date(candidate.candidate.profile.birthDate).toLocaleDateString('pt-BR')
                    : ''}
                </span>
              </div>
              <div>
                <span className="block text-[9px] font-bold text-gray-500 uppercase">Telefone</span>
                <span className="font-semibold text-white">{candidate.candidate.profile?.phone}</span>
              </div>
              <div>
                <span className="block text-[9px] font-bold text-gray-500 uppercase">E-mail</span>
                <span className="font-semibold text-white">{candidate.candidate.email}</span>
              </div>
            </div>

            <div className="bg-[#0F172A] p-4 rounded-xl border border-white/[0.05] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-400">
              <div>
                <span className="block text-gray-500 uppercase tracking-wider text-[8px] font-bold">Escolaridade</span>
                <span className="font-semibold text-white">{candidate.candidate.profile?.education}</span>
              </div>
              <div>
                <span className="block text-gray-500 uppercase tracking-wider text-[8px] font-bold">CREA</span>
                <span className="font-semibold text-white">{candidate.candidate.profile?.crea || 'Não possui'}</span>
              </div>
              <div>
                <span className="block text-gray-500 uppercase tracking-wider text-[8px] font-bold">CNH</span>
                <span className="font-semibold text-white">{candidate.candidate.profile?.cnh || 'Não possui'}</span>
              </div>
              <div>
                <span className="block text-gray-500 uppercase tracking-wider text-[8px] font-bold">Pretensão Salarial</span>
                <span className="font-semibold text-accent">
                  {candidate.candidate.profile?.salaryExpectation
                    ? `R$ ${candidate.candidate.profile.salaryExpectation.toLocaleString()}`
                    : 'Não informada'}
                </span>
              </div>
            </div>

            {/* Experiences details */}
            <div>
              <h4 className="font-heading font-bold text-white mb-3 text-sm uppercase tracking-wider border-b border-white/[0.03] pb-1.5">
                Histórico Profissional
              </h4>
              {candidate.candidate.profile?.experiences?.length === 0 ? (
                <span className="text-xs text-gray-550 italic">Sem registros de experiências.</span>
              ) : (
                <div className="space-y-3">
                  {candidate.candidate.profile?.experiences?.map((exp: any, i: number) => (
                    <div key={i} className="p-4 bg-[#0F172A] border border-white/[0.04] rounded-lg text-xs leading-normal">
                      <strong className="text-white">{exp.role}</strong> na{' '}
                      <span className="font-semibold text-accent">{exp.company}</span>
                      <span className="block text-[10px] text-gray-450 mt-1">
                        Período: {new Date(exp.startDate).toLocaleDateString('pt-BR')}{' '}
                        {exp.isCurrent
                          ? '- Atual'
                          : exp.endDate
                            ? `a ${new Date(exp.endDate).toLocaleDateString('pt-BR')}`
                            : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resume PDF Attachment Link */}
            {candidate.candidate.profile?.resumeUrl && (
              <div className="pt-4 border-t border-white/[0.05] flex items-center justify-between">
                <span className="text-xs text-gray-400 font-semibold">Currículo PDF Cadastrado:</span>
                <a
                  href={candidate.candidate.profile.resumeUrl}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-accent font-bold hover:underline"
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  Visualizar / Download PDF
                </a>
              </div>
            )}
          </div>

          {/* Right Column (1/3): RH Actions & Communication */}
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-white/[0.05] space-y-6">
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider border-b border-white/[0.03] pb-2">
              Ações do RH
            </h4>

            {/* Pipeline Status Controller */}
            <div>
              <label className="block text-[10px] font-sans font-bold text-gray-450 uppercase tracking-wider mb-2">
                Alterar Etapa do Pipeline
              </label>
              <select
                value={candidate.status}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-full bg-[#131B2E] border border-white/10 rounded-lg px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-accent"
              >
                {pipelineStages.map((stage) => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Chat with candidate */}
            <div className="border-t border-white/[0.05] pt-6 space-y-4">
              <label className="block text-[10px] font-sans font-bold text-gray-450 uppercase tracking-wider">
                Enviar Mensagem Direta
              </label>

              {/* Short Log */}
              <div className="space-y-2 max-h-[140px] overflow-y-auto bg-[#131B2E] p-3 rounded-lg border border-white/5 text-[10px] font-sans scrollbar-thin">
                {chatLog.length === 0 ? (
                  <span className="text-gray-500 block text-center py-2">Sem histórico de mensagens.</span>
                ) : (
                  chatLog.map((m) => (
                    <div key={m.id} className="pb-1.5 border-b border-white/[0.03] last:border-0 last:pb-0 text-gray-300">
                      <strong className={m.senderId === user.userId ? 'text-accent' : 'text-white'}>
                        {m.senderId === user.userId ? 'Você: ' : 'Candidato: '}
                      </strong>
                      <span>{m.content}</span>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={onSendChatMessage} className="flex gap-2">
                <input
                  type="text"
                  value={rhMessage}
                  onChange={(e) => onRhMessageChange(e.target.value)}
                  placeholder="Mensagem..."
                  className="flex-grow bg-[#131B2E] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                />
                <button
                  type="submit"
                  className="bg-accent text-primary hover:bg-accent-hover text-xs font-bold px-3 py-2 rounded-lg"
                >
                  Enviar
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/[0.05] flex justify-end">
          <button
            onClick={onClose}
            className="border border-white/10 text-gray-450 hover:bg-white/5 font-sans font-bold px-6 py-3 rounded-xl text-xs uppercase"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
