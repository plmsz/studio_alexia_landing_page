# Regras de Negócio — Alexia Studio

Este documento centraliza as regras de negócio (RN) do sistema de gestão de agendamentos para salão e clínica.

Todos os identificações de regra seguem o padrão `RN-<DOMÍNIO>-<Nº>`, por exemplo: `RN-AG-01`. Esses IDs devem ser usados em PRs, commits, testes e comentários no código para rastrear o que foi implementado e o que está em plano.

---

## 1. Agendamentos (`features/agendamentos`)

- **RN-AG-01 (Conflito de Agenda):** O sistema não deve permitir dois agendamentos que se sobreponham no mesmo intervalo de tempo para o mesmo profissional. A disponibilidade de um horário é calculada verificando se a nova soma de serviço ultrapassa o limite de cada período.
- **RN-AG-02 (Horários de Funcionamento):** O sistema define horários fixos por dia da semana. Segunda a sexta: 09h–12h e 14h–18h; Sábado: 10h–12h e 14h–18h; Domingo: 09h–12h.
- **RN-AG-03 (Duração do Serviço na Agenda):** Cada agendamento deve ter início e fim que respeitem a duração total do serviço alocado a ele; o intervalo do serviço não pode ultrapassar o fim do período de funcionamento.
- **RN-AG-04 (Data Mínima de Agendamento):** Apenas datas a partir de **hoje** podem ser agendadas. Agendamentos com data no passado são inválidos.
- **RN-AG-05 (Limite de Próximos 3 Meses):** O sistema só permite agendamentos no máximo **3 meses à frente** a partir da data atual.
- **RN-AG-06 (Dados Pessoais do Cliente):** Ao criar um agendamento, o cliente deve informar nome e contato. O contato é usado para origem de comunicação, preferência do WhatsApp.
- **RN-AG-07 (Cancelamento):** O administrador pode cancelar agendamentos existentes. Ao cancelar, o estado do agendamento é marcado como cancelado (confirmado via modal de confirmação de exclusão).
- **RN-AG-08 (Separar Agendamentos Futuros e Passados):** O sistema deve separar visivelmente agendamentos futuros de agendamentos anteriores, exibindo apenas os futuros no fluxo de agendamento e listando os anteriores como histórico.

---

## 2. Clientes (`features/clientes`)

- **RN-CL-01 (Identificação Única):** O cliente é identificado por nome e contato (telefone). O sistema não mantém cadastro de cliente separado; os dados de nome e contato são capturados no momento do agendamento.
- **RN-CL-02 (Ação de Contato):** O sistema gera um link direto para WhatsApp a partir do número de telefone cadastrado no agendamento, permitindo ao cliente entrar em contato rapidamente.

---

## 3. Serviços e Profissionais (`features/servicos`)

- **RN-SV-01 (Duração do Serviço):** Cada serviço deve possuir uma duração estimada (em minutos) que determina a alocação de tempo na agenda do profissional.
- **RN-SV-02 (Preço do Serviço):** Cada serviço deve possuir um preço maior que zero (R$). O valor é armazenado em centavos ou reais, patrocinando a formatação monetária em BRL.
- **RN-SV-03 (Campos Obrigatórios):** Título, descrição, imagem e texto alternativo são obrigatórios ao criar ou editar um serviço.
- **RN-SV-04 (Serviço em Destaque):** O sistema pode destacar alguns serviços na Página Inicial, contendo a flag `featured`. O admin pode controlar quem é destacado.
- **RN-SV-05 (Visualização de Serviços):** O sistema exibe serviços disponíveis; a Página Inicial mostra os destaques e a seção de serviços permite listar todos.
- **RN-SV-06 (Duração Total Inclui Preparo):** A duração total do serviço deve incluir tempo de preparo e intervalo entre clientes, conforme dica da UI: "Inclua o tempo de preparo e intervalo entre clientes na duração total".

---

## 4. Pagamentos e Comissões (`features/financeiro`)

- **RN-FN-01 (Confirmação de Reserva):** Serviços com valor superior a **R$ 150,00** exigem sinalização/sinalização de pagamento de **20%** no ato do agendamento. (Nota: o campo físico para a confirmação de pagamento está previsto para uma iteração futura de cobrança; o requisito está registrado para orientar o desenvolvimento.)
- **RN-FN-02 (Cálculo de Comissão):** A comissão do profissional é calculada sobre o valor **líquido** do serviço realizado, descartando descontos concedidos.

---

## Observações de Implementação

- A persistência de dados usa **JSON Server** (mock) no `db.json`, com endpoints `/services` e `/appointments`. O Firebase só é usado para autenticação de administradores (login via Google).
- O CRUD de serviços e agendamentos é feito via `servicesApi` e `appointmentsApi` dentro de `src/services/api.ts`.
- A disponibilidade de horários é gerada no `src/utils/scheduleUtils.ts` (`generateTimeSlots`), que checa conflitos com agendamentos existentes usando a duração do serviço.
- A formatação de preços usa `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.
- A duração dos serviços é usada no agendamento (`duration` em minutos) e exibida no admin em formato legível (ex: `90min` → `1h 30min`).

---

## Como Manter Este Documento

1. **Cada regra nova recebe um ID** no padrão `RN-<DOMÍNIO>-<Nº>`, com número sequencial dentro do domínio.
2. **Coloque a regra na seção correspondente** à feature do código: `features/agendamentos`, `features/clientes`, `features/servicos`.
3. **Use frases no presente e diretas**: "Deve", "Não deve", "Exige".
4. **Não repita details técnicos** (ex: strings de CRUD, chamadas de API); mantenha apenas o que define o **comportamento esperado**.
5. **Atualize o arquivo** em cada PR significativo que mude o comportamento do sistema; o ID da regra deve aparecer no título do PR/commit (ex: `feat(agendamentos): implementar RN-AG-03`).
