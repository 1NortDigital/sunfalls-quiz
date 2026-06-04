/**
 * Sunfalls — Quiz da Copa da Economia → grava os leads na planilha própria da Sunfalls.
 *
 * O quiz já manda um resumo completo no campo `mensagem`, mas este script também
 * distribui as respostas em COLUNAS separadas (loja, casa_propria, sistema_ideal,
 * potencia_kwp, placas, consumo_kwh, economia_4anos). O cabeçalho é adaptativo:
 * colunas novas entram no fim sem bagunçar dados antigos.
 *
 * COMO PUBLICAR (gera a URL /exec que vai no SHEET_BACKUP do index.html):
 * 1. Abra a planilha → Extensões → Apps Script. Apague o conteúdo e cole tudo isto. Salve.
 * 2. Implantar → Nova implantação → Tipo: App da Web.
 * 3. Executar como: Eu (sua conta) · Quem pode acessar: Qualquer pessoa. Implantar.
 * 4. Autorize o acesso quando pedir. Copie a URL /exec e me mande pra eu colar no quiz.
 *    (Pra atualizar depois SEM trocar a URL: Gerenciar implantações → Editar → Nova versão.)
 */

var SHEET_ID = '1dAEEWx9k4kmSbZ9IGmH-twkgSIDuO1RnqZ_7CEyCgLk'; // planilha Sunfalls
var SHEET_NAME = 'Leads';

// Cabeçalho padrão (inclui os campos do quiz: dimensionamento + economia).
var DEFAULT_HEADERS = [
  'recebido_em','form_type','pagina','nome','telefone','email',
  'cidade','conta_mensal','casa_propria','loja',
  'sistema_ideal','potencia_kwp','placas','consumo_kwh','economia_4anos','mensagem',
  'utm_source','utm_medium','utm_campaign','utm_content','utm_term',
  'gclid','fbclid','ip','page_url','page_referer','timestamp','landing_url','clickup_client_id'
];

function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(DEFAULT_HEADERS);
    }

    // Garante que todas as colunas desejadas existam (adiciona as faltantes no fim)
    var lastCol = sheet.getLastColumn();
    var header = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var faltam = DEFAULT_HEADERS.filter(function(h){ return header.indexOf(h) === -1; });
    if (faltam.length) {
      sheet.getRange(1, header.length + 1, 1, faltam.length).setValues([faltam]);
      header = header.concat(faltam);
    }

    var now = Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm:ss');

    var row = header.map(function(col) {
      if (col === 'recebido_em' || col === 'data_hora' || col === 'data') return now;
      if (col === 'timestamp') return data.timestamp || '';
      return (data[col] !== undefined && data[col] !== null) ? data[col] : '';
    });

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('Sunfalls Quiz OK');
}
