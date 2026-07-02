# 🏗️ Portal de Recrutamento - CMM Construtora
## Guia de Credenciais e Testes de Demonstração

Este documento contém as informações e credenciais de teste para demonstração completa das funcionalidades do sistema para o cliente. O banco de dados está hospedado no **Supabase** e já foi populado com dados fictícios estruturados de acordo com o segmento de engenharia e construção civil.

---

### 🔑 1. Credenciais de Acesso

#### 💼 Painel Administrativo (Recursos Humanos / RH)
Permite gerenciar vagas, analisar candidaturas por nota de compatibilidade (*match score*), movimentar candidatos nas etapas do funil de recrutamento via painel Kanban e enviar mensagens.

*   **E-mail:** `admin@cmmconstrutora.com.br`
*   **Senha:** `admin123`

---

#### 👷 Painel do Candidato (Currículos e Vagas)
Permite aos profissionais visualizarem vagas abertas, se candidatarem, editarem suas informações de currículo (experiência, formação acadêmica, dados do CREA/CNH) e trocarem mensagens com o RH.

Temos 3 perfis de candidatos de demonstração já cadastrados com diferentes formações e experiências para ilustrar o sistema:

1.  **Carlos Silva (Perfil: Engenheiro Civil)**
    *   *Foco:* Engenharia Civil, Gestão de Canteiro, certificação PMP.
    *   **E-mail:** `carlos.silva@gmail.com`
    *   **Senha:** `carlos123`

2.  **Mariana Costa (Perfil: Assistente Administrativo)**
    *   *Foco:* Rotinas de escritório de campo, faturamento, notas fiscais.
    *   **E-mail:** `mariana.costa@hotmail.com`
    *   **Senha:** `mariana123`

3.  **Pedro Santos (Perfil: Mestre de Obras)**
    *   *Foco:* Campo de obras, leitura de projetos de alvenaria e concretagem.
    *   **E-mail:** `pedro.santos@outlook.com`
    *   **Senha:** `pedro123`

---

### 🚀 2. Roteiro Sugerido para Demonstração

Para demonstrar o potencial do sistema ao cliente, sugerimos o seguinte fluxo de testes:

1.  **Acesso ao Painel do Candidato:**
    *   Faça login com a conta de **Carlos Silva** (`carlos.silva@gmail.com`).
    *   Navegue até a seção "Meu Currículo" para visualizar o currículo estruturado com experiências na *Construtora Alfa* e formação na *UFMG*.
    *   Navegue na seção de **Vagas Abertas**, visualize os detalhes da vaga de *Engenheiro Civil de Obras* e realize a candidatura.

2.  **Gestão Inteligente pelo RH:**
    *   Faça login com a conta de **RH Administrador** (`admin@cmmconstrutora.com.br`).
    *   Na **Visão Geral**, observe os gráficos automáticos de distribuição de candidatos por etapa e as métricas atualizadas de currículos e vagas.
    *   Acesse a aba **Kanban / Pipeline**:
        *   Veja os cards dos candidatos (Carlos, Mariana e Pedro) distribuídos nas colunas.
        *   Arraste o card de **Carlos Silva** da coluna *Triagem* para a coluna *Entrevista*. A mudança é salva automaticamente no banco!
    *   Acesse a aba **Banco de Talentos / Filtros**:
        *   Utilize a barra de pesquisa ou os filtros inteligentes (filtrar por quem tem "CREA Ativo", escolaridade "Graduação Superior", ou definir o *Match Score* mínimo) para ver o filtro dinâmico de talentos em tempo real.
    *   Clique em **Avaliar Candidato** no card de Carlos:
        *   Analise o currículo unificado do candidato.
        *   No painel lateral de chat, envie uma mensagem direta a ele (ex: *"Olá Carlos, agendamos sua entrevista para quinta-feira"*).

3.  **Visualização do Candidato (Feedback):**
    *   Volte a fazer login com **Carlos Silva** e observe o recebimento da mensagem enviada pelo RH e a alteração da sua etapa do processo seletivo em tempo real.
