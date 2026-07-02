'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, ArrowUp, Send, Check } from 'lucide-react';
import { useState } from 'react';
import { FaInstagram, FaFacebook, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary text-gray-400 font-sans border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand & Bio */}
          <div className="flex flex-col space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logoLOW_transparent.png"
                alt="CMM Construtora"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed">
              Referência em engenharia e infraestrutura de alta complexidade. Projetamos, planejamos e construímos o futuro com compromisso técnico, segurança e tecnologia de ponta.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 text-gray-300 hover:bg-accent hover:text-primary transition-all duration-300">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 text-gray-300 hover:bg-accent hover:text-primary transition-all duration-300">
                <FaLinkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 text-gray-300 hover:bg-accent hover:text-primary transition-all duration-300">
                <FaFacebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-heading font-bold text-base mb-6 uppercase tracking-wider">
              Links Rápidos
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/#inicio" className="hover:text-accent transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/#quem-somos" className="hover:text-accent transition-colors">
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link href="/#servicos" className="hover:text-accent transition-colors">
                  Nossos Serviços
                </Link>
              </li>
              <li>
                <Link href="/#projetos" className="hover:text-accent transition-colors">
                  Projetos Realizados
                </Link>
              </li>
              <li>
                <Link href="/vagas" className="hover:text-accent transition-colors">
                  Trabalhe Conosco (ATS)
                </Link>
              </li>
              <li>
                <Link href="/auth?mode=login" className="hover:text-accent transition-colors text-xs opacity-75">
                  Acesso Restrito (RH)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Info */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-white font-heading font-bold text-base mb-2 uppercase tracking-wider">
              Contato
            </h3>
            <div className="flex items-start space-x-3 text-sm">
              <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <span>Rua Padre Feijó, 78 - Salvador, Bahia, 40.110-170, BR</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Phone className="w-5 h-5 text-accent shrink-0" />
              <span>+55 71 99954-4176</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Mail className="w-5 h-5 text-accent shrink-0" />
              <span>cmm@cmmconstrutora.com</span>
            </div>
            <div className="text-xs text-gray-500 pt-2">
              Segunda a Sexta: 08:00 às 18:00
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col space-y-6">
            <h3 className="text-white font-heading font-bold text-base uppercase tracking-wider">
              Newsletter
            </h3>
            <p className="text-sm">
              Inscreva-se para receber atualizações sobre novos projetos e oportunidades da CMM.
            </p>
            <form onSubmit={handleSubscribe} className="relative flex">
              <input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={subscribed}
                className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 pr-12"
              />
              <button
                type="submit"
                className={`absolute right-1.5 top-1.5 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${subscribed ? 'bg-green-600 text-white' : 'bg-accent text-primary hover:bg-accent-hover'
                  }`}
              >
                {subscribed ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-xs space-y-4 md:space-y-0">
          <p>
            &copy; {new Date().getFullYear()} CMM Construtora. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6">
            <Link href="/politica-de-privacidade" className="hover:text-accent transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/termos-de-uso" className="hover:text-accent transition-colors">
              Termos de Uso
            </Link>
            <Link href="/lgpd" className="hover:text-accent transition-colors">
              Declaração LGPD
            </Link>
          </div>
          <button
            onClick={scrollToTop}
            className="group flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-accent hover:text-primary transition-all duration-300"
            aria-label="Rolar para o topo"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
