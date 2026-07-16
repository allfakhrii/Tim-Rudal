'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

// Define the BeforeInstallPromptEvent interface as it's not standard in TypeScript
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsInstallable(false);
    
    console.log(`User interaction with A2HS prompt: ${outcome}`);
  };

  if (!isInstallable) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2 bg-primary/90 hover:bg-primary text-white py-3 px-4 rounded-full shadow-lg transition-all hover:scale-105"
      aria-label="Install App"
    >
      <Download size={20} strokeWidth={2.5} />
      <span className="font-semibold text-sm">Install App</span>
    </button>
  );
}
