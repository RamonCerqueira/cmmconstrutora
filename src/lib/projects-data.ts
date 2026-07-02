export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'OBRAS_PUBLICAS' | 'OBRAS_PRIVADAS';
  status: 'EM_ANDAMENTO' | 'FINALIZADOS';
  client: string;
  location: string;
  area: string;
  duration: string;
  technologies: string[];
  mainImage: string;
  galleryImages: string[];
  videoUrl?: string | null;
  completionPercentage: number;
}

export const projects: Project[] = [
  {
    id: 'residenziale-golden-gate',
    title: 'Edifício Residencial Golden Gate',
    description: 'Torre residencial de altíssimo padrão com 28 pavimentos, área de lazer suspensa, automação residencial total e acabamentos nobres em mármore e madeira certificada.',
    category: 'OBRAS_PRIVADAS',
    status: 'FINALIZADOS',
    client: 'Golden Gate Incorporações',
    location: 'Belo Horizonte - MG',
    area: '12.400 m²',
    duration: '24 meses',
    technologies: ['BIM Inteligente', 'Concreto Autoadensável', 'Automação Predial', 'Energia Solar Fotovoltaica'],
    mainImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    completionPercentage: 100
  },
  {
    id: 'terminal-logistico-central',
    title: 'Terminal Logístico Rodoferroviário Central',
    description: 'Centro de distribuição logística de alta performance, contendo pátio ferroviário integrado, piso de altíssima resistência com nivelamento a laser e 120 docas automáticas de carga e descarga.',
    category: 'OBRAS_PRIVADAS',
    status: 'EM_ANDAMENTO',
    client: 'LogiCargo Logística S/A',
    location: 'Campinas - SP',
    area: '45.000 m²',
    duration: '18 meses',
    technologies: ['Estrutura Metálica Protendida', 'Piso Industrial Nivelado a Laser', 'Docas Hidráulicas Inteligentes'],
    mainImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1586528116493-a0219c412f8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    completionPercentage: 75
  },
  {
    id: 'duplicacao-br-101',
    title: 'Complexo Viário e Duplicação BR-101',
    description: 'Obra pública de duplicação, drenagem profunda, contenção de encostas e construção de três viadutos de concreto armado em trecho com alto fluxo rodoviário de cargas.',
    category: 'OBRAS_PUBLICAS',
    status: 'FINALIZADOS',
    client: 'DNIT / Governo Federal',
    location: 'Joinville - SC',
    area: '28 km de extensão',
    duration: '36 meses',
    technologies: ['Cimento Asfáltico Modificado por Polímero', 'Drenagem Profunda com Geo-grelha', 'Sensores de Carga em Pontes'],
    mainImage: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1517089596392-ee9a5c03e2d4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    completionPercentage: 100
  },
  {
    id: 'hospital-regional-norte',
    title: 'Novo Hospital Regional Norte',
    description: 'Hospital público de alta complexidade com 350 leitos, 8 salas cirúrgicas de última geração, isolamentos com fluxo de ar controlado, UTI equipada e heliponto estrutural homologado.',
    category: 'OBRAS_PUBLICAS',
    status: 'EM_ANDAMENTO',
    client: 'Secretaria de Saúde / Governo do Estado',
    location: 'Ribeirão Preto - SP',
    area: '22.500 m²',
    duration: '30 meses',
    technologies: ['HVAC com Filtros HEPA Absolutos', 'Divisórias Pré-fabricadas Acústicas', 'Fundações em Estacas Escavadas'],
    mainImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce8?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    completionPercentage: 45
  },
  {
    id: 'parque-eolico-vento-forte',
    title: 'Infraestrutura Civil do Parque Eólico Vento Forte',
    description: 'Construção civil das fundações circulares de concreto protendido e rede interna subterrânea de média tensão para interligação elétrica de 42 aerogeradores gigantes.',
    category: 'OBRAS_PRIVADAS',
    status: 'FINALIZADOS',
    client: 'Vento Forte Energia S/A',
    location: 'Fortaleza - CE',
    area: '8.000 hectares',
    duration: '18 meses',
    technologies: ['Fundação de Anel de Concreto Protendido', 'Rede Subterrânea Blindada', 'Logística de Cargas Especiais Superpesadas'],
    mainImage: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    completionPercentage: 100
  }
];
