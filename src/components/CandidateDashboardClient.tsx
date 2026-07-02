'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { saveProfileAct, deleteCandidateAccountAction } from '@/app/actions/candidate';
import { sendMessageAction } from '@/app/actions/message';
import {
  User,
  Briefcase,
  MessageSquare,
  Shield,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  Mail,
  Phone,
  FileText,
  DollarSign,
  AlertCircle,
  Download,
} from 'lucide-react';
import Link from 'next/link';

interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

interface Application {
  id: number;
  status: string;
  score: number;
  createdAt: Date;
  vacancy: {
    id: number;
    title: string;
    city: string;
    state: string;
    modality: string;
  };
}

interface Message {
  id: number;
  content: string;
  createdAt: Date;
  isRead: boolean;
  senderId: number;
  sender: {
    name: string;
    role: string;
  };
}

interface CandidateDashboardClientProps {
  initialProfile: any;
  applications: Application[];
  messages: Message[];
  user: {
    userId: number;
    email: string;
    role: string;
    name: string;
  };
}

export default function CandidateDashboardClient({
  initialProfile,
  applications,
  messages,
  user,
}: CandidateDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'applications' | 'messages' | 'security'>('profile');
  const [activeSubTab, setActiveSubTab] = useState<'personal' | 'address' | 'experience' | 'files'>('personal');
  const [saveStatus, setSaveStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Profile Form States
  const [cpf, setCpf] = useState(initialProfile?.cpf || '');
  const [rg, setRg] = useState(initialProfile?.rg || '');
  const [birthDate, setBirthDate] = useState(
    initialProfile?.birthDate ? new Date(initialProfile.birthDate).toISOString().split('T')[0] : ''
  );
  const [gender, setGender] = useState(initialProfile?.gender || '');
  const [maritalStatus, setMaritalStatus] = useState(initialProfile?.maritalStatus || '');
  const [phone, setPhone] = useState(initialProfile?.phone || '');
  const [whatsapp, setWhatsapp] = useState(initialProfile?.whatsapp || '');
  const [address, setAddress] = useState(initialProfile?.address || '');
  const [city, setCity] = useState(initialProfile?.city || '');
  const [state, setState] = useState(initialProfile?.state || '');
  const [cep, setCep] = useState(initialProfile?.cep || '');
  const [salaryExpectation, setSalaryExpectation] = useState(initialProfile?.salaryExpectation || '');
  const [availability, setAvailability] = useState(initialProfile?.availability || '');
  const [education, setEducation] = useState(initialProfile?.education || 'GRADUACAO');
  const [degree, setDegree] = useState(initialProfile?.degree || '');
  const [courses, setCourses] = useState(initialProfile?.courses || '');
  const [certifications, setCertifications] = useState(initialProfile?.certifications || '');
  const [crea, setCrea] = useState(initialProfile?.crea || '');
  const [cnh, setCnh] = useState(initialProfile?.cnh || '');
  const [hasVehicle, setHasVehicle] = useState(initialProfile?.hasVehicle || false);
  const [desiredArea, setDesiredArea] = useState(initialProfile?.desiredArea || 'ENGENHARIA');
  const [desiredRole, setDesiredRole] = useState(initialProfile?.desiredRole || '');
  const [skills, setSkills] = useState(initialProfile?.skills || '');
  const [languages, setLanguages] = useState(initialProfile?.languages || '');
  const [linkedin, setLinkedin] = useState(initialProfile?.linkedin || '');
  const [portfolio, setPortfolio] = useState(initialProfile?.portfolio || '');

  // Experience and Education Lists
  const [experiences, setExperiences] = useState<Experience[]>(initialProfile?.experiences || []);
  const [educations, setEducations] = useState<Education[]>(initialProfile?.educations || []);

  // Temporary item additions
  const [newExp, setNewExp] = useState<Experience>({ company: '', role: '', startDate: '', endDate: '', isCurrent: false });
  const [newEdu, setNewEdu] = useState<Education>({ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', isCurrent: false });

  // File States (files are submitted via standard multipart/form-data)
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Chat/Messages State
  const [replyContent, setReplyContent] = useState('');
  const [messageError, setMessageError] = useState('');

  const handleAddExperience = () => {
    if (!newExp.company || !newExp.role || !newExp.startDate) return;
    setExperiences([...experiences, newExp]);
    setNewExp({ company: '', role: '', startDate: '', endDate: '', isCurrent: false });
  };

  const handleRemoveExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const handleAddEducation = () => {
    if (!newEdu.institution || !newEdu.degree || !newEdu.startDate) return;
    setEducations([...educations, newEdu]);
    setNewEdu({ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', isCurrent: false });
  };

  const handleRemoveEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus(null);
    setIsPending(true);

    const formData = new FormData();
    formData.append('cpf', cpf);
    formData.append('rg', rg);
    formData.append('birthDate', birthDate);
    formData.append('gender', gender);
    formData.append('maritalStatus', maritalStatus);
    formData.append('phone', phone);
    formData.append('whatsapp', whatsapp);
    formData.append('address', address);
    formData.append('city', city);
    formData.append('state', state);
    formData.append('cep', cep);
    formData.append('salaryExpectation', salaryExpectation.toString());
    formData.append('availability', availability);
    formData.append('education', education);
    formData.append('degree', degree);
    formData.append('courses', courses);
    formData.append('certifications', certifications);
    formData.append('crea', crea);
    formData.append('cnh', cnh);
    formData.append('hasVehicle', hasVehicle.toString());
    formData.append('desiredArea', desiredArea);
    formData.append('desiredRole', desiredRole);
    formData.append('skills', skills);
    formData.append('languages', languages);
    formData.append('linkedin', linkedin);
    formData.append('portfolio', portfolio);

    formData.append('experiences', JSON.stringify(experiences));
    formData.append('educations', JSON.stringify(educations));

    if (initialProfile?.photo) formData.append('photoUrlHidden', initialProfile.photo);
    if (initialProfile?.resumeUrl) formData.append('resumeUrlHidden', initialProfile.resumeUrl);

    if (photoFile) formData.append('photo', photoFile);
    if (resumeFile) formData.append('resume', resumeFile);

    const res = await saveProfileAct(formData);
    setIsPending(false);
    if (res.success) {
      setSaveStatus({ success: true, message: 'Perfil e currículo atualizados com sucesso!' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSaveStatus({ success: false, message: res.error || 'Erro ao salvar currículo.' });
    }
  };

  // LGPD Export Data
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({
        candidato: user,
        perfil: {
          cpf, rg, birthDate, gender, maritalStatus, phone, whatsapp, address, city, state, cep,
          salaryExpectation, availability, education, degree, courses, certifications, crea, cnh,
          hasVehicle, desiredArea, desiredRole, skills, languages, linkedin, portfolio,
          experiences, educations
        },
        candidaturas: applications
      }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `meus_dados_cmm_construtora.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // LGPD Delete Account
  const handleDeleteAccount = async () => {
    const confirm = window.confirm(
      'ATENÇÃO: A exclusão de conta é permanente e removerá todos os seus dados, currículos e candidaturas sob as diretrizes da LGPD. Deseja prosseguir?'
    );
    if (!confirm) return;

    const res = await deleteCandidateAccountAction();
    if (res.success) {
      alert('Sua conta e dados pessoais foram completamente excluídos sob os termos da LGPD.');
      window.location.href = '/';
    } else {
      alert('Erro ao excluir conta. Contate o suporte do RH.');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    // Send message to RH. Since the portal default admin seeded ID is 1 (the first user created or Admin)
    // We send message back to sender of the message or to the Admin (user ID 1 / any admin)
    const adminId = messages.length > 0 ? messages[0].senderId : 1;
    const res = await sendMessageAction(adminId, replyContent);
    if (res.success) {
      setReplyContent('');
      window.location.reload();
    } else {
      setMessageError(res.error || 'Erro ao enviar.');
    }
  };

  return (
    <div className="bg-neutral-light min-h-screen pt-28 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title */}
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-heading font-extrabold text-primary">Painel do Candidato</h1>
            <p className="text-sm text-gray-500 mt-1">Bem-vindo, {user.name}. Gerencie seu perfil profissional e acompanhe suas candidaturas.</p>
          </div>
          <Link href="/vagas" className="bg-accent text-primary px-6 py-3 rounded-full text-xs font-bold hover:bg-accent-hover transition-colors shadow-lg shadow-accent/15">
            Ver Vagas Disponíveis
          </Link>
        </div>

        {/* Dashboard Tabs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar Menu */}
          <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm h-fit space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'profile'
                  ? 'bg-primary text-accent'
                  : 'text-gray-500 hover:bg-neutral-light hover:text-primary'
                }`}
            >
              <User className="w-4.5 h-4.5" />
              Meu Currículo / Perfil
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'applications'
                  ? 'bg-primary text-accent'
                  : 'text-gray-500 hover:bg-neutral-light hover:text-primary'
                }`}
            >
              <Briefcase className="w-4.5 h-4.5" />
              Vagas Inscritas
              {applications.length > 0 && (
                <span className="ml-auto w-5 h-5 rounded-full bg-accent text-primary font-heading font-bold text-[10px] flex items-center justify-center">
                  {applications.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'messages'
                  ? 'bg-primary text-accent'
                  : 'text-gray-500 hover:bg-neutral-light hover:text-primary'
                }`}
            >
              <MessageSquare className="w-4.5 h-4.5" />
              Mensagens do RH
              {messages.filter(m => !m.isRead && m.senderId !== user.userId).length > 0 && (
                <span className="ml-auto w-2 h-2 rounded-full bg-accent animate-ping" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'security'
                  ? 'bg-primary text-accent'
                  : 'text-gray-500 hover:bg-neutral-light hover:text-primary'
                }`}
            >
              <Shield className="w-4.5 h-4.5" />
              Segurança & LGPD
            </button>
          </div>

          {/* Active Tab Panel */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-10 shadow-sm space-y-8">

                {/* Save Feedback */}
                {saveStatus && (
                  <div className={`p-4 rounded-lg text-sm font-sans flex items-start gap-2 border ${saveStatus.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                    {saveStatus.success ? <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />}
                    <span>{saveStatus.message}</span>
                  </div>
                )}

                {/* Subtabs for Easy Multi-step Profile completion */}
                <div className="flex flex-wrap border-b border-gray-100 gap-4 mb-6">
                  <button
                    onClick={() => setActiveSubTab('personal')}
                    className={`pb-3 font-heading font-bold text-sm border-b-2 transition-all ${activeSubTab === 'personal' ? 'border-accent text-primary' : 'border-transparent text-gray-400 hover:text-primary'
                      }`}
                  >
                    Dados Pessoais
                  </button>
                  <button
                    onClick={() => setActiveSubTab('address')}
                    className={`pb-3 font-heading font-bold text-sm border-b-2 transition-all ${activeSubTab === 'address' ? 'border-accent text-primary' : 'border-transparent text-gray-400 hover:text-primary'
                      }`}
                  >
                    Contato & Pretensões
                  </button>
                  <button
                    onClick={() => setActiveSubTab('experience')}
                    className={`pb-3 font-heading font-bold text-sm border-b-2 transition-all ${activeSubTab === 'experience' ? 'border-accent text-primary' : 'border-transparent text-gray-400 hover:text-primary'
                      }`}
                  >
                    Experiência & Formação
                  </button>
                  <button
                    onClick={() => setActiveSubTab('files')}
                    className={`pb-3 font-heading font-bold text-sm border-b-2 transition-all ${activeSubTab === 'files' ? 'border-accent text-primary' : 'border-transparent text-gray-400 hover:text-primary'
                      }`}
                  >
                    Arquivos Anexos
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Step 1: Personal Data */}
                  {activeSubTab === 'personal' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">CPF *</label>
                        <input
                          type="text"
                          required
                          value={cpf}
                          onChange={(e) => setCpf(e.target.value)}
                          placeholder="000.000.000-00"
                          className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">RG</label>
                        <input
                          type="text"
                          value={rg}
                          onChange={(e) => setRg(e.target.value)}
                          placeholder="Digite seu RG"
                          className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Data de Nascimento *</label>
                        <input
                          type="date"
                          required
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Gênero</label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                        >
                          <option value="">Selecione...</option>
                          <option value="MASCULINO">Masculino</option>
                          <option value="FEMININO">Feminino</option>
                          <option value="OUTRO">Outro / Prefiro não responder</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Estado Civil</label>
                        <select
                          value={maritalStatus}
                          onChange={(e) => setMaritalStatus(e.target.value)}
                          className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                        >
                          <option value="">Selecione...</option>
                          <option value="SOLTEIRO">Solteiro(a)</option>
                          <option value="CASADO">Casado(a)</option>
                          <option value="DIVORCIADO">Divorciado(a)</option>
                          <option value="VIUVO">Viúvo(a)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Contact, Address, Preferences */}
                  {activeSubTab === 'address' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Telefone Principal *</label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="(11) 99999-9999"
                            className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">WhatsApp</label>
                          <input
                            type="tel"
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            placeholder="(11) 99999-9999"
                            className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Endereço Completo *</label>
                          <input
                            type="text"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Rua, Número, Bairro..."
                            className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Cidade *</label>
                          <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Ex: São Paulo"
                            className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Estado (UF) *</label>
                          <input
                            type="text"
                            required
                            maxLength={2}
                            value={state}
                            onChange={(e) => setState(e.target.value.toUpperCase())}
                            placeholder="Ex: SP"
                            className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">CEP *</label>
                          <input
                            type="text"
                            required
                            value={cep}
                            onChange={(e) => setCep(e.target.value)}
                            placeholder="00000-000"
                            className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Pretensão Salarial (R$)</label>
                          <input
                            type="number"
                            value={salaryExpectation}
                            onChange={(e) => setSalaryExpectation(e.target.value)}
                            placeholder="Ex: 5000"
                            className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Disponibilidade</label>
                          <select
                            value={availability}
                            onChange={(e) => setAvailability(e.target.value)}
                            className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                          >
                            <option value="">Selecione...</option>
                            <option value="IMMEDIATE">Imediata</option>
                            <option value="15_DAYS">15 dias</option>
                            <option value="30_DAYS">30 dias</option>
                            <option value="OTHER">Outros / Negociável</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">LinkedIn</label>
                          <input
                            type="url"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                            placeholder="https://linkedin.com/in/seu-perfil"
                            className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Portfólio / Site Pessoal</label>
                          <input
                            type="url"
                            value={portfolio}
                            onChange={(e) => setPortfolio(e.target.value)}
                            placeholder="https://seuportfolio.com"
                            className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Experience & Education */}
                  {activeSubTab === 'experience' && (
                    <div className="space-y-8">
                      {/* Technical properties */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Escolaridade *</label>
                          <select
                            value={education}
                            onChange={(e) => setEducation(e.target.value)}
                            className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                          >
                            <option value="ENSINO_MEDIO">Ensino Médio</option>
                            <option value="TECNICO">Ensino Técnico</option>
                            <option value="GRADUACAO">Graduação Superior</option>
                            <option value="POS_GRADUACAO">Pós Graduação</option>
                            <option value="MESTRADO">Mestrado</option>
                            <option value="DOUTORADO">Doutorado</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Formação / Curso Principal</label>
                          <input
                            type="text"
                            value={degree}
                            onChange={(e) => setDegree(e.target.value)}
                            placeholder="Ex: Engenharia Civil"
                            className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Registro no CREA (Se aplicável)</label>
                          <input
                            type="text"
                            value={crea}
                            onChange={(e) => setCrea(e.target.value)}
                            placeholder="Digite seu CREA"
                            className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Área Desejada *</label>
                          <select
                            value={desiredArea}
                            onChange={(e) => setDesiredArea(e.target.value)}
                            className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                          >
                            <option value="ENGENHARIA">Engenharia</option>
                            <option value="OBRAS_CAMPO">Obras de Campo</option>
                            <option value="ADMINISTRATIVO">Administrativo</option>
                            <option value="OUTROS">Outros</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Cargo Pretendido *</label>
                          <input
                            type="text"
                            required
                            value={desiredRole}
                            onChange={(e) => setDesiredRole(e.target.value)}
                            placeholder="Ex: Engenheiro Residente"
                            className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">CNH / Categoria</label>
                          <input
                            type="text"
                            value={cnh}
                            onChange={(e) => setCnh(e.target.value)}
                            placeholder="Ex: AB, B, D"
                            className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-xs font-sans font-semibold text-primary">
                          <input
                            type="checkbox"
                            checked={hasVehicle}
                            onChange={(e) => setHasVehicle(e.target.checked)}
                            className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                          />
                          Possui veículo próprio?
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Competências Técnicas / Habilidades</label>
                          <textarea
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            rows={3}
                            placeholder="Ex: AutoCAD, MS Project, Liderança de Equipes (separado por vírgula)"
                            className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Idiomas</label>
                          <textarea
                            value={languages}
                            onChange={(e) => setLanguages(e.target.value)}
                            rows={3}
                            placeholder="Ex: Inglês Intermediário, Espanhol Básico"
                            className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent resize-none"
                          />
                        </div>
                      </div>

                      {/* Professional Experience Lists */}
                      <div className="border-t border-gray-100 pt-6">
                        <h4 className="font-heading font-bold text-primary mb-4 text-sm uppercase tracking-wider">Experiências Profissionais</h4>

                        {/* Current list */}
                        {experiences.length > 0 && (
                          <div className="space-y-3 mb-6">
                            {experiences.map((exp, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-neutral-light p-4 rounded-lg border border-gray-150 text-xs">
                                <div>
                                  <strong className="text-primary">{exp.role}</strong> na <span className="text-gray-600 font-semibold">{exp.company}</span>
                                  <p className="text-[10px] text-gray-400 mt-0.5">
                                    {exp.startDate} {exp.isCurrent ? '- Atual' : (exp.endDate ? `a ${exp.endDate}` : '')}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveExperience(idx)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add form */}
                        <div className="bg-neutral-light/50 p-4 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
                          <div className="sm:col-span-2">
                            <label className="block text-[9px] font-sans font-bold text-gray-500 uppercase">Empresa</label>
                            <input
                              type="text"
                              value={newExp.company}
                              onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                              placeholder="Nome da empresa"
                              className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[9px] font-sans font-bold text-gray-500 uppercase">Cargo</label>
                            <input
                              type="text"
                              value={newExp.role}
                              onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                              placeholder="Cargo exercido"
                              className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-sans font-bold text-gray-500 uppercase">Início</label>
                            <input
                              type="date"
                              value={newExp.startDate}
                              onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
                              className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-sans font-bold text-gray-500 uppercase">Fim</label>
                            <input
                              type="date"
                              disabled={newExp.isCurrent}
                              value={newExp.endDate}
                              onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
                              className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent disabled:opacity-50"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-1 text-[10px] font-sans font-semibold text-gray-500">
                              <input
                                type="checkbox"
                                checked={newExp.isCurrent}
                                onChange={(e) => setNewExp({ ...newExp, isCurrent: e.target.checked, endDate: e.target.checked ? '' : newExp.endDate })}
                                className="w-3.5 h-3.5 text-accent border-gray-300 rounded"
                              />
                              Atual
                            </label>
                          </div>
                          <button
                            type="button"
                            onClick={handleAddExperience}
                            className="bg-primary text-white hover:bg-primary/95 text-xs font-bold py-2 rounded flex items-center justify-center gap-1.5"
                          >
                            <Plus className="w-4 h-4 text-accent" /> Adicionar
                          </button>
                        </div>
                      </div>

                      {/* Academic Background List */}
                      <div className="border-t border-gray-100 pt-6">
                        <h4 className="font-heading font-bold text-primary mb-4 text-sm uppercase tracking-wider">Formação Acadêmica</h4>

                        {/* Current list */}
                        {educations.length > 0 && (
                          <div className="space-y-3 mb-6">
                            {educations.map((edu, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-neutral-light p-4 rounded-lg border border-gray-150 text-xs">
                                <div>
                                  <strong className="text-primary">{edu.degree}</strong> em <span className="text-gray-600 font-semibold">{edu.institution}</span>
                                  {edu.fieldOfStudy && <p className="text-[10px] text-gray-400">Área: {edu.fieldOfStudy}</p>}
                                  <p className="text-[10px] text-gray-400 mt-0.5">
                                    {edu.startDate} {edu.isCurrent ? '- Atual' : (edu.endDate ? `a ${edu.endDate}` : '')}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveEducation(idx)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add form */}
                        <div className="bg-neutral-light/50 p-4 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
                          <div className="sm:col-span-2">
                            <label className="block text-[9px] font-sans font-bold text-gray-500 uppercase">Instituição</label>
                            <input
                              type="text"
                              value={newEdu.institution}
                              onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                              placeholder="Nome da instituição"
                              className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[9px] font-sans font-bold text-gray-500 uppercase">Título / Curso</label>
                            <input
                              type="text"
                              value={newEdu.degree}
                              onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                              placeholder="Curso executado"
                              className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-sans font-bold text-gray-500 uppercase">Início</label>
                            <input
                              type="date"
                              value={newEdu.startDate}
                              onChange={(e) => setNewEdu({ ...newEdu, startDate: e.target.value })}
                              className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-sans font-bold text-gray-500 uppercase">Fim</label>
                            <input
                              type="date"
                              disabled={newEdu.isCurrent}
                              value={newEdu.endDate}
                              onChange={(e) => setNewEdu({ ...newEdu, endDate: e.target.value })}
                              className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent disabled:opacity-50"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-1 text-[10px] font-sans font-semibold text-gray-500">
                              <input
                                type="checkbox"
                                checked={newEdu.isCurrent}
                                onChange={(e) => setNewEdu({ ...newEdu, isCurrent: e.target.checked, endDate: e.target.checked ? '' : newEdu.endDate })}
                                className="w-3.5 h-3.5 text-accent border-gray-300 rounded"
                              />
                              Atual
                            </label>
                          </div>
                          <button
                            type="button"
                            onClick={handleAddEducation}
                            className="bg-primary text-white hover:bg-primary/95 text-xs font-bold py-2 rounded flex items-center justify-center gap-1.5"
                          >
                            <Plus className="w-4 h-4 text-accent" /> Adicionar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Files Upload */}
                  {activeSubTab === 'files' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {/* Photo Upload */}
                      <div className="bg-neutral-light p-6 rounded-xl border border-dashed border-gray-350 flex flex-col items-center justify-center text-center space-y-4">
                        <Upload className="w-10 h-10 text-accent" />
                        <div>
                          <h4 className="font-heading font-bold text-primary text-sm">Foto de Perfil</h4>
                          <p className="text-[10px] text-gray-400 mt-1">Formato JPG/PNG recomendado (Max: 2MB)</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                          className="text-xs font-sans text-gray-500 border border-gray-200 p-2 rounded-lg bg-white"
                        />
                        {initialProfile?.photo && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                              <img src={initialProfile.photo} alt="Perfil" className="w-full h-full object-cover" />
                            </span>
                            <span>Foto cadastrada</span>
                          </div>
                        )}
                      </div>

                      {/* PDF Resume Upload */}
                      <div className="bg-neutral-light p-6 rounded-xl border border-dashed border-gray-350 flex flex-col items-center justify-center text-center space-y-4">
                        <FileText className="w-10 h-10 text-accent" />
                        <div>
                          <h4 className="font-heading font-bold text-primary text-sm">Currículo em PDF *</h4>
                          <p className="text-[10px] text-gray-400 mt-1">Anexo obrigatório em formato PDF (Max: 5MB)</p>
                        </div>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                          className="text-xs font-sans text-gray-500 border border-gray-200 p-2 rounded-lg bg-white"
                        />
                        {initialProfile?.resumeUrl && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <a
                              href={initialProfile.resumeUrl}
                              target="_blank"
                              className="text-accent underline font-semibold flex items-center gap-1"
                            >
                              <Download className="w-3.5 h-3.5" /> Ver PDF
                            </a>
                            <span>PDF Cadastrado</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-gray-150 flex justify-end">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="bg-primary text-white font-sans font-bold px-8 py-3.5 rounded-lg hover:bg-primary/95 transition-all text-sm disabled:opacity-50"
                    >
                      {isPending ? 'Salvando...' : 'Salvar Informações do Currículo'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-sm space-y-6">
                <h2 className="text-xl font-heading font-extrabold text-primary border-b border-gray-50 pb-4">Candidaturas Realizadas</h2>

                {applications.length === 0 ? (
                  <div className="text-center p-12">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="font-heading font-bold text-primary text-base">Nenhuma candidatura registrada</h3>
                    <p className="text-xs text-gray-500 mt-1">Navegue pelas nossas vagas e envie seu currículo para concorrer.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="bg-neutral-light p-6 rounded-xl border border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div className="space-y-2">
                          <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/5 text-accent border border-accent/10 uppercase">
                            {app.vacancy.modality}
                          </span>
                          <h3 className="font-heading font-bold text-primary text-base sm:text-lg leading-tight">{app.vacancy.title}</h3>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-sans">
                            <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                            <span>{app.vacancy.city} - {app.vacancy.state}</span>
                          </div>
                        </div>

                        {/* Pipeline Status Indicator */}
                        <div className="flex flex-col sm:items-end gap-2 shrink-0">
                          <span className={`text-xs font-bold tracking-wider px-3.5 py-1.5 rounded-full text-center uppercase ${app.status === 'APROVADO' || app.status === 'CONTRATADO'
                              ? 'bg-green-100 text-green-800'
                              : app.status === 'BANCO_TALENTOS'
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-accent/15 text-accent-hover'
                            }`}>
                            Status: {app.status}
                          </span>
                          <span className="text-[10px] text-gray-400 font-sans">Inscrito em: {new Date(app.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Chat/Messages Tab */}
            {activeTab === 'messages' && (
              <div className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-sm space-y-6">
                <h2 className="text-xl font-heading font-extrabold text-primary border-b border-gray-50 pb-4">Mensagens Recebidas do RH</h2>

                {messages.length === 0 ? (
                  <div className="text-center p-12">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="font-heading font-bold text-primary text-base">Nenhuma mensagem registrada</h3>
                    <p className="text-xs text-gray-500 mt-1">O RH enviará notificações ou convites para entrevistas por aqui.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Chat Log */}
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                      {messages.map((m) => {
                        const isRH = m.sender.role === 'ADMIN';
                        return (
                          <div key={m.id} className={`flex ${isRH ? 'justify-start' : 'justify-end'}`}>
                            <div className={`p-4 rounded-2xl max-w-[80%] border ${isRH ? 'bg-neutral-light border-gray-200 rounded-tl-none' : 'bg-primary text-white border-primary rounded-tr-none'
                              }`}>
                              <span className={`block text-[9px] font-sans font-bold uppercase mb-1 ${isRH ? 'text-accent-hover' : 'text-accent'}`}>
                                {isRH ? 'CMM Recursos Humanos' : 'Você'}
                              </span>
                              <p className="text-xs leading-relaxed font-sans">{m.content}</p>
                              <span className="block text-[8px] text-gray-400 text-right mt-1.5">
                                {new Date(m.createdAt).toLocaleDateString('pt-BR')} {new Date(m.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Reply Area */}
                    <form onSubmit={handleSendMessage} className="border-t border-gray-150 pt-4 flex gap-4">
                      <input
                        type="text"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Escreva uma resposta para o RH..."
                        className="flex-grow bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                      />
                      <button
                        type="submit"
                        className="bg-primary text-white hover:bg-primary/95 font-sans font-bold px-6 py-3 rounded-lg text-sm transition-colors"
                      >
                        Enviar
                      </button>
                    </form>
                    {messageError && <span className="text-xs text-red-500 block font-sans">{messageError}</span>}
                  </div>
                )}
              </div>
            )}

            {/* LGPD Security Panel */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-10 shadow-sm space-y-8">
                <div>
                  <h2 className="text-xl font-heading font-extrabold text-primary">Segurança de Dados & LGPD</h2>
                  <p className="text-xs text-gray-500 mt-1">Conformidade estrita com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).</p>
                </div>

                {/* Consent Explanation */}
                <div className="bg-neutral-light p-6 rounded-xl border border-gray-150 space-y-3 text-xs sm:text-sm text-gray-600 leading-relaxed font-sans">
                  <h4 className="font-heading font-bold text-primary flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                    Consentimento de Tratamento de Dados
                  </h4>
                  <p>
                    Ao cadastrar seu currículo no portal Trabalhe Conosco da CMM Construtora, você autoriza nossa equipe de Recursos Humanos a processar suas informações profissionais exclusivamente para fins de recrutamento, seleção e triagem de vagas internas.
                  </p>
                  <p>
                    Seus dados são protegidos por mecanismos seguros de criptografia e acesso restrito aos analistas autorizados.
                  </p>
                </div>

                {/* LGPD Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-100 pt-8">
                  <div className="space-y-2">
                    <h4 className="font-heading font-bold text-primary text-sm">Direito de Portabilidade</h4>
                    <p className="text-xs text-gray-400">Exporte todos os seus dados cadastrais, logs e candidaturas em formato legível estruturado (JSON).</p>
                    <button
                      onClick={handleExportData}
                      className="inline-flex items-center gap-2 border border-primary/10 text-primary font-sans font-bold text-xs px-5 py-3 rounded-lg hover:bg-neutral-light transition-colors"
                    >
                      <Download className="w-4 h-4 text-accent" />
                      Exportar meus dados cadastrais
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-heading font-bold text-red-700 text-sm">Direito de Exclusão ("Esquecimento")</h4>
                    <p className="text-xs text-gray-400">Revogue seu consentimento e apague permanentemente seu cadastro dos nossos servidores.</p>
                    <button
                      onClick={handleDeleteAccount}
                      className="inline-flex items-center gap-2 border border-red-200 text-red-700 font-sans font-bold text-xs px-5 py-3 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                      Excluir minha conta e dados
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
