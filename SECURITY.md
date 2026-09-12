# Removal Studio Security Policy & Threat Model

Removal Studio treats all uploaded files as potentially hostile input and implements multi-layer defense-in-depth security.

---

## 1. Threat Model & Protections

| Threat Vector | Risk Description | Removal Studio Mitigation |
|---|---|---|
| **Malicious File Upload / RCE** | Attacker uploads executable or script disguised as image | **Zero Server Execution**: Images are decoded exclusively by browser image decoders inside the client sandbox. Server never executes uploaded binaries. |
| **MIME-Type Spoofing** | Attacker sets `Content-Type: image/png` on a non-image file | **Magic-Byte Sniffing**: Header bytes are inspected (`FF D8 FF` for JPEG, `89 50 4E 47` for PNG, `RIFF...WEBP` for WebP). Non-matching files are rejected immediately. |
| **Decompression Bomb (Pixel Flood)** | Tiny compressed image (e.g. 1MB) that decompresses to 20GB of RAM | **Dimension Pre-Check**: Native image dimensions are inspected before full canvas allocation. Images exceeding 45 Megapixels (~45,000,000 pixels) are rejected before buffer expansion. |
| **Memory Exhaustion (OOM)** | Giant files crashing the user's browser | **Strict File Size Cap**: Input files are capped at 35MB. |
| **Cross-Origin Information Leaks** | Spectre / Meltdown timing side-channel attacks | **COOP & COEP Isolation**: `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` are strictly enforced. |
| **Path Traversal / LFI** | Manipulating filename parameters | **UUID / Ephemeral Object URLs**: All memory buffers use browser-generated `blob:` URLs. Filenames are sanitized on download. |

---

## 2. Browser Sandboxing

Removal Studio relies on the modern web platform security model:
1. **No Native Binaries**: Inference runs within WebGPU compute pipelines or WebAssembly virtual machines.
2. **Same-Origin Policy**: No cross-origin data exfiltration.
3. **No Local Storage Leaks**: No persistent storage of user images; memory is reclaimed when the tab closes.

---

## 3. Reporting a Vulnerability

If you discover a security vulnerability, please open an issue or email the maintainers directly. Vulnerabilities will be triaged and addressed promptly.
