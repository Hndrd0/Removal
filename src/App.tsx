import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SunsetBanner } from './components/SunsetBanner';
import { Header } from './components/Header';
import { HeroUploadSection } from './components/HeroUploadSection';
import { QualityShowcase } from './components/QualityShowcase';
import { UseCasesSection } from './components/UseCasesSection';
import { EfficiencySection } from './components/EfficiencySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { Footer } from './components/Footer';
import { ComparisonViewer } from './components/ComparisonViewer';
import { ActionBar } from './components/ActionBar';
import { ProcessingOverlay } from './components/ProcessingOverlay';
import { PrivacyModal } from './components/PrivacyModal';
import { TermsModal } from './components/TermsModal';
import { AccountlessModal } from './components/AccountlessModal';
import { ApiModal } from './components/ApiModal';
import { BulkModal } from './components/BulkModal';
import { PluginsModal } from './components/PluginsModal';
import { PricingModal } from './components/PricingModal';
import { UrlInputModal } from './components/UrlInputModal';
import { WalkthroughModal } from './components/WalkthroughModal';
import { validateAndLoadImage } from './services/imageValidation';
import { removeBackgroundClientSide } from './services/backgroundRemoval';
import type { ProcessProgress, ProcessingResult } from './types';

const WALKTHROUGH_STORAGE_KEY = 'removal_studio_walkthrough_seen';

export const App: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);

  const [progress, setProgress] = useState<ProcessProgress>({
    stage: 'idle',
    progress: 0,
    message: '',
  });

  const [result, setResult] = useState<ProcessingResult | null>(null);

  // Settings
  const [haloDecontamination, setHaloDecontamination] = useState<boolean>(true);
  const [edgeSmoothing, setEdgeSmoothing] = useState<boolean>(true);

  // Modals
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
  const [isApiOpen, setIsApiOpen] = useState<boolean>(false);
  const [isBulkOpen, setIsBulkOpen] = useState<boolean>(false);
  const [isPluginsOpen, setIsPluginsOpen] = useState<boolean>(false);
  const [isPricingOpen, setIsPricingOpen] = useState<boolean>(false);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState<boolean>(false);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(WALKTHROUGH_STORAGE_KEY) !== 'true';
    } catch {
      return false;
    }
  });
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; type: 'login' | 'signup' }>({
    isOpen: false,
    type: 'login',
  });

  const handleDismissWalkthrough = () => {
    setIsWalkthroughOpen(false);
    try {
      localStorage.setItem(WALKTHROUGH_STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
  };

  const handleStartFromWalkthrough = () => {
    handleDismissWalkthrough();
    const hero = document.getElementById('hero-upload-section');
    if (hero) {
      hero.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Hallmark Theme State (Light / Dark Mode)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    if (nextIsDark) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('removal-studio-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('removal-studio-theme', 'light');
    }
  };

  // Main processing pipeline
  const processImageFile = useCallback(async (file: File) => {
    // Revoke previous URLs
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);

    // 1. Client-Side Validation
    setProgress({
      stage: 'validating',
      progress: 5,
      message: 'Validating image signature...',
      details: 'Checking magic bytes and dimension boundaries',
    });

    const validation = await validateAndLoadImage(file);
    if (!validation.valid || !validation.metadata || !validation.imageElement) {
      setProgress({
        stage: 'error',
        progress: 0,
        message: 'Invalid Image',
        details: validation.error || 'The uploaded file could not be processed.',
      });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setOriginalFile(file);
    setOriginalUrl(objectUrl);

    // 2. Client-Side AI Background Removal
    try {
      const output = await removeBackgroundClientSide(
        file,
        validation.imageElement,
        validation.metadata,
        {
          haloDecontamination,
          edgeSmoothing,
          morphologicalCleanup: true,
        },
        (p) => setProgress(p)
      );

      setResult(output);
      setProgress({
        stage: 'complete',
        progress: 100,
        message: 'Complete',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Segmentation failed.';
      setProgress({
        stage: 'error',
        progress: 0,
        message: 'Processing Error',
        details: msg,
      });
    }
  }, [originalUrl, result, haloDecontamination, edgeSmoothing]);

  // Sample image loader
  const handleSampleSelected = async (samplePath: string, sampleName: string) => {
    try {
      setProgress({
        stage: 'validating',
        progress: 5,
        message: `Loading sample: ${sampleName}...`,
      });
      const res = await fetch(samplePath);
      const blob = await res.blob();
      const file = new File([blob], sampleName, { type: blob.type || 'image/jpeg' });
      await processImageFile(file);
    } catch (err) {
      console.error('Failed to load sample image:', err);
    }
  };

  // Remote URL image loader
  const handleUrlSubmitted = async (imageUrl: string) => {
    try {
      setProgress({
        stage: 'validating',
        progress: 5,
        message: 'Fetching image from URL...',
        details: imageUrl,
      });
      const res = await fetch(imageUrl);
      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      const blob = await res.blob();
      const fileName = imageUrl.split('/').pop()?.split('?')[0] || 'remote-image.jpg';
      const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });
      await processImageFile(file);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not fetch image from URL.';
      setProgress({
        stage: 'error',
        progress: 0,
        message: 'Failed to Load Image URL',
        details: `${msg}. Cross-Origin CORS restrictions may prevent direct downloading from some sites. Download the image to your computer and drag it here instead.`,
      });
    }
  };

  // Global Clipboard Paste Handler (Ctrl+V)
  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      // Don't intercept paste events when user is typing into input or textarea
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (progress.stage !== 'idle' && progress.stage !== 'complete' && progress.stage !== 'error') {
        return; // Don't interrupt active processing
      }

      if (e.clipboardData && e.clipboardData.items) {
        for (let i = 0; i < e.clipboardData.items.length; i++) {
          const item = e.clipboardData.items[i];
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              processImageFile(file);
              break;
            }
          }
        }
      }
    },
    [progress.stage, processImageFile]
  );

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  // Store active object URLs in ref for cleanup strictly on component unmount
  const activeUrlsRef = useRef<{ originalUrl: string | null; resultUrl: string | null }>({
    originalUrl: null,
    resultUrl: null,
  });

  useEffect(() => {
    activeUrlsRef.current = { originalUrl, resultUrl: result?.url || null };
  }, [originalUrl, result?.url]);

  useEffect(() => {
    return () => {
      if (activeUrlsRef.current.originalUrl) URL.revokeObjectURL(activeUrlsRef.current.originalUrl);
      if (activeUrlsRef.current.resultUrl) URL.revokeObjectURL(activeUrlsRef.current.resultUrl);
    };
  }, []);

  const handleReset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (result?.url) URL.revokeObjectURL(result.url);
    setOriginalFile(null);
    setOriginalUrl(null);
    setResult(null);
    setProgress({
      stage: 'idle',
      progress: 0,
      message: '',
    });
  };

  const handleRetry = () => {
    if (originalFile) {
      processImageFile(originalFile);
    } else {
      handleReset();
    }
  };

  const scrollToUpload = () => {
    if (result) {
      handleReset();
    }
    const el = document.getElementById('hero-upload-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isProcessing =
    progress.stage === 'validating' ||
    progress.stage === 'loading-model' ||
    progress.stage === 'segmenting' ||
    progress.stage === 'refining';

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink selection:bg-accent selection:text-accent-ink font-body transition-colors">
      {/* Sunset Banner (matching remove.bg) */}
      <SunsetBanner onOpenPrivacy={() => setIsPrivacyOpen(true)} />

      {/* Remove.bg-Style Header */}
      <Header
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenApi={() => setIsApiOpen(true)}
        onOpenBulk={() => setIsBulkOpen(true)}
        onOpenPlugins={() => setIsPluginsOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenAuth={(type) => setAuthModal({ isOpen: true, type })}
        onScrollToUpload={scrollToUpload}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Main Body */}
      <main className="flex-1 flex flex-col items-center">
        {/* State 1: Active Processing Overlay */}
        {isProcessing && (
          <div className="my-auto py-16 px-4">
            <ProcessingOverlay
              progress={progress}
              onRetry={handleRetry}
              onCancel={handleReset}
            />
          </div>
        )}

        {/* State 2: Error State */}
        {!isProcessing && progress.stage === 'error' && (
          <div className="my-auto py-16 px-4">
            <ProcessingOverlay
              progress={progress}
              onRetry={handleRetry}
              onCancel={handleReset}
            />
          </div>
        )}

        {/* State 3: Completed Result with Comparison Viewer & Cutout Brush */}
        {!isProcessing && result && originalUrl && (
          <div className="w-full flex flex-col items-center my-auto pt-10 sm:pt-14 pb-8 px-4">
            <ComparisonViewer
              originalUrl={originalUrl}
              cutoutUrl={result.url}
              width={result.width}
              height={result.height}
              onCutoutUpdated={(newBlob, newUrl) => {
                setResult((prev) => {
                  if (prev?.url && prev.url !== newUrl) {
                    URL.revokeObjectURL(prev.url);
                  }
                  return prev ? { ...prev, blob: newBlob, url: newUrl } : null;
                });
              }}
            />

            <ActionBar
              result={result}
              onReset={handleReset}
              haloDecontamination={haloDecontamination}
              onToggleHalo={(val) => setHaloDecontamination(val)}
              edgeSmoothing={edgeSmoothing}
              onToggleSmoothing={(val) => setEdgeSmoothing(val)}
            />
          </div>
        )}

        {/* State 4: Remove.bg Full Homepage */}
        {!isProcessing && !result && progress.stage !== 'error' && (
          <div className="w-full flex flex-col items-center">
            {/* 1. Hero with 2-Column Layout & Signature Upload Box */}
            <HeroUploadSection
              onFileSelected={(file) => processImageFile(file)}
              onSampleSelected={handleSampleSelected}
              onOpenUrlModal={() => setIsUrlModalOpen(true)}
              onOpenTerms={() => setIsTermsOpen(true)}
              disabled={isProcessing}
            />

            {/* 2. Interactive "Stunning Quality" Category Showcase */}
            <QualityShowcase />

            {/* 3. "One Tool, Endless Uses" 9-Card Grid */}
            <UseCasesSection />

            {/* 4. Efficiency & Bulk Processing Highlight */}
            <EfficiencySection
              onOpenBulk={() => setIsBulkOpen(true)}
              onOpenApi={() => setIsApiOpen(true)}
            />

            {/* 5. Testimonials ("They love us. You will too.") */}
            <TestimonialsSection />
          </div>
        )}
      </main>

      {/* Full Remove.bg Multi-Column Footer */}
      <Footer
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenApi={() => setIsApiOpen(true)}
        onOpenBulk={() => setIsBulkOpen(true)}
        onOpenPlugins={() => setIsPluginsOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
        onScrollToUpload={scrollToUpload}
      />

      {/* Modals & Dialogs */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      <AccountlessModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ isOpen: false, type: 'login' })}
        actionType={authModal.type}
      />

      <ApiModal
        isOpen={isApiOpen}
        onClose={() => setIsApiOpen(false)}
      />

      <BulkModal
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        onUploadClick={scrollToUpload}
      />

      <PluginsModal
        isOpen={isPluginsOpen}
        onClose={() => setIsPluginsOpen(false)}
      />

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        onUploadClick={scrollToUpload}
      />

      <UrlInputModal
        isOpen={isUrlModalOpen}
        onClose={() => setIsUrlModalOpen(false)}
        onSubmitUrl={handleUrlSubmitted}
      />

      <WalkthroughModal
        isOpen={isWalkthroughOpen}
        onClose={handleDismissWalkthrough}
        onStart={handleStartFromWalkthrough}
      />
    </div>
  );
};

export default App;
