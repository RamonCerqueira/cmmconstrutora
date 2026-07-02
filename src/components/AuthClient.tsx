'use client';

import { useState, useTransition, useActionState } from 'react';
import { loginAction, registerAction } from '@/app/actions/auth';
import { Shield, Mail, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AuthClient() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Login Action State
  const [loginState, runLoginAction] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await loginAction(prevState, formData);
      if (result.success) {
        window.location.href = result.role === 'ADMIN' ? '/dashboard/rh' : '/dashboard/candidato';
      }
      return result;
    },
    null
  );

  // Register Action State
  const [registerState, runRegisterAction] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await registerAction(prevState, formData);
      if (result.success) {
        window.location.href = '/dashboard/candidato';
      }
      return result;
    },
    null
  );

  const error = mode === 'login' ? loginState?.error : registerState?.error;

  return (
    <div className="min-h-screen flex font-sans bg-primary relative overflow-hidden">
      {/* Background Image Panel for Desktop (1/2 Screen) */}
      <div
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80')",
        }}
        className="hidden lg:block w-1/2 bg-cover bg-center relative"
      >
        <div className="absolute inset-0 bg-primary/70 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex flex-col justify-between p-16 z-10 text-white">
          <Link href="/" className="flex flex-col">
            <span className="text-2xl font-heading font-extrabold tracking-wider text-white">
              CMM <span className="text-accent">CONSTRUTORA</span>
            </span>
            <span className="text-[9px] font-sans tracking-[0.3em] text-gray-400 uppercase -mt-1">
              EXCELÊNCIA EM ENGENHARIA
            </span>
          </Link>

          <div className="space-y-6">
            <h2 className="text-4xl font-heading font-extrabold leading-tight text-white">
              Faça parte da equipe que está construindo o amanhã.
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              Valorizamos engenharia de precisão, processos sólidos e segurança. Cadastre seu currículo profissional e participe dos nossos processos de recrutamento e seleção.
            </p>
          </div>

          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} CMM Construtora. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Form Panel (1/2 Screen on Desktop, Full Screen on Mobile) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 pt-28 lg:pt-12 relative z-10">
        <div className="w-full max-w-md bg-secondary/80 backdrop-blur-md p-8 sm:p-10 rounded-2xl border border-white/5 shadow-2xl space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-heading font-extrabold text-white">
              {mode === 'login' ? 'Acessar Conta' : 'Criar Cadastro'}
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">
              {mode === 'login' ? 'Digite suas credenciais de candidato ou RH' : 'Cadastre-se para preencher seu perfil de talentos'}
            </p>
          </div>

          {/* Switch Tabs */}
          <div className="flex bg-primary/60 p-1 rounded-lg border border-white/5 text-xs font-semibold">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded text-center transition-all ${
                mode === 'login' ? 'bg-accent text-primary' : 'text-gray-400 hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2.5 rounded text-center transition-all ${
                mode === 'register' ? 'bg-accent text-primary' : 'text-gray-400 hover:text-white'
              }`}
            >
              Cadastrar-se
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-950/60 border border-red-800 text-red-300 p-4 rounded-lg text-xs sm:text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form
            action={mode === 'login' ? runLoginAction : runRegisterAction}
            className="space-y-5"
          >
            {mode === 'register' && (
              <div>
                <label className="block text-[10px] font-sans font-semibold text-gray-300 mb-1 uppercase tracking-wider">
                  Nome Completo
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full bg-primary/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-all"
                    placeholder="Ex: João da Silva"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-sans font-semibold text-gray-300 mb-1 uppercase tracking-wider">
                E-mail
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full bg-primary/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-all"
                  placeholder="Ex: joao@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-sans font-semibold text-gray-300 mb-1 uppercase tracking-wider">
                Senha
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  className="w-full bg-primary/40 border border-white/10 rounded-lg pl-10 pr-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-all"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-accent text-primary font-sans font-bold py-3.5 rounded-lg hover:bg-accent-hover transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-accent/15 mt-8 disabled:opacity-50"
            >
              {isPending ? 'Aguarde...' : mode === 'login' ? 'Entrar no Painel' : 'Concluir Cadastro'}
              <ArrowRight className="w-4 h-4 text-primary" />
            </button>
          </form>

          {/* Quick Info Seeds */}
          {mode === 'login' && (
            <div className="bg-primary/40 border border-white/5 p-4 rounded-lg text-[10px] text-gray-400 leading-relaxed font-sans space-y-1">
              <span className="font-bold text-accent uppercase block">Acesso de Demonstração RH:</span>
              <p>E-mail: <strong className="text-white">admin@cmmconstrutora.com.br</strong></p>
              <p>Senha: <strong className="text-white">admin123</strong></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
