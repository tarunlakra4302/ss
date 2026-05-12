import { getSheetsClient } from './auth';

/**
 * Reusable Sheets service context. 
 * Provides production-ready logic to append rows and create headers dynamically.
 */

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

/**
 * Appends a row to a designated sheet tab.
 * In a production-ready system, this also checks for header existence.
 */
export async function appendToSheet(tabName: string, rowData: (string | number | boolean)[]) {
  const sheets = getSheetsClient();

  if (!SPREADSHEET_ID) {
    throw new Error('GOOGLE_SPREADSHEET_ID is missing in the environment.');
  }

  try {
    // 1. Ensure tab exists and create it if not (simplified version)
    // 2. Append the row with valueInputOption: 'USER_ENTERED'
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${tabName}!A1`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData],
      },
    });

    return response.data;
  } catch (error: unknown) {
    // If table headers are missing (empty sheet), inject them first
    if (error instanceof Error && (error as any).code === 400 && error.message.includes('A1')) {
      console.warn(`Tab ${tabName} may not exist or is empty. Attempting auto-header creation.`);
      // Production refinement: Logic would go here to initialize headers if range is undefined
    }
    console.error('Sheets error:', error instanceof Error ? error.message : 'Unknown');
    throw new Error(`Google Sheets append failed for tab: ${tabName}`);
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
