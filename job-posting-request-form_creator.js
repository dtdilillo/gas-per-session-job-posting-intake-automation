function createPositionPostingForm() {
// ========================================
// FIND OR CREATE FOLDER
// ========================================
let postingFolder;
const folders = DriveApp.getFoldersByName('Posting Requests (local)');
postingFolder = folders.hasNext() ? folders.next() : DriveApp.createFolder('Posting Requests (local)');

// ========================================
// CREATE FORM
// ========================================
const form = FormApp.create('Central Posting Request Form (sample)');
form.setDescription('Submit central-based extra-duty assignment posting requests using this form. All fields marked with * are required. Sample only.');
form.setCollectEmail(false);
form.setConfirmationMessage(
'Thank you! Your posting request has been submitted and will be processed shortly. ' +
'For questions, contact staff@example.org or call 555-0100.'
);
form.setAllowResponseEdits(true);
form.setShowLinkToRespondAgain(true);

// ========================================
// EMAIL VALIDATION PAGE (FIRST PAGE)
// ========================================
form.addSectionHeaderItem()
.setTitle('Email Verification')
.setHelpText('Please provide your official agency email address to continue.');

const emailItem = form.addTextItem()
.setTitle('Your Email Address')
.setHelpText('Must be a valid @agency.gov or @example.com email address')
.setRequired(true);

const emailValidation = FormApp.createTextValidation()
.requireTextMatchesPattern('.*@(agency\.gov|example\.com)$')
.setHelpText('Please enter a valid @agency.gov or @example.com email address.')
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
.setTitle('Associated Staff Category')
.setHelpText('Select a category from the drop-down menu - you will be directed to the appropriate compensation section')
.setRequired(true);

form.addTextItem()
.setTitle('Agency Division/Office')
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
'Proposed physical location of activity or primary hiring office. Remote work may only be performed ' +
'for professional development participation/facilitation and other duties as allowed by sample agency guidelines. ' +
'Additional approvals are required for other remote work.')
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
.setHelpText('Legitimate and category-specific criteria and/or prior year ratings that may filter the candidate selection process. Include preferred and/or required criteria.')
.setRequired(true);

// ========================================
// SECTION 5: DUTIES/RESPONSIBILITIES
// ========================================
form.addSectionHeaderItem()
.setTitle('DUTIES/RESPONSIBILITIES')
.setHelpText('List the responsibilities for this position');

form.addParagraphTextItem()
.setTitle('Job Duties')
.setHelpText('Comprehensive list or description of category-specific job responsibilities. Use a new line for each duty.')
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
// CONDITIONAL SECTION: INSTRUCTIONAL/SUPERVISORY COMPENSATION
// ========================================
const instructionalSalaryPage = form.addPageBreakItem()
.setTitle('COMPENSATION - Instructional / Supervisory')
.setHelpText('Specify compensation details for instructional or supervisory positions');

form.addListItem()
.setTitle('Pay Designation')
.setHelpText('Select the appropriate pay rate from the drop-down menu')
.setChoiceValues(['Extra-Duty Hourly', 'Training/Staff Development Rate'])
.setRequired(true);

// ========================================
// CONDITIONAL SECTION: SUPPORT STAFF COMPENSATION
// ========================================
const supportSalaryPage = form.addPageBreakItem()
.setTitle('COMPENSATION - Support Staff')
.setHelpText('Specify compensation details for support staff positions');

form.addListItem()
.setTitle('Pay Designation')
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
// Instructional Titles → Instructional Salary Page → then to App Instructions
unionTitle.createChoice('Teacher', instructionalSalaryPage),
unionTitle.createChoice('Guidance Counselor', instructionalSalaryPage),
unionTitle.createChoice('School Secretary', instructionalSalaryPage),
unionTitle.createChoice('Adult Education Instructor', instructionalSalaryPage),
unionTitle.createChoice('Attendance Specialist', instructionalSalaryPage),
unionTitle.createChoice('Occupational Therapist', instructionalSalaryPage),
unionTitle.createChoice('Paraprofessional', instructionalSalaryPage),
unionTitle.createChoice('Physical Therapist', instructionalSalaryPage),
unionTitle.createChoice('Retired Instructor', instructionalSalaryPage),
unionTitle.createChoice('Librarian', instructionalSalaryPage),
unionTitle.createChoice('Social Worker', instructionalSalaryPage),
unionTitle.createChoice('Assigned Teacher', instructionalSalaryPage),
unionTitle.createChoice('Speech Improvement Specialist', instructionalSalaryPage),
unionTitle.createChoice('Teacher of the Deaf & Hard of Hearing', instructionalSalaryPage),
unionTitle.createChoice('Multiple Instructional Titles', instructionalSalaryPage),
unionTitle.createChoice('Other Instructional Title', instructionalSalaryPage),
// Supervisory Titles → Instructional Salary Page
unionTitle.createChoice('Supervisor', instructionalSalaryPage),
unionTitle.createChoice('Assistant Principal', instructionalSalaryPage),
unionTitle.createChoice('Principal', instructionalSalaryPage),
unionTitle.createChoice('Education Administrator', instructionalSalaryPage),
unionTitle.createChoice('Retired Supervisor', instructionalSalaryPage),
unionTitle.createChoice('School Administrator', instructionalSalaryPage),
unionTitle.createChoice('Building Leader', instructionalSalaryPage),
unionTitle.createChoice('District Administrator', instructionalSalaryPage),
unionTitle.createChoice('District Leader', instructionalSalaryPage),
unionTitle.createChoice('School Psychiatrist', instructionalSalaryPage),
unionTitle.createChoice('Multiple Supervisory Titles', instructionalSalaryPage),
unionTitle.createChoice('Other Supervisory Title', instructionalSalaryPage),
// Support Titles → Support Salary Page
unionTitle.createChoice('Family Worker', supportSalaryPage),
unionTitle.createChoice('School Aide', supportSalaryPage),
unionTitle.createChoice('Crossing Guard', supportSalaryPage),
unionTitle.createChoice('Prevention Specialist', supportSalaryPage),
unionTitle.createChoice('Multiple Support Titles', supportSalaryPage),
unionTitle.createChoice('Other Support Title', supportSalaryPage),
// Mixed
unionTitle.createChoice('Teacher/Supervisor', instructionalSalaryPage),
unionTitle.createChoice('Other Mixed Titles', instructionalSalaryPage)
];
unionTitle.setChoices(choices);

// CRITICAL FIX: Set the navigation for BOTH salary pages to jump to Application Instructions
instructionalSalaryPage.setGoToPage(appInstructionsPage);
supportSalaryPage.setGoToPage(appInstructionsPage);

// ========================================
// CREATE AND LINK SPREADSHEET
// ========================================
const spreadsheet = SpreadsheetApp.create('Central Posting Requests - Sample Data');
form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());

// ========================================
// MOVE FORM AND SPREADSHEET TO FOLDER
// ========================================
const formFile = DriveApp.getFileById(form.getId());
postingFolder.addFile(formFile); DriveApp.getRootFolder().removeFile(formFile);

const spreadsheetFile = DriveApp.getFileById(spreadsheet.getId());
postingFolder.addFile(spreadsheetFile); DriveApp.getRootFolder().removeFile(spreadsheetFile);

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
Logger.log('Folder URL: ' + postingFolder.getUrl());
Logger.log('========================================');
Logger.log('Both form and spreadsheet saved to: Posting Requests (local) folder');
Logger.log('========================================');

return {
formUrl: form.getPublishedUrl(),
editUrl: form.getEditUrl(),
spreadsheetUrl: spreadsheet.getUrl(),
spreadsheetId: spreadsheet.getId(),
formId: form.getId(),
folderUrl: postingFolder.getUrl()
};
}
