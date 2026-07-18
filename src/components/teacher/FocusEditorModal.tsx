// ──────────────────────────────────────────────────────────
// SiberCerdas – Focus Mode Editor (Modal Layar Penuh)
// ──────────────────────────────────────────────────────────
// Allows teachers to write and edit content in a distraction-free
// full-screen overlay with toolbar and live preview support.
// ──────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Maximize2,
  Image,
  Video,
  Eye,
  EyeOff,
  Type,
  Hash,
  List,
  Save,
  Upload,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

interface FocusEditorModalProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  title?: string;
}

/** Extract YouTube video ID from various URL formats */
function extractYouTubeId(url: string): string | null {
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

export default function FocusEditorModal({
  value,
  onChange,
  onClose,
  title = 'Editor Fokus',
}: FocusEditorModalProps) {
  const [text, setText] = useState(value);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64Url = event.target.result as string;
          const desc = prompt('Deskripsi gambar (opsional):', 'gambar') || 'gambar';
          const ta = textareaRef.current;
          const pos = ta ? ta.selectionStart : text.length;
          const newText =
            text.substring(0, pos) + `\n![${desc}](${base64Url})\n` + text.substring(pos);
          setText(newText);
        }
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = '';
  };

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        onChange(text);
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [text, onChange, onClose]);

  const insertAtCursor = (before: string, after: string = '') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = text.substring(start, end);
    const placeholder = selected || 'teks';
    const newText =
      text.substring(0, start) + before + placeholder + after + text.substring(end);
    setText(newText);
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = start + before.length;
      ta.selectionEnd = start + before.length + placeholder.length;
    }, 10);
  };

  const insertImage = () => {
    const url = prompt('Masukkan URL gambar:');
    if (url) {
      const desc = prompt('Deskripsi gambar (opsional):', 'gambar') || 'gambar';
      const ta = textareaRef.current;
      const pos = ta ? ta.selectionStart : text.length;
      const newText =
        text.substring(0, pos) + `\n![${desc}](${url})\n` + text.substring(pos);
      setText(newText);
    }
  };

  const insertVideo = () => {
    const url = prompt('Masukkan URL YouTube (contoh: https://youtu.be/xxxxx):');
    if (url) {
      const ta = textareaRef.current;
      const pos = ta ? ta.selectionStart : text.length;
      const newText =
        text.substring(0, pos) + `\n[VIDEO: ${url}]\n` + text.substring(pos);
      setText(newText);
    }
  };

  const handleSave = () => {
    onChange(text);
    onClose();
  };

  /** Simple markdown preview renderer */
  const renderPreview = (content: string) => {
    if (!content) return <p className="text-gray-300 italic text-sm">Belum ada konten...</p>;

    return content.split('\n').map((line, idx) => {
      // YouTube embed
      const videoMatch = line.match(/\[VIDEO:\s*(.*?)\]/);
      if (videoMatch) {
        const videoUrl = videoMatch[1].trim();
        const videoId = extractYouTubeId(videoUrl);
        if (videoId) {
          return (
            <div
              key={idx}
              className="my-4 rounded-2xl overflow-hidden shadow-lg border border-gray-100 aspect-video max-w-md mx-auto"
            >
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="w-full h-full"
                allowFullScreen
                title="Video"
              />
            </div>
          );
        }
        return (
          <div key={idx} className="my-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            URL video tidak valid: {videoUrl}
          </div>
        );
      }

      // Image
      const imgMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
      if (imgMatch) {
        return (
          <figure key={idx} className="my-4 text-center">
            <img
              src={imgMatch[2]}
              alt={imgMatch[1]}
              className="max-w-full mx-auto rounded-2xl shadow-md max-h-64 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzliYTFhZCIgZm9udC1zaXplPSIxMiI+R2FtYmFyIHRpZGFrIGRpdGVtdWthbjwvdGV4dD48L3N2Zz4=';
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
      if (line.startsWith('## '))
        return (
          <h3 key={idx} className="text-base font-bold text-gray-800 mt-4 mb-1.5">
            {line.slice(3)}
          </h3>
        );
      if (line.startsWith('# '))
        return (
          <h2 key={idx} className="text-lg font-bold text-gray-900 mt-5 mb-2">
            {line.slice(2)}
          </h2>
        );

      // Lists
      if (line.startsWith('- ') || line.startsWith('* '))
        return (
          <li key={idx} className="ml-5 list-disc text-sm text-gray-700 mt-0.5">
            {renderInline(line.slice(2))}
          </li>
        );

      // Numbered lists
      const numberedMatch = line.match(/^(\d+)\.\s(.*)/);
      if (numberedMatch)
        return (
          <li key={idx} className="ml-5 list-decimal text-sm text-gray-700 mt-0.5">
            {renderInline(numberedMatch[2])}
          </li>
        );

      // Empty line
      if (!line.trim()) return <div key={idx} className="h-2" />;

      // Regular paragraph
      return (
        <p key={idx} className="text-sm text-gray-700 leading-relaxed mb-1.5">
          {renderInline(line)}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
              <Maximize2 size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-gray-800 text-sm">
                {title}
              </h3>
              <p className="text-[10px] text-gray-400 font-medium">
                {text.length} karakter · {text.split('\n').length} baris ·{' '}
                <span className="text-primary-400">Ctrl+S untuk simpan</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                showPreview
                  ? 'bg-primary-50 text-primary-700 border-primary-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200'
              }`}
            >
              {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
              {showPreview ? 'Tutup Pratinjau' : 'Pratinjau'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1.5 px-6 py-2 border-b border-gray-100 bg-white">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mr-2">
            Format:
          </span>
          <button
            onClick={() => insertAtCursor('**', '**')}
            className="px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-bold text-gray-600 transition-all border border-gray-200"
            title="Teks Tebal"
          >
            <Type size={13} />
          </button>
          <button
            onClick={() => insertAtCursor('## ', '')}
            className="px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-bold text-gray-600 transition-all border border-gray-200"
            title="Heading"
          >
            <Hash size={13} />
          </button>
          <button
            onClick={() => insertAtCursor('- ', '')}
            className="px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-bold text-gray-600 transition-all border border-gray-200"
            title="Daftar"
          >
            <List size={13} />
          </button>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <button
            onClick={insertImage}
            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs font-bold text-blue-600 transition-all border border-blue-200 flex items-center gap-1"
          >
            <Image size={13} /> Gambar Link
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 rounded-lg text-xs font-bold text-sky-600 transition-all border border-sky-200 flex items-center gap-1"
          >
            <Upload size={13} /> Unggah Gambar
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <button
            onClick={insertVideo}
            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-bold text-red-600 transition-all border border-red-200 flex items-center gap-1"
          >
            <Video size={13} /> Video YT
          </button>
        </div>

        {/* Editor + Preview */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Textarea */}
          <div
            className={`${
              showPreview ? 'w-1/2 border-r border-gray-100' : 'w-full'
            } flex flex-col`}
          >
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 p-6 text-sm font-sans leading-[1.8] text-gray-800 resize-none focus:outline-none bg-white placeholder:text-gray-300"
              placeholder="Tulis konten materi di sini...&#10;&#10;Gunakan toolbar di atas untuk menyisipkan gambar atau video.&#10;&#10;Format yang didukung:&#10;**teks tebal**&#10;## Judul&#10;- Daftar&#10;![deskripsi](url gambar)&#10;[VIDEO: url youtube]"
              spellCheck={false}
            />
          </div>
          {/* Preview */}
          {showPreview && (
            <div className="w-1/2 p-6 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Eye size={12} /> Pratinjau Konten
              </div>
              <div className="space-y-0.5">{renderPreview(text)}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <p className="flex items-center gap-1 text-[10px] text-gray-400">
            <Lightbulb className="h-3 w-3" />
            <span>
            Gunakan <code className="bg-gray-100 px-1 rounded text-[9px]">**tebal**</code>,{' '}
            <code className="bg-gray-100 px-1 rounded text-[9px]">## Judul</code>,{' '}
            <code className="bg-gray-100 px-1 rounded text-[9px]">- Daftar</code>,{' '}
            <code className="bg-gray-100 px-1 rounded text-[9px]">![](url)</code>,{' '}
            <code className="bg-gray-100 px-1 rounded text-[9px]">[VIDEO: url]</code>
            </span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <Save size={13} /> Simpan & Tutup
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/** Render inline formatting (bold) */
function renderInline(text: string): React.ReactNode {
  if (!text) return null;
  const boldRegex = /\*\*(.*?)\*\*/g;
  if (!boldRegex.test(text)) return text;
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold text-gray-900">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}
