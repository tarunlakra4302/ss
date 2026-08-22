/**
 * Production Google Apps Script Web App for Sustainable Sundays
 * Spreadsheet ID: 1rYWS5HRvgyZZSc9pA-fpFRS5EDbpdy3WFTz63UbaXfI
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Spreadsheet (ID: 1rYWS5HRvgyZZSc9pA-fpFRS5EDbpdy3WFTz63UbaXfI).
 * 2. Click Extensions > Apps Script.
 * 3. Replace all existing code in Code.gs with this script.
 * 4. Click Deploy > New Deployment.
 *    - Select type: Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Click Deploy and copy the Web App URL into .env.local as GOOGLE_WEB_APP_URL (NOT NEXT_PUBLIC_).
 */

function doPost(e) {  
  try {    
    // 1. Open Spreadsheet by ID with fallback to Active Spreadsheet
    var SPREADSHEET_ID = "1rYWS5HRvgyZZSc9pA-fpFRS5EDbpdy3WFTz63UbaXfI";
    var ss;
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (openErr) {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    }

    if (!ss) {
      throw new Error("Could not access Google Spreadsheet with ID: " + SPREADSHEET_ID);
    }
    
    // 2. Parse incoming JSON payload
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Empty or invalid request payload.");
    }

    var data = JSON.parse(e.postData.contents);    
    var rawType = (data.formType || "event").toString().toLowerCase();
    var timestamp = data.donationTime || new Date().toLocaleString();  
    
    // Normalize names, emails, phones safely
    var fullName = (data.name || "").toString().trim();
    var firstName = (data.firstName || (fullName ? fullName.split(' ')[0] : "")).toString().trim();
    var lastName = (data.lastName || (fullName ? fullName.split(' ').slice(1).join(' ') : "")).toString().trim();
    var email = (data.email || data.donorEmail || "").toString().trim();
    var rawPhone = (data.phone || data.phoneNumber || data.donorPhone || "").toString().trim();
    var phone = formatPhone(rawPhone);
    var message = (data.message || data.reason || data.city || "").toString().trim();
    var amount = data.totalPaid || data.amount || 0;
    var quantity = data.participants || data.quantity || 1;

    // 3. Tab Routing & Append Data
    if (rawType === "member") {      
      var sheet = getOrCreateSheet(ss, "Member", ["Timestamp", "First Name", "Last Name", "Phone", "Email", "Message"]);
      sheet.appendRow([timestamp, firstName, lastName, phone, email, message]);    
    }     
    else if (rawType === "volunteering" || rawType === "volunteer") {      
      var sheet = getOrCreateSheet(ss, "Volunteering", ["Timestamp", "First Name", "Last Name", "Phone", "Email", "Message"]);      
      sheet.appendRow([timestamp, firstName, lastName, phone, email, message]);    
    }     
    else if (rawType === "donation") {      
      var donorName = data.donorName || (firstName + " " + lastName).trim() || fullName || "Anonymous Donor";
      var sheet = getOrCreateSheet(ss, "Donation", ["Timestamp", "Donor Name", "Amount", "Email", "Phone", "Donation Time / Note"]);      
      sheet.appendRow([timestamp, donorName, amount, email, phone, data.note || timestamp]);    
    }     
    else if (rawType === "event") {      
      var eventTitle = data.eventName || data.description || "General Admission";
      var sheet = getOrCreateSheet(ss, "EventRegistration", ["Timestamp", "Event Name", "First Name", "Last Name", "Phone", "Email", "Participants", "Total Paid"]);      
      sheet.appendRow([timestamp, eventTitle, firstName, lastName, phone, email, quantity, amount]);    
    }
    else if (rawType === "contact") {
      var sheet = getOrCreateSheet(ss, "Contacts", ["Timestamp", "First Name", "Last Name", "Phone", "Email", "Message"]);
      sheet.appendRow([timestamp, firstName, lastName, phone, email, message]);
    }     
    else {      
      return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: 'Invalid form type: ' + rawType }))        
        .setMimeType(ContentService.MimeType.JSON);    
    }  
    
    return ContentService.createTextOutput(JSON.stringify({ result: 'success', status: 'success', message: 'Row appended successfully to ' + rawType }))      
      .setMimeType(ContentService.MimeType.JSON);  
      
  } catch (error) {    
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', status: 'error', error: error.toString() }))      
      .setMimeType(ContentService.MimeType.JSON);  
  }
}

/**
 * Helper to retrieve sheet by primary name, fallback name, or create if missing.
 */
function getOrCreateSheet(ss, primaryName, defaultHeaders) {
  var sheet = ss.getSheetByName(primaryName);
  if (sheet) return sheet;

  // Check common alternate plural names
  var altName = primaryName + "s";
  sheet = ss.getSheetByName(altName);
  if (sheet) return sheet;

  if (primaryName === "Volunteering") {
    sheet = ss.getSheetByName("Volunteers") || ss.getSheetByName("Volunteer");
    if (sheet) return sheet;
  }
  if (primaryName === "EventRegistration") {
    sheet = ss.getSheetByName("Events") || ss.getSheetByName("Event");
    if (sheet) return sheet;
  }

  // Create new tab if it doesn't exist
  sheet = ss.insertSheet(primaryName);
  if (defaultHeaders && defaultHeaders.length > 0) {
    sheet.appendRow(defaultHeaders);
  }
  return sheet;
}

/**
 * Format phone string to +91-XXXXXXXXXX format
 */
function formatPhone(phoneStr) {
  if (!phoneStr) return "";
  var digits = phoneStr.toString().replace(/\D/g, "");
  var num = digits;
  if (digits.length === 12 && digits.indexOf("91") === 0) {
    num = digits.substring(2);
  } else if (digits.length === 11 && digits.indexOf("0") === 0) {
    num = digits.substring(1);
  } else if (digits.length > 10) {
    num = digits.slice(-10);
  }
  // Prepend single quote ' so Google Sheets treats +91-XXXXXXXXXX as text instead of formula =+91-XXXXXXXXXX
  return "'+91-" + num;
}

