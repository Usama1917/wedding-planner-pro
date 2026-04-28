const SHEET_NAME = 'RSVP';
const HEADERS = [
  'Submitted At',
  'Name',
  'Message',
  'Language',
  'Page URL',
  'User Agent',
];

function doPost(e) {
  const sheet = getSheet_();
  ensureHeaders_(sheet);

  const payload = parsePayload_(e);

  sheet.appendRow([
    payload.submittedAt ? new Date(payload.submittedAt) : new Date(),
    payload.name || '',
    payload.message || '',
    payload.language || '',
    payload.pageUrl || '',
    payload.userAgent || '',
  ]);

  return json_({ ok: true });
}

function doGet() {
  return json_({ ok: true, service: 'rsvp-google-sheets-webhook' });
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  return sheet;
}

function ensureHeaders_(sheet) {
  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const hasHeaders = firstRow.some(Boolean);

  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return {};
  }

  try {
    return JSON.parse(e.postData.contents);
  } catch (error) {
    return {};
  }
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
