# Silhouex

> **A 1:1-Quality, 100% Client-Side, Privacy-First Remove.bg Alternative**
>
> *Upload image → AI segmentation & edge matting → inspect with split comparison → download full-resolution transparent PNG. Zero server uploads. Zero tracking.*

[![Zero Telemetry](https://img.shields.io/badge/Telemetry-Zero%20(100%25%20Private)-10b981.svg)](#privacy-first)
[![Client-Side AI](https://img.shields.io/badge/AI-WebGPU%20%2F%20WASM%20In--Browser-06b6d4.svg)](#100-client-sided)
[![Resolution](https://img.shields.io/badge/Resolution-Full%20Original%20(No%20Downscaling)-8b5cf6.svg)](#studio-quality)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Mission & Philosophy

Most background-removal tools either upload your private photos to remote cloud servers, force user registration, degrade output resolution behind a paywall, or spam you with invasive ads and tracking pixels.

**Silhouex is an independent, production-grade alternative built on three uncompromising principles:**

1. **Quality Comes First**: State-of-the-art Dichotomous Image Segmentation (IS-Net / BiRefNet) with edge-aware halo decontamination and morphological refinement. Hair, fur, and intricate edges are extracted with studio precision.
2. **Privacy Comes Second**: **100% client-sided**. The neural network executes entirely inside your device's web browser using **WebGPU** with automatic fallback to **multi-threaded WebAssembly (WASM SIMD)**. Not a single pixel or byte of your image ever leaves your computer.
3. **Speed Comes Third**: Near-instantaneous WebGPU processing, zero network latency, and offline PWA capability.

---

## Feature Parity & Highlights

- **100% Client-Side In-Browser AI**: Zero backend uploads. Completely private and air-gapped capable.
- **Full Original Resolution**: Never artificially downscaled or compressed. A 4000×3000 input yields a 4000×3000 transparent PNG.
- **Advanced Post-Processing Pipeline**:
  - **Halo Decontamination**: Recalculates semi-transparent boundary RGB values to eliminate white or dark color bleed.
  - **Edge-Aware Smoothing**: Removes jagged staircase pixelation without blurring fine hair strands.
  - **Pinhole Cavity Filling**: Repairs micro-holes in solid subjects.
- **Interactive Comparison Viewer**:
  - **Split Slider**: Drag a divider between original and cutout.
  - **Side-by-Side**: Synchronized dual preview.
  - **Backdrop Switcher**: Preview against Dark Checkerboard, Light Checkerboard, Pure White, Pure Black, Slate, or custom hex color.
  - **Pan & Zoom**: Mouse wheel zoom (up to 400%), click-and-drag pan to inspect fine edges.
- **One-Click Actions**:
  - **Download PNG**: Direct transparent 32-bit PNG file download.
  - **Copy Image**: Directly copies the binary PNG blob to your OS clipboard (paste instantly into Figma, Photoshop, Canva, or Slack).
- **Zero Ads & Zero Telemetry**: No Google Analytics, no Meta Pixel, no tracking cookies, no user profiling.
- **Drag & Drop + Clipboard Paste**: Drop any image onto the window or simply press `Ctrl+V` / `Cmd+V`.
- **Supported Formats**: JPG, PNG, WebP, AVIF (with magic-byte header sniffing and decompression bomb protection).

---

## Quickstart (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ or v20+

### Installation & Run

```bash
# 1. Clone repository
git clone https://github.com/your-username/silhouex.git
cd silhouex

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Production Build & Self-Hosting

### Standard Build

```bash
npm run build
npm run preview
```

The compiled static assets in `dist/` can be served by any static host (Cloudflare Pages, Vercel, Netlify, GitHub Pages, Nginx, Apache, or S3).

### Docker Deployment

Run with Docker in a single command:

```bash
docker compose up -d
```

Access the application at `http://localhost:8080`.

---

## Benchmark & Performance

Silhouex includes a benchmarking suite (`benchmark/`) evaluating inference latencies and edge quality:

| Model | Architecture | Runtime | Inference Latency | Edge Detail Rating |
|---|---|---|---|---|
| **IS-Net (`isnet_fp16`)** *(Default)* | Dichotomous Image Segmentation | WebGPU / WASM | ~500ms - 1.2s (GPU) / ~3.8s (CPU) | **Studio Grade (S-Tier)** |
| **U2-Net** | Nested U-Structure | WASM / CPU | ~1.3s - 1.6s (CPU) | **Fast (A-Tier)** |
| **BiRefNet** | Bilateral Reference DIS | Server / GPU | ~150ms - 600ms (CUDA) | **Ultra Studio (S+-Tier)** |

Run the automated benchmark:
```bash
python benchmark/benchmark.py
```
Or open the in-browser hardware diagnostic at `/benchmark.html`.

---

## Project Structure

```text
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Brand identity & privacy status
│   │   ├── Dropzone.tsx            # Drag & drop upload area + Ctrl+V listener
│   │   ├── ComparisonViewer.tsx    # Split slider, side-by-side, zoom/pan
│   │   ├── ActionBar.tsx           # Download PNG, Copy to Clipboard, toggles
│   │   ├── ProcessingOverlay.tsx   # Honest progress indicator & error retry
│   │   ├── PrivacyModal.tsx        # Zero-telemetry declaration
│   │   └── TermsModal.tsx          # Open acceptable use terms
│   ├── services/
│   │   ├── backgroundRemoval.ts    # In-browser neural network orchestrator
│   │   ├── postProcessing.ts       # Halo decontamination & edge smoothing
│   │   ├── imageValidation.ts      # Magic-bytes sniffing & decompression bomb guard
│   │   ├── imageValidation.test.ts # Validation unit tests
│   │   └── postProcessing.test.ts  # Post-processing unit tests
│   ├── types.ts                    # TypeScript interfaces
│   ├── App.tsx                     # Main application container
│   └── index.css                   # Tailwind CSS & checkerboard patterns
├── benchmark/
│   ├── images/                     # Test image dataset (hair, fur, products)
│   ├── outputs/                    # Benchmark cutout outputs
│   ├── benchmark.py                # Automated benchmark runner
│   ├── report.md                   # Benchmark report
│   └── comparison.html             # Side-by-side HTML visual matrix
├── public/
│   ├── samples/                    # Preloaded demo test images
│   ├── benchmark.html              # In-browser hardware diagnostic tool
│   └── favicon.svg                 # Silhouex logo favicon
├── Dockerfile                      # Production multi-stage Nginx container
├── docker-compose.yml              # One-command compose configuration
├── nginx.conf                      # COOP/COEP isolation headers & caching
├── ARCHITECTURE.md                 # Deep technical architecture
├── PRIVACY.md                      # Privacy policy and verification guide
├── SECURITY.md                     # Security & sandboxing documentation
├── MODEL_BENCHMARK.md              # Model comparison data
└── DEPLOYMENT.md                   # Production deployment guide
```

---

## Privacy & Security Guarantee

1. **Zero Uploads**: Images are processed directly inside your browser via Web Worker.
2. **Zero Telemetry**: No tracking scripts, analytics, or behavioral cookies.
3. **Open Source**: Auditable code, reproducible builds, and self-hostable.

---

## License

MIT License. Free for personal and commercial use.
