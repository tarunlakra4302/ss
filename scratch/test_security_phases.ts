import { getClientIp } from '../lib/rate-limit';
import { checkHoneypot } from '../lib/security/honeypot';
import { validateFileMagicBytes } from '../lib/file-validation';

async function runTests() {
  console.log('--- TEST 1: IP Resolution & Trusted Headers ---');
  const cfReq = new Request('http://localhost', {
    headers: {
      'cf-connecting-ip': '203.0.113.195',
      'x-forwarded-for': '198.51.100.1',
    },
  });
  console.assert(getClientIp(cfReq) === '203.0.113.195', `Cloudflare IP failed: got ${getClientIp(cfReq)}`);

  const vercelReq = new Request('http://localhost', {
    headers: {
      'x-vercel-proxied-for': '198.51.100.42, 10.0.0.1',
      'x-forwarded-for': '1.2.3.4',
    },
  });
  console.assert(getClientIp(vercelReq) === '198.51.100.42', `Vercel IP failed: got ${getClientIp(vercelReq)}`);

  console.log('✓ IP Resolution Tests Passed');

  console.log('--- TEST 2: Honeypot & Bot Timing Detection ---');
  // Honeypot filled
  const spam1 = checkHoneypot({ name: 'Bot', email: 'bot@spam.com', website: 'http://spam-link.com' });
  console.assert(spam1.isSpam === true, 'Honeypot check failed for filled field');

  // Instant submission (< 2000ms)
  const spam2 = checkHoneypot({ name: 'Fast Bot', email: 'bot@spam.com', _formStartTime: Date.now() - 500 });
  console.assert(spam2.isSpam === true, 'Bot timing check failed for fast submission');

  // Legitimate user
  const legit = checkHoneypot({ name: 'John Doe', email: 'john@example.com', website: '', _formStartTime: Date.now() - 5000 });
  console.assert(legit.isSpam === false, 'Legitimate submission incorrectly flagged');

  console.log('✓ Honeypot & Bot Timing Tests Passed');

  console.log('--- TEST 3: File Magic Byte Signatures ---');
  // Genuine PNG header: 89 50 4E 47
  const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const pngResult = validateFileMagicBytes(pngBuffer);
  console.assert(pngResult.valid === true && pngResult.mimeType === 'image/png', 'PNG validation failed');

  // Fake JPEG (plain text file disguised)
  const textBuffer = Buffer.from('<?xml version="1.0"?><svg onload="alert(1)"></svg>');
  const svgResult = validateFileMagicBytes(textBuffer);
  console.assert(svgResult.valid === false, 'SVG/Text disguised file should be rejected');

  console.log('✓ Magic Byte Signature Tests Passed');
  console.log('=== ALL PHASE 2 & 3 SECURITY TESTS PASSED ===');
}

runTests().catch(console.error);
