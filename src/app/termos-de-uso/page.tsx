import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

export default function TermosUso() {
  return (
    <div className="bg-neutral-light min-h-screen pt-28 pb-20 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 text-accent" />
          Voltar ao início
        </Link>
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-gray-150 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <FileText className="w-8 h-8 text-accent" />
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-primary">Termos de Uso</h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Ao acessar o portal da CMM Construtora e utilizar nossos serviços de recrutamento online, você concorda com estes Termos de Uso. Caso não concorde, por favor, evite enviar currículos ou dados pessoais através do site.
          </p>
          <h3 className="text-sm font-bold text-primary uppercase tracking-wide">1. Fidelidade das Informações</h3>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            O candidato responsabiliza-se legalmente pela veracidade e exatidão das informações profissionais inseridas em seu perfil, incluindo certificados, registros no CREA, históricos de experiências de trabalho e competências técnicas.
          </p>
          <h3 className="text-sm font-bold text-primary uppercase tracking-wide">2. Uso Permitido</h3>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            O portal é de uso estritamente pessoal para candidaturas de empregos na construtora. É vedado qualquer uso automatizado ou robótico para crawlar, extrair ou falsificar vagas e dados de candidatos em nossos servidores.
          </p>
          <h3 className="text-sm font-bold text-primary uppercase tracking-wide">3. Limites de Responsabilidade</h3>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            A CMM Construtora empenha-se em manter o portal disponível e seguro, mas não assume responsabilidade por perdas técnicas ou falhas de provedores de internet locais dos usuários.
          </p>
        </div>
      </div>
    </div>
  );
}
