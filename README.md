# Studio Alexia Menezes - Aplicação Web

Aplicação web completa desenvolvida como Projeto de Extensão III em Ciência da Computação para o **Studio Alexia Menezes**, especializado em sobrancelhas, cílios, unhas e estética facial.

---

## 🎯 Objetivo

Desenvolver uma aplicação web moderna e responsiva que:

- Apresente os serviços do estúdio (sobrancelhas, cílios, unhas e estética facial)
- Facilite o agendamento online de serviços
- Gerencie agendamentos através de painel administrativo
- Integre contato via WhatsApp e Instagram
- Exiba horários de atendimento e localização
- Seja mobile-first, com design elegante e paleta terrosa (vinho, marrom, dourado e preto)

## 🚀 Tecnologias

### Frontend

- **React 19** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool e dev server de alta performance
- **React Router DOM** - Gerenciamento de rotas
- **CSS Modules** - Estilização com escopo local

### Backend & Database

- **Firebase** - Autenticação e banco de dados
- **JSON Server** - Mock de API REST para desenvolvimento

### Bibliotecas

- **Axios** - Cliente HTTP para requisições
- **Day.js** - Manipulação de datas

### Ferramentas de Desenvolvimento

- **ESLint** - Linter para qualidade de código
- **TypeScript ESLint** - Regras específicas para TypeScript

## 📁 Estrutura do Projeto

```
PEX3/
├── studio-alexia/
│   ├── src/
│   │   ├── components/         # Componentes reutilizáveis
│   │   │   ├── Admin/          # Painel administrativo
│   │   │   ├── Appointment/    # Sistema de agendamento
│   │   │   ├── common/         # Componentes comuns (Modal, etc)
│   │   │   ├── Contact/        # Seção de contato
│   │   │   ├── Footer/         # Rodapé
│   │   │   ├── Header/         # Cabeçalho e navegação
│   │   │   ├── Hero/           # Seção hero da página inicial
│   │   │   ├── Location/       # Localização e mapa
│   │   │   ├── Schedule/       # Horários de atendimento
│   │   │   └── Services/       # Listagem de serviços
│   │   ├── contexts/           # Contextos React (Auth)
│   │   ├── hooks/              # Custom hooks
│   │   ├── pages/              # Páginas da aplicação
│   │   ├── services/           # Serviços e integração com APIs
│   │   ├── styles/             # Estilos globais
│   │   ├── types/              # Definições de tipos TypeScript
│   │   └── utils/              # Funções utilitárias
│   ├── public/                 # Arquivos públicos
│   ├── db.json                 # Banco de dados mock (JSON Server)
│   ├── .env.example            # Exemplo de variáveis de ambiente
│   └── package.json            # Dependências do projeto
└── README.md                   # Este arquivo
```

## 🛠️ Funcionalidades

### Para Clientes

- ✅ Visualização de serviços disponíveis
- ✅ Agendamento online de serviços
- ✅ Confirmação de agendamento por modal
- ✅ Contato direto via WhatsApp e Instagram
- ✅ Visualização de horários de atendimento
- ✅ Localização do estúdio
- ✅ Interface responsiva (mobile-first)

### Para Administradores

- ✅ Autenticação via Google (Firebase)
- ✅ Painel administrativo protegido
- ✅ Gerenciamento de agendamentos
- ✅ Cadastro e edição de serviços
- ✅ Controle de acesso baseado em e-mail autorizado

## 🚦 Como Executar o Projeto

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- Conta no **Firebase** (para autenticação)

### 1. Clone o repositório

```bash
git clone https://github.com/plmsz/PEX3.git
cd PEX3/studio-alexia
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do Firebase:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_FIREBASE_MEASUREMENT_ID=seu_measurement_id
VITE_ADMIN_EMAILS=admin@example.com,outro.admin@example.com
```

### 4. Execute a aplicação 

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 📦 Scripts Disponíveis

```bash
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Gera build de produção
npm run preview      # Visualiza o build de produção
npm run lint         # Executa o linter
```

## 🔐 Autenticação e Autorização

O projeto utiliza **Firebase Authentication** para login via Google. O acesso ao painel administrativo é restrito aos e-mails configurados na variável de ambiente `VITE_ADMIN_EMAILS`.

### Fluxo de Autenticação

1. Usuário faz login com conta Google
2. Sistema verifica se o e-mail está na lista de administradores
3. Acesso concedido ou negado baseado na autorização

## 🎨 Design e UX

- **Mobile-First**: Design otimizado para dispositivos móveis
- **Paleta de Cores**: Tons terrosos (vinho, marrom, dourado e preto)
- **Animações**: Efeitos suaves de scroll e transições
- **Acessibilidade**: Estrutura semântica e navegação intuitiva

## 🌐 Deploy

### Vercel (Frontend)

O projeto pode ser publicado no Vercel. Configure nas Settings do repositório.

### Firebase Hosting (Recomendado)

Para deploy completo com Firebase:

```bash
npm run build
firebase deploy
```
### 
```bash
ncu --interactive --format group
```

## 🔄 Próximas Implementações

    - [ ] Executar e rodar as is 11
    - [ ] Escrever regras de negócio existentes 11
    - [ ] Estruturação do React em módulos isolados por domínio de negócio. 12
    - [ ] Gestão Dinâmica da Agenda e Disponibilidade (Visão Admin) 13
    - [ ] Adição ao Calendário Pessoal / Prevenção de No-Show (Visão Cliente) 14
    - [ ] Adicionar mascara de telefone
    - [ ] Melhorar loading - apenas no componente e não a tela inteira

    - [ ] Login Social do cliente com Google via Firebase 15
    - [ ] Interface pública para clientes selecionarem procedimentos e marcar e cancelar horários de forma autônoma. 
    - [ ] Coleta de notas por estrelas e feedbacks pós-atendimento para exibição pública na página. - 24
    - [ ] Testes Unitários e de UI: Cobertura de utilizando Vitest, React Testing Library e MSW. - 25

- [ ] Pipeline automatizado no GitHub Actions com análises do SonarQube, Biome e deploy contínuo.
- [ ] API em C# .NET Core ou Node.js com camadas desacopladas e persistência em PostgreSQL.
- [ ] Dashboard de Métricas e Faturamento: Painel com gráficos de receitas, taxa de absenteísmo, ticket médio e serviços mais procurados.
- [ ] Automação de cenários completos de agendamento e administração com Playwright em telas mobile e desktop.
- [ ] Renderização prévia no servidor para performance máxima de carregamento e indexação no Google.
- [ ] Publicação de artigos otimizados via Headless CMS (Sanity/Strapi) para atração de tráfego orgânico.
- [ ] Exibição de fotos antes/depois com upload e otimização em nuvem via Cloudinary.
- [ ] SEO otimizado
- [ ] Google Analytics integrado
- [ ] Notificações instantâneas no painel admin via SignalR/WebSockets para cancelamentos e alterações.
- [ ] Sincronização automática dos agendamentos com a conta Google da proprietária.
- [ ] Disparos automáticos de pós-venda, aniversários e lembretes de retorno pós-30 dias.
- [ ] Observabilidade e Telemetria: Monitoramento e captura de exceções em tempo real no cliente e servidor usando Sentry/Datadog.
- [ ] Cobrança de sinal via Pix dinâmico ou cartão com aprovação imediata via webhooks para novos clientes em procedimentos demorados.
 -[ ] Envio de confirmações e lembretes pré-atendimento (24h e 2h antes) via API Oficial da Meta.
- [ ] Autenticação por OTP via WhatsApp / SMS ou Magic Link Assinado (Tokens JWT) ou OAuth2 / OpenID Connect Nativo
---

## 🔍 Como Revisar o ESLint

Para revisar a qualidade do código com o ESLint, execute:

```bash
npm run lint
```

### Configuração atual

O `eslint.config.js` está configurado com as regras do TypeScript ESLint e do ESLint, incluindo:

- `react-hooks/set-state-in-effect`: **desabilitada temporariamente**
- `react-hooks/immutability`: **desabilitada temporariamente**

### Como revisar

1. **Rodar o linter**
   ```bash
   npm run lint
   ```

2. **Verificar erros críticos**
   - Erros de parse
   - Regras de `react` e `react-hooks`
   - Regras de TypeScript

3. **Corrigir automaticamente quando possível**
   ```bash
   npx eslint . --fix
   ```

### Próximos passos

Em breve, as regras `react-hooks/set-state-in-effect` e `react-hooks/immutability` serão **reativadas** e o código será refatorado para evitar `setState()` diretamente dentro de `useEffect`. Recomendamos:

- Revisar cada erro reportado no `npm run lint`
- Migrar chamadas de `setState` para fora dos `useEffect`
- Revisar a ordem de dependências dos hooks
- Adicionar testes unitários uma vez que as regras de qualidade estejam ativas

> **Nota:** Essas regras foram desativadas temporariamente para facilitar a integração das bibliotecas em sua versão `latest`, sem quebrar o fluxo de desenvolvimento.




> Projeto desenvolvido por **Paloma Souza** como parte do Projeto de Extensão III em Ciência da Computação.

## 📫 Contato

<div align="center">
<img style="border-radius: 50%;" src="https://github.com/plmsz.png" width="100px;" alt="Paloma Souza"/>
</div>

<br>

<div align="center">

[![LinkedIn](https://img.shields.io/static/v1?label=&message=LinkedIn&color=blue&style=flat-square&logo=LinkedIn&logoColor=white)](https://www.linkedin.com/in/plmsz/)
[![Email](https://img.shields.io/static/v1?label=&message=Email&color=red&style=flat-square&logo=Gmail&logoColor=white)](mailto:plmsouzaoliveira@gmail.com)
[![Twitter Badge](https://img.shields.io/static/v1?label=&message=Twitter&color=1ca0f1&style=flat-square&logo=Twitter&logoColor=white)](https://twitter.com/plmszdev)

</div>
