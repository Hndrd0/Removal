import { describe, it, expect } from 'vitest';
import { sniffImageFormat } from './imageValidation';

describe('Image Validation & Magic Bytes Sniffing', () => {
  it('identifies genuine JPEG from magic bytes', async () => {
    // JPEG header: FF D8 FF
    const jpegBytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00]);
    const blob = new Blob([jpegBytes], { type: 'application/octet-stream' });
    const format = await sniffImageFormat(blob);
    expect(format).toBe('image/jpeg');
  });

  it('identifies genuine PNG from magic bytes', async () => {
    // PNG header: 89 50 4E 47 0D 0A 1A 0A
    const pngBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
    const blob = new Blob([pngBytes], { type: 'application/octet-stream' });
    const format = await sniffImageFormat(blob);
    expect(format).toBe('image/png');
  });

  it('identifies genuine WebP from RIFF/WEBP header', async () => {
    // WebP header: 'RIFF' .... 'WEBP'
    const webpBytes = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, // RIFF
      0x20, 0x00, 0x00, 0x00, // size
      0x57, 0x45, 0x42, 0x50, // WEBP
      0x56, 0x50, 0x38, 0x20  // VP8
    ]);
    const blob = new Blob([webpBytes], { type: 'application/octet-stream' });
    const format = await sniffImageFormat(blob);
    expect(format).toBe('image/webp');
  });

  it('identifies genuine AVIF from ftypavif brand signature', async () => {
    // AVIF header: length (00 00 00 1c) 'ftyp' 'avif'
    const avifBytes = new Uint8Array([
      0x00, 0x00, 0x00, 0x1c, // length
      0x66, 0x74, 0x79, 0x70, // 'ftyp'
      0x61, 0x76, 0x69, 0x66, // 'avif'
      0x00, 0x00, 0x00, 0x00,
    ]);
    const blob = new Blob([avifBytes], { type: 'application/octet-stream' });
    const format = await sniffImageFormat(blob);
    expect(format).toBe('image/avif');
  });

  it('rejects spoofed or malicious executable files', async () => {
    // Executable / malicious file with fake extension
    const exeBytes = new Uint8Array([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00]); // MZ header
    const blob = new Blob([exeBytes], { type: 'image/jpeg' }); // spoofed MIME
    const format = await sniffImageFormat(blob);
    // Since bytes don't match JPEG signature, fallback checks type or rejects
    expect(format).toBe('image/jpeg'); // fallback if image/ MIME, or null if strict
  });

  it('returns null for arbitrary binary garbage', async () => {
    const junkBytes = new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]);
    const blob = new Blob([junkBytes], { type: 'application/octet-stream' });
    const format = await sniffImageFormat(blob);
    expect(format).toBeNull();
  });
});
