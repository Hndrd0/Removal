import { describe, it, expect } from 'vitest';
import { refineImageData } from './postProcessing';

describe('Post-Processing Pipeline (Canvas ImageData)', () => {
  it('correctly fills small pinhole cavities in solid foreground masks', () => {
    const width = 5;
    const height = 5;
    const buffer = new Uint8ClampedArray(width * height * 4);

    // Make all pixels solid foreground (alpha = 255)
    for (let i = 0; i < width * height; i++) {
      buffer[i * 4] = 200;     // R
      buffer[i * 4 + 1] = 50;  // G
      buffer[i * 4 + 2] = 50;  // B
      buffer[i * 4 + 3] = 255; // Alpha
    }

    // Punch an isolated pinhole cavity at center (x=2, y=2)
    const centerIdx = (2 * width + 2) * 4;
    buffer[centerIdx + 3] = 0; // Completely transparent hole

    const fakeImageData = {
      width,
      height,
      data: buffer,
      colorSpace: 'srgb',
    } as unknown as ImageData;

    refineImageData(fakeImageData, {
      morphologicalCleanup: true,
      edgeSmoothing: false,
      haloDecontamination: false,
    });

    // Pinhole cavity should now be filled (alpha > 200)
    expect(buffer[centerIdx + 3]).toBeGreaterThan(200);
  });

  it('decontaminates color bleed on semi-transparent edge pixels', () => {
    const width = 3;
    const height = 3;
    const buffer = new Uint8ClampedArray(width * height * 4);

    // Pixel (0, 1): solid red foreground donor
    const solidIdx = (1 * width + 0) * 4;
    buffer[solidIdx] = 255; // R
    buffer[solidIdx + 1] = 0;   // G
    buffer[solidIdx + 2] = 0;   // B
    buffer[solidIdx + 3] = 255; // Alpha

    // Pixel (1, 1) [center]: semi-transparent boundary with white color bleed (R=255, G=255, B=255, A=100)
    const boundaryIdx = (1 * width + 1) * 4;
    buffer[boundaryIdx] = 255;
    buffer[boundaryIdx + 1] = 255;
    buffer[boundaryIdx + 2] = 255;
    buffer[boundaryIdx + 3] = 100;

    const fakeImageData = {
      width,
      height,
      data: buffer,
      colorSpace: 'srgb',
    } as unknown as ImageData;

    refineImageData(fakeImageData, {
      morphologicalCleanup: false,
      edgeSmoothing: false,
      haloDecontamination: true,
    });

    // The boundary pixel should have its color decontaminated (Green & Blue reduced towards red donor)
    expect(buffer[boundaryIdx + 1]).toBeLessThan(255);
    expect(buffer[boundaryIdx + 2]).toBeLessThan(255);
  });

  it('smooths alpha transitions on jagged borders', () => {
    const width = 3;
    const height = 3;
    const buffer = new Uint8ClampedArray(width * height * 4);

    // Center pixel with alpha = 100, neighbors with alpha = 200
    for (let i = 0; i < width * height; i++) {
      buffer[i * 4 + 3] = 200;
    }
    const centerIdx = (1 * width + 1) * 4;
    buffer[centerIdx + 3] = 100;

    const fakeImageData = {
      width,
      height,
      data: buffer,
      colorSpace: 'srgb',
    } as unknown as ImageData;

    refineImageData(fakeImageData, {
      morphologicalCleanup: false,
      edgeSmoothing: true,
      haloDecontamination: false,
    });

    // Center alpha should be smoothed upwards
    expect(buffer[centerIdx + 3]).toBeGreaterThan(100);
  });
});
