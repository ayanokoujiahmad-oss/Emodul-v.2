import { useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
export type ConfettiPreset = 'quiz-complete' | 'badge-unlock' | 'adventure-complete';

/* ------------------------------------------------------------------ */
/*  Preset configurations                                              */
/* ------------------------------------------------------------------ */

const presets: Record<ConfettiPreset, () => void> = {
  'quiz-complete': () => {
    const end = Date.now() + 1500;
    const colors = ['#7c3aed', '#8b5cf6', '#a78bfa', '#60a5fa', '#34d399'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  },

  'badge-unlock': () => {
    const colors = ['#7c3aed', '#fbbf24', '#f59e0b', '#8b5cf6'];

    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.6 },
      colors,
      shapes: ['star', 'circle'],
      scalar: 1.2,
    });

    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.65 },
        colors,
        shapes: ['star'],
        scalar: 0.9,
      });
    }, 300);
  },

  'adventure-complete': () => {
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#10b981', '#fbbf24'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.5 },
        colors,
        shapes: ['star', 'circle'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.5 },
        colors,
        shapes: ['star', 'circle'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  },
};

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useConfetti() {
  const activeRaf = useRef<number | null>(null);

  const fire = useCallback((preset: ConfettiPreset = 'quiz-complete') => {
    // Cancel any ongoing animation to avoid overlap
    if (activeRaf.current !== null) {
      cancelAnimationFrame(activeRaf.current);
    }

    const run = presets[preset];
    if (run) {
      run();
    }
  }, []);

  const reset = useCallback(() => {
    confetti.reset();
    if (activeRaf.current !== null) {
      cancelAnimationFrame(activeRaf.current);
      activeRaf.current = null;
    }
  }, []);

  return { fire, reset };
}

/* ------------------------------------------------------------------ */
/*  Static helper for quick one-shot usage                             */
/* ------------------------------------------------------------------ */

export function fireConfetti(preset: ConfettiPreset = 'quiz-complete') {
  const run = presets[preset];
  if (run) run();
}
