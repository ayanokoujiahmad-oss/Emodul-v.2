import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock } from 'lucide-react';
import type { Badge as BadgeType } from '../../types/models';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface BadgeProps {
  badge: BadgeType;
  unlocked: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/* ------------------------------------------------------------------ */
/*  Size config                                                        */
/* ------------------------------------------------------------------ */

const sizeMap = {
  sm: {
    container: 'h-10 w-10',
    label: 'text-[11px]',
    lock: 'h-3 w-3',
    lockContainer: 'h-4 w-4',
    tooltip: 'text-xs',
  },
  md: {
    container: 'h-14 w-14',
    label: 'text-sm',
    lock: 'h-3.5 w-3.5',
    lockContainer: 'h-5 w-5',
    tooltip: 'text-xs',
  },
  lg: {
    container: 'h-20 w-20',
    label: 'text-xl',
    lock: 'h-4 w-4',
    lockContainer: 'h-6 w-6',
    tooltip: 'text-sm',
  },
};

const imageSizeMap = {
  sm: 'h-16 w-16',
  md: 'h-20 w-20',
  lg: 'h-28 w-28',
};

const championBadgeSizeMap = {
  sm: 'h-[4.25rem] w-[4.25rem]',
  md: 'h-[5.5rem] w-[5.5rem]',
  lg: 'h-[7.75rem] w-[7.75rem]',
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Badge({ badge, unlocked, size = 'md' }: BadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const config = sizeMap[size];
  const hasVisualBadge = Boolean(badge.imageUrl || badge.videoUrl);
  const isChampionBadge = badge.id === 'badge-sang-juara' && hasVisualBadge;
  const visualSize = isChampionBadge ? championBadgeSizeMap[size] : imageSizeMap[size];
  const hoverMotion = hasVisualBadge
    ? { scale: isChampionBadge ? 1.36 : 1.48, y: isChampionBadge ? -8 : -6 }
    : { scale: 1.08 };

  return (
    <div
      className="relative inline-flex hover:z-50 focus-within:z-50"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      <motion.div
        initial={unlocked ? { scale: 0, rotate: -30 } : false}
        animate={unlocked ? { scale: 1, rotate: 0 } : undefined}
        whileHover={hoverMotion}
        whileFocus={hoverMotion}
        transition={{ type: 'spring', stiffness: 360, damping: 20 }}
        className={`relative flex items-center justify-center ${
          hasVisualBadge
            ? `${visualSize} overflow-visible border-0 bg-transparent shadow-none`
            : `overflow-hidden rounded-2xl border ${config.container}`
        } ${
          unlocked
            ? hasVisualBadge
              ? 'cursor-default text-primary-700'
              : 'cursor-default border-primary-100 bg-primary-50 text-primary-700 shadow-glow'
            : hasVisualBadge
              ? 'cursor-not-allowed text-surface-400 grayscale'
              : 'cursor-not-allowed border-surface-200 bg-surface-100 text-surface-400 grayscale'
        }`}
        tabIndex={0}
        role="img"
        aria-label={
          unlocked
            ? `Badge: ${badge.name}`
            : `Badge terkunci: ${badge.name}`
        }
      >
        {/* Glow ring when unlocked */}
        {unlocked && !hasVisualBadge && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            animate={{
              boxShadow: [
                '0 0 0px rgba(0, 117, 222, 0)',
                '0 0 12px rgba(0, 117, 222, 0.22)',
                '0 0 0px rgba(0, 117, 222, 0)',
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Badge mark */}
        {badge.videoUrl ? (
          <video
            src={badge.videoUrl}
            className={`h-full w-full select-none object-contain ${
              unlocked ? 'drop-shadow-md' : 'opacity-55'
            } ${
              isChampionBadge ? 'scale-110' : ''
            }`}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        ) : badge.imageUrl ? (
          <img
            src={badge.imageUrl}
            alt=""
            className={`h-full w-full select-none ${
              isChampionBadge ? 'scale-110 object-cover' : 'object-contain'
            } ${
              unlocked ? 'drop-shadow-md' : 'opacity-55'
            }`}
            loading="lazy"
            draggable={false}
          />
        ) : (
          <span
            className={`${config.label} select-none font-black tracking-tight ${
              unlocked ? '' : 'opacity-40'
            }`}
          >
            {badge.emoji}
          </span>
        )}

        {/* Lock overlay */}
        {!unlocked && (
          <div
            className={`absolute -bottom-1 -right-1 flex items-center justify-center rounded-full bg-gray-400 text-white ${config.lockContainer}`}
          >
            <Lock className={config.lock} />
          </div>
        )}
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-primary-100 bg-white px-3 py-2 shadow-card ${config.tooltip}`}
          >
            <p className="font-semibold text-primary-700">{badge.name}</p>
            <p className="mt-0.5 text-primary-400">{badge.description}</p>
            {!unlocked && (
              <p className="mt-1 inline-flex items-center gap-1 text-[10px] italic text-primary-300">
                <Lock className="h-3 w-3" />
                {badge.requirement}
              </p>
            )}
            {/* Arrow */}
            <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
