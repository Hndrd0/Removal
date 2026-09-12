import { removeBackground, type Config } from '@imgly/background-removal';
import type { ProcessProgress, ProcessingOptions, ProcessingResult, ImageMetadata } from '../types';
import { createRefinedTransparentPng } from './postProcessing';

export type ProgressCallback = (progress: ProcessProgress) => void;

/**
 * Executes 100% Client-Side In-Browser AI Background Removal
 * 
 * - Zero network uploads.
 * - Hardware accelerated WebGPU with automatic WASM fallback.
 * - Post-processing halo decontamination and edge refinement.
 * - Preserves 100% original full image resolution.
 */
export async function removeBackgroundClientSide(
  file: File,
  imgElement: HTMLImageElement,
  metadata: ImageMetadata,
  options: ProcessingOptions = {},
  onProgress?: ProgressCallback
): Promise<ProcessingResult> {
  const startTime = performance.now();

  const report = (stage: ProcessProgress['stage'], pct: number, message: string, details?: string) => {
    if (onProgress) {
      onProgress({
        stage,
        progress: Math.min(100, Math.max(0, Math.round(pct))),
        message,
        details,
      });
    }
  };

  report('loading-model', 5, 'Initializing local AI neural engine...', 'Preparing WebGPU / WASM runtime');

  // Configure imgly client-side removal
  const config: Config = {
    device: options.device || 'gpu', // WebGPU preferred, falls back to WASM
    model: options.model || 'isnet_fp16', // Dichotomous Image Segmentation
    output: {
      format: 'image/png',
      quality: 1.0,
    },
    debug: false,
    progress: (key: string, current: number, total: number) => {
      if (key.startsWith('fetch:')) {
        const percent = total > 0 ? (current / total) * 60 : 30;
        const mbCurrent = (current / (1024 * 1024)).toFixed(1);
        const mbTotal = (total / (1024 * 1024)).toFixed(1);
        report(
          'loading-model',
          10 + percent,
          'Fetching AI model weights...',
          `Downloading: ${mbCurrent}MB / ${mbTotal}MB (cached locally)`
        );
      } else if (key.startsWith('compute:') || key.includes('onnx')) {
        report('segmenting', 75, 'Analyzing image with AI segmentation...', 'Computing dichotomous edge mask');
      }
    },
  };

  try {
    // Ensure input blob has a MIME type supported by @imgly's decoder (PNG, JPEG, WebP).
    // Browsers can decode image/avif, but @imgly throws "Invalid format: image/avif" if passed directly.
    let inputSource: Blob | File = file;
    const supportedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const fileMime = (file.type || '').toLowerCase();

    if (!supportedMimes.includes(fileMime)) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = imgElement.naturalWidth;
        canvas.height = imgElement.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(imgElement, 0, 0);
          const convertedBlob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, 'image/png')
          );
          if (convertedBlob) {
            inputSource = convertedBlob;
          }
        }
      } catch (convErr) {
        console.warn('Canvas conversion for unsupported MIME type failed, proceeding with original:', convErr);
      }
    }

    // In-browser inference with automatic CPU/WASM fallback
    let rawCutoutBlob: Blob;
    try {
      rawCutoutBlob = await removeBackground(inputSource, config);
    } catch (primaryErr: unknown) {
      // If GPU/WebGPU failed (e.g. backend not found, webgpuInit error, adapter error, context loss),
      // seamlessly retry using CPU (WASM SIMD)
      if (config.device !== 'cpu') {
        console.warn('WebGPU inference failed, retrying with CPU (WASM SIMD) fallback:', primaryErr);
        report(
          'loading-model',
          30,
          'WebGPU unavailable, switching to CPU / WASM fallback...',
          'Loading multi-threaded WebAssembly model'
        );
        const fallbackConfig: Config = {
          ...config,
          device: 'cpu',
          progress: (key: string, current: number, total: number) => {
            if (key.startsWith('fetch:')) {
              const percent = total > 0 ? (current / total) * 60 : 30;
              const mbCurrent = (current / (1024 * 1024)).toFixed(1);
              const mbTotal = (total / (1024 * 1024)).toFixed(1);
              report(
                'loading-model',
                20 + percent * 0.7,
                'Fetching WASM model weights...',
                `Downloading: ${mbCurrent}MB / ${mbTotal}MB (cached locally)`
              );
            } else if (key.startsWith('compute:') || key.includes('onnx')) {
              report('segmenting', 75, 'Analyzing image with AI segmentation (CPU WASM)...', 'Computing dichotomous edge mask');
            }
          },
        };
        rawCutoutBlob = await removeBackground(inputSource, fallbackConfig);
      } else {
        throw primaryErr;
      }
    }

    report('refining', 88, 'Refining edges and decontaminating halos...', 'Applying edge-aware smoothing and color decontamination');

    // High quality post-processing at 100% full original resolution
    const refinedResult = await createRefinedTransparentPng(imgElement, rawCutoutBlob, {
      haloDecontamination: options.haloDecontamination ?? true,
      edgeSmoothing: options.edgeSmoothing ?? true,
      morphologicalCleanup: options.morphologicalCleanup ?? true,
    });

    const durationMs = Math.round(performance.now() - startTime);

    report('complete', 100, 'Background removed successfully!', `Processed in ${(durationMs / 1000).toFixed(2)}s`);

    return {
      blob: refinedResult.blob,
      url: refinedResult.url,
      width: refinedResult.width,
      height: refinedResult.height,
      durationMs,
      metadata,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'An error occurred during client-side segmentation.';
    report('error', 0, 'Processing failed', errorMsg);
    throw new Error(errorMsg);
  }
}
