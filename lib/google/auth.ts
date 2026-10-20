import type { GoogleAuthCredentials } from '@/types/forms';

/**
 * Singleton Google Auth Client with Deferred/Lazy Loading.
 * Eliminates top-level parsing of the 60MB `googleapis` library on module load,
 * dropping serverless cold-start initialization time by hundreds of milliseconds.
 */

let authInstance: any = null;
let googleApi: typeof import('googleapis').google | null = null;

async function getGoogle() {
  if (!googleApi) {
    const { google } = await import('googleapis');
    googleApi = google;
  }
  return googleApi;
}

export const getGoogleAuth = async () => {
  if (authInstance) return authInstance;

  const client_email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  // Handle line breaks in the private key from .env.local
  const private_key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!client_email || !private_key) {
    throw new Error('Missing Google Auth environment variables.');
  }

  const google = await getGoogle();

  try {
    authInstance = new google.auth.JWT({
      email: client_email,
      key: private_key,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file'
      ],
    });
    return authInstance;
  } catch (error) {
    authInstance = null;
    console.error('Auth error:', error instanceof Error ? error.message : 'Unknown');
    throw new Error('Initialization of Google Auth failed.');
  }
};

/**
 * Convenience method to get a Sheets client instance
 */
export const getSheetsClient = async () => {
  const auth = await getGoogleAuth();
  const google = await getGoogle();
  return google.sheets({ version: 'v4', auth });
};

/**
 * Convenience method to get a Drive client instance
 */
export const getDriveClient = async () => {
  const auth = await getGoogleAuth();
  const google = await getGoogle();
  return google.drive({ version: 'v3', auth });
};
