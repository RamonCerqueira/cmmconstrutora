'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, User, ChevronRight, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  user: {
    userId: number;
    email: string;
    role: string;
    name: string;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-primary/95 backdrop-blur-md shadow-lg border-b border-white/5 py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logo-Transparente.png"
                alt="CMM Construtora"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/#inicio" className="text-sm font-sans font-medium text-gray-300 hover:text-accent transition-colors">
                Início
              </Link>
              <Link href="/#quem-somos" className="text-sm font-sans font-medium text-gray-300 hover:text-accent transition-colors">
                Quem Somos
              </Link>
              <Link href="/#servicos" className="text-sm font-sans font-medium text-gray-300 hover:text-accent transition-colors">
                Serviços
              </Link>
              <Link href="/#projetos" className="text-sm font-sans font-medium text-gray-300 hover:text-accent transition-colors">
                Projetos
              </Link>
              <Link href="/vagas" className="text-sm font-sans font-medium text-gray-300 hover:text-accent transition-colors flex items-center gap-1">
                <Briefcase className="w-4 h-4 text-accent" />
                Vagas
              </Link>
              <Link href="/#contato" className="text-sm font-sans font-medium text-gray-300 hover:text-accent transition-colors">
                Contato
              </Link>
            </nav>

            {/* Candidate Area Button */}
            <div className="hidden md:flex items-center">
              {user ? (
                <Link
                  href={user.role === 'ADMIN' ? '/dashboard/rh' : '/dashboard/candidato'}
                  className="flex items-center gap-2 border border-accent text-accent px-5 py-2 rounded-full text-sm font-sans font-semibold hover:bg-accent hover:text-primary transition-all duration-300"
                >
                  <User className="w-4 h-4" />
                  Painel ({user.name.split(' ')[0]})
                </Link>
              ) : (
                <Link
                  href="/auth"
                  className="flex items-center gap-2 bg-accent text-primary px-5 py-2 rounded-full text-sm font-sans font-semibold hover:bg-accent-hover transition-all duration-300 shadow-md shadow-accent/15"
                >
                  <User className="w-4 h-4" />
                  Área do Candidato
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white hover:text-accent focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-primary/98 backdrop-blur-lg pt-24 px-4 flex flex-col md:hidden"
          >
            <nav className="flex flex-col space-y-6 text-center text-lg">
              <Link
                href="/#inicio"
                onClick={() => setIsOpen(false)}
                className="font-sans font-medium text-gray-200 hover:text-accent transition-colors py-2 border-b border-white/5"
              >
                Início
              </Link>
              <Link
                href="/#quem-somos"
                onClick={() => setIsOpen(false)}
                className="font-sans font-medium text-gray-200 hover:text-accent transition-colors py-2 border-b border-white/5"
              >
                Quem Somos
              </Link>
              <Link
                href="/#servicos"
                onClick={() => setIsOpen(false)}
                className="font-sans font-medium text-gray-200 hover:text-accent transition-colors py-2 border-b border-white/5"
              >
                Serviços
              </Link>
              <Link
                href="/#projetos"
                onClick={() => setIsOpen(false)}
                className="font-sans font-medium text-gray-200 hover:text-accent transition-colors py-2 border-b border-white/5"
              >
                Projetos
              </Link>
              <Link
                href="/vagas"
                onClick={() => setIsOpen(false)}
                className="font-sans font-medium text-gray-200 hover:text-accent transition-colors py-2 border-b border-white/5 flex items-center justify-center gap-2"
              >
                <Briefcase className="w-5 h-5 text-accent" />
                Vagas Abertas
              </Link>
              <Link
                href="/#contato"
                onClick={() => setIsOpen(false)}
                className="font-sans font-medium text-gray-200 hover:text-accent transition-colors py-2"
              >
                Contato
              </Link>

              <div className="pt-8">
                {user ? (
                  <Link
                    href={user.role === 'ADMIN' ? '/dashboard/rh' : '/dashboard/candidato'}
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center gap-2 border border-accent text-accent px-6 py-3 rounded-full text-base font-sans font-semibold hover:bg-accent hover:text-primary transition-all duration-300"
                  >
                    <User className="w-5 h-5" />
                    Acessar Painel ({user.name.split(' ')[0]})
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <Link
                    href="/auth"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-accent text-primary px-6 py-3 rounded-full text-base font-sans font-semibold hover:bg-accent-hover transition-all duration-300 shadow-md shadow-accent/15"
                  >
                    <User className="w-5 h-5" />
                    Área do Candidato
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
