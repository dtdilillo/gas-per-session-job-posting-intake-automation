function generateDocumentsFromTimestamps() {
  // ======== CONFIGURATION ========
  const TEMPLATE_DOC_ID = 'YOUR_TEMPLATE_DOC_ID';
  const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
  const STARTING_REF_NUMBER = 1;
  const DATE_POSTED = 'YYYY-MM-DD';
  const DEADLINE = 'YYYY-MM-DD';
  const OUTPUT_FOLDER_NAME = 'Finalized Requests';

  // Copy timestamp(s) from sheet, exactly, here (one per line)
  const TIMESTAMPS_RAW = `
YYYY-MM-DD HH:MM:SS
  `;

  const TIMESTAMPS = TIMESTAMPS_RAW.split('\n').map(x => x.trim()).filter(x => x);
  const perSessionFolders = DriveApp.getFoldersByName('Posting Requests (local)');
  if (!perSessionFolders.hasNext()) throw new Error('Posting Requests (local) folder not found');
  const perSessionFolder = perSessionFolders.next();
  const templateFile = DriveApp.getFileById(TEMPLATE_DOC_ID);
  const outputFolders = perSessionFolder.getFoldersByName(OUTPUT_FOLDER_NAME);
  const outputFolder = outputFolders.hasNext() ? outputFolders.next() : perSessionFolder.createFolder(OUTPUT_FOLDER_NAME);

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheets()[0];
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const timestampColIndex = headers.indexOf('Timestamp');
  if (timestampColIndex === -1) throw new Error('Timestamp column not found: ' + headers.join(', '));

  let refNumber = STARTING_REF_NUMBER;
  for (let i = 0; i < TIMESTAMPS.length; i++) {
    const targetTimestamp = TIMESTAMPS[i];
    let rowData = null;
    let rowIndex = -1;
    let targetDate = new Date(targetTimestamp.replace(/-/g, '/'));
    for (let r = 1; r < data.length; r++) {
      let rowTimestamp = data[r][timestampColIndex];
      let rowTimestampDate;
      if (rowTimestamp instanceof Date) {
        rowTimestampDate = rowTimestamp;
      } else if (typeof rowTimestamp === 'string') {
        rowTimestampDate = new Date(rowTimestamp.replace(/-/g, '/'));
      }
      let diff = Math.abs(rowTimestampDate - targetDate);
      Logger.log("Comparing row " + r + ": [" + rowTimestampDate + "] to [" + targetDate + "] diff: " + diff + ' ms');
      if (diff <= 60 * 1000) {
        rowData = data[r];
        rowIndex = r + 1;
        break;
      }
    }
    if (!rowData) {
      Logger.log('No match: ' + targetTimestamp);
      continue;
    }

    // ====== DATA MAPPING ======
    const formData = {};
    for (let col = 0; col < headers.length; col++) {
      const key = headers[col].toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
      formData[key] = rowData[col] || '';
    }
    const refNumberPadded = String(refNumber).padStart(4, '0');
    const docName = `REF-${refNumberPadded}-FY-SAMPLE`;
    formData['ref_number'] = refNumberPadded;
    formData['date_posted'] = DATE_POSTED;
    formData['deadline'] = DEADLINE;

    // ====== DOC CREATION & REPLACEMENT ======
    const newFile = templateFile.makeCopy(docName, outputFolder);
    const docId = newFile.getId();
    const doc = DocumentApp.openById(docId);
    const body = doc.getBody();

    for (const key in formData) {
      body.replaceText('\\{\\{' + key + '\\}\\}', formData[key]);
    }
    if (!formData['pay_designation']) {
      body.replaceText('\\{\\{pay_designation\\}\\}', formData['uft_csa_pay_designation'] || formData['dc_37_pay_designation'] || '');
    }
    doc.saveAndClose();

    // ====== EXPORT DOCX ONLY via UrlFetchApp ======
    var docxFile = exportGoogleDoc(docId, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', docName + '.docx', outputFolder);

    // Optionally, trash temp Google Doc
    DriveApp.getFileById(docId).setTrashed(true);

    // ====== WRITE LINK TO SHEET ======
    sheet.getRange(rowIndex, headers.length + 1).setValue(docxFile.getUrl());

    Logger.log(`✓ Generated: ${docxFile.getName()} for ${targetTimestamp}`);
    refNumber++;
  }
  Logger.log('All done! Check "Finalized Requests" for DOCX files.');
}

// ------------ Helper Function ---------------

function exportGoogleDoc(docId, mimeType, fileName, outputFolder) {
  var token = ScriptApp.getOAuthToken();
  var url = 'https://www.googleapis.com/drive/v3/files/' + docId + '/export?mimeType=' + encodeURIComponent(mimeType);
  var response = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: { Authorization: 'Bearer ' + token },
    muteHttpExceptions: true
  });
  var blob = response.getBlob().setName(fileName);
  return outputFolder.createFile(blob);
}
