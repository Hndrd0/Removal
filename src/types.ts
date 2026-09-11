export interface ProcessProgress {
  stage: 'idle' | 'validating' | 'loading-model' | 'segmenting' | 'refining' | 'complete' | 'error';
  progress: number; // 0 to 100
  message: string;
  details?: string;
}

export interface ProcessingOptions {
  model?: 'isnet' | 'isnet_fp16' | 'isnet_quint8';
  device?: 'gpu' | 'cpu';
  haloDecontamination?: boolean; // cleans color bleed on boundary pixels
  edgeSmoothing?: boolean;      // edge-aware smoothing
  morphologicalCleanup?: boolean; // removes pinhole cavities and dust
  featherRadius?: number;        // sub-pixel edge feathering
}

export interface ImageMetadata {
  name: string;
  width: number;
  height: number;
  sizeBytes: number;
  type: string;
  aspectRatio: number;
}

export interface ProcessingResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  durationMs: number;
  metadata: ImageMetadata;
}
