import React, { useState } from 'react';
import { X, Code2, Copy, Check, Terminal } from 'lucide-react';

interface ApiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiModal: React.FC<ApiModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const codeSnippet = `import { removeBackground } from '@removal-studio/client';

// 100% Client-Side WebGPU / WASM execution
const imageFile = document.querySelector('input[type="file"]').files[0];

const result = await removeBackground(imageFile, {
  haloDecontamination: true,
  edgeSmoothing: true,
  onProgress: (p) => console.log(\`\${p.stage}: \${p.progress}%\`),
});

// Full uncompressed PNG Blob ready to use or download
console.log('Result Dimensions:', result.width, result.height);
const transparentUrl = URL.createObjectURL(result.blob);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-paper/80 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-paper-2 border border-rule rounded-3xl p-6 sm:p-8 shadow-2xl text-left"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close API modal"
          className="absolute top-6 right-6 p-2 rounded-full bg-paper border border-rule text-muted hover:text-ink hover:bg-paper-3 transition-colors cursor-pointer shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-paper border border-accent text-accent flex items-center justify-center shadow-sm">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h3 id="api-modal-title" className="font-display font-medium text-xl text-ink tracking-tight">
              Client-Side WebGPU / WASM API
            </h3>
            <p className="font-mono text-xs text-muted">Zero Cloud Egress • Free • Offline Capable</p>
          </div>
        </div>

        <p className="text-xs text-muted leading-relaxed mb-4">
          Integrate neural background removal directly inside your web application, Electron tool, or browser extension with zero backend server dependencies or per-call API billing.
        </p>

        {/* Code Snippet Box */}
        <div className="relative rounded-2xl bg-paper border border-rule overflow-hidden mb-5">
          <div className="flex items-center justify-between px-4 py-2 bg-paper-3 border-b border-rule font-mono text-[11px] text-muted">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-accent" />
              <span>client-api-example.ts</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-ink hover:text-accent transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-ink overflow-x-auto leading-relaxed">
            <code>{codeSnippet}</code>
          </pre>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left font-mono text-xs">
          <div className="p-3 rounded-xl bg-paper border border-rule">
            <span className="text-accent font-semibold block mb-0.5">Zero API Keys</span>
            <span className="text-muted text-[11px]">No rate limits or credit quotas.</span>
          </div>
          <div className="p-3 rounded-xl bg-paper border border-rule">
            <span className="text-accent font-semibold block mb-0.5">ONNX Runtime</span>
            <span className="text-muted text-[11px]">WebGPU with WebAssembly SIMD fallback.</span>
          </div>
          <div className="p-3 rounded-xl bg-paper border border-rule">
            <span className="text-accent font-semibold block mb-0.5">Privacy Guaranteed</span>
            <span className="text-muted text-[11px]">HIPAA & GDPR friendly by default.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
