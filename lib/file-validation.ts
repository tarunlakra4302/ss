export interface FileValidationResult {
  valid: boolean;
  mimeType?: string;
  error?: string;
}

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Inspects buffer initial magic bytes to strictly verify genuine image files.
 * Protects against extension spoofing, SVG script injection, and arbitrary payload upload.
 * Strictly permits only: PNG, JPEG, WEBP.
 * Rejects: SVG, HTML, scripts, binaries.
 */
export function validateFileMagicBytes(
  buffer: Buffer,
  maxSizeBytes: number = MAX_FILE_SIZE_BYTES
): FileValidationResult {
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: 'File payload is empty.' };
  }

  if (buffer.length > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed limit of ${maxSizeBytes / (1024 * 1024)}MB.`,
    };
  }

  // PNG: 89 50 4E 47
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { valid: true, mimeType: 'image/png' };
  }

  // JPEG: FF D8 FF
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return { valid: true, mimeType: 'image/jpeg' };
  }

  // WEBP: RIFF (bytes 0-3) + WEBP (bytes 8-11)
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { valid: true, mimeType: 'image/webp' };
  }

  return {
    valid: false,
    error: 'Invalid file signature. Only genuine PNG, JPEG, and WEBP images are permitted.',
  };
}

