# Silhouex Production Deployment Guide

Silhouex is designed for frictionless, zero-maintenance deployment. Because all AI inference runs directly in the user's browser, the server only serves static files and WASM/ONNX assets.

---

## 1. Quick Deployment Methods

### Method A: Docker & Docker Compose (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/silhouex.git
   cd silhouex
   ```

2. Start the container:
   ```bash
   docker compose up -d
   ```

3. Silhouex will be running at `http://localhost:8080`.

To change the exposed port, set `PORT=3000` in `.env`.

---

### Method B: Static Hosting (Cloudflare Pages / Vercel / Netlify)

Because Silhouex is a static Single-Page Application, it can be deployed for **free** to global edge networks.

#### Cloudflare Pages
1. Build command: `npm run build`
2. Build output directory: `dist`
3. In `public/_headers` (or Cloudflare rules), set:
   ```http
   /*
     Cross-Origin-Opener-Policy: same-origin
     Cross-Origin-Embedder-Policy: require-corp
   ```

#### Vercel
1. Connect repository.
2. Framework Preset: `Vite`.
3. Add `vercel.json`:
   ```json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
           { "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" }
         ]
       }
     ]
   }
   ```

---

## 2. Reverse Proxy & HTTPS Deployment (Nginx / Caddy)

### Production Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name removebg.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/removebg.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/removebg.yourdomain.com/privkey.pem;

    root /var/www/silhouex/dist;
    index index.html;

    # Crucial threading headers for WebAssembly SIMD
    add_header Cross-Origin-Opener-Policy "same-origin" always;
    add_header Cross-Origin-Embedder-Policy "require-corp" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;

    # Caching for model weights and WASM
    location ~* \.(wasm|onnx|mjs|js|css|png|jpg|jpeg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Cross-Origin-Opener-Policy "same-origin" always;
        add_header Cross-Origin-Embedder-Policy "require-corp" always;
        try_files $uri =404;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Caddy Configuration
```caddy
removebg.yourdomain.com {
    root * /var/www/silhouex/dist
    file_server

    header {
        Cross-Origin-Opener-Policy "same-origin"
        Cross-Origin-Embedder-Policy "require-corp"
    }

    try_files {path} /index.html
}
```

---

## 3. Hardware & Storage Requirements

### Server Side
- **CPU**: 1 vCPU (almost zero CPU load because clients execute all models)
- **RAM**: 256 MB – 512 MB
- **Disk**: 500 MB (for static HTML, CSS, JS, and ONNX weights)
- **Bandwidth**: Dependent on user traffic (~80MB first-time model cache per user)

### Client Side
- **Browser**: Modern browser with WebGPU or WASM support (Chrome, Edge, Firefox, Safari)
- **Device RAM**: 2 GB+ (recommended 4 GB+)
