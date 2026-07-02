'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Award,
  Clock,
  Cpu,
  Leaf,
  Users,
  Compass,
  FileText,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  ArrowRight,
  Star,
  CheckCircle2,
  HardHat,
  Hammer,
  Building,
  Wrench,
  Layers,
  FileSpreadsheet,
  Briefcase,
  HelpCircle,
  Sparkles,
  Calendar,
  X,
  Play,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Counter from './Counter';
import ProjectsShowcase from './ProjectsShowcase';
import { Project } from '@/lib/projects-data';

interface HomeClientProps {
  initialProjects: Project[];
}

export default function HomeClient({ initialProjects }: HomeClientProps) {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  const services = [
    { title: 'Construção Civil', icon: Building, img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80', desc: 'Execução completa de edificações residenciais, comerciais e industriais de alto padrão.' },
    { title: 'Reformas Corporativas', icon: Hammer, img: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=600&q=80', desc: 'Revitalização e adaptação de espaços corporativos com agilidade e acabamento premium.' },
    { title: 'Infraestrutura', icon: Layers, img: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80', desc: 'Grandes obras de terraplenagem, pavimentação, saneamento e redes de energia.' },
    { title: 'Obras Públicas', icon: Shield, img: 'https://images.unsplash.com/photo-1517089596392-ee9a5c03e2d4?auto=format&fit=crop&w=600&q=80', desc: 'Construção de escolas, hospitais e vias públicas atendendo rigorosamente a editais.' },
    { title: 'Obras Privadas', icon: HardHat, img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80', desc: 'Parceria no desenvolvimento de condomínios, indústrias e centros logísticos.' },
    { title: 'Engenharia Consultiva', icon: Compass, img: 'https://images.unsplash.com/photo-1503387762-592dedb8c310?auto=format&fit=crop&w=600&q=80', desc: 'Estudos de viabilidade técnica, análises estruturais e consultorias especializadas.' },
    { title: 'Gerenciamento de Obras', icon: Wrench, img: 'https://images.unsplash.com/photo-1531834687290-c3b04509121b?auto=format&fit=crop&w=600&q=80', desc: 'Administração de cronograma, custos e suprimentos para máxima eficiência.' },
    { title: 'Consultoria Técnica', icon: Users, img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80', desc: 'Análise de patologias, auditorias de segurança e avaliações de engenharia.' },
    { title: 'Projetos Arquitetônicos', icon: Sparkles, img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80', desc: 'Desenhos conceituais que aliam estética contemporânea à eficiência estrutural.' },
    { title: 'Projetos Estruturais', icon: Cpu, img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', desc: 'Dimensionamento seguro de concreto armado, estruturas metálicas e fundações.' },
    { title: 'Regularização Imobiliária', icon: FileText, img: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80', desc: 'Assessoria em Habite-se, alvarás, vistorias do Corpo de Bombeiros e licenças.' },
    { title: 'Fiscalização de Obras', icon: FileSpreadsheet, img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80', desc: 'Garantia de que a execução atenda estritamente às especificações de projeto.' },
  ];

  const timelineSteps = [
    { step: '01', title: 'Planejamento', desc: 'Estudo de viabilidade técnica, orçamento executivo e cronograma macro.' },
    { step: '02', title: 'Projeto', desc: 'Criação dos projetos executivos detalhados em tecnologia BIM.' },
    { step: '03', title: 'Aprovação', desc: 'Obtenção de licenças governamentais e alvarás necessários.' },
    { step: '04', title: 'Execução', desc: 'Mobilização no canteiro e construção ativa com controle rígido de qualidade.' },
    { step: '05', title: 'Fiscalização', desc: 'Vistorias periódicas de conformidade técnica e de segurança do trabalho.' },
    { step: '06', title: 'Entrega', desc: 'Testes de comissionamento, entrega de chaves e o manual do proprietário.' },
  ];

  const differentials = [
    { title: 'Equipe Especializada', desc: 'Corpo técnico formado por engenheiros e mestres com larga experiência de campo.', icon: Users },
    { title: 'Atendimento Personalizado', desc: 'Relatórios semanais detalhados e canal de contato direto com a gerência do projeto.', icon: Compass },
    { title: 'Compromisso com Prazos', desc: 'Gestão via metodologias ágeis de construção que evitam gargalos físicos e financeiros.', icon: Clock },
    { title: 'Segurança Rigorosa', desc: 'Índice de acidentes zero graças ao rigoroso controle de EPIs e treinamentos de NR.', icon: Shield },
    { title: 'Tecnologia BIM', desc: 'Compatibilização de projetos em 3D que reduz desperdícios de materiais no canteiro.', icon: Cpu },
    { title: 'Sustentabilidade', desc: 'Gestão de resíduos sólidos, reaproveitamento de água e certificações de obra verde.', icon: Leaf },
    { title: 'Qualidade Garantida', desc: 'Laboratórios próprios para ensaio de materiais e concreto em todas as etapas.', icon: Award },
    { title: 'Transparência Absoluta', desc: 'Portal do cliente para acompanhar gastos, orçamentos comparativos e cronogramas.', icon: FileSpreadsheet },
  ];

  const testimonials = [
    { name: 'Carlos Silva', role: 'Diretor de Engenharia', company: 'DNIT', text: 'A CMM entregou a duplicação da rodovia BR-101 com 3 meses de antecedência. Comprometimento técnico exemplar e transparência financeira impecável.', rating: 5 },
    { name: 'Mariana Souza', role: 'Diretora Operacional', company: 'SafeCorp Logística', text: 'O gerenciamento do nosso centro logístico em Campinas foi perfeito. Custos controlados centavo por centavo e qualidade construtiva excelente.', rating: 5 },
    { name: 'Roberto Mendes', role: 'Diretor Geral', company: 'Mendes Participações', text: 'A CMM Construtora é sinônimo de segurança jurídica e eficiência de engenharia. Nossos condomínios corporativos levam a assinatura de qualidade deles.', rating: 5 },
  ];

  const faqs = [
    { q: 'A CMM Construtora atende obras em todo o Brasil?', a: 'Sim, a CMM possui capacidade logística instalada para mobilização e execução de grandes obras residenciais, corporativas, comerciais e de infraestrutura em âmbito nacional.' },
    { q: 'Como funciona o acompanhamento financeiro e cronograma físico da obra?', a: 'Utilizamos um portal exclusivo para o cliente onde são anexados relatórios diários de obra (RDO), fotos semanais via drones, status de cronograma e o fluxo de pagamentos de suprimentos.' },
    { q: 'A empresa possui certificação de qualidade?', a: 'Sim, a CMM é certificada pelo PBQP-H Nível A (Programa Brasileiro da Qualidade e Produtividade do Habitat) e ISO 9001, garantindo processos padronizados.' },
    { q: 'Como faço para enviar meu currículo?', a: 'Você pode acessar nossa aba "Vagas" ou clicar no botão "Área do Candidato" no topo do site para criar sua conta, cadastrar seu currículo e se inscrever nas vagas abertas de forma online.' },
    { q: 'A CMM atua em parcerias para incorporação imobiliária?', a: 'Sim, atuamos sob a modalidade de EPC (Engineering, Procurement and Construction), empreitadas globais ou sociedades de propósito específico (SPE) com investidores privados.' },
  ];

  return (
    <div className="bg-neutral-light overflow-x-hidden" id="inicio">
      {/* 1. Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center bg-primary overflow-hidden">
        {/* Parallax Background Zoom Image */}
        <motion.div
          initial={{ scale: 1.15, opacity: 0.25 }}
          animate={{ scale: 1, opacity: 0.35 }}
          transition={{ duration: 15, ease: 'easeOut' }}
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80')",
          }}
          className="absolute inset-0 bg-cover bg-center"
        />

        {/* Diagonal architectural line overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent z-10" />

        <div className="relative z-20 max-w-5xl mx-auto px-4 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4 flex items-center gap-2 border border-accent/25 bg-accent/5 px-4 py-1.5 rounded-full text-xs font-sans font-semibold tracking-wider text-accent uppercase"
          >
            <Shield className="w-3.5 h-3.5" />
            Engenharia & Soluções Sólidas
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight text-white leading-tight"
          >
            Construindo o futuro <br />
            <span className="text-accent bg-clip-text">com excelência.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 text-base sm:text-xl text-gray-300 font-sans max-w-3xl leading-relaxed font-light"
          >
            Projetos, construções e soluções completas para obras públicas e privadas, entregando qualidade, segurança e compromisso em cada etapa.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md"
          >
            <Link
              href="#contato"
              className="bg-accent text-primary font-sans font-bold px-8 py-4 rounded-full hover:bg-accent-hover transition-all duration-300 shadow-lg shadow-accent/20 text-center"
            >
              Solicitar Orçamento
            </Link>
            <Link
              href="#projetos"
              className="border border-white/20 text-white font-sans font-semibold px-8 py-4 rounded-full hover:bg-white/5 transition-all duration-300 text-center"
            >
              Conheça nossos Projetos
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
          <span className="text-xs tracking-[0.2em] font-sans text-gray-500 uppercase mb-2">Role para explorar</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="w-5 h-8 border-2 border-accent/40 rounded-full flex justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-accent rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* 2. Quem Somos Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="quem-somos">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Interactive Image Collage */}
          <div className="relative h-[480px] rounded-2xl overflow-hidden shadow-2xl group">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1000&q=80')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/25 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <span className="text-accent font-sans text-xs tracking-widest uppercase font-bold block mb-1">Canteiro CMM</span>
              <h3 className="text-xl font-heading font-bold">Foco em Solidez e Segurança Jurídica</h3>
            </div>
          </div>

          {/* Right: History & Mission */}
          <div className="flex flex-col space-y-8">
            <div>
              <span className="text-accent font-sans text-sm tracking-widest uppercase font-bold block mb-2">
                Quem Somos
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-primary">
                Mais de uma década erguendo projetos de grande importância nacional.
              </h2>
            </div>

            <p className="text-gray-600 font-sans leading-relaxed text-base">
              Fundada sob pilares de integridade técnica e inovação de engenharia, a CMM Construtora iniciou sua trajetória focada em infraestrutura e rapidamente expandiu sua atuação para grandes galpões industriais, obras residenciais premium e parcerias públicas estratégicas.
            </p>

            {/* Mission, Vision, Values Tab Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <span className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4">
                  <Award className="w-5 h-5" />
                </span>
                <h4 className="font-heading font-bold text-primary mb-2">Missão</h4>
                <p className="text-xs text-gray-500 font-sans leading-relaxed">
                  Entregar obras excepcionais com zero desvios técnicos, respeitando orçamento e meio ambiente.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <span className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4">
                  <Shield className="w-5 h-5" />
                </span>
                <h4 className="font-heading font-bold text-primary mb-2">Visão</h4>
                <p className="text-xs text-gray-500 font-sans leading-relaxed">
                  Ser reconhecida nacionalmente pela excelência, tecnologia BIM aplicada e atratividade corporativa.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <span className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4">
                  <Users className="w-5 h-5" />
                </span>
                <h4 className="font-heading font-bold text-primary mb-2">Valores</h4>
                <p className="text-xs text-gray-500 font-sans leading-relaxed">
                  Compromisso com prazos, ética jurídica (LGPD/Compliance), sustentabilidade e valorização de talentos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Indicadores Section */}
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            <div className="text-center flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-heading font-extrabold text-accent block mb-2">
                <Counter end={180} suffix="+" />
              </span>
              <span className="text-xs font-sans tracking-widest text-gray-400 uppercase">Obras Concluídas</span>
            </div>
            <div className="text-center flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-heading font-extrabold text-accent block mb-2">
                <Counter end={950} suffix="+" />
              </span>
              <span className="text-xs font-sans tracking-widest text-gray-400 uppercase">Clientes Atendidos</span>
            </div>
            <div className="text-center flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-heading font-extrabold text-accent block mb-2">
                <Counter end={12} suffix=" Anos" />
              </span>
              <span className="text-xs font-sans tracking-widest text-gray-400 uppercase">de Experiência</span>
            </div>
            <div className="text-center flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-heading font-extrabold text-accent block mb-2">
                <Counter end={450} suffix="+" />
              </span>
              <span className="text-xs font-sans tracking-widest text-gray-400 uppercase">Colaboradores</span>
            </div>
            <div className="text-center flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-heading font-extrabold text-accent block mb-2">
                <Counter end={75} suffix="+" />
              </span>
              <span className="text-xs font-sans tracking-widest text-gray-400 uppercase">Cidades Atendidas</span>
            </div>
            <div className="text-center flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-heading font-extrabold text-accent block mb-2">
                <Counter end={98} suffix="%" />
              </span>
              <span className="text-xs font-sans tracking-widest text-gray-400 uppercase">Índice de Satisfação</span>
            </div>
          </div>
        </div>

        {/* Diagonal grid lines background */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
      </section>

      {/* 4. Parallax Section (Obra em Construção) */}
      <section
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80')",
        }}
        className="parallax-bg relative h-[450px] w-full flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-primary/75 z-10" />
        <div className="relative z-20 max-w-4xl mx-auto px-4 text-center text-white">
          <span className="text-accent text-xs font-sans font-bold tracking-[0.25em] uppercase mb-4 block">Engenharia em Ação</span>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight mb-6">
            Engenharia de precisão e processos industriais avançados.
          </h2>
          <p className="text-gray-300 font-sans text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Garantimos o controle de qualidade desde as fundações até o acabamento fino. Construções de alta performance e durabilidade.
          </p>
        </div>
      </section>

      {/* 5. Serviços Section */}
      <section className="py-24 bg-white" id="servicos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-sans text-sm tracking-widest uppercase font-bold block mb-2">
              Nossos Serviços
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-primary">
              Portfólio robusto de soluções de engenharia
            </h2>
            <p className="text-gray-500 mt-4 font-sans text-sm sm:text-base">
              Dispomos de capacitação técnica, equipamentos e equipe especializada para executar projetos complexos em múltiplos segmentos.
            </p>
          </div>

          {/* Services Grid (12 Cards with Zoom / depth hover effect) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {services.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="bg-neutral-light rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 flex flex-col justify-between group transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors" />
                    <span className="absolute bottom-4 right-4 w-10 h-10 rounded-lg bg-primary text-accent flex items-center justify-center shadow-lg border border-white/10">
                      <IconComponent className="w-5 h-5" />
                    </span>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-primary text-base mb-2 group-hover:text-accent transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 font-sans leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5.5. Projetos Showcase Section */}
      <ProjectsShowcase projects={initialProjects} />

      {/* 6. Processo de Trabalho Section */}
      <section className="py-24 bg-neutral-light overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-accent font-sans text-sm tracking-widest uppercase font-bold block mb-2">
              Processo de Trabalho

              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-primary">
                Planejamento e controle de ponta a ponta
              </h2>
            </span>
          </div>

          {/* Horizontal Timeline Layout */}
          <div className="relative flex flex-col items-center">
            {/* Horizontal Line background */}
            <div className="absolute top-12 left-10 right-10 h-[2px] bg-primary/5 hidden lg:block" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 w-full relative z-10">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group">
                  {/* Step Bubble */}
                  <div className="w-14 h-14 rounded-full bg-primary border-2 border-accent text-accent font-heading font-bold text-lg flex items-center justify-center mb-6 shadow-lg timeline-pulse transition-all duration-300 group-hover:bg-accent group-hover:text-primary">
                    {step.step}
                  </div>
                  <h3 className="font-heading font-bold text-primary mb-2 text-base">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-sans leading-relaxed px-4">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Diferenciais Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-sans text-sm tracking-widest uppercase font-bold block mb-2">
              Diferenciais CMM
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-primary">
              Por que escolher a nossa construtora?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {differentials.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div key={idx} className="bg-neutral-light p-8 rounded-xl border border-gray-100 hover:border-accent/40 shadow-sm transition-all duration-300 hover:shadow-lg">
                  <span className="w-12 h-12 rounded-lg bg-primary text-accent flex items-center justify-center mb-6">
                    <IconComponent className="w-6 h-6" />
                  </span>
                  <h3 className="font-heading font-bold text-primary mb-3 text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-sans leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Clientes (Infinite Carousel) */}
      <section className="py-16 bg-primary overflow-hidden border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
          <span className="text-accent/60 font-sans text-xs tracking-[0.25em] uppercase font-semibold">Parceiros e Clientes Corporativos</span>
        </div>
        <div className="relative w-full flex items-center overflow-hidden">
          {/* Scroll Area */}
          <div className="flex space-x-16 animate-[marquee_25s_linear_infinite] whitespace-nowrap min-w-full">
            {['DNIT', 'SABESP', 'VALE', 'PETROBRAS', 'VALEC', 'MRV ENGENHARIA', 'GERDAU', 'INFRAERO', 'PREFEITURA SP'].map((client, idx) => (
              <span key={idx} className="text-2xl font-heading font-black tracking-widest text-white/20 hover:text-accent/60 transition-colors uppercase select-none cursor-default">
                {client}
              </span>
            ))}
            {/* Duplicated for smooth infinite loop */}
            {['DNIT', 'SABESP', 'VALE', 'PETROBRAS', 'VALEC', 'MRV ENGENHARIA', 'GERDAU', 'INFRAERO', 'PREFEITURA SP'].map((client, idx) => (
              <span key={`dup-${idx}`} className="text-2xl font-heading font-black tracking-widest text-white/20 hover:text-accent/60 transition-colors uppercase select-none cursor-default">
                {client}
              </span>
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* 9. Depoimentos Section */}
      <section className="py-24 bg-neutral-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-sans text-sm tracking-widest uppercase font-bold block mb-2">
              Depoimentos
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-primary">
              O que dizem nossos parceiros de negócios
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex space-x-1 mb-6 text-accent">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-currentColor" />
                    ))}
                  </div>
                  <p className="text-gray-600 font-sans text-sm italic leading-relaxed mb-8">
                    "{item.text}"
                  </p>
                </div>
                <div className="flex items-center space-x-4 border-t border-gray-50 pt-6">
                  <div className="w-10 h-10 rounded-full bg-primary text-accent font-heading font-bold flex items-center justify-center text-sm shadow-sm border border-accent/15">
                    {item.name[0]}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-primary text-sm">{item.name}</h4>
                    <p className="text-[11px] text-gray-500 font-sans">{item.role} &bull; {item.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FAQ Section */}
      <section className="py-24 bg-white" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-accent font-sans text-sm tracking-widest uppercase font-bold block mb-2">
              Dúvidas Frequentes
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-primary">
              FAQ Institucional
            </h2>
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setFaqOpen(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-6 bg-neutral-light hover:bg-neutral-light/80 text-left transition-colors focus:outline-none"
                  >
                    <span className="font-heading font-bold text-primary text-sm sm:text-base flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-accent shrink-0" />
                      {faq.q}
                    </span>
                    {isOpen ? <ChevronDown className="w-4 h-4 text-accent rotate-180 transition-transform" /> : <ChevronDown className="w-4 h-4 text-gray-400 transition-transform" />}
                  </button>
                  {isOpen && (
                    <div className="p-6 bg-white border-t border-gray-50 text-xs sm:text-sm text-gray-500 font-sans leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 12. Contato Section */}
      <section className="py-24 bg-neutral-light border-t border-gray-100" id="contato">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Contact Info & Simulated Map */}
            <div className="flex flex-col space-y-8">
              <div>
                <span className="text-accent font-sans text-sm tracking-widest uppercase font-bold block mb-2">
                  Contato
                </span>
                <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-primary">
                  Fale com a nossa equipe de engenharia
                </h2>
                <p className="text-gray-500 mt-4 font-sans text-sm">
                  Dúvidas sobre orçamentos, parcerias públicas ou consultorias especializadas? Envie sua mensagem ou entre em contato direto.
                </p>
              </div>

              <div className="flex flex-col space-y-4">
                <div className="flex items-start space-x-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading font-bold text-primary text-sm">Sede Administrativa</h4>
                    <p className="text-xs text-gray-500 font-sans mt-1">Rua Padre Feijó, 78 - Salvador, Bahia, 40.110-170, BR</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <Phone className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading font-bold text-primary text-sm">Canais Telefônicos</h4>
                    <p className="text-xs text-gray-500 font-sans mt-1">+55 71 99954-4176</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <Mail className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading font-bold text-primary text-sm">E-mail Corporativo</h4>
                    <p className="text-xs text-gray-500 font-sans mt-1">cmm@cmmconstrutora.com</p>
                  </div>
                </div>
              </div>

              {/* High Quality Simulated Map */}
              <div className="relative h-64 rounded-xl overflow-hidden border border-gray-200 shadow-inner group">
                <div
                  className="absolute inset-0 bg-cover bg-center grayscale contrast-[0.9] hover:grayscale-0 transition-all duration-700"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80')",
                  }}
                />
                <div className="absolute inset-0 bg-primary/20 pointer-events-none" />
                <div className="absolute top-4 left-4 bg-primary text-white text-[11px] font-sans px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg border border-white/5">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  Sede CMM Construtora (BA)
                </div>
              </div>
            </div>

            {/* Right: Lead Capture Form */}
            <div className="bg-white p-8 sm:p-10 rounded-2xl border border-gray-150 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-primary text-xl mb-2">Envie uma Mensagem</h3>
                <p className="text-gray-500 text-xs font-sans mb-8">Nossa equipe comercial retornará em até 24 horas úteis.</p>

                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-xl flex flex-col items-center text-center space-y-3"
                  >
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                    <h4 className="font-heading font-bold text-base">Mensagem Enviada!</h4>
                    <p className="text-xs font-sans">Agradecemos o contato. Nossa equipe técnica entrará em contato em breve.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Nome Completo</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent transition-all"
                        placeholder="Ex: João da Silva"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-sans font-semibold text-primary mb-1 uppercase tracking-wider">E-mail</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent transition-all"
                          placeholder="Ex: joao@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Telefone (DDD)</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent transition-all"
                          placeholder="Ex: (11) 99999-9999"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-sans font-semibold text-primary mb-1 uppercase tracking-wider">Mensagem</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-neutral-light border border-gray-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent transition-all resize-none"
                        placeholder="Descreva seu projeto ou demanda técnica..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-primary text-white font-sans font-bold py-4 rounded-lg hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      Enviar Solicitação
                      <ArrowRight className="w-4 h-4 text-accent" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
