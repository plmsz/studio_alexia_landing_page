# 📋 Plano de Implementação — Studio Alexia Menezes

> Este documento especifica a arquitetura, as alterações de código e a documentação para as duas novas funcionalidades prioritárias do projeto.

---

## 🎯 Funcionalidades Prioritárias

1. **Gestão Dinâmica da Agenda e Disponibilidade (Visão Admin)**
2. **Adição ao Calendário Pessoal / Prevenção de No-Show (Visão Cliente)**

---

## 1. Comandos de Instalação

Execute dentro de `/home/paloma/Documentos/studio_alexia_landing_page/studio-alexia`:

```bash
npm install datebook react-day-picker dayjs
```

| Pacote | Finalidade |
|--------|-----------|
| `datebook` | Geração de links "Adicionar ao Calendário" (Google, Apple/iOS, Outlook) e download de arquivo `.ics` |
| `react-day-picker` | Componente visual de calendário no painel admin para bloqueio de datas (feriados/folgas) |
| `dayjs` | Manipulação de datas (já presente no `package.json`) |

> `react-day-picker` v8+ inclui tipos TypeScript nativamente.

---

## 2. Alterações na Base de Dados (`db.json`)

Serão adicionadas duas novas coleções ao `db.json` (raiz: `/home/paloma/Documentos/studio_alexia_landing_page/studio-alexia/db.json`).

### Coleção `businessHours`

```json
"businessHours": [
  { "id": 1, "dayOfWeek": 1, "open": "09:00", "close": "18:00", "breakStart": "12:00", "breakEnd": "14:00", "isWorking": true },
  { "id": 2, "dayOfWeek": 2, "open": "09:00", "close": "18:00", "breakStart": "12:00", "breakEnd": "14:00", "isWorking": true },
  { "id": 3, "dayOfWeek": 3, "open": "09:00", "close": "18:00", "breakStart": "12:00", "breakEnd": "14:00", "isWorking": true },
  { "id": 4, "dayOfWeek": 4, "open": "09:00", "close": "18:00", "breakStart": "12:00", "breakEnd": "14:00", "isWorking": true },
  { "id": 5, "dayOfWeek": 5, "open": "09:00", "close": "18:00", "breakStart": "12:00", "breakEnd": "14:00", "isWorking": true },
  { "id": 6, "dayOfWeek": 6, "open": "10:00", "close": "18:00", "breakStart": "12:00", "breakEnd": "14:00", "isWorking": true },
  { "id": 7, "dayOfWeek": 0, "open": "09:00", "close": "12:00", "breakStart": null, "breakEnd": null, "isWorking": true }
]
```

Campos:
- `id`: número único
- `dayOfWeek`: 0 (Domingo) a 6 (Sábado)
- `open`: hora de abertura (HH:mm)
- `close`: hora de fechamento (HH:mm)
- `breakStart` / `breakEnd`: intervalo de pausa (null se não houver)
- `isWorking`: se o dia é dia de expediente

### Coleção `blockedDates`

```json
"blockedDates": [
  { "id": 1, "date": "2025-12-25", "reason": "Natal", "type": "holiday" },
  { "id": 2, "date": "2026-01-01", "reason": "Ano Novo", "type": "holiday" },
  { "id": 3, "date": "2026-02-16", "reason": "Férias", "type": "personal" }
]
```

Campos:
- `id`: número único
- `date`: data no formato ISO `YYYY-MM-DD`
- `reason`: descrição do bloqueio
- `type`: `holiday` | `personal` | `maintenance`

---

## 3. Novos Tipos TypeScript (`src/types/`)

**Novo arquivo:** `/home/paloma/Documentos/studio_alexia_landing_page/studio-alexia/src/types/businessHours.ts`

```typescript
export interface BusinessHours {
  id: number;
  dayOfWeek: number; // 0 = Domingo, ..., 6 = Sábado
  open: string;      // HH:mm
  close: string;     // HH:mm
  breakStart: string | null; // HH:mm ou null
  breakEnd: string | null;   // HH:mm ou null
  isWorking: boolean;
}

export interface BlockedDate {
  id: number;
  date: string;   // YYYY-MM-DD
  reason: string;
  type: 'holiday' | 'personal' | 'maintenance';
}
```

---

## 4. Atualizações nos Serviços de API (`src/services/api.ts`)

Adicionar dois novos módulos ao `api.ts`:

### `businessHoursApi`

```typescript
export const businessHoursApi = {
  getAll: async (): Promise<BusinessHours[]> => {
    const response = await api.get<BusinessHours[]>('/businessHours');
    return response.data;
  },
  update: async (id: number, hours: Partial<BusinessHours>): Promise<BusinessHours> => {
    const response = await api.put<BusinessHours>(`/businessHours/${id}`, hours);
    return response.data;
  },
};
```

### `blockedDatesApi`

```typescript
export const blockedDatesApi = {
  getAll: async (): Promise<BlockedDate[]> => {
    const response = await api.get<BlockedDate[]>('/blockedDates');
    return response.data;
  },
  create: async (blockedDate: Omit<BlockedDate, 'id'>): Promise<BlockedDate> => {
    const response = await api.post<BlockedDate>('/blockedDates', blockedDate);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/blockedDates/${id}`);
  },
};
```

> O JSON-Server aceita POST/PUT/DELETE dinamicamente, portanto nenhum ajuste de servidor é necessário.

---

## 5. Refatoração dos Utilitários (`src/utils/scheduleUtils.ts`)

A função `generateTimeSlots` será refatorada para consumir dados dinâmicos da API.

### Nova assinatura

```typescript
export const generateTimeSlots = (
  date: Date,
  appointments: Appointment[],
  serviceDuration: number,
  businessHours: BusinessHours[],
  blockedDates: BlockedDate[]
): TimeSlot[] => { ... }
```

### Mudanças na lógica

1. Busca o `BusinessHours` correspondente ao `dayOfWeek` da data. Se `isWorking === false` ou não houver entrada, retorna array vazio.
2. Verifica se a data está em `blockedDates` — se sim, retorna array vazio.
3. Divide o expediente em períodos de trabalho excluindo o intervalo de pausa (`breakStart` → `breakEnd`).
4. Para cada período, gera slots respeitando:
   - `serviceDuration`: o serviço não pode ultrapassar o `close` do período
   - `appointments`: valida sobreposição com agendamentos existentes
   - Horários passados são marcados como indisponíveis

### Funções auxiliares novas

- `isBlockedDate(date: Date, blockedDates: BlockedDate[]): boolean`
- `getBusinessHoursForDay(dayOfWeek: number, businessHours: BusinessHours[]): BusinessHours | undefined`
- `splitPeriodIntoWorkBlocks(open: string, close: string, breakStart: string | null, breakEnd: string | null): {start: string; end: string}[]`

---

## 6. Mapeamento de Componentes (Novos e Modificados)

### Componentes NOVOS

| Arquivo | Responsabilidade |
|---------|-----------------|
| `src/components/Admin/BusinessHoursManager.tsx` | Tabela/formulário para editar horários de funcionamento por dia da semana. Integra com `businessHoursApi`. |
| `src/components/Admin/DateBlocker.tsx` | Calendário visual (`react-day-picker`) para bloquear/desbloquear datas específicas. Integra com `blockedDatesApi`. |

### Componentes MODIFICADOS

| Arquivo | Alteração |
|---------|-----------|
| `src/components/Appointment/AppointmentForm.tsx` | Carregar `businessHours` e `blockedDates` via API antes de gerar slots; passar para `generateTimeSlots`. |
| `src/components/Appointment/ConfirmationModal.tsx` | Adicionar botões "Adicionar ao Google Calendar", "Apple Calendar", "Outlook" e "Baixar .ics" usando `datebook`. |
| `src/pages/Dashboard.tsx` | Adicionar nova aba "Agenda" no painel admin contendo `BusinessHoursManager` e `DateBlocker`. |
| `src/utils/scheduleUtils.ts` | Refatorar `generateTimeSlots` e adicionar funções auxiliares. |
| `src/services/api.ts` | Adicionar `businessHoursApi` e `blockedDatesApi`. |
| `src/types/businessHours.ts` | Novo arquivo com interfaces `BusinessHours` e `BlockedDate`. |

### Fluxo de dados atualizado (Agendamento)

```
Usuário seleciona data
    ↓
AppointmentForm carrega:
  - servicesApi.getAll()
  - appointmentsApi.getByDate(date)
  - businessHoursApi.getAll()
  - blockedDatesApi.getAll()
    ↓
generateTimeSlots(date, appointments, serviceDuration, businessHours, blockedDates)
    ↓
Exibe slots disponíveis
    ↓
Usuário confirma agendamento
    ↓
appointmentsApi.create() → modal de confirmação
    ↓
ConfirmationModal exibe botões datebook (Google/Apple/Outlook/.ics)
```

---

## 7. Critérios de Aceitação (DoD)

- [ ] `db.json` contém coleções `businessHours` e `blockedDates` com dados válidos.
- [ ] `generateTimeSlots` respeita horários dinâmicos e bloqueios de data.
- [ ] Painel Admin possui aba para editar `businessHours` (por dia da semana).
- [ ] Painel Admin possui calendário para bloquear datas (`react-day-picker`).
- [ ] Modal de confirmação exibe botões de adição ao calendário (Google, Apple, Outlook, .ics).
- [ ] Evento do calendário contém título, data/hora, endereço completo e descrição com tolerância de atraso.
- [ ] TypeScript compila sem erros (`tsc -b`).
- [ ] Build de produção roda com sucesso (`vite build`).

---

---

## 8. Correção de Vulnerabilidades de Segurança

Antes de colocar as novas funcionalidades em produção, deve-se auditar e corrigir vulnerabilidades nas dependências e no código:

### 8.1 Auditoria de Dependências

```bash
# Dentro de /home/paloma/Documentos/studio_alexia_landing_page/studio-alexia
npm audit
npm audit fix
```

### 8.2 Itens de Segurança a Validar

- [ ] **Variáveis de ambiente:** Confirmar que `.env` não está versionado no Git (verificar `.gitignore`).
- [ ] **Chaves Firebase:** As credenciais do Firebase devem estar apenas em `.env` e nunca hardcadas no código-fonte (remover `src/components/Services/firebase.ts` com chaves expostas).
- [ ] **Proteção de rotas admin:** Verificar que `ProtectedRoute` bloqueia acesso não autenticado e não-admin a `/admin`.
- [ ] **Validação de entrada:** Sanitizar dados recebidos do cliente antes de enviar para a API (nome, contato, data, serviço).
- [ ] **CORS e proxy:** Confirmar que o proxy do Vite e os rewrites da Vercel expõem apenas os endpoints necessários (`/api/*`).
- [ ] **JSON-Server exposto:** Verificar se o JSON-Server no Render não está acessível sem autenticação para operações de escrita sensíveis.
- [ ] **Atualização de pacotes:** Atualizar `datebook`, `react-day-picker` e `dayjs` para versões mais recentes estáveis após instalação.

### 8.3 Comando de Verificação Final

```bash
npm audit --production
npm run build
npm run lint
```

## 9. Documentação — README.md (Resumo do Conteúdo)

O `README.md` deverá conter as seguintes seções:

- Badge & Nome do Projeto: Plataforma Web – Studio Alexia Menezes
- Visão Geral e Objetivos (ODS 8 e 10)
- Tecnologias Utilizadas (React 19, TS, Vite, CSS Modules, Firebase, JSON-Server, datebook, react-day-picker, dayjs)
- Arquitetura de Pastas e Componentes
- Novas Funcionalidades (Visão Admin e Cliente)
- Guia de Instalação e Execução Local
- Variáveis de Ambiente (`.env.example`)
- Deploy e Links Públicos (Vercel + Render)
- Modelos de Dados (Service, Appointment, BusinessHours, BlockedDate)
- Rotas da Aplicação
- Como Contribuir

---

## 10. Próximos Passos

1. Validar este plano com o produto.
2. Executar as alterações na ordem: dependências → db.json → types → api.ts → utils → componentes → páginas → documentação.
3. Rodar `npm run build` e `npm run lint` para validação.


---

*Documento gerado automaticamente como parte da Etapa 1 (Planejamento) da evolução do Studio Alexia Menezes.*