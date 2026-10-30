# Posting-intake automation (generic sample)

Google Apps Script prototypes that build a request form and turn spreadsheet rows into packet files.

Live Google Drive file IDs, mailbox addresses, and phone numbers are not in this copy. Replace the `YOUR_*` constants before running anything against your own Drive. All titles, domains, and process language have been genericized.

| Script | Purpose |
|---|---|
| [`job-posting-request-form_creator.js`](job-posting-request-form_creator.js) | Builds a Google Form and a destination spreadsheet |
| [`response-reader-docx_creator.js`](response-reader-docx_creator.js) | Matches rows by timestamp and writes a DOCX from a template |

**Stack:** Google Apps Script, Forms / Sheets / Docs / Drive

Set `TEMPLATE_DOC_ID` and `SPREADSHEET_ID` to IDs from *your* Drive.

Related: [power-platform-system-documentation-kit](https://github.com/dtdilillo/power-platform-system-documentation-kit)
