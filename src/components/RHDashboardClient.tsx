'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createVacancyAction, updateVacancyAction, updateApplicationStatusAction, sendRHMessageAction } from '@/app/actions/rh';
import {
  Users,
  Briefcase,
  Layers,
  CheckCircle,
  Clock,
  Search,
  Plus,
  MapPin,
  DollarSign,
  Award,
  Shield,
  History,
  TrendingUp,
} from 'lucide-react';
import RHVacancyModal from './RHVacancyModal';
import RHCandidateDetailsModal from './RHCandidateDetailsModal';
import RHKanbanBoard from './RHKanbanBoard';

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
  
  // Edit Vacancy State
  const [showEditVacancy, setShowEditVacancy] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<any | null>(null);
  const [editVacancyError, setEditVacancyError] = useState('');
  
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

  // Edit Vacancy Open
  const handleOpenEditVacancy = (vacancy: any) => {
    setEditingVacancy(vacancy);
    setShowEditVacancy(true);
    setEditVacancyError('');
  };

  // Edit Vacancy Submit
  const handleEditVacancySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditVacancyError('');
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const res = await updateVacancyAction(editingVacancy.id, formData);
    setIsPending(false);

    if (res.success) {
      setShowEditVacancy(false);
      window.location.reload();
    } else {
      setEditVacancyError(res.error || 'Erro ao atualizar vaga.');
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
    
    // Fetch conversation log dynamically
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

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedCandidate) return;
    const res = await updateApplicationStatusAction(selectedCandidate.id, newStatus);
    if (res.success) {
      setSelectedCandidate({ ...selectedCandidate, status: newStatus });
      
      // Update applications state locally
      const updated = applications.map((app) =>
        app.id === selectedCandidate.id ? { ...app, status: newStatus } : app
      );
      setApplications(updated);
    } else {
      alert(res.error || 'Erro ao alterar etapa.');
    }
  };

  return (
    <div className="bg-[#0B0F19] text-slate-100 min-h-screen pt-28 pb-20 font-sans relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title / Header */}
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-sans font-bold text-accent uppercase tracking-[0.2em]">Painel de Controle Interno</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-white">Painel de Gestão do RH</h1>
            <p className="text-sm text-gray-400 mt-1">Recrutamento, Seleção Inteligente e Pipeline de Talentos CMM Construtora.</p>
          </div>
          <button
            onClick={() => setShowAddVacancy(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-accent to-[#b8974a] text-primary px-6 py-3.5 rounded-full text-xs font-bold hover:shadow-lg hover:shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-md shadow-accent/15"
          >
            <Plus className="w-4 h-4 text-primary" />
            Cadastrar Nova Vaga
          </button>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex flex-wrap bg-[#131B2E]/60 p-1.5 rounded-2xl border border-white/5 gap-2 mb-10 text-xs font-semibold max-w-fit backdrop-blur-md">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-3 rounded-xl transition-all duration-300 ${
              activeTab === 'overview' ? 'bg-accent text-primary shadow-lg shadow-accent/15' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-5 py-3 rounded-xl transition-all duration-300 ${
              activeTab === 'pipeline' ? 'bg-accent text-primary shadow-lg shadow-accent/15' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Kanban / Pipeline
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-5 py-3 rounded-xl transition-all duration-300 ${
              activeTab === 'candidates' ? 'bg-accent text-primary shadow-lg shadow-accent/15' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Banco de Talentos / Filtros
          </button>
          <button
            onClick={() => setActiveTab('vacancies')}
            className={`px-5 py-3 rounded-xl transition-all duration-300 ${
              activeTab === 'vacancies' ? 'bg-accent text-primary shadow-lg shadow-accent/15' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Gerenciar Vagas
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
                <div className="bg-[#131B2E]/60 backdrop-blur-md p-6 rounded-2xl border border-white/[0.05] shadow-xl text-center flex flex-col items-center hover:border-accent/30 hover:scale-[1.03] transition-all duration-300 group">
                  <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 text-accent border border-accent/20 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(200,167,91,0.05)] group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5" />
                  </span>
                  <span className="text-3xl font-heading font-extrabold text-white block">{totalResumes}</span>
                  <span className="text-[10px] text-gray-400 font-sans uppercase tracking-wider mt-1.5 font-bold">Currículos</span>
                </div>
                <div className="bg-[#131B2E]/60 backdrop-blur-md p-6 rounded-2xl border border-white/[0.05] shadow-xl text-center flex flex-col items-center hover:border-accent/30 hover:scale-[1.03] transition-all duration-300 group">
                  <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 text-accent border border-accent/20 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(200,167,91,0.05)] group-hover:scale-110 transition-transform">
                    <Plus className="w-5 h-5" />
                  </span>
                  <span className="text-3xl font-heading font-extrabold text-white block">{newCands}</span>
                  <span className="text-[10px] text-gray-400 font-sans uppercase tracking-wider mt-1.5 font-bold">Novos</span>
                </div>
                <div className="bg-[#131B2E]/60 backdrop-blur-md p-6 rounded-2xl border border-white/[0.05] shadow-xl text-center flex flex-col items-center hover:border-accent/30 hover:scale-[1.03] transition-all duration-300 group">
                  <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 text-accent border border-accent/20 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(200,167,91,0.05)] group-hover:scale-110 transition-transform">
                    <Briefcase className="w-5 h-5" />
                  </span>
                  <span className="text-3xl font-heading font-extrabold text-white block">{activeVacancies}</span>
                  <span className="text-[10px] text-gray-400 font-sans uppercase tracking-wider mt-1.5 font-bold">Vagas Abertas</span>
                </div>
                <div className="bg-[#131B2E]/60 backdrop-blur-md p-6 rounded-2xl border border-white/[0.05] shadow-xl text-center flex flex-col items-center hover:border-accent/30 hover:scale-[1.03] transition-all duration-300 group">
                  <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 text-accent border border-accent/20 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(200,167,91,0.05)] group-hover:scale-110 transition-transform">
                    <Clock className="w-5 h-5" />
                  </span>
                  <span className="text-3xl font-heading font-extrabold text-white block">{interviewCands}</span>
                  <span className="text-[10px] text-gray-400 font-sans uppercase tracking-wider mt-1.5 font-bold">Entrevistas</span>
                </div>
                <div className="bg-[#131B2E]/60 backdrop-blur-md p-6 rounded-2xl border border-white/[0.05] shadow-xl text-center flex flex-col items-center hover:border-accent/30 hover:scale-[1.03] transition-all duration-300 group">
                  <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 text-accent border border-accent/20 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(200,167,91,0.05)] group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-5 h-5" />
                  </span>
                  <span className="text-3xl font-heading font-extrabold text-white block">{hiredCands}</span>
                  <span className="text-[10px] text-gray-400 font-sans uppercase tracking-wider mt-1.5 font-bold">Contratados</span>
                </div>
                <div className="bg-[#131B2E]/60 backdrop-blur-md p-6 rounded-2xl border border-white/[0.05] shadow-xl text-center flex flex-col items-center hover:border-accent/30 hover:scale-[1.03] transition-all duration-300 group">
                  <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 text-accent border border-accent/20 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(200,167,91,0.05)] group-hover:scale-110 transition-transform">
                    <Layers className="w-5 h-5" />
                  </span>
                  <span className="text-3xl font-heading font-extrabold text-white block">{talentPoolCount}</span>
                  <span className="text-[10px] text-gray-400 font-sans uppercase tracking-wider mt-1.5 font-bold">Talentos</span>
                </div>
              </div>

              {/* Graphics & Activity Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* SVG Sleek Bar Chart */}
                <div className="lg:col-span-2 bg-[#131B2E]/50 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/[0.05] shadow-xl space-y-6">
                  <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    Distribuição de Candidaturas por Etapa
                  </h3>
                  <div className="h-64 flex items-end justify-between px-4 pb-4 pt-10 border-b border-white/[0.05] relative">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 py-4">
                      <div className="w-full border-t border-white/10" />
                      <div className="w-full border-t border-white/10" />
                      <div className="w-full border-t border-white/10" />
                    </div>
                    
                    {pipelineStages.map((stage) => {
                      const count = applications.filter((a) => a.status === stage.value).length;
                      const maxVal = Math.max(...pipelineStages.map((s) => applications.filter((a) => a.status === s.value).length), 1);
                      const pct = (count / maxVal) * 100;
                      return (
                        <div key={stage.value} className="flex flex-col items-center w-1/8 group relative z-10 animate-fade-in">
                          <span className="text-[10px] font-bold text-accent font-sans opacity-0 group-hover:opacity-100 transition-opacity mb-1 absolute bottom-full">
                            {count}
                          </span>
                          <div
                            style={{ height: `${Math.max(pct, 5)}%` }}
                            className="w-8 bg-gradient-to-t from-accent/20 to-accent rounded-t-lg group-hover:shadow-[0_0_15px_rgba(200,167,91,0.3)] transition-all duration-300"
                          />
                          <span className="text-[9px] font-sans text-gray-400 truncate w-12 text-center mt-2.5 font-semibold">
                            {stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Audit Logs / Activity History */}
                <div className="bg-[#131B2E]/50 backdrop-blur-md p-6 rounded-2xl border border-white/[0.05] shadow-xl space-y-6">
                  <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                    <History className="w-5 h-5 text-accent" />
                    Histórico de Auditoria do RH
                  </h3>
                  <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1">
                    {auditLogs.length === 0 ? (
                      <span className="text-xs text-gray-500 font-sans block text-center pt-8">Sem atividades registradas.</span>
                    ) : (
                      auditLogs.map((log) => (
                        <div key={log.id} className="text-xs font-sans border-b border-white/[0.04] pb-3 last:border-0 last:pb-0">
                          <span className="block text-[9px] font-bold text-accent uppercase tracking-wider">
                            {log.action}
                          </span>
                          <p className="text-gray-300 mt-0.5 leading-relaxed">{log.details}</p>
                          <span className="block text-[8px] text-gray-500 mt-1">
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
            >
              <RHKanbanBoard
                pipelineStages={pipelineStages}
                applications={applications}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onCardClick={handleOpenCandidateDetails}
              />
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
              <div className="bg-[#131B2E]/55 backdrop-blur-md p-6 rounded-2xl border border-white/[0.05] shadow-xl space-y-6">
                <div className="flex gap-4 items-center border-b border-white/[0.05] pb-4">
                  <Search className="w-5 h-5 text-accent shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar candidatos por nome ou cargo..."
                    className="flex-grow bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5 text-xs">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Cargo Desejado</label>
                    <input
                      type="text"
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      placeholder="Ex: Engenheiro"
                      className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Cidade</label>
                    <input
                      type="text"
                      value={filterCity}
                      onChange={(e) => setFilterCity(e.target.value)}
                      placeholder="Ex: São Paulo"
                      className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Escolaridade</label>
                    <select
                      value={filterEdu}
                      onChange={(e) => setFilterEdu(e.target.value)}
                      className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-accent"
                    >
                      <option value="">Todas</option>
                      <option value="ENSINO_MEDIO">Ensino Médio</option>
                      <option value="TECNICO">Ensino Técnico</option>
                      <option value="GRADUACAO">Graduação Superior</option>
                      <option value="POS_GRADUACAO">Pós Graduação</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">CREA Ativo</label>
                    <select
                      value={filterCrea}
                      onChange={(e) => setFilterCrea(e.target.value)}
                      className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-accent"
                    >
                      <option value="ALL">Qualquer um</option>
                      <option value="YES">Sim (Preenchido)</option>
                      <option value="NO">Não (Isento)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">CNH Necessária</label>
                    <select
                      value={filterCnh}
                      onChange={(e) => setFilterCnh(e.target.value)}
                      className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-accent"
                    >
                      <option value="ALL">Qualquer uma</option>
                      <option value="B">B (Carro)</option>
                      <option value="D">D (Caminhão/Micro-ônibus)</option>
                    </select>
                  </div>
                </div>

                {/* Score slider */}
                <div className="flex items-center gap-4 text-xs font-semibold text-gray-300">
                  <span>Score Mínimo:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filterMinScore}
                    onChange={(e) => setFilterMinScore(parseInt(e.target.value))}
                    className="w-48 accent-accent"
                  />
                  <span className="text-accent">{filterMinScore}% Match</span>
                </div>
              </div>

              {/* Candidates List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-[#131B2E]/50 border border-white/[0.05] p-6 rounded-2xl shadow-xl flex flex-col justify-between hover:border-accent/40 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-[10px] font-bold bg-accent/15 text-accent border border-accent/20 px-2.5 py-1 rounded-full uppercase shadow-[0_0_10px_rgba(200,167,91,0.05)]">
                          Score: {app.score}% Match
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Status: {app.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-heading font-extrabold text-white text-base leading-tight">
                          {app.candidate.name}
                        </h4>
                        <span className="text-xs text-gray-400 font-sans mt-1 block truncate">
                          Vaga: {app.vacancy.title}
                        </span>
                      </div>

                      {/* Contact metadata */}
                      <div className="space-y-2.5 text-xs font-sans text-gray-400 border-t border-white/[0.03] pt-3.5">
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

                    <div className="pt-6 mt-6 border-t border-white/[0.03] flex gap-3">
                      <button
                        onClick={() => handleOpenCandidateDetails(app)}
                        className="flex-grow text-center text-xs font-bold font-sans bg-accent text-primary py-3.5 rounded-xl hover:bg-accent-hover transition-colors shadow-md shadow-accent/10"
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
                <div key={v.id} className="bg-[#131B2E]/50 border border-white/[0.05] p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col justify-between hover:border-accent/35 hover:shadow-2xl transition-all duration-300">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/20 uppercase">
                        {v.area}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase ${v.isActive
                        ? 'bg-green-500/10 text-green-400 border-green-500/25'
                        : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}>
                        {v.isActive ? 'Ativa' : 'Encerrada'}
                      </span>
                    </div>

                    <h3 className="font-heading font-extrabold text-white text-lg sm:text-xl leading-tight">
                      {v.title}
                    </h3>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-450 font-sans">
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-accent" />{v.city} - {v.state}</span>
                      {v.salary && <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-accent" />R$ {v.salary.toLocaleString()}</span>}
                    </div>

                    <p className="text-xs text-gray-405 leading-relaxed font-sans line-clamp-3 border-t border-white/[0.03] pt-3">
                      {v.description}
                    </p>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-gray-500 font-sans pt-2 border-t border-white/[0.03]">
                      <span>📅 Início: {v.startDate ? new Date(v.startDate).toLocaleDateString('pt-BR') : 'Imediato'}</span>
                      <span>⏳ Prazo: {v.deadline ? new Date(v.deadline).toLocaleDateString('pt-BR') : 'Sem prazo'}</span>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/[0.03] flex justify-end">
                    <button
                      onClick={() => handleOpenEditVacancy(v)}
                      className="bg-[#1E293B] border border-white/5 text-accent hover:border-accent/40 font-sans font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all"
                    >
                      Editar Oportunidade
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals container */}
        <RHVacancyModal
          isOpen={showAddVacancy}
          onClose={() => setShowAddVacancy(false)}
          onSubmit={handleAddVacancySubmit}
          mode="create"
          isPending={isPending}
          error={newVacancyError}
        />

        <RHVacancyModal
          isOpen={showEditVacancy}
          onClose={() => setShowEditVacancy(false)}
          onSubmit={handleEditVacancySubmit}
          mode="edit"
          vacancy={editingVacancy}
          isPending={isPending}
          error={editVacancyError}
        />

        <RHCandidateDetailsModal
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          candidate={selectedCandidate}
          user={user}
          pipelineStages={pipelineStages}
          chatLog={chatLog}
          rhMessage={rhMessage}
          onRhMessageChange={setRhMessage}
          onSendChatMessage={handleSendRHMessageSubmit}
          onStatusChange={handleStatusChange}
        />

      </div>
    </div>
  );
}
