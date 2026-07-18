// ──────────────────────────────────────────────────────────
// SiberCerdas – Rich Content Renderer
// ──────────────────────────────────────────────────────────
// Shared component for rendering markdown-like content with
// support for images, YouTube embeds, bold text, headings,
// lists, and media blocks.
// ──────────────────────────────────────────────────────────

import React from 'react';
import { BookOpen } from 'lucide-react';

/** Extract YouTube video ID from various URL formats */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pat of patterns) {
    const m = url.match(pat);
    if (m) return m[1];
  }
  return null;
}

/** Render inline bold formatting */
function renderInline(text: string): React.ReactNode {
  if (!text) return null;
  const boldRegex = /\*\*(.*?)\*\*/g;
  if (!boldRegex.test(text)) return text;
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold text-slate-900">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

interface RichContentRendererProps {
  content: string;
  className?: string;
}

/**
 * Renders markdown-like content with support for:
 * - `## heading` → h3
 * - `# heading` → h2
 * - `- item` or `* item` → bullet list
 * - `1. item` → numbered list
 * - `**bold**` → strong
 * - `![alt](url)` → image with caption
 * - `[VIDEO: url]` → YouTube iframe embed
 */
export default function RichContentRenderer({
  content,
  className = '',
}: RichContentRendererProps) {
  if (!content) return null;

  const elements = content.split('\n').map((line, idx) => {
    // YouTube embed: [VIDEO: url]
    const videoMatch = line.match(/\[VIDEO:\s*(.*?)\]/);
    if (videoMatch) {
      const videoUrl = videoMatch[1].trim();
      const videoId = extractYouTubeId(videoUrl);
      if (videoId) {
        return (
          <div
            key={idx}
            className="my-4 rounded-2xl overflow-hidden shadow-lg border border-gray-100 aspect-video max-w-lg mx-auto"
          >
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Video Pembelajaran"
            />
          </div>
        );
      }
      return null;
    }

    // Image: ![alt](url)
    const imgMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
    if (imgMatch) {
      return (
        <figure key={idx} className="my-4 text-center">
          <img
            src={imgMatch[2]}
            alt={imgMatch[1]}
            className="max-w-full mx-auto rounded-2xl shadow-md max-h-72 object-contain"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {imgMatch[1] && imgMatch[1] !== 'gambar' && (
            <figcaption className="text-[11px] text-gray-400 mt-1.5 italic">
              {imgMatch[1]}
            </figcaption>
          )}
        </figure>
      );
    }

    // Headings
    if (line.startsWith('### '))
      return (
        <h4 key={idx} className="text-sm font-bold text-slate-800 mt-3 mb-1">
          {renderInline(line.slice(4))}
        </h4>
      );
    if (line.startsWith('## '))
      return (
        <h3 key={idx} className="text-base font-bold text-slate-800 mt-4 mb-1.5">
          {renderInline(line.slice(3))}
        </h3>
      );
    if (line.startsWith('# '))
      return (
        <h2 key={idx} className="text-lg font-bold text-slate-900 mt-5 mb-2">
          {renderInline(line.slice(2))}
        </h2>
      );

    // Bullet lists
    if (line.startsWith('- ') || line.startsWith('* '))
      return (
        <li key={idx} className="ml-5 list-disc text-xs text-slate-700 mt-0.5 leading-relaxed">
          {renderInline(line.slice(2))}
        </li>
      );

    // Numbered lists
    const numberedMatch = line.match(/^(\d+)\.\s(.*)/);
    if (numberedMatch)
      return (
        <li key={idx} className="ml-5 list-decimal text-xs text-slate-700 mt-0.5 leading-relaxed">
          {renderInline(numberedMatch[2])}
        </li>
      );

    // Horizontal rule
    if (line.trim() === '---' || line.trim() === '***')
      return <hr key={idx} className="my-4 border-gray-200" />;

    // Empty line
    if (!line.trim()) return <div key={idx} className="h-2" />;

    // Regular paragraph
    return (
      <p key={idx} className="text-xs text-slate-700 leading-relaxed mb-1.5">
        {renderInline(line)}
      </p>
    );
  });

  return <div className={className}>{elements}</div>;
}

/**
 * Renders a media block (image or YouTube video) based on step properties.
 * Used in both teacher preview and student view.
 */
export function MediaBlock({
  mediaType,
  mediaUrl,
  mediaLayout = 'above',
}: {
  mediaType?: string;
  mediaUrl?: string;
  mediaLayout?: string;
}) {
  if (!mediaType || mediaType === 'none' || !mediaUrl) return null;

  if (mediaType === 'youtube') {
    const videoId = extractYouTubeId(mediaUrl);
    if (!videoId) return null;
    return (
      <div className="my-4 rounded-2xl overflow-hidden shadow-lg border border-gray-100 aspect-video max-w-lg mx-auto">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video Pembelajaran"
        />
      </div>
    );
  }

  if (mediaType === 'image') {
    return (
      <div
        className={`my-4 ${
          mediaLayout === 'side' ? 'float-right ml-4 mb-2 max-w-[280px]' : 'text-center'
        }`}
      >
        <img
          src={mediaUrl}
          alt="Media pembelajaran"
          className="rounded-2xl shadow-md max-h-72 object-contain mx-auto max-w-full"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  return null;
}

/**
 * Renders a passage/story box before quiz questions.
 */
export function PassageBlock({ passage }: { passage?: string }) {
  if (!passage) return null;
  return (
    <div className="my-4 p-4 bg-amber-50/80 border border-amber-200/60 rounded-2xl">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="h-4 w-4 text-amber-700" />
        <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
          Bacaan / Cerita Pengantar
        </span>
      </div>
      <div className="text-sm text-amber-900 leading-relaxed whitespace-pre-line">
        {passage}
      </div>
    </div>
  );
}

/**
 * Renders an image attached to a question.
 */
export function QuestionImage({ imageUrl }: { imageUrl?: string }) {
  if (!imageUrl) return null;
  return (
    <div className="my-2 text-center">
      <img
        src={imageUrl}
        alt="Gambar soal"
        className="max-w-full mx-auto rounded-xl shadow-sm max-h-48 object-contain border border-gray-100"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
}
