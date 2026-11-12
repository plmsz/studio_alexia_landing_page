# Plano de Estruturação de Pastas — Studio Alexia

## 1. Estrutura de Pastas

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

## 2. Regras para Adicionar um Novo Domínio

Ao criar uma nova feature/domínio, siga estas orientações:

1. **Crie** `src/features/<novo-domain>/` com: components, `api/`, `types.ts`, `utils/` (apenas se o domínio crescer).
2. **Adicione** re-exports no `index.ts` (API pública — somente o que outro lado pode consumir).
3. **Importe** de `@/features/<novo-domain>/...` — **nunca** de `@/shared` para lógica de domínio.
4. **Avalie extração para `shared/`** apenas se houver um segundo consumidor fora do domínio — e apenas o núcleo sem lógica de domínio, não o todo.
5. **Para estender a feature:** crie arquivos no local; o `index.ts` continua a única fronteira exportável. O restante é privado (não está no barrel de nenhuma pasta).
6. **Comunicação entre features:** permitida apenas pela API pública (`index.ts`) — nunca cruze importação direta entre features.

---

## 3. Considerações para Novas Funcionalidades

Ao adicionar novas funcionalidades, analise o seguinte:

### Estado e Gerenciamento

- **Store (Zustand):** Não há estado global além da sessão Firebase, que já fica em `app/providers/`. `features/<nome>/store/` só entra quando uma feature tiver estado de negócio global. **Não coloque no readme agora** — adicione quando for necessário.
- **Auth:** Firebase v13 (`firebase/auth`) — já possui sessão global.
- **AsyncStorage/SessionStorage:** Não há configurabilidade de persistência de estado atualmente.

### Busca e Dados

- **Requisições HTTP:** axios com baseURL `/api` (proxy para json-server no Render).
- **Dados de servidor:** Atualmente buscados em `useEffect` dentro de páginas/componentes (`Dashboard.tsx`, `AppointmentForm.tsx`).
- **TanStack Query (react-query):** Biblioteca padrão de fato para "server state" em React. Gerencia cache, refetch automático, background updates, stale-while-revalidator, mutations e invalidation.
  - **Avaliar uso:** Se a aplicação crescer e múltiplas features precisarem de dados servidor sincronizados, considerar TanStack Query globalmente em `app/` ou por feature. Para agora, o padrão `useEffect` + axios permanece.
- **Integração com feature-based:** Cada feature pode ter seu próprio `QueryClient` ou usar um global na raiz (`app/`).

### Testes

- **Vitest/Playwright:** Instalar após estrutura definida. Testes serão co-localizados com os componentes que mudam.

---

## 4. Boas Práticas

- **Co-locate everything** that changes together. Um componente, seu teste, sua story e seus tipos pertencem na mesma pasta. Árvores de teste paralelas sempre acabam drifting.
- **Keep route files thin.** Rotas compostam features e declaram loaders; não devem conter lógica de negócio. Se uma rota crescer além de 50 linhas, empurre lógica para uma feature.
- **Split shared code by concern, not by type.** `shared/lib/http.ts`, `money.ts`, `date.ts` — nunca um giant utils.ts. Tree-shaking e grep melhoram.
- **Name files by what they are,** não por onde vivem. Button.tsx, não SharedUiButton.tsx. O caminho já encode a localização.
- **Promote to shared/ deliberately, not reactively.** Um segundo consumidor não justifica promoção. Extraia o núcleo livre de domínio para shared/lib e deixe features construírem em cima.
- **Put server state behind a hook.** Componentes nunca devem importar seu cliente HTTP diretamente; eles chamam um hook de feature que envolve TanStack Query ou SWR.
- **Keep the design system dumb.** `shared/components/ui/*` não devem importar de features/. Um Button que conheça usuários é um Button que não pode reutilizar.

---

## 5. Índice Rápido (Quick Reference)

- ✅ Sempre crie features bajo `src/features/`
- ✅ Use `index.ts` como única fronteira de API pública
- ✅ Nunca importe de `shared/` para lógica de domínio
- ✅ Componentes de feature não podem importar de outras features
- ✅ Considere TanStack Query para state de servidor quando features crescerem
- ✅ Mantenha rota finas — empurre lógica para features
- ✅ Promova para `shared/` apenas com múltiplos consumidores e núcleo sem domínio

