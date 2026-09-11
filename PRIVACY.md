# Silhouex Privacy Policy & Zero-Telemetry Guarantee

**Last Updated:** September 2026  
**Status:** Strict Zero-Telemetry Architecture

---

## 1. The Core Privacy Principle

> **"Your images never leave your computer."**

Silhouex was created specifically to eliminate the privacy and surveillance problems of cloud-based background removal tools. When you use Silhouex:

1. **Zero Bytes of Image Data Are Sent Anywhere**: The artificial intelligence neural network runs directly inside your browser. No server ever receives your image.
2. **Zero Telemetry / Zero Analytics**: We do not include Google Analytics, Google Tag Manager, Meta Pixel, Hotjar, Microsoft Clarity, Mixpanel, Segment, or any other behavioral tracking scripts.
3. **No Advertising / No Fingerprinting**: No banner ads, popup ads, tracking cookies, or canvas fingerprinting.
4. **No Accounts Required**: No email forms, login walls, or forced registration.

---

## 2. Technical Verification (Audit Guide)

You do not have to take our word for it. You can independently verify that Silhouex is 100% private in 30 seconds using your browser's Developer Tools:

1. Open **Silhouex** in Google Chrome, Mozilla Firefox, Microsoft Edge, or Apple Safari.
2. Press `F12` (or Right Click → **Inspect**) to open **Developer Tools**.
3. Select the **Network** tab.
4. Check the **Preserve log** checkbox and filter by **Fetch/XHR**.
5. Upload an image, drag & drop, or paste from clipboard (`Ctrl+V`).
6. Observe the network traffic:
   - **Zero outgoing `POST` or `PUT` requests containing image data.**
   - The only network activity is the initial static asset download (HTML, CSS, JS, and ONNX model weights), which are subsequently cached in browser storage.
7. Disconnect your internet connection (or turn on Airplane Mode) and process another image. **It still works 100% offline.**

---

## 3. Data Retention Policy

Because Silhouex does not collect or receive images:
- **Server Data Retention**: **Zero days (0 seconds)**. No images exist on any server.
- **Client-Side Temporary Memory**: Images are loaded into your browser tab's ephemeral RAM. When you close or refresh the tab, all image buffers are immediately discarded and garbage collected by your browser.

---

## 4. Operational Logs

If you host Silhouex on your own server (e.g. via Nginx or Docker), standard HTTP access logs may record:
- Client IP address requesting static asset files (`index.html`, `app.js`).
- Timestamp and HTTP status code.

No image content, user identifiers, or metadata are ever present in server logs.

---

## 5. Contact & Auditing

Silhouex is open source. You are encouraged to audit the source code in `src/` to verify these privacy guarantees.
