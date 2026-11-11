# Plano de Reestruturação de Pastas — Studio Alexia

> Este plano é **apenas de estudo** para a branch `refactor/estrutura-feature-based`.
> **Nenhum arquivo foi movido, renomeado ou alterado.** Execução segura: `git mv` (preserva histórico) + versão de segurança.

---

## 1. Diagnóstico

### 1.1 Stack atual

| Área | Tecnologia |
|---|---|
| Bundler | Vite 8 (config `vite.config.ts`) |
| UI | React 19.3 |
| Router | `react-router-dom` v7 (BrowserRouter, Routes, Route) |
| HTTP client | axios (baseURL `/api`, proxy p/ json-server no Render) |
| Auth | Firebase v13 (`firebase/auth`) |
| Data/date | `dayjs` (+ plugins duration, locale pt-br) |
| Lint | ESLint flat config (`eslint.config.js`) + typescript-eslint + eslint-plugin-react-hooks |
| Testes | **Nenhum** |
| Path aliases (`@/…`) | **NENHUM configurado** (usam apenas imports relativos) |
| Build | `tsc -b && vite build` |

> Obs: **não há aliases de caminho** configurados. O plano inclui a adição de aliases (`@/features`, `@/shared`, `@/app`) como enquadramento, mas isso é *config* — não dependência nova.

### 1.2 Domínios atuais e os arquivos que os compõem

#### Domínio: Serviços
| Tipo | Arquivo |
|---|---|
| Componente | `src/components/Services/Services.tsx` |
| Componente | `src/components/Services/ServiceCard.tsx` |
| API feature | `servicesApi` em `src/services/api.ts` |
| Tipos | `Service`, `ScheduleDay`, `ContactInfo`, `LocationInfo` em `src/types/service.ts` |
| Dados estáticos | `schedule`, `contactInfo`, `locationInfo` em `src/data/services.ts` |
| Utils | `formatPrice`, `formatDuration` em `src/utils/formatService.ts` |
| Página | `src/pages/ServicesPage.tsx` (e `Home.tsx` que usa `Services`) |

#### Domínio: Agendamentos
| Tipo | Arquivo |
|---|---|
| Componente | `src/components/Appointment/AppointmentForm.tsx` |
| Componente | `src/components/Appointment/ConfirmationModal.tsx` |
| API feature | `appointmentsApi` em `src/services/api.ts` |
| Tipos | `Appointment` em `src/types/appointment.ts` |
| Utils | `generateTimeSlots`, `formatTime`, `formatDate`, `formatDateTime`, `isWorkingDay`, `getMinDate`, `getMaxDate` em `src/utils/scheduleUtils.ts` |
| Página de admin | `src/pages/Dashboard.tsx` (aba "Agendamentos") |

#### Domínio: Autenticação / Admin
| Tipo | Arquivo |
|---|---|
| Context | `src/contexts/AuthContext.tsx` |
| Hook | `src/hooks/useAuth.ts` |
| Infra de auth | `src/services/firebase.ts` |
| Componente | `src/components/ProtectedRoute.tsx` |
| Páginas | `src/pages/Login.tsx`, `src/pages/Dashboard.tsx`, `src/pages/Unauthorized.tsx` |
| Admin (componentes) | `src/components/Admin/ServicesList.tsx`, `src/components/Admin/ServiceForm.tsx`, `src/components/Admin/AppointmentsList.tsx` |

#### Domínio: nada (infraestrutura compartilhada sem dono)
| Categoria | Arquivos |
|---|---|
| UI primitives | `src/components/common/Modal.tsx`, `Header/`, `Footer/`, `Hero/`, `Location/`, `Contact/`, `Schedule/` |
| Lib genérica | `src/utils/imageUtils.ts`, `src/utils/formatUtils.ts` (`formatPrice`, `formatDuration`, `getWhatsAppLink`) |
| Hooks genéricos | `src/hooks/useScrollAnimation.ts`, `src/hooks/useScrollToHash.ts` |
| Dados de site | `src/data/services.ts` (`schedule`, `contactInfo`, `locationInfo`) |
| Assets | `src/assets/img/*` |
| Estilos | `src/styles/global.css` |

### 1.3 Acoplamentos problemáticos

1. `ServiceCard.tsx` importa **3 fronteiras** de uma vez: hook genérico (`../../hooks/useScrollAnimation`), lib (`../../utils/formatUtils`) e tipo do domínio (`../../types/service`).
2. `AppointmentForm.tsx` cruza **mais de 4 fronteiras**: `servicesApi` + `appointmentsApi` (mesmo arquivo `api.ts`), tipos do domínio serviços, tipos do domínio agendamentos, `scheduleUtils`, `Modal` (shared).
3. `Dashboard.tsx` é uma "god page": importa `servicesApi`, `Service`, `Admin/ServicesList`, `Admin/ServiceForm`, `Admin/AppointmentsList`, `useAuth` — compõe **2+ features** sem separação e mistura estado de sessão com lógica de admin.
4. Componentes `Admin/*` ficam fisicamente em `Admin/` mas são domínio de serviços (ou de agendamentos) — não há um "package admin" limpo.
5. **Código morto:** `src/utils/formatService.ts` exporta `formatPrice`/`formatDuration` **idênticos** a `formatUtils.ts`, e **nenhum arquivo importa `formatService.ts`**.
6. `data/services.ts` contém horários/contato/localização que são usados pelos *components genéricos* `Schedule`, `Contact`, `Location` — não por um domínio "serviços". Físico equivocado.
7. `ServiceCard` usa `ServiceCard` dentro de `Services` → já é compose dentro do domínio serviços (OK, mantém).
8. `types/service.ts` exporta `ScheduleDay`, `ContactInfo`, `LocationInfo` que são consumidos por `shared/ui` (Schedule, Contact, Location). Ou seja, **shared importa features** — viola a direção de dependência.
9. `useAuth` importa `AuthContext` de `../contexts/AuthContext` — físico em `hooks/` em vez de `context/`.
10. `api.ts` aglomera `servicesApi` e `appointmentsApi` em um único arquivo sem fronteira de domínio.

### 1.4 O que já está bom e não precisa mudar

- `common/Modal.tsx` — primitiva de UI genérica, bem feita.
- `imageUtils.ts` — utilidade genérica limpa (validação, resize, base64).
- `api.ts` — cliente HTTP com axios, organizado.
- `types/appointment.ts`, `types/service.ts` — definições de tipo claras.
- `useScrollToHash.ts` — hook genérico puro.
- `Header`, `Footer`, `Hero`, `Location`, `Contact`, `Schedule` — componentes reutilizáveis e limpos.
- `firebase.ts` — config de infraestrutura, sem lógica de domínio.
- `global.css` — estilos globais.

---

## 2. Estrutura alvo

```
studio-alexia/
└── src/
    ├── app/                            # camada shell: providers + rota + layout
    │   ├── providers/
    │   │   └── AuthProvider.tsx        # AuthContextProvider (wrapper da sessão)
    │   └── App.tsx                     # Router + Providers + Rotas finas (sem lógica de domínio)
    ├── features/
    │   ├── services/                   # Serviços
    │   │   ├── components/
    │   │   │   ├── Services.tsx
    │   │   │   ├── Services.module.css
    │   │   │   ├── ServiceCard.tsx
    │   │   │   ├── ServiceCard.module.css
    │   │   │   ├── ServicesList.tsx        # admin (privado)
    │   │   │   ├── ServiceForm.tsx         # admin (privado)
    │   │   │   └── Admin.module.css        # admin (privado)
    │   │   ├── api/
    │   │   │   └── servicesApi.ts
    │   │   ├── types.ts                  # Service, ScheduleDay, ContactInfo, LocationInfo
    │   │   ├── data.ts                   # schedule, contactInfo, locationInfo
    │   │   ├── utils/
    │   │   │   └── formatService.ts
    │   │   └── index.ts                  # API pública do domínio
    │   ├── appointments/               # Agendamentos
    │   │   ├── components/
    │   │   │   ├── AppointmentForm.tsx
    │   │   │   ├── AppointmentForm.module.css
    │   │   │   ├── ConfirmationModal.tsx
    │   │   │   ├── ConfirmationModal.module.css
    │   │   │   ├── AppointmentsList.tsx      # admin (privado)
    │   │   │   └── Admin.module.css
    │   │   ├── api/
    │   │   │   └── appointmentsApi.ts
    │   │   ├── types.ts                  # Appointment
    │   │   ├── utils/
    │   │   │   └── scheduleUtils.ts
    │   │   └── index.ts                  # API pública do domínio
    │   └── auth/                       # Autenticação / Área Administrativa
    │       ├── components/
    │       │   └── ProtectedRoute.tsx
    │       ├── context/
    │       │   └── AuthContext.tsx
    │       ├── hooks/
    │       │   └── useAuth.ts
    │       ├── firebase.ts
    │       ├── pages/
    │       │   ├── Login.tsx
    │       │   ├── Dashboard.tsx
    │       │   └── Unauthorized.tsx
    │       └── index.ts                  # API pública do domínio
    ├── shared/                         # infra sem dono
    │   ├── ui/                         # primitivas
    │   │   ├── Modal.tsx
    │   │   ├── Modal.module.css
    │   │   ├── Header.tsx
    │   │   ├── Header.module.css
    │   │   ├── Footer.tsx
    │   │   ├── Footer.module.css
    │   │   ├── Hero.tsx
    │   │   ├── Hero.module.css
    │   │   ├── Location.tsx
    │   │   ├── Location.module.css
    │   │   ├── Contact.tsx
    │   │   ├── Contact.module.css
    │   │   ├── Schedule.tsx
    │   │   ├── Schedule.module.css
    │   │   └── index.ts
    │   ├── lib/                        # utilitários genéricos
    │   │   ├── imageUtils.ts
    │   │   ├── formatUtils.ts
    │   │   └── index.ts
    │   ├── hooks/                      # hooks genéricos
    │   │   ├── useScrollAnimation.ts
    │   │   ├── useScrollToHash.ts
    │   │   └── index.ts
    │   ├── data/                       # dados estáticos de site
    │   │   └── index.ts
    │   ├── assets/
    │   │   └── img/
    │   ├── styles/
    │   │   └── global.css
    │   └── index.ts                    # barrel de shared
    ├── main.tsx                        # entrada (mantém no src/)
    └── types/                          # (remover/centralizar; ver regra de divisão)
```

> **Por que não há subpastras dentro de `features/`?** Os itens do domínio têm 1–2 arquivos de um tipo só (ex.: só um `ServicesList`, só um `AppointmentForm`). Por regra do plano, evita-se `api/`, `hooks/`, `store/` dentro de feature até o domínio crescer e justificar. Apenas `components/` entra diretamente na feature.

**Decisão de tipo:** `Service` → `features/services/types.ts` (domínio). `ScheduleDay`, `ContactInfo`, `LocationInfo` → `shared/types.ts` (são consumidos por `shared/ui`). Como `shared/ui` não pode importar `features/`, os tipos de site ficam em `shared/`.

---

## 3. Tabela de mapeamento (arquivo atual → destino novo)

| Arquivo atual | Destino novo | Domínio |
|---|---|---|
| `src/components/Services/Services.tsx` | `src/features/services/components/Services.tsx` | services |
| `src/components/Services/ServiceCard.tsx` | `src/features/services/components/ServiceCard.tsx` | services |
| `src/services/api.ts` (`servicesApi`) | `src/features/services/api/servicesApi.ts` | services |
| `src/types/service.ts` (Service) | `src/features/services/types.ts` | services |
| `src/types/service.ts` (ScheduleDay, ContactInfo, LocationInfo) | `src/shared/types.ts` | shared |
| `src/data/services.ts` | `src/shared/data/index.ts` | shared |
| `src/utils/formatService.ts` | `src/features/services/utils/formatService.ts` (ou remover se confirmado) | services |
| `src/components/Appointment/AppointmentForm.tsx` | `src/features/appointments/components/AppointmentForm.tsx` | appointments |
| `src/components/Appointment/ConfirmationModal.tsx` | `src/features/appointments/components/ConfirmationModal.tsx` | appointments |
| `src/services/api.ts` (`appointmentsApi`) | `src/features/appointments/api/appointmentsApi.ts` | appointments |
| `src/types/appointment.ts` | `src/features/appointments/types.ts` | appointments |
| `src/utils/scheduleUtils.ts` | `src/features/appointments/utils/scheduleUtils.ts` | appointments |
| `src/components/Admin/ServicesList.tsx` | `src/features/services/components/ServicesList.tsx` | services |
| `src/components/Admin/ServiceForm.tsx` | `src/features/services/components/ServiceForm.tsx` | services |
| `src/components/Admin/AppointmentsList.tsx` | `src/features/appointments/components/AppointmentsList.tsx` | appointments |
| `src/components/Admin/Admin.module.css` | partição: `src/features/services/components/Admin.module.css` + `src/features/appointments/components/Admin.module.css` | services/appointments |
| `src/contexts/AuthContext.tsx` | `src/features/auth/context/AuthContext.tsx` | auth |
| `src/hooks/useAuth.ts` | `src/features/auth/hooks/useAuth.ts` | auth |
| `src/services/firebase.ts` | `src/features/auth/firebase.ts` | auth |
| `src/components/ProtectedRoute.tsx` | `src/features/auth/components/ProtectedRoute.tsx` | auth |
| `src/pages/Login.tsx` | `src/features/auth/pages/Login.tsx` | auth |
| `src/pages/Dashboard.tsx` | `src/features/auth/pages/Dashboard.tsx` | auth |
| `src/pages/Unauthorized.tsx` | `src/features/auth/pages/Unauthorized.tsx` | auth |
| `src/components/common/Modal.tsx` | `src/shared/ui/Modal.tsx` | shared |
| `src/components/Header/*` | `src/shared/ui/Header/*` | shared |
| `src/components/Footer/*` | `src/shared/ui/Footer/*` | shared |
| `src/components/Hero/*` | `src/shared/ui/Hero/*` | shared |
| `src/components/Location/*` | `src/shared/ui/Location/*` | shared |
| `src/components/Contact/*` | `src/shared/ui/Contact/*` | shared |
| `src/components/Schedule/*` | `src/shared/ui/Schedule/*` | shared |
| `src/utils/imageUtils.ts` | `src/shared/lib/imageUtils.ts` | shared |
| `src/utils/formatUtils.ts` | `src/shared/lib/formatUtils.ts` | shared |
| `src/hooks/useScrollAnimation.ts` | `src/shared/hooks/useScrollAnimation.ts` | shared |
| `src/hooks/useScrollToHash.ts` | `src/shared/hooks/useScrollToHash.ts` | shared |
| `src/assets/img/*` | `src/shared/assets/img/*` | shared |
| `src/styles/global.css` | `src/shared/styles/global.css` | shared |

---

## 4. Passos ordenados (um commit por passo, build verde ao final)

### Passo 1 — Config: adicionar path aliases (`@/features`, `@/shared`, `@/app`)

- Alterar `tsconfig.app.json` (`compilerOptions.paths` + `baseUrl`), `vite.config.ts` (`resolve.alias`) e `eslint.config.js` (`settings.externalModuleRequests` ou `no-restricted-imports` se for usar).
- **Sem mover nenhum arquivo.** Os imports relativos continuam válidos; o alias só existe, não quebra nada.
- `pnpm build` **deve ficar verde** antes de prosseguir.

### Passo 2 — `shared/`: mover infraestrutura e atualizar seus importadores

- `git mv` (em lote) para `src/shared/`:
  - `ui/`: Modal, Header, Footer, Hero, Location, Contact, Schedule (com `*.module.css` ao lado)
  - `lib/`: imageUtils, formatUtils
  - `hooks/`: useScrollAnimation, useScrollToHash
  - `data/`: index.ts (re-export de schedule, contactInfo, locationInfo)
  - `assets/img/`, `styles/global.css`
- Atualizar os imports dos assets que dependiam de shared para `@/shared/...` (ex.: `ServiceCard` → `useScrollAnimation`, `formatUtils`; `AppointmentForm` → `Modal`; `AppointmentsList` → `formatUtils`, `scheduleUtils`).
- Commit: `refactor: migra infraestrutura para shared/ e ajusta importadores`.
- Verificação: `pnpm build && pnpm lint` (deve ser verde — os arquivos que importam shared já apontam para a nova pasta do mesmo commit).

### Passo 3 — `features/`: mover os três domínios e ajustar imports internos

- `git mv` (em lote):
  - `features/services/`: components, api/servicesApi.ts, types.ts, data.ts, utils/formatService.ts;
  - `features/appointments/`: components, api/appointmentsApi.ts, types.ts, utils/scheduleUtils.ts;
  - `features/auth/`: context/AuthContext.tsx, hooks/useAuth.ts, firebase.ts, components/ProtectedRoute.tsx, pages/Login, Dashboard, Unauthorized.
- Atualizar Imports internos ao domínio para `@/features/<domínio>/...` (ex.: `AppointmentForm` → `@/features/appointments/api/appointmentsApi`, `@/features/appointments/utils/scheduleUtils`).
- Commit: `refactor: migra features/services, appointments e auth para features/`.
- Verificação: `pnpm build && pnpm lint` **verde** após cada feature migrada (ideal de commit bem menor, se for o caso).

### Passo 4 — `app/`: providers e rota fina

- Criar `src/app/providers/AuthProvider.tsx` que re-exporta `AuthContextProvider` de `@/features/auth/context/AuthContext`.
- Mover `src/main.tsx`? **Não.** Mantém no `src/` (é a entrada do Vite, não parte do shell de rota).
- `App.tsx` (novo `src/app/App.tsx`): imports viram `@/app/providers/AuthProvider`, `@/shared/ui/*`, `@/features/*/pages/*`, `@/features/appointments/components/AppointmentForm`, `@/features/auth/components/ProtectedRoute`. Rotas ficam finas: só compõem features e declaram loaders/lazy (nada de lógica de negócio). `useScrollToHash` move para `@/shared/hooks/useScrollToHash`.
- Commit: `refactor: app/ só shell: providers e rotas finas`.
- Verificação: `pnpm build && pnpm lint` **verde**.

### Passo 5 — Cleanup e verificação final

- Confirmar que `formatService.ts` não é importado por ninguém (já confirmado via grep). Decisão do usuário: remover (`código morto`) ou manter como "API interna" do domínio serviços. Se remover: commit `chore: remove arquivo morto formatService.ts`.
- Verificar que `src/types/`, `src/services/`, `src/data/`, `src/hooks/` (exceto os que migraram para shared) estão vazios; se vazios, apagar pasta.
- Commit final: `chore: rearranjo final e verificações`.
- Verificação final: `pnpm typecheck && pnpm lint && pnpm build` — **todo verde**.

> Nota: a dica de "um commit por passo com build verde" é um ideal; em praticamente todos os passos há que apagar imports junto com moves. Como cada passo abaixo é pequeno e o build é verificado após cada um, mantemos o invariantes.

---

## 5. Verificação por passo

| Passo | Comando de verificação | O que cobre |
|---|---|---|
| 1 | `pnpm build` (e `pnpm lint`) | Config de aliases não quebra builds nem lint |
| 2 | `pnpm build && pnpm lint` | Movimento de `shared/` + ajuste de importadores |
| 3 | `pnpm build && pnpm lint` | Migração de cada feature antes de fechar o commit |
| 4 | `pnpm build && pnpm lint` | `app/` shell, providers, rotas finas |
| 5 | `pnpm typecheck && pnpm lint && pnpm build` | Estado final, sem regressões |

> Como esse projeto **não possui test suite** (nenhum vitest/jest/playwright/cypress), a seção "testes" é N/A. O "testes" aplicáveis são `typecheck` (tsc) e `lint`. Quando um domínio crescer e ganhar testes, a regra de co-localização (`<component>.test.tsx` ao lado) entra em vigor.

---

## 6. Regras para adicionar um novo domínio no futuro (checklist curto)

1. Criar `src/features/<novo-domain>/` com componentes, `api/`, `types.ts`, `utils/` (se crescer).
2. Adicionar re-exports no `index.ts` (API pública — só o que outro lado pode consumir).
3. Importar de `@/features/<novo-domain>/...` — **nunca** de `@/shared` para lógica de domínio.
4. Se um segundo consumidor (fora do domínio) precisar daquele código, avaliar extração para `shared/` com o critério: *segundo consumidor não é suficiente para promover* — só extrai o núcleo sem domínio.
5. Para estender a feature: criar arquivos no local; o `index.ts` continua a única fronteira exportável. O restante é privado (`no barrel` em toda pasta).
6. O patrão de entre-features é permitido apenas pela API pública (`index.ts`) — nunca cruze importação direta entre features.

---

## 7. Riscos e decisões necessárias

Aqui a decisão é **sua** — não executei esse plano ainda.

1. **`formatService.ts` morto**: não é importado por nenhum arquivo. Enquanto "organização", prefiro removê-lo. Se quiser conservá-lo como "API do domínio", posso apenas re-exportar `formatPrice`/`formatDuration` dele e apagar o original.
2. **Onde ficam `Home` e `ServicesPage`?** `Home` cumpre papel de landing/página pública; `ServicesPage` é a versão expandida de serviços. Proposta: ambos em `features/services/pages/`. Se preferir um "feature de site" separado, é só dizer.
3. **Path aliases**: o plano adiciona `@/features`, `@/shared`, `@/app`. Se preferir manter imports relativos (zero mudança de config), a reestruturação continua funcional — apenas o código fica mais verboso. *Recomendo adicionar, pois o padrão é praíva e deixará a base mais simples para crescer.*
4. **Enforcement de dependências (feature → feature, só pela API pública)**:
   - Opção A (recomendada para este tamanho): `no-restricted-imports` — regra simples, sem nova dependência de runtime.
   - Opção B: `eslint-plugin-boundaries` (artigo) — mais elaborado, exige config adicional.
5. **`App.tsx` e rotas**: o plano mantém as rotas no `App.tsx` (fina). Se você quiser em separado, o `app/` pode agrupar `App.tsx` e `routes/`, mas para este tamanho um único arquivo é suficiente.
6. **`data/services.ts`** (horários/contato/localização): vai para `shared/data/`. Se esses dados forem apenas "informações de um domínio de serviço" no seu mental modelo, pode ficar em `features/services/data.ts` — valor da decisão sobre o que é "negócio" vs "site genérico".
7. **Tipificação de `ScheduleDay/ContactInfo/LocationInfo`**: movidos para `shared/types.ts` porque são consumidos por `shared/ui`. Se você achar que "serviços" é o dono do domínio (e `Schedule`, `Contact`, `Location` são apenas "páginas do serviço"), fique em `features/services/types.ts` — o plano segue a direção `shared` → `features`, que é a que evita ciclos.

### O que **deixei de fora** intencionalmente e por quê

- **`store/` (Zustand)**: não há estado global além da sessão (Firebase) e a regra do plano mantém isso em `app/providers/`. `features/<nome>/store/` só entra quando uma feature tiver estado de negócio global. — não há necessidade hoje, colocar no readme adição do zustand quando necessário.
- **Vitest/Playwright**: após estrutura haverá teste, instalar ambos.
- **Admin.module.css quebrado**: foi dividido em dois (um por feature admin) para manter o arquivo privado do domínio; se preferir um `Admin.module.css` compartilhado no `shared/ui`, é só avisar.
- **AsyncStorage/SessionStorage**: não há, portanto não há configuração de persistência de estado pra mover.

---

## 8. TanStack Query - Considerações de Integração

**Estado atual de gerenciamento de dados:**
- Autenticação: Firebase v13 (`firebase/auth`) — já possui sessão global
- Requisições HTTP: axios com baseURL `/api` (proxy p/ json-server no Render)
- Dados de servidor: buscados em `useEffect` dentro de páginas/componentes (`Dashboard.tsx`, `AppointmentForm.tsx`)
- Estado de cliente: tema/sessão em `app/providers/` (AuthContextProvider); feature-level state ainda não existe (domínios são relativamente estáticos)

**TanStack Query (react-query) como opção:**
- Biblioteca padrão de fato para "server state" em React
- Gerencia: cache, refetch automático, background updates, stale-while-revalidator, mutations, invalidation
- Integração natural com o padrão "Feature-based" do plano: cada feature pode ter seu próprio `QueryClient` ou um global na raiz (`app/`)

1. **Por que considerar TanStack Query para este projeto:**
1. **Centraliza fetching**: Em vez de `useEffect` + `servicesApi.getAll()` em cada página, o query client gerencia o ciclo de vida (carregando, erro, dados frescos).
