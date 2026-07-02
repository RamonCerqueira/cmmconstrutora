'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createVacancyAction, updateApplicationStatusAction, sendRHMessageAction } from '@/app/actions/rh';
import {
  Users,
  Briefcase,
  Layers,
  CheckCircle,
  Clock,
  Search,
  Filter,
  ArrowRight,
  Plus,
  X,
  MapPin,
  Calendar,
  DollarSign,
  Award,
  Cpu,
  Mail,
  Phone,
  FileText,
  User,
  Shield,
  MessageSquare,
  History,
  TrendingUp,
} from 'lucide-react';

interface RHDashboardClientProps {
  initialVacancies: any[];
  initialApplications: any[];
  auditLogs: any[];
  user: {
    userId: number;
    email: string;
    role: string;
    name: string;
  };
}

export default function RHDashboardClient({
  initialVacancies,
  initialApplications,
  auditLogs,
  user,
}: RHDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'pipeline' | 'candidates' | 'vacancies'>('overview');
  
  // Pipeline / Kanban State
  const [applications, setApplications] = useState(initialApplications);
  const [draggedAppId, setDraggedAppId] = useState<number | null>(null);

  // Vacancy Form State
  const [vacancies, setVacancies] = useState(initialVacancies);
  const [showAddVacancy, setShowAddVacancy] = useState(false);
  const [newVacancyError, setNewVacancyError] = useState('');
  const [isPending, setIsPending] = useState(false);

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterEdu, setFilterEdu] = useState('');
  const [filterCrea, setFilterCrea] = useState('ALL');
  const [filterCnh, setFilterCnh] = useState('ALL');
  const [filterMinScore, setFilterMinScore] = useState(0);

  // Candidate Details Modal
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  
  // Chat State
  const [rhMessage, setRhMessage] = useState('');
  const [chatLog, setChatLog] = useState<any[]>([]);

  // Pipeline Columns
  const pipelineStages = [
    { value: 'NOVO', label: 'Novo' },
    { value: 'TRIAGEM', label: 'Triagem' },
    { value: 'ANALISE', label: 'Análise' },
    { value: 'ENTREVISTA', label: 'Entrevista' },
    { value: 'TESTE', label: 'Teste' },
    { value: 'APROVADO', label: 'Aprovado' },
    { value: 'CONTRATADO', label: 'Contratado' },
    { value: 'BANCO_TALENTOS', label: 'Banco de Talentos' },
  ];

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedAppId(id);
    e.dataTransfer.setData('text/plain', id.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, stageValue: string) => {
    e.preventDefault();
    const id = draggedAppId || parseInt(e.dataTransfer.getData('text/plain'));
    if (!id) return;

    // Optimistic update
    const updated = applications.map((app) =>
      app.id === id ? { ...app, status: stageValue } : app
    );
    setApplications(updated);

    const res = await updateApplicationStatusAction(id, stageValue);
    if (!res.success) {
      // Revert on error
      setApplications(applications);
      alert(res.error || 'Erro ao mover candidato.');
    }
    setDraggedAppId(null);
  };

  // Add Vacancy Submit
  const handleAddVacancySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNewVacancyError('');
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const res = await createVacancyAction(formData);
    setIsPending(false);

    if (res.success) {
      setShowAddVacancy(false);
      window.location.reload();
    } else {
      setNewVacancyError(res.error || 'Erro ao cadastrar vaga.');
    }
  };

  // Advanced Filtering
  const filteredApplications = applications.filter((app) => {
    const candidateName = app.candidate.name.toLowerCase();
    const desiredRole = app.candidate.profile?.desiredRole?.toLowerCase() || '';
    const city = app.candidate.profile?.city?.toLowerCase() || '';
    const education = app.candidate.profile?.education || '';
    const crea = app.candidate.profile?.crea || '';
    const cnh = app.candidate.profile?.cnh || '';
    const score = app.score;

    const matchesSearch = candidateName.includes(searchTerm.toLowerCase()) || desiredRole.includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || desiredRole.includes(filterRole.toLowerCase());
    const matchesCity = !filterCity || city.includes(filterCity.toLowerCase());
    const matchesEdu = !filterEdu || education === filterEdu;
    const matchesCrea = filterCrea === 'ALL' || (filterCrea === 'YES' ? crea.trim() !== '' : crea.trim() === '');
    const matchesCnh = filterCnh === 'ALL' || (cnh.toUpperCase().includes(filterCnh.toUpperCase()));
    const matchesScore = score >= filterMinScore;

    return matchesSearch && matchesRole && matchesCity && matchesEdu && matchesCrea && matchesCnh && matchesScore;
  });

  // Calculate Metrics
  const totalResumes = applications.length;
  const newCands = applications.filter((a) => a.status === 'NOVO').length;
  const interviewCands = applications.filter((a) => a.status === 'ENTREVISTA').length;
  const hiredCands = applications.filter((a) => a.status === 'CONTRATADO').length;
  const activeVacancies = vacancies.filter((v) => v.isActive).length;
  const talentPoolCount = applications.filter((a) => a.status === 'BANCO_TALENTOS').length;

  const handleOpenCandidateDetails = async (candidate: any) => {
    setSelectedCandidate(candidate);
    
    // Fetch conversation log dynamically or simulate chat messages
    const chat = await fetch(`/api/messages?candidateId=${candidate.candidateId}`)
      .then((res) => res.json())
      .catch(() => []);
    setChatLog(chat);
  };

  const handleSendRHMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rhMessage.trim() || !selectedCandidate) return;

    const res = await sendRHMessageAction(selectedCandidate.candidateId, rhMessage);
    if (res.success) {
      const newMsg = {
        id: Date.now(),
        content: rhMessage,
        createdAt: new Date(),
        senderId: user.userId,
        sender: { name: 'RH', role: 'ADMIN' },
      };
      setChatLog([...chatLog, newMsg]);
      setRhMessage('');
    } else {
      alert(res.error || 'Erro ao enviar.');
    }
  };

  return (
    <div className="bg-neutral-light min-h-screen pt-28 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-heading font-extrabold text-primary">Painel de Gestão do RH</h1>
            <p className="text-sm text-gray-500 mt-1">Recrutamento, Seleção Inteligente e Pipeline de Talentos CMM Construtora.</p>
          </div>
          <button
            onClick={() => setShowAddVacancy(true)}
            className="flex items-center gap-2 bg-accent text-primary px-6 py-3 rounded-full text-xs font-bold hover:bg-accent-hover transition-colors shadow-lg shadow-accent/15"
          >
            <Plus className="w-4 h-4 text-primary" />
            Cadastrar Nova Vaga
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 gap-6 mb-8 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 border-b-2 transition-colors ${
              activeTab === 'overview' ? 'border-accent text-primary' : 'border-transparent text-gray-400 hover:text-primary'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`pb-4 border-b-2 transition-colors ${
              activeTab === 'pipeline' ? 'border-accent text-primary' : 'border-transparent text-gray-400 hover:text-primary'
            }`}
          >
            Kanban / Pipeline
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`pb-4 border-b-2 transition-colors ${
              activeTab === 'candidates' ? 'border-accent text-primary' : 'border-transparent text-gray-400 hover:text-primary'
            }`}
          >
            Banco de Talentos / Filtros
          </button>
        </div>

        {/* Tab Contents */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-10"
            >
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm text-center flex flex-col items-center">
                  <span className="w-10 h-10 rounded-full bg-primary/5 text-accent flex items-center justify-center mb-3">
                    <Users className="w-5 h-5" />
                  </span>
                  <span className="text-2xl font-heading font-extrabold text-primary block">{totalResumes}</span>
                  <span className="text-[10px] text-gray-400 font-sans uppercase tracking-wider mt-1">Currículos</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm text-center flex flex-col items-center">
                  <span className="w-10 h-10 rounded-full bg-primary/5 text-accent flex items-center justify-center mb-3">
                    <Plus className="w-5 h-5" />
                  </span>
                  <span className="text-2xl font-heading font-extrabold text-primary block">{newCands}</span>
                  <span className="text-[10px] text-gray-400 font-sans uppercase tracking-wider mt-1">Novos</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm text-center flex flex-col items-center">
                  <span className="w-10 h-10 rounded-full bg-primary/5 text-accent flex items-center justify-center mb-3">
                    <Briefcase className="w-5 h-5" />
                  </span>
                  <span className="text-2xl font-heading font-extrabold text-primary block">{activeVacancies}</span>
                  <span className="text-[10px] text-gray-400 font-sans uppercase tracking-wider mt-1">Vagas Abertas</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm text-center flex flex-col items-center">
                  <span className="w-10 h-10 rounded-full bg-primary/5 text-accent flex items-center justify-center mb-3">
                    <Clock className="w-5 h-5" />
                  </span>
                  <span className="text-2xl font-heading font-extrabold text-primary block">{interviewCands}</span>
                  <span className="text-[10px] text-gray-400 font-sans uppercase tracking-wider mt-1">Entrevistas</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm text-center flex flex-col items-center">
                  <span className="w-10 h-10 rounded-full bg-primary/5 text-accent flex items-center justify-center mb-3">
                    <CheckCircle className="w-5 h-5" />
                  </span>
                  <span className="text-2xl font-heading font-extrabold text-primary block">{hiredCands}</span>
                  <span className="text-[10px] text-gray-400 font-sans uppercase tracking-wider mt-1">Contratados</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm text-center flex flex-col items-center">
                  <span className="w-10 h-10 rounded-full bg-primary/5 text-accent flex items-center justify-center mb-3">
                    <Layers className="w-5 h-5" />
                  </span>
                  <span className="text-2xl font-heading font-extrabold text-primary block">{talentPoolCount}</span>
                  <span className="text-[10px] text-gray-400 font-sans uppercase tracking-wider mt-1">Banco de Talentos</span>
                </div>
              </div>

              {/* Graphics & Audit Logs Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Custom SVG Sleek Bar Chart */}
                <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-gray-150 shadow-sm space-y-6">
                  <h3 className="text-lg font-heading font-extrabold text-primary flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    Distribuição de Candidaturas por Etapa
                  </h3>
                  <div className="h-64 flex items-end justify-between px-4 pb-4 pt-10 border-b border-gray-100 relative">
                    {/* SVG Bars */}
                    {pipelineStages.map((stage) => {
                      const count = applications.filter((a) => a.status === stage.value).length;
                      const maxVal = Math.max(...pipelineStages.map((s) => applications.filter((a) => a.status === s.value).length), 1);
                      const pct = (count / maxVal) * 100;
                      return (
                        <div key={stage.value} className="flex flex-col items-center w-1/8 group">
                          {/* Value Tooltip */}
                          <span className="text-[10px] font-bold text-accent font-sans opacity-0 group-hover:opacity-100 transition-opacity mb-1 absolute bottom-[275px]">
                            {count}
                          </span>
                          {/* Colored bar */}
                          <div
                            style={{ height: `${Math.max(pct, 5)}%` }}
                            className="w-8 bg-primary rounded-t-lg group-hover:bg-accent transition-all duration-300 shadow-lg shadow-primary/5"
                          />
                          <span className="text-[9px] font-sans text-gray-400 truncate w-12 text-center mt-2 font-semibold">
                            {stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Audit Logs / Activity History */}
                <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-6">
                  <h3 className="text-lg font-heading font-extrabold text-primary flex items-center gap-2">
                    <History className="w-5 h-5 text-accent" />
                    Histórico de Auditoria do RH
                  </h3>
                  <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1">
                    {auditLogs.length === 0 ? (
                      <span className="text-xs text-gray-400 font-sans block text-center pt-8">Sem atividades registradas.</span>
                    ) : (
                      auditLogs.map((log) => (
                        <div key={log.id} className="text-xs font-sans border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                          <span className="block text-[9px] font-bold text-accent uppercase tracking-wider">
                            {log.action}
                          </span>
                          <p className="text-primary mt-0.5 leading-relaxed">{log.details}</p>
                          <span className="block text-[8px] text-gray-400 mt-1">
                            {new Date(log.createdAt).toLocaleString('pt-BR')}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Kanban / Pipeline View */}
          {activeTab === 'pipeline' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex gap-4 overflow-x-auto pb-6"
            >
              {pipelineStages.map((stage) => {
                const stageApps = applications.filter((app) => app.status === stage.value);
                return (
                  <div
                    key={stage.value}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, stage.value)}
                    className="flex-shrink-0 w-80 bg-white border border-gray-150 rounded-2xl p-4 flex flex-col justify-between"
                  >
                    <div>
                      {/* Column Header */}
                      <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                        <span className="font-heading font-bold text-primary text-sm">{stage.label}</span>
                        <span className="w-5 h-5 rounded-full bg-primary/5 text-accent font-heading font-bold text-[10px] flex items-center justify-center">
                          {stageApps.length}
                        </span>
                      </div>

                      {/* Cards Container */}
                      <div className="space-y-3 min-h-[300px] overflow-y-auto max-h-[60vh] pr-1">
                        {stageApps.map((app) => (
                          <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, app.id)}
                            onClick={() => handleOpenCandidateDetails(app)}
                            key={app.id}
                            className="bg-neutral-light border border-gray-200 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-accent hover:shadow-lg transition-all duration-300 space-y-3"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-heading font-bold text-primary text-xs sm:text-sm line-clamp-1">
                                {app.candidate.name}
                              </h4>
                              {/* Match score Badge */}
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                app.score >= 80 ? 'bg-green-100 text-green-800' : app.score >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-gray-150 text-gray-700'
                              }`}>
                                {app.score}% Match
                              </span>
                            </div>
                            <span className="block text-[10px] font-sans font-medium text-gray-500 truncate">
                              Vaga: {app.vacancy.title}
                            </span>
                            <div className="flex justify-between items-center text-[9px] text-gray-400 font-sans">
                              <span>{app.candidate.profile?.city}</span>
                              <span>CREA: {app.candidate.profile?.crea ? 'Sim' : 'Não'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* Candidates View with Search and Advanced Filters */}
          {activeTab === 'candidates' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Search & Filters block */}
              <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-6">
                <div className="flex gap-4 items-center border-b border-gray-100 pb-4">
                  <Search className="w-5 h-5 text-accent shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar candidatos por nome ou cargo..."
                    className="flex-grow bg-transparent text-sm text-primary placeholder-gray-400 focus:outline-none"
                  />
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-xs">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Cargo Desejado</label>
                    <input
                      type="text"
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      placeholder="Ex: Engenheiro"
                      className="w-full bg-neutral-light border border-gray-200 rounded-lg px-3 py-2 text-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Cidade</label>
                    <input
                      type="text"
                      value={filterCity}
                      onChange={(e) => setFilterCity(e.target.value)}
                      placeholder="Ex: São Paulo"
                      className="w-full bg-neutral-light border border-gray-200 rounded-lg px-3 py-2 text-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Escolaridade</label>
                    <select
                      value={filterEdu}
                      onChange={(e) => setFilterEdu(e.target.value)}
                      className="w-full bg-neutral-light border border-gray-200 rounded-lg px-3 py-2 text-primary focus:outline-none"
                    >
                      <option value="">Todas</option>
                      <option value="ENSINO_MEDIO">Ensino Médio</option>
                      <option value="TECNICO">Ensino Técnico</option>
                      <option value="GRADUACAO">Graduação Superior</option>
                      <option value="POS_GRADUACAO">Pós Graduação</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">CREA Ativo</label>
                    <select
                      value={filterCrea}
                      onChange={(e) => setFilterCrea(e.target.value)}
                      className="w-full bg-neutral-light border border-gray-200 rounded-lg px-3 py-2 text-primary focus:outline-none"
                    >
                      <option value="ALL">Qualquer um</option>
                      <option value="YES">Sim (Preenchido)</option>
                      <option value="NO">Não (Isento)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">CNH Necessária</label>
                    <select
                      value={filterCnh}
                      onChange={(e) => setFilterCnh(e.target.value)}
                      className="w-full bg-neutral-light border border-gray-200 rounded-lg px-3 py-2 text-primary focus:outline-none"
                    >
                      <option value="ALL">Qualquer uma</option>
                      <option value="B">B (Carro)</option>
                      <option value="D">D (Caminhão/Micro-ônibus)</option>
                    </select>
                  </div>
                </div>

                {/* Score slider */}
                <div className="flex items-center gap-4 text-xs font-semibold text-primary">
                  <span>Score Mínimo:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filterMinScore}
                    onChange={(e) => setFilterMinScore(parseInt(e.target.value))}
                    className="w-48 accent-accent"
                  />
                  <span>{filterMinScore}% Match</span>
                </div>
              </div>

              {/* Candidates List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all duration-300"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-[10px] font-bold bg-primary/5 text-accent border border-accent/10 px-2.5 py-1 rounded-full uppercase">
                          Score: {app.score}% Match
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Status: {app.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-heading font-bold text-primary text-base leading-tight">
                          {app.candidate.name}
                        </h4>
                        <span className="text-xs text-gray-500 font-sans mt-1 block truncate">
                          Vaga: {app.vacancy.title}
                        </span>
                      </div>

                      {/* Contact metadata */}
                      <div className="space-y-2 text-xs font-sans text-gray-500 border-t border-gray-50 pt-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-accent shrink-0" />
                          <span>{app.candidate.profile?.city || 'Não preenchido'} - {app.candidate.profile?.state || ''}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-accent shrink-0" />
                          <span>Cargo Desejado: {app.candidate.profile?.desiredRole || 'Não informado'}</span>
                        </div>
                        {app.candidate.profile?.crea && (
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-accent shrink-0" />
                            <span>CREA: {app.candidate.profile.crea}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-gray-50 flex gap-3">
                      <button
                        onClick={() => handleOpenCandidateDetails(app)}
                        className="flex-grow text-center text-xs font-bold font-sans bg-primary text-white py-3 rounded-lg hover:bg-primary/95 transition-colors"
                      >
                        Avaliar Candidato
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Vacancies management tab */}
          {activeTab === 'vacancies' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {vacancies.map((v) => (
                <div key={v.id} className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/5 text-accent border border-accent/10 uppercase">
                        {v.area}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        v.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-150 text-gray-700'
                      }`}>
                        {v.isActive ? 'Ativa' : 'Encerrada'}
                      </span>
                    </div>

                    <h3 className="font-heading font-extrabold text-primary text-lg sm:text-xl leading-tight">
                      {v.title}
                    </h3>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500 font-sans">
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-accent" />{v.city} - {v.state}</span>
                      {v.salary && <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-accent" />R$ {v.salary.toLocaleString()}</span>}
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed font-sans line-clamp-3">
                      {v.description}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Vacancy Modal */}
        <AnimatePresence>
          {showAddVacancy && (
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
                  onClick={() => setShowAddVacancy(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-primary transition-colors focus:outline-none"
                >
                  <X className="w-6 h-6" />
                </button>

                <h3 className="font-heading font-extrabold text-primary text-xl border-b border-gray-50 pb-4 mb-6">
                  Cadastrar Nova Oportunidade
                </h3>

                {newVacancyError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg text-xs sm:text-sm mb-6 flex items-center gap-2">
                    <X className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{newVacancyError}</span>
                  </div>
                )}

                <form onSubmit={handleAddVacancySubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Título da Vaga *</label>
                      <input
                        type="text"
                        name="title"
                        required
                        placeholder="Ex: Engenheiro Residente"
                        className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Área *</label>
                      <select
                        name="area"
                        required
                        className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
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
                      <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Cidade *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        placeholder="Ex: São Paulo"
                        className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Estado *</label>
                      <input
                        type="text"
                        name="state"
                        required
                        maxLength={2}
                        placeholder="Ex: SP"
                        className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Modalidade *</label>
                      <select
                        name="modality"
                        required
                        className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                      >
                        <option value="PRESENCIAL">Presencial</option>
                        <option value="HIBRIDO">Híbrido</option>
                        <option value="REMOTO">Remoto</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Salário (R$)</label>
                      <input
                        type="number"
                        name="salary"
                        placeholder="Ex: 8500"
                        className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Quantidade de Vagas</label>
                      <input
                        type="number"
                        name="quantity"
                        defaultValue={1}
                        className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Escolaridade Mínima</label>
                      <select
                        name="minEducation"
                        className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                      >
                        <option value="ENSINO_MEDIO">Ensino Médio</option>
                        <option value="TECNICO">Ensino Técnico</option>
                        <option value="GRADUACAO">Graduação Superior</option>
                        <option value="POS_GRADUACAO">Pós Graduação</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Exp. Mínima (Meses)</label>
                      <input
                        type="number"
                        name="minExperienceMonths"
                        defaultValue={0}
                        className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">CNH Exigida</label>
                      <input
                        type="text"
                        name="cnhRequired"
                        placeholder="Ex: B, D"
                        className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <label className="flex items-center gap-2 text-xs font-sans font-semibold text-primary select-none">
                        <input
                          type="checkbox"
                          name="creaRequired"
                          value="true"
                          className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                        />
                        Exige CREA ativo?
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Descrição Detalhada *</label>
                    <textarea
                      name="description"
                      required
                      rows={3}
                      className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Requisitos Básicos *</label>
                    <textarea
                      name="requirements"
                      required
                      rows={2}
                      className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent resize-none"
                      placeholder="Separe os requisitos com novas linhas..."
                    />
                  </div>

                  <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddVacancy(false)}
                      className="border border-gray-200 text-gray-600 hover:bg-gray-50 font-sans font-bold px-6 py-3 rounded-lg text-sm"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="bg-primary text-white font-sans font-bold px-6 py-3 rounded-lg text-sm hover:shadow-lg transition-all"
                    >
                      {isPending ? 'Gravando...' : 'Cadastrar Vaga'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Candidate Evaluation Modal */}
        <AnimatePresence>
          {selectedCandidate && (
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
                className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto border border-gray-200 shadow-2xl p-6 sm:p-8 relative"
              >
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-primary transition-colors focus:outline-none"
                >
                  <X className="w-6 h-6" />
                </button>

                <h3 className="font-heading font-extrabold text-primary text-xl border-b border-gray-50 pb-4 mb-6 flex items-center gap-2">
                  Avaliação Detalhada: {selectedCandidate.candidate.name}
                  <span className="text-xs font-bold bg-accent/20 text-accent-hover px-3 py-1 rounded-full uppercase ml-2">
                    Score: {selectedCandidate.score}% Match
                  </span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left Column (2/3): Profile details */}
                  <div className="md:col-span-2 space-y-6 font-sans text-sm text-gray-600">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[9px] font-bold text-gray-450 uppercase">CPF</span>
                        <span className="font-semibold text-primary">{selectedCandidate.candidate.profile?.cpf}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold text-gray-450 uppercase">Data de Nascimento</span>
                        <span className="font-semibold text-primary">
                          {selectedCandidate.candidate.profile?.birthDate ? new Date(selectedCandidate.candidate.profile.birthDate).toLocaleDateString('pt-BR') : ''}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold text-gray-450 uppercase">Telefone</span>
                        <span className="font-semibold text-primary">{selectedCandidate.candidate.profile?.phone}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold text-gray-450 uppercase">E-mail</span>
                        <span className="font-semibold text-primary">{selectedCandidate.candidate.email}</span>
                      </div>
                    </div>

                    <div className="bg-neutral-light p-4 rounded-xl border border-gray-150 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-500">
                      <div>
                        <span className="block text-gray-400 uppercase tracking-wider text-[8px] font-bold">Escolaridade</span>
                        <span className="font-semibold text-primary">{selectedCandidate.candidate.profile?.education}</span>
                      </div>
                      <div>
                        <span className="block text-gray-400 uppercase tracking-wider text-[8px] font-bold">CREA</span>
                        <span className="font-semibold text-primary">{selectedCandidate.candidate.profile?.crea || 'Não possui'}</span>
                      </div>
                      <div>
                        <span className="block text-gray-400 uppercase tracking-wider text-[8px] font-bold">CNH</span>
                        <span className="font-semibold text-primary">{selectedCandidate.candidate.profile?.cnh || 'Não possui'}</span>
                      </div>
                      <div>
                        <span className="block text-gray-400 uppercase tracking-wider text-[8px] font-bold">Pretensão Salarial</span>
                        <span className="font-semibold text-primary">
                          {selectedCandidate.candidate.profile?.salaryExpectation ? `R$ ${selectedCandidate.candidate.profile.salaryExpectation.toLocaleString()}` : 'Não informada'}
                        </span>
                      </div>
                    </div>

                    {/* Experiences details */}
                    <div>
                      <h4 className="font-heading font-bold text-primary mb-2 text-sm uppercase tracking-wider">Histórico Profissional</h4>
                      {selectedCandidate.candidate.profile?.experiences?.length === 0 ? (
                        <span className="text-xs text-gray-450 italic">Sem registros.</span>
                      ) : (
                        <div className="space-y-2">
                          {selectedCandidate.candidate.profile?.experiences?.map((exp: any, i: number) => (
                            <div key={i} className="p-3 bg-neutral-light border border-gray-200 rounded-lg text-xs leading-normal">
                              <strong>{exp.role}</strong> na <span className="font-semibold text-gray-600">{exp.company}</span>
                              <span className="block text-[10px] text-gray-400 mt-0.5">
                                Período: {new Date(exp.startDate).toLocaleDateString('pt-BR')} {exp.isCurrent ? '- Atual' : (exp.endDate ? `a ${new Date(exp.endDate).toLocaleDateString('pt-BR')}` : '')}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Resume PDF Attachment Link */}
                    {selectedCandidate.candidate.profile?.resumeUrl && (
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-semibold">Currículo PDF Cadastrado:</span>
                        <a
                          href={selectedCandidate.candidate.profile.resumeUrl}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-accent font-bold hover:underline"
                        >
                          <FileText className="w-4 h-4 shrink-0" />
                          Download PDF Currículo
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Right Column (1/3): RH Actions & Communication */}
                  <div className="bg-neutral-light/50 p-6 rounded-2xl border border-gray-200 space-y-6">
                    <h4 className="font-heading font-bold text-primary text-sm uppercase tracking-wider">Ações do RH</h4>

                    {/* Pipeline Status Controller */}
                    <div>
                      <label className="block text-[10px] font-sans font-bold text-gray-400 uppercase tracking-wider mb-2">Alterar Etapa do Pipeline</label>
                      <select
                        value={selectedCandidate.status}
                        onChange={async (e) => {
                          const res = await updateApplicationStatusAction(selectedCandidate.id, e.target.value);
                          if (res.success) {
                            setSelectedCandidate({ ...selectedCandidate, status: e.target.value });
                            window.location.reload();
                          } else {
                            alert(res.error);
                          }
                        }}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-primary focus:outline-none focus:border-accent"
                      >
                        {pipelineStages.map((stage) => (
                          <option key={stage.value} value={stage.value}>{stage.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Chat with candidate */}
                    <div className="border-t border-gray-200 pt-6 space-y-4">
                      <label className="block text-[10px] font-sans font-bold text-gray-400 uppercase tracking-wider">Enviar Mensagem Direta</label>
                      
                      {/* Short Log */}
                      <div className="space-y-2 max-h-[140px] overflow-y-auto bg-white p-3 rounded-lg border border-gray-150 text-[10px] font-sans">
                        {chatLog.length === 0 ? (
                          <span className="text-gray-400 block text-center">Sem histórico de mensagens.</span>
                        ) : (
                          chatLog.map((m) => (
                            <div key={m.id} className="pb-1.5 border-b border-gray-50 last:border-0 last:pb-0">
                              <strong className={m.senderId === user.userId ? 'text-accent-hover' : 'text-primary'}>
                                {m.senderId === user.userId ? 'Você: ' : 'Candidato: '}
                              </strong>
                              <span>{m.content}</span>
                            </div>
                          ))
                        )}
                      </div>

                      <form onSubmit={handleSendRHMessageSubmit} className="flex gap-2">
                        <input
                          type="text"
                          value={rhMessage}
                          onChange={(e) => setRhMessage(e.target.value)}
                          placeholder="Digite..."
                          className="flex-grow bg-white border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-primary focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="bg-primary text-white hover:bg-primary/95 text-xs font-bold px-3 py-2 rounded-lg"
                        >
                          Enviar
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => setSelectedCandidate(null)}
                    className="border border-gray-200 text-gray-600 hover:bg-gray-50 font-sans font-bold px-6 py-3 rounded-lg text-sm"
                  >
                    Fechar Avaliação
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
