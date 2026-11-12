📋 Plano 1 — Adicionar ao Calendário ao Confirmar Agendamento (Visão Cliente)Foco: Prevenção de No-Show integrando a confirmação do agendamento com calendários pessoais (Google Calendar, Apple Calendar, Outlook e download de arquivo .ics).1. Comandos de InstalaçãoExecute dentro de /home/paloma/Documentos/studio_alexia_landing_page/studio-alexia:Bashnpm install datebook dayjs
PacoteFinalidadedatebookGeração de links de calendário (Google, Apple, Outlook) e download do arquivo .icsdayjsFormatação de datas e fusos horários para montagem do evento2. Componentes EnvolvidosComponentes MODIFICADOSArquivoAlteraçãosrc/components/Appointment/ConfirmationModal.tsxAdicionar integração com datebook para gerar botões/links de adição ao calendário após a confirmação.3. Arquitetura da Solução (ConfirmationModal.tsx)Ao confirmar o agendamento, o modal deve montar o evento usando a biblioteca datebook:TypeScriptimport { ICalendar, GoogleCalendar, OutlookCalendar } from 'datebook';

// Dados recebidos do agendamento confirmado
const eventConfig = {
  title: `Agendamento: ${service.name} - Studio Alexia Menezes`,
  description: `Seu agendamento para ${service.name} foi confirmado.\n\n` +
               `Observação: Tolerância máxima de atraso de 10 minutos.\n` +
               `Dúvidas ou cancelamentos: Entre em contato pelo WhatsApp.`,
  location: `${location.address}, ${location.neighborhood} - ${location.city}/${location.state}`,
  start: new Date(`${appointment.date}T${appointment.time}`),
  end: new Date(new Date(`${appointment.date}T${appointment.time}`).getTime() + service.duration * 60000),
};

// Geradores de Link / Download
const icsFile = new ICalendar(eventConfig).download();
const googleUrl = new GoogleCalendar(eventConfig).render();
const outlookUrl = new OutlookCalendar(eventConfig).render();
4. Fluxo do UsuárioUsuário conclui o formulário de agendamento
    ↓
appointmentsApi.create() envia os dados com sucesso
    ↓
ConfirmationModal é exibido na tela
    ↓
Exibe os botões de ação:
├── 📅 Adicionar ao Google Agenda (Abre link)
├── 🍏 Adicionar ao Apple Calendar (Download .ics / link web)
├── ✉️ Adicionar ao Outlook (Abre link)
└── 💾 Baixar Arquivo .ics (Download direto)
5. Critérios de Aceitação (DoD)[ ] Instalação dos pacotes datebook e dayjs concluída.[ ] Modal de confirmação renderiza os 4 botões/links de calendário corretamente após o sucesso do agendamento.[ ] O evento gerado inclui: Título com o nome do serviço, Data/Hora de início e término calculadas pela duração, Endereço completo e Instruções de tolerância/atraso na descrição.[ ] Testado o download do arquivo .ics e a abertura do link do Google Calendar.[ ] Sem erros de compilação TypeScript (tsc -b).📋 Plano 2 — Gestão Dinâmica da Agenda e Bloqueio de Dias (Visão Admin)Foco: Permitir ao administrador configurar horários de funcionamento por dia da semana (com pausas) e bloquear datas específicas (feriados, folgas), refletindo isso em tempo real nos horários disponíveis para o cliente.1. Comandos de InstalaçãoExecute dentro de /home/paloma/Documentos/studio_alexia_landing_page/studio-alexia:Bashnpm install react-day-picker dayjs
PacoteFinalidadereact-day-pickerComponente visual de calendário no painel admin para seleção e bloqueio de datasdayjsManipulação e validação de datas no motor de disponibilidade2. Alterações na Base de Dados (db.json)Adicionar duas novas coleções ao db.json (/home/paloma/Documentos/studio_alexia_landing_page/studio-alexia/db.json):JSON{
  "businessHours": [
    { "id": 1, "dayOfWeek": 1, "open": "09:00", "close": "18:00", "breakStart": "12:00", "breakEnd": "14:00", "isWorking": true },
    { "id": 2, "dayOfWeek": 2, "open": "09:00", "close": "18:00", "breakStart": "12:00", "breakEnd": "14:00", "isWorking": true },
    { "id": 3, "dayOfWeek": 3, "open": "09:00", "close": "18:00", "breakStart": "12:00", "breakEnd": "14:00", "isWorking": true },
    { "id": 4, "dayOfWeek": 4, "open": "09:00", "close": "18:00", "breakStart": "12:00", "breakEnd": "14:00", "isWorking": true },
    { "id": 5, "dayOfWeek": 5, "open": "09:00", "close": "18:00", "breakStart": "12:00", "breakEnd": "14:00", "isWorking": true },
    { "id": 6, "dayOfWeek": 6, "open": "10:00", "close": "18:00", "breakStart": "12:00", "breakEnd": "14:00", "isWorking": true },
    { "id": 7, "dayOfWeek": 0, "open": "09:00", "close": "12:00", "breakStart": null, "breakEnd": null, "isWorking": false }
  ],
  "blockedDates": [
    { "id": 1, "date": "2025-12-25", "reason": "Natal", "type": "holiday" },
    { "id": 2, "date": "2026-01-01", "reason": "Ano Novo", "type": "holiday" },
    { "id": 3, "date": "2026-02-16", "reason": "Férias", "type": "personal" }
  ]
}
3. Novos Tipos TypeScriptAtualizar ou criar os tipos nas camadas de compartilhamento:src/shared/types.ts ou src/features/services/types.tsTypeScriptexport interface BusinessHours {
  id: number;
  dayOfWeek: number; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  open: string;      // HH:mm
  close: string;     // HH:mm
  breakStart: string | null; // HH:mm ou null
  breakEnd: string | null;   // HH:mm ou null
  isWorking: boolean;
}

export interface BlockedDate {
  id: number;
  date: string;   // Format ISO YYYY-MM-DD
  reason: string;
  type: 'holiday' | 'personal' | 'maintenance';
}
4. Serviços de API (src/services/api.ts)Adicionar os módulos de integração com a API:TypeScriptexport const businessHoursApi = {
  getAll: async (): Promise<BusinessHours[]> => {
    const response = await api.get<BusinessHours[]>('/businessHours');
    return response.data;
  },
  update: async (id: number, hours: Partial<BusinessHours>): Promise<BusinessHours> => {
    const response = await api.put<BusinessHours>(`/businessHours/${id}`, hours);
    return response.data;
  },
};

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
5. Refatoração dos Utilitários de Horários (src/utils/scheduleUtils.ts)A função generateTimeSlots passa a receber as regras dinâmicas:TypeScriptexport const generateTimeSlots = (
  date: Date,
  appointments: Appointment[],
  serviceDuration: number,
  businessHours: BusinessHours[],
  blockedDates: BlockedDate[]
): TimeSlot[] => {
  // 1. Verificar se a data está bloqueada
  if (isBlockedDate(date, blockedDates)) return [];

  // 2. Buscar expediente para o dia da semana
  const dayOfWeek = date.getDay();
  const dayConfig = getBusinessHoursForDay(dayOfWeek, businessHours);
  if (!dayConfig || !dayConfig.isWorking) return [];

  // 3. Gerar slots baseados no expediente e pausas (breakStart/breakEnd)
  // 4. Filtrar slots sobrepostos por appointments existentes
  // ...
};

// Funções Auxiliares:
export const isBlockedDate = (date: Date, blockedDates: BlockedDate[]): boolean => {
  const formattedDate = dayjs(date).format('YYYY-MM-DD');
  return blockedDates.some(b => b.date === formattedDate);
};

export const getBusinessHoursForDay = (
  dayOfWeek: number, 
  businessHours: BusinessHours[]
): BusinessHours | undefined => {
  return businessHours.find(b => b.dayOfWeek === dayOfWeek);
};
6. Mapeamento de Componentes (Novos e Modificados)Componentes NOVOSArquivoResponsabilidadesrc/components/Admin/BusinessHoursManager.tsxForm e tabela para edição de expedientes e pausas por dia da semana (businessHoursApi).src/components/Admin/DateBlocker.tsxCalendário (react-day-picker) para listar, adicionar e remover dias bloqueados (blockedDatesApi).Componentes MODIFICADOSArquivoAlteraçãosrc/pages/Dashboard.tsxAdicionar a aba "Gestão da Agenda" incorporando BusinessHoursManager e DateBlocker.src/components/Appointment/AppointmentForm.tsxCarregar businessHours e blockedDates na montagem e repassar para generateTimeSlots.src/utils/scheduleUtils.tsAtualizar motor de cálculo de disponibilidade.7. Fluxo de Dados (Painel Admin + Agendamento)[PAINEL ADMIN]
Admin altera horários no BusinessHoursManager OU bloqueia uma data no DateBlocker
    ↓
API salva em /businessHours ou /blockedDates (db.json)

-----------------------------------------------------------------------

[TELA DE AGENDAMENTO CLIENTE]
Usuário escolhe uma data no AppointmentForm
    ↓
AppointmentForm consulta: appointmentsApi, businessHoursApi e blockedDatesApi
    ↓
generateTimeSlots(date, appointments, duration, businessHours, blockedDates)
    ↓
Data bloqueada / Dia não letivo -> 0 horários disponíveis
Dia normal -> Retorna slots considerando abertura, fechamento e intervalo de almoço
8. Critérios de Aceitação (DoD)[ ] db.json atualizado com as tabelas businessHours e blockedDates.[ ] Componente BusinessHoursManager funcionando no Painel Admin (permite alterar horários e dias de descanso).[ ] Componente DateBlocker funcionando com react-day-picker (permite selecionar datas no calendário para bloquear com motivo).[ ] generateTimeSlots impede agendamento em datas bloqueadas ou fora do expediente configurado.[ ] Projeto compila sem erros TypeScript (tsc -b) e passa no build (vite build).