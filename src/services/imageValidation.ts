import type { ImageMetadata } from '../types';

export interface ValidationResult {
  valid: boolean;
  error?: string;
  metadata?: ImageMetadata;
  imageElement?: HTMLImageElement;
}

const MAX_FILE_SIZE_BYTES = 35 * 1024 * 1024; // 35 MB
const MAX_IMAGE_PIXELS = 45_000_000; // 45 Megapixels (e.g. 7500 x 6000)

/**
 * Sniffs the file magic bytes to verify genuine image type regardless of extension
 */
export async function sniffImageFormat(file: File | Blob): Promise<string | null> {
  const buffer = await file.slice(0, 16).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return 'image/png';
  }

  // WebP: 'RIFF' .... 'WEBP'
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'image/webp';
  }

  // AVIF / HEIC container check: bytes 4-8 'ftyp'
  if (
    bytes.length >= 12 &&
    bytes[4] === 0x66 &&
    bytes[5] === 0x74 &&
    bytes[6] === 0x79 &&
    bytes[7] === 0x70
  ) {
    const brand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
    if (brand === 'avif' || brand === 'avis') {
      return 'image/avif';
    }
    return 'image/heif-avif';
  }

  // Fallback to file.type if standard image
  if (file.type && file.type.startsWith('image/')) {
    return file.type;
  }

  return null;
}

/**
 * Validates input file, handles decompression bomb checks, and extracts dimensions
 */
export async function validateAndLoadImage(file: File): Promise<ValidationResult> {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  // 1. File size check
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${sizeMb} MB). Maximum supported size is 35 MB to ensure smooth client-side memory handling.`,
    };
  }

  // 2. Magic bytes sniff
  const detectedType = await sniffImageFormat(file);
  if (!detectedType) {
    return {
      valid: false,
      error: 'Unsupported or corrupted image format. Please upload a standard JPG, PNG, WebP, or AVIF file.',
    };
  }

  // 3. Load image into memory to verify decodability and dimensions
  let objectUrl: string | null = null;
  try {
    objectUrl = URL.createObjectURL(file);
    const img = new Image();

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to decode image data.'));
      img.src = objectUrl!;
    });

    const totalPixels = img.naturalWidth * img.naturalHeight;
    if (totalPixels > MAX_IMAGE_PIXELS) {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      return {
        valid: false,
        error: `Image dimensions (${img.naturalWidth}x${img.naturalHeight} = ${(totalPixels / 1_000_000).toFixed(1)}MP) exceed the browser memory safety threshold of 45 Megapixels. Please resize slightly.`,
      };
    }

    if (img.naturalWidth < 10 || img.naturalHeight < 10) {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      return {
        valid: false,
        error: 'Image dimensions are too small (minimum 10x10 pixels).',
      };
    }

    const metadata: ImageMetadata = {
      name: file.name,
      width: img.naturalWidth,
      height: img.naturalHeight,
      sizeBytes: file.size,
      type: detectedType,
      aspectRatio: img.naturalWidth / img.naturalHeight,
    };

    // Clean up temporary decoding URL
    if (objectUrl) URL.revokeObjectURL(objectUrl);

    return {
      valid: true,
      metadata,
      imageElement: img,
    };
  } catch (err: unknown) {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    const message = err instanceof Error ? err.message : 'Corrupted or unreadable image file.';
    return {
      valid: false,
      error: message,
    };
  }
}
