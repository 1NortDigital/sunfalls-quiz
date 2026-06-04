# Sunfalls — Quiz da Copa da Economia

Site no **formato quiz** (não é landing page) que capta leads de energia solar com a pegada da Copa do Mundo: *"Descubra quanto você economiza a cada Copa do Mundo (4 anos)"*.

Cliente novo da agência (Paraná). Visual próprio — **estádio ao entardecer** (azul-noite + dourado do sol), distinto do quiz verde da Romasol. Origem identificada por `pagina = quiz-sunfalls` / `form_type = quiz_solar`.

## Fluxo
Intro Copa (botão **Iniciar**) → **P1** Conta de luz (R$300 / R$600 / +R$900) → **P2** Casa própria? (Sim / Não-Alugada) → **P3** Cidade (seletor) → **Resultado** (sistema ideal em kWp + economia por Copa) → **Nome + WhatsApp** → **"Lead capturado!"** → `obrigado.html` (resultado liberado + botão WhatsApp da loja certa).

## Roteamento por loja (raio ~80km)
A cidade escolhida na P3 define a loja e o WhatsApp:
- **Londrina (PR)** → `55 43 9912-4301`
- **Cascavel (PR)** → `55 45 9985-2431`
- **Foz do Iguaçu (PR)** → `55 45 9144-1136`

## Cálculo (Paraná)
- `consumo (kWh/mês) = conta ÷ TARIFA_KWH` (TARIFA_KWH = **R$ 0,95**)
- `potência (kWp) = consumo ÷ GERACAO_KWP_MES` (GERACAO_KWP_MES = **120** kWh/kWp·mês)
- `nº de placas = kWp ÷ POT_PLACA_KW` (POT_PLACA_KW = **0,57** kWp, ~570 Wp)
- `economia/ano = consumo × tarifa × 90%` · `economia/Copa = economia/ano × 4 (4 anos)`
- Faixa de conta → base: R$300→300 · R$600→600 · +R$900→1100.
- **Todas as constantes ficam no topo do `<script>` do `index.html`** — fácil de ajustar.

## Config (no `<script>` do index.html)
- `WEBHOOK` — n8n da agência (fixo).
- `SHEET_BACKUP` — **TODO**: colar a URL `/exec` do Apps Script da planilha Sunfalls.
- `PAGINA = 'quiz-sunfalls'` · `CLICKUP_CLIENT_ID = '86afxmfhc'`.
- `WHATS_LOJA` — números por loja (Londrina/Cascavel/Foz).
- `REDIRECT_OBRIGADO = 'obrigado.html'`.
- **GTM**: snippet comentado com `GTM-XXXXXXX` — trocar pelo container da Sunfalls quando tiver.

## Arquivos
- `index.html` — o quiz.
- `obrigado.html` — página de resultado/agradecimento (lê o resultado via `localStorage` e monta o WhatsApp da loja).
- `assets/logo-sunfalls-branca.png` — logo tratada (branca/transparente pro tema escuro).
- `APPS_SCRIPT_PLANILHA.gs` — **interno, não entra no ZIP**. Cole na planilha Sunfalls e publique como App da Web pra gerar a URL `/exec`.

## Deploy
Single-file, sem build. Subir `index.html`, `obrigado.html` e `assets/` na raiz do domínio (precisa de **HTTPS**). GitHub Pages é só pra preview/aprovação.
