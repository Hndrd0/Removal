/**
 * Client-Side Post-Processing Quality Pipeline for Alpha Matte & Transparent PNG
 * 
 * Implements:
 * 1. Halo Decontamination: Eliminates light/dark color bleed along semi-transparent boundaries.
 * 2. Edge-Aware Smoothing: Eliminates jagged pixel staircase without destroying fine hair.
 * 3. Morphological Cavity Filling: Fills small pinholes in the foreground mask.
 */

export interface PostProcessConfig {
  haloDecontamination?: boolean;
  edgeSmoothing?: boolean;
  morphologicalCleanup?: boolean;
}

/**
 * Applies edge-aware post-processing directly to Canvas ImageData
 */
export function refineImageData(
  imageData: ImageData,
  config: PostProcessConfig = {
    haloDecontamination: true,
    edgeSmoothing: true,
    morphologicalCleanup: true,
  }
): ImageData {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;

  // 1. Morphological Cavity Filling (Speckle / pinhole cleanup on alpha)
  if (config.morphologicalCleanup) {
    fillAlphaCavities(data, width, height);
  }

  // 2. Edge-Aware Smoothing on Alpha Channel
  if (config.edgeSmoothing) {
    smoothAlphaEdges(data, width, height);
  }

  // 3. Foreground Color Decontamination (Halo Suppression)
  if (config.haloDecontamination) {
    decontaminateHalos(data, width, height);
  }

  return imageData;
}

/**
 * Fills tiny 1-2 pixel holes inside solid foreground objects
 */
function fillAlphaCavities(data: Uint8ClampedArray, width: number, height: number): void {
  const alphaBuffer = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    alphaBuffer[i] = data[i * 4 + 3];
  }

  // Simple 3x3 majority vote for isolated dark pixels surrounded by solid foreground
  for (let y = 1; y < height - 1; y++) {
    const rowOffset = y * width;
    for (let x = 1; x < width - 1; x++) {
      const idx = rowOffset + x;
      const a = alphaBuffer[idx];
      
      // If pixel is semi-transparent or transparent but surrounded by solid foreground (> 220)
      if (a < 180) {
        let solidNeighbors = 0;
        if (alphaBuffer[idx - 1] > 220) solidNeighbors++;
        if (alphaBuffer[idx + 1] > 220) solidNeighbors++;
        if (alphaBuffer[idx - width] > 220) solidNeighbors++;
        if (alphaBuffer[idx + width] > 220) solidNeighbors++;
        if (alphaBuffer[idx - width - 1] > 220) solidNeighbors++;
        if (alphaBuffer[idx - width + 1] > 220) solidNeighbors++;
        if (alphaBuffer[idx + width - 1] > 220) solidNeighbors++;
        if (alphaBuffer[idx + width + 1] > 220) solidNeighbors++;

        if (solidNeighbors >= 6) {
          // Fill the cavity
          data[idx * 4 + 3] = 240;
        }
      }
    }
  }
}

/**
 * Smooths staircase jaggedness along alpha transitions without blurring fine details
 */
function smoothAlphaEdges(data: Uint8ClampedArray, width: number, height: number): void {
  const alphaCopy = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    alphaCopy[i] = data[i * 4 + 3];
  }

  for (let y = 1; y < height - 1; y++) {
    const row = y * width;
    for (let x = 1; x < width - 1; x++) {
      const idx = row + x;
      const current = alphaCopy[idx];

      // Only process boundary transition pixels (not solid background 0 or solid foreground 255)
      if (current > 10 && current < 245) {
        // Weighted average with cross neighbors
        const n1 = alphaCopy[idx - 1];
        const n2 = alphaCopy[idx + 1];
        const n3 = alphaCopy[idx - width];
        const n4 = alphaCopy[idx + width];

        const smoothed = Math.round((current * 4 + n1 + n2 + n3 + n4) / 8);
        data[idx * 4 + 3] = smoothed;
      }
    }
  }
}

/**
 * Halo Decontamination (Color Bleed Suppression)
 * 
 * Semi-transparent boundary pixels often contain background color bleeding.
 * We sample neighboring solid foreground pixels to pull the foreground color forward,
 * preventing unsightly white halos or black fringes when placed on different backgrounds.
 */
function decontaminateHalos(data: Uint8ClampedArray, width: number, height: number): void {
  const thresholdLow = 15;
  const thresholdHigh = 235;

  for (let y = 1; y < height - 1; y++) {
    const row = y * width;
    for (let x = 1; x < width - 1; x++) {
      const idx = (row + x) * 4;
      const alpha = data[idx + 3];

      // Target transition boundary pixels
      if (alpha >= thresholdLow && alpha <= thresholdHigh) {
        let sumR = 0;
        let sumG = 0;
        let sumB = 0;
        let solidCount = 0;

        // Search in a 3x3 neighborhood for solid foreground color donors
        const offsets = [
          idx - 4, idx + 4,
          idx - width * 4, idx + width * 4,
          idx - (width + 1) * 4, idx - (width - 1) * 4,
          idx + (width - 1) * 4, idx + (width + 1) * 4,
        ];

        for (const offset of offsets) {
          if (data[offset + 3] > 230) {
            sumR += data[offset];
            sumG += data[offset + 1];
            sumB += data[offset + 2];
            solidCount++;
          }
        }

        if (solidCount > 0) {
          // Blend towards the average solid foreground color according to alpha transparency
          const blendWeight = 1 - (alpha / 255);
          const avgR = sumR / solidCount;
          const avgG = sumG / solidCount;
          const avgB = sumB / solidCount;

          data[idx] = Math.round(data[idx] * (1 - blendWeight) + avgR * blendWeight);
          data[idx + 1] = Math.round(data[idx + 1] * (1 - blendWeight) + avgG * blendWeight);
          data[idx + 2] = Math.round(data[idx + 2] * (1 - blendWeight) + avgB * blendWeight);
        }
      }
    }
  }
}

/**
 * Creates a high-quality transparent PNG Blob from an HTMLImageElement and result Blob,
 * applying post-processing at 100% original full resolution.
 */
export async function createRefinedTransparentPng(
  originalImg: HTMLImageElement,
  cutoutBlob: Blob,
  options: PostProcessConfig = { haloDecontamination: true, edgeSmoothing: true, morphologicalCleanup: true }
): Promise<{ blob: Blob; url: string; width: number; height: number }> {
  const width = originalImg.naturalWidth;
  const height = originalImg.naturalHeight;

  // Load cutout blob as Image
  const cutoutImg = new Image();
  const cutoutUrl = URL.createObjectURL(cutoutBlob);
  await new Promise<void>((resolve, reject) => {
    cutoutImg.onload = () => resolve();
    cutoutImg.onerror = () => reject(new Error('Failed to load cutout image.'));
    cutoutImg.src = cutoutUrl;
  });

  // Offscreen canvas at 100% original dimensions
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable.');
  }

  // Draw cutout image onto canvas at full resolution
  ctx.drawImage(cutoutImg, 0, 0, width, height);
  URL.revokeObjectURL(cutoutUrl);

  // Extract pixel data for refinement
  const imageData = ctx.getImageData(0, 0, width, height);

  // Apply post-processing
  refineImageData(imageData, options);

  // Put refined pixels back
  ctx.putImageData(imageData, 0, 0);

  // Convert to full-resolution transparent PNG blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to encode transparent PNG blob.'));
        return;
      }
      const url = URL.createObjectURL(blob);
      resolve({ blob, url, width, height });
    }, 'image/png');
  });
}
