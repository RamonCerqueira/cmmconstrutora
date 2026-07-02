import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default function LgpdPage() {
  return (
    <div className="bg-neutral-light min-h-screen pt-28 pb-20 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 text-accent" />
          Voltar ao início
        </Link>
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-gray-150 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <Shield className="w-8 h-8 text-accent" />
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-primary">Declaração de Conformidade LGPD</h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            A CMM Construtora declara estar em total conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD) - Lei nº 13.709/2018. Adotamos as melhores práticas técnicas e organizacionais de segurança da informação para garantir a segurança dos titulares de dados.
          </p>
          <h3 className="text-sm font-bold text-primary uppercase tracking-wide">Como Tratamos Seus Dados</h3>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Seus dados cadastrados no Trabalhe Conosco (dados cadastrais, arquivos de currículos, certificados, CREA, CNH, CPF e dados acadêmicos) são classificados como dados pessoais comuns. O tratamento é realizado sob a base legal de execução contratual e procedimentos preliminares a pedido do titular (Art. 7º, V da LGPD).
          </p>
          <h3 className="text-sm font-bold text-primary uppercase tracking-wide">Direitos do Titular Garantidos</h3>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            No Painel do Candidato, disponibilizamos ferramentas automáticas para que você exerça seus direitos legais de:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm text-gray-500 leading-relaxed">
            <li><strong>Portabilidade de Dados:</strong> Exportação de todas as informações pessoais cadastradas em arquivo estruturado.</li>
            <li><strong>Revogação de Consentimento e Exclusão ("Direito ao Esquecimento"):</strong> Exclusão total e definitiva de sua conta, currículo e histórico dos nossos servidores.</li>
            <li><strong>Atualização e Correção:</strong> Atualização instantânea de dados incorretos ou desatualizados.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
