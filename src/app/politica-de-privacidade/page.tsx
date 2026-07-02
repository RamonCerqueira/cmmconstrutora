import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function PoliticaPrivacidade() {
  return (
    <div className="bg-neutral-light min-h-screen pt-28 pb-20 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 text-accent" />
          Voltar ao início
        </Link>
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-gray-150 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <ShieldCheck className="w-8 h-8 text-accent" />
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-primary">Política de Privacidade</h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Na CMM Construtora, privacidade e segurança são prioridades. Esta Política de Privacidade descreve como coletamos, usamos e protegemos seus dados pessoais quando você visita nosso site institucional ou se cadastra em nosso portal de recrutamento.
          </p>
          <h3 className="text-sm font-bold text-primary uppercase tracking-wide">1. Coleta de Informações</h3>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Coletamos informações cadastrais voluntárias, como nome, e-mail, telefone, CPF, formação profissional e currículo anexo em PDF. Esses dados são coletados exclusivamente para a triagem e seleção de candidatos para vagas internas da construtora.
          </p>
          <h3 className="text-sm font-bold text-primary uppercase tracking-wide">2. Uso e Proteção dos Dados</h3>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Seus dados cadastrais são tratados com segurança e integridade sob os preceitos da LGPD. Em nenhuma hipótese compartilhamos, vendemos ou divulgamos suas informações profissionais para terceiros sem o seu consentimento prévio.
          </p>
          <h3 className="text-sm font-bold text-primary uppercase tracking-wide">3. Seus Direitos</h3>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Conforme a lei federal, você possui pleno direito de acessar seus dados, exportá-los em formato legível ou solicitar a exclusão definitiva do nosso banco de talentos a qualquer momento através do seu painel do candidato.
          </p>
        </div>
      </div>
    </div>
  );
}
