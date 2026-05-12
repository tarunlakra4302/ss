import { google } from 'googleapis';
import { GoogleAuthCredentials } from '@/types/forms';

/**
 * Singleton Google Auth Client.
 * Ensures only one instance of the auth object is created for the server lifecycle.
 * Securely handles line-break formatting in private keys from .env.local.
 */

let authInstance: InstanceType<typeof google.auth.JWT> | null = null;

export const getGoogleAuth = () => {
  if (authInstance) return authInstance;

  const client_email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  // Handle line breaks in the private key from .env.local
  const private_key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!client_email || !private_key) {
    throw new Error('Missing Google Auth environment variables.');
  }

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
export const getSheetsClient = () => {
  const auth = getGoogleAuth();
  return google.sheets({ version: 'v4', auth });
};

/**
 * Convenience method to get a Drive client instance
 */
export const getDriveClient = () => {
  const auth = getGoogleAuth();
  return google.drive({ version: 'v3', auth });
};
