import { getSheetsClient } from './auth';
import { submitToGoogleScript } from './script';

/**
 * Reusable Sheets service context. 
 * Provides production-ready logic to append rows and create headers dynamically.
 */

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

/**
 * Appends a row to a designated sheet tab.
 * Uses Google Sheets API v4 if Service Account credentials exist,
 * otherwise falls back to the Apps Script Web App endpoint.
 */
export async function appendToSheet(tabName: string, rowData: (string | number | boolean)[]) {
  const hasServiceAccount = Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    SPREADSHEET_ID
  );

  if (!hasServiceAccount) {
    console.log(
      `Service Account credentials not configured. Using Apps Script Web App for tab "${tabName}".`
    );
    
    const lowerTab = tabName.toLowerCase();
    const formType = lowerTab.includes('member') ? 'member'
      : lowerTab.includes('volunteer') ? 'volunteering'
      : lowerTab.includes('donat') ? 'donation'
      : lowerTab.includes('contact') ? 'contact'
      : 'event';

    const timestamp = rowData[0] ? String(rowData[0]) : new Date().toISOString();
    
    let payload: Record<string, any> = { formType, donationTime: timestamp };

    if (formType === 'event') {
      payload = {
        ...payload,
        name: rowData[1],
        email: rowData[2],
        phone: rowData[3],
        eventName: rowData[4],
        driveLink: rowData[5],
      };
    } else if (formType === 'member') {
      payload = {
        ...payload,
        name: rowData[1],
        email: rowData[2],
        phone: rowData[3],
        city: rowData[4],
        reason: rowData[5],
      };
    } else if (formType === 'volunteering') {
      payload = {
        ...payload,
        name: rowData[1],
        email: rowData[2],
        phone: rowData[3],
        expertise: rowData[4],
        availability: rowData[5],
        message: rowData[6],
      };
    } else if (formType === 'donation') {
      payload = {
        ...payload,
        donorName: rowData[1],
        donorEmail: rowData[2],
        donorPhone: rowData[3],
        amount: rowData[4],
        note: rowData[5],
      };
    }

    try {
      return await submitToGoogleScript(payload);
    } catch (fallbackError) {
      console.error(`Apps Script fallback failed for tab ${tabName}:`, fallbackError);
      throw new Error(`Google Sheets append failed for tab: ${tabName}`);
    }
  }

  try {
    const sheets = getSheetsClient();
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID!,
      range: `${tabName}!A1`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData],
      },
    });

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error && (error as any).code === 400 && error.message.includes('A1')) {
      console.warn(`Tab ${tabName} may not exist or is empty. Attempting auto-header creation.`);
    }
    console.error('Sheets error:', error instanceof Error ? error.message : 'Unknown');
    
    // Attempt fallback to Apps Script if API v4 throws
    try {
      console.warn(`Google Sheets API v4 failed. Attempting Apps Script fallback for ${tabName}.`);
      const formType = tabName.toLowerCase() === 'members' ? 'member'
        : tabName.toLowerCase() === 'volunteers' ? 'volunteering'
        : tabName.toLowerCase() === 'donations' ? 'donation'
        : 'event';
      return await submitToGoogleScript({ formType, rowData, donationTime: new Date().toLocaleString() });
    } catch {
      throw new Error(`Google Sheets append failed for tab: ${tabName}`);
    }
  }
}

/**
 * Utility: Initialize sheet with headers if completely empty
 */
export async function ensureSheetHeaders(tabName: string, headers: string[]) {
  const sheets = getSheetsClient();
  const range = `${tabName}!A1:Z1`;

  try {
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID!,
      range,
    });

    if (!existing.data.values || existing.data.values.length === 0) {
      console.log(`Initializing headers for ${tabName}`);
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID!,
        range: `${tabName}!A1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [headers],
        },
      });
    }
  } catch (error) {
    console.error(`Failed to ensure headers for ${tabName}:`, error);
  }
}
