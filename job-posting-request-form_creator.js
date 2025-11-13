function createPositionPostingForm() {
// ========================================
// FIND OR CREATE FOLDER
// ========================================
let perSessionFolder;
const folders = DriveApp.getFoldersByName('Per Session Job Postings');
perSessionFolder = folders.hasNext() ? folders.next() : DriveApp.createFolder('Per Session Job Postings');

// ========================================
// CREATE FORM
// ========================================
const form = FormApp.create('NYCPS Central-Based Per Session Job Posting Requests');
form.setDescription('Submit central-based per session position posting requests using this form. All fields marked with * are required.');
form.setCollectEmail(false);
form.setConfirmationMessage(
'Thank you! Your per session posting request has been submitted and will be processed shortly. ' +
'For questions, contact PerSessionStaff@schools.nyc.gov or call 718-935-4075.'
);
form.setAllowResponseEdits(true);
form.setShowLinkToRespondAgain(true);

// ========================================
// EMAIL VALIDATION PAGE (FIRST PAGE)
// ========================================
form.addSectionHeaderItem()
.setTitle('Email Verification')
.setHelpText('Please provide your official NYCPS or UFT email address to continue.');

const emailItem = form.addTextItem()
.setTitle('Your Email Address')
.setHelpText('Must be a valid @schools.nyc.gov or @uft.org email address')
.setRequired(true);

const emailValidation = FormApp.createTextValidation()
.requireTextMatchesPattern('.*@(schools\.nyc\.gov|uft\.org)$')
.setHelpText('Please enter a valid @schools.nyc.gov or @uft.org email address.')
.build();
emailItem.setValidation(emailValidation);

form.addTextItem()
.setTitle('Your Full Name')
.setHelpText('First and last name of the person submitting this request')
.setRequired(true);

form.addPageBreakItem()
.setTitle('Position Details')
.setHelpText('Now that your information is verified, please complete the position posting request.');

// ========================================
// SECTION 1: POSITION
// ========================================
form.addSectionHeaderItem()
.setTitle('POSITION')
.setHelpText('Provide basic information about the position');

form.addTextItem()
.setTitle('Position Name')
.setHelpText('Include the unique name of the advertised position')
.setRequired(true);

form.addTextItem()
.setTitle('Approx. Number of Positions Available')
.setHelpText('Enter an approximate number of positions or a number range, or enter "TBD"')
.setRequired(true);

const unionTitle = form.addMultipleChoiceItem()
.setTitle('Associated Union Title')
.setHelpText('Select a title from drop-down menu - you will be directed to the appropriate salary section')
.setRequired(true);

form.addTextItem()
.setTitle('NYCPS Division/Office')
.setHelpText('Include the full official name of the primary division and/or office requesting this position')
.setRequired(true);

form.addParagraphTextItem()
.setTitle('Additional Description')
.setHelpText('Provide any other relevant background on the position.')
.setRequired(false);

// ========================================
// SECTION 2: LOCATION
// ========================================
form.addSectionHeaderItem()
.setTitle('LOCATION')
.setHelpText('Specify where the work will be performed');

form.addParagraphTextItem()
.setTitle('Location')
.setHelpText(
'Proposed physical location of activity or primary hiring office. Remote per session work may only be performed ' +
'for professional development participation/facilitation and other duties as allowed by C-175 regulations and current DHR guidelines. ' +
'Additional Superintendent and DHR approvals are required for other remote work.')
.setRequired(true);

// ========================================
// SECTION 3: ELIGIBILITY REQUIREMENTS
// ========================================
form.addSectionHeaderItem()
.setTitle('ELIGIBILITY REQUIREMENTS')
.setHelpText('Specify minimum qualifications and requirements');

form.addParagraphTextItem()
.setTitle('Eligibility')
.setHelpText('Minimum eligibility, title descriptions, and title-specific qualifications or certification(s) sought')
.setRequired(true);

// ========================================
// SECTION 4: SELECTION CRITERIA
// ========================================
form.addSectionHeaderItem()
.setTitle('SELECTION CRITERIA')
.setHelpText('Describe criteria for candidate selection');

form.addParagraphTextItem()
.setTitle('Criteria')
.setHelpText('Legitimate and title-specific criteria and/or prior year ratings that may filter the candidate selection process. Include preferred and/or required criteria.')
.setRequired(true);

// ========================================
// SECTION 5: DUTIES/RESPONSIBILITIES
// ========================================
form.addSectionHeaderItem()
.setTitle('DUTIES/RESPONSIBILITIES')
.setHelpText('List the responsibilities for this position');

form.addParagraphTextItem()
.setTitle('Job Duties')
.setHelpText('Comprehensive list or description of title-specific job responsibilities. Use a new line for each duty.')
.setRequired(true);

// ========================================
// SECTION 6: WORK SCHEDULE
// ========================================
form.addSectionHeaderItem()
.setTitle('WORK SCHEDULE')
.setHelpText('Provide schedule and timing details');

form.addParagraphTextItem()
.setTitle('Schedule')
.setHelpText('Estimated days, times, and the number of total hours of the position. Work cannot start before the application deadline.')
.setRequired(true);

form.addListItem()
.setTitle('Proposed Work Season')
.setHelpText('Select Summer, Summer/Fall, Fall, School Year, or Spring from drop-down menu')
.setChoiceValues(['School Year', 'Summer', 'Summer/Fall', 'Fall', 'Spring'])
.setRequired(true);

// ========================================
// CONDITIONAL SECTION: UFT/CSA SALARY
// ========================================
const uftCsaSalaryPage = form.addPageBreakItem()
.setTitle('SALARY - UFT/CSA')
.setHelpText('Specify compensation details for UFT/CSA positions');

form.addListItem()
.setTitle('UFT/CSA Pay Designation')
.setHelpText('Select the appropriate pay rate from the drop-down menu')
.setChoiceValues(['Per Session', 'Training/Staff Development Rate'])
.setRequired(true);

// ========================================
// CONDITIONAL SECTION: DC 37 SALARY
// ========================================
const dc37SalaryPage = form.addPageBreakItem()
.setTitle('SALARY - DC 37')
.setHelpText('Specify compensation details for DC 37 positions');

form.addListItem()
.setTitle('DC 37 Pay Designation')
.setHelpText('Select the appropriate pay rate from the drop-down menu')
.setChoiceValues(['Extra Hours', 'Training/Staff Development Rate'])
.setRequired(true);

// ========================================
// APPLICATION INSTRUCTIONS SECTION
// ========================================
const appInstructionsPage = form.addPageBreakItem()
.setTitle('APPLICATION INSTRUCTIONS')
.setHelpText('Provide details on how candidates should apply for this opportunity.');

form.addParagraphTextItem()
.setTitle('Application Process')
.setHelpText(
'One of the following methods will be provided with additional details if necessary: ' +
'(1) Valid email address to which digital materials will be sent, ' +
'(2) Full URL of an online application portal with instructions, or ' +
'(3) Full mailing address for an application package.'
)
.setRequired(true);

form.addTextItem()
.setTitle('Supervisor of this Position')
.setHelpText('Include the name(s)/title(s) of the proposed primary work supervisor or supervisory team')
.setRequired(true);

form.addTextItem()
.setTitle('Activity Contact Email')
.setHelpText('Best email address contact for inquiries regarding this opportunity')
.setValidation(FormApp.createTextValidation()
.requireTextIsEmail()
.build())
.setRequired(true);

// ========================================
// SET UP CONDITIONAL NAVIGATION
// ========================================
const choices = [
// UFT Titles → UFT/CSA Salary Page → then to App Instructions
unionTitle.createChoice('Teacher - UFT', uftCsaSalaryPage),
unionTitle.createChoice('Guidance Counselor - UFT', uftCsaSalaryPage),
unionTitle.createChoice('School Secretary - UFT', uftCsaSalaryPage),
unionTitle.createChoice('Adult Education Teacher - UFT', uftCsaSalaryPage),
unionTitle.createChoice('Attendance Teacher - UFT', uftCsaSalaryPage),
unionTitle.createChoice('Occupational Therapist - UFT', uftCsaSalaryPage),
unionTitle.createChoice('Paraprofessional - UFT', uftCsaSalaryPage),
unionTitle.createChoice('Physical Therapist - UFT', uftCsaSalaryPage),
unionTitle.createChoice('Retired Teacher - UFT', uftCsaSalaryPage),
unionTitle.createChoice('School Librarian - UFT', uftCsaSalaryPage),
unionTitle.createChoice('School Social Worker - UFT', uftCsaSalaryPage),
unionTitle.createChoice('Teacher Assigned - UFT', uftCsaSalaryPage),
unionTitle.createChoice('Teacher of Speech Improvement - UFT', uftCsaSalaryPage),
unionTitle.createChoice('Teacher of the Deaf & Hard of Hearing - UFT', uftCsaSalaryPage),
unionTitle.createChoice('Multiple UFT Titles', uftCsaSalaryPage),
unionTitle.createChoice('Other UFT Title', uftCsaSalaryPage),
// CSA Titles → UFT/CSA Salary Page → then to App Instructions
unionTitle.createChoice('Supervisor - CSA', uftCsaSalaryPage),
unionTitle.createChoice('Assistant Principal - CSA', uftCsaSalaryPage),
unionTitle.createChoice('Principal - CSA', uftCsaSalaryPage),
unionTitle.createChoice('Education Administrator - CSA', uftCsaSalaryPage),
unionTitle.createChoice('Retired Supervisor - CSA', uftCsaSalaryPage),
unionTitle.createChoice('School Administrator and Supervisor (SAS) - CSA', uftCsaSalaryPage),
unionTitle.createChoice('School Building Leader (SBL) - CSA', uftCsaSalaryPage),
unionTitle.createChoice('School District Administrator (SDA) - CSA', uftCsaSalaryPage),
unionTitle.createChoice('School District Leader (SDL) - CSA', uftCsaSalaryPage),
unionTitle.createChoice('School Psychiatrist - CSA', uftCsaSalaryPage),
unionTitle.createChoice('Multiple CSA Titles', uftCsaSalaryPage),
unionTitle.createChoice('Other CSA Title', uftCsaSalaryPage),
// DC 37 Titles → DC 37 Salary Page → then to App Instructions
unionTitle.createChoice('Family Worker - DC 37', dc37SalaryPage),
unionTitle.createChoice('School Aide - DC 37', dc37SalaryPage),
unionTitle.createChoice('School Crossing Guard - DC 37', dc37SalaryPage),
unionTitle.createChoice('Substance Abuse Prevention and Intervention Specialist (SAPIS) - DC 37', dc37SalaryPage),
unionTitle.createChoice('Multiple DC 37 Titles', dc37SalaryPage),
unionTitle.createChoice('Other DC 37 Title', dc37SalaryPage),
// Mixed Titles → UFT/CSA Salary Page
unionTitle.createChoice('Teacher/Supervisor - UFT/CSA', uftCsaSalaryPage),
unionTitle.createChoice('Other UFT/CSA Titles', uftCsaSalaryPage)
];
unionTitle.setChoices(choices);

// CRITICAL FIX: Set the navigation for BOTH salary pages to jump to Application Instructions
uftCsaSalaryPage.setGoToPage(appInstructionsPage);
dc37SalaryPage.setGoToPage(appInstructionsPage);

// ========================================
// CREATE AND LINK SPREADSHEET
// ========================================
const spreadsheet = SpreadsheetApp.create('NYCPS Central-Based Per Session Job Posting Submissions - Master Data');
form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());

// ========================================
// MOVE FORM AND SPREADSHEET TO FOLDER
// ========================================
const formFile = DriveApp.getFileById(form.getId());
perSessionFolder.addFile(formFile); DriveApp.getRootFolder().removeFile(formFile);

const spreadsheetFile = DriveApp.getFileById(spreadsheet.getId());
perSessionFolder.addFile(spreadsheetFile); DriveApp.getRootFolder().removeFile(spreadsheetFile);

// ========================================
// LOG URLS FOR REFERENCE
// ========================================
Logger.log('========================================');
Logger.log('FORM CREATED SUCCESSFULLY!');
Logger.log('========================================');
Logger.log('Form URL (share with users): ' + form.getPublishedUrl());
Logger.log('Form Edit URL (for you): ' + form.getEditUrl());
Logger.log('Spreadsheet URL: ' + spreadsheet.getUrl());
Logger.log('Spreadsheet ID (save this): ' + spreadsheet.getId());
Logger.log('Form ID (save this): ' + form.getId());
Logger.log('Folder URL: ' + perSessionFolder.getUrl());
Logger.log('========================================');
Logger.log('Both form and spreadsheet saved to: Per Session Job Postings folder');
Logger.log('========================================');

return {
formUrl: form.getPublishedUrl(),
editUrl: form.getEditUrl(),
spreadsheetUrl: spreadsheet.getUrl(),
spreadsheetId: spreadsheet.getId(),
formId: form.getId(),
folderUrl: perSessionFolder.getUrl()
};
}