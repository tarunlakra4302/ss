import { Readable } from 'stream';
import { getDriveClient } from './auth';

/**
 * Reusable Google Drive logic for handling file uploads (e.g. screenshots).
 * Accepts Buffer or ArrayBuffer, converts to a stream for uploading.
 */

const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

/**
 * Uploads a file buffer to a specific Google Drive folder.
 * Sets the file to be viewable by anyone with the link (configurable).
 */
export async function uploadToDrive(file: Buffer | ArrayBuffer, fileName: string, mimeType: string = 'image/png') {
  const drive = getDriveClient();

  if (!DRIVE_FOLDER_ID) {
    throw new Error('GOOGLE_DRIVE_FOLDER_ID is missing in the environment.');
  }

  // Convert Buffer or ArrayBuffer to a stream
  const buffer = Buffer.isBuffer(file) ? file : Buffer.from(file);
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  try {
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [DRIVE_FOLDER_ID],
      },
      media: {
        mimeType,
        body: stream,
      },
      fields: 'id, webViewLink',
    });

    const fileId = response.data.id;
    if (!fileId) throw new Error('Failed to get fileId from Drive upload response.');

    return {
      fileId,
      webViewLink: response.data.webViewLink,
    };
  } catch (error) {
    console.error('Drive error:', error instanceof Error ? error.message : 'Unknown');
    throw new Error(`Google Drive upload failed for file: ${fileName}`);
  }
}
