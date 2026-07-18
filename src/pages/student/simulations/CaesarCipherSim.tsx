import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Key, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import canvasConfetti from 'canvas-confetti';

interface CaesarCipherSimProps {
  onComplete: (result: {
    score: number;
    maxScore: number;
    decisions: { scenarioId: string; choice: string; isCorrect: boolean }[];
  }) => void;
}

export default function CaesarCipherSim({ onComplete }: CaesarCipherSimProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [textToEncrypt, setTextToEncrypt] = useState('SIBER');
  const [shiftKey, setShiftKey] = useState(3);
  
  // Decryption challenge state
  const encryptedChallenge = 'KDWL-KDWL'; // 'HATI-HATI' with shift 3
  const [userDecryptedText, setUserDecryptedText] = useState('');
  const [isChallengeSuccess, setIsChallengeSuccess] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Caesar cipher logic helper
  const encryptCaesar = (str: string, shift: number): string => {
    return str
      .toUpperCase()
      .split('')
      .map((char) => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        }
        return char;
      })
      .join('');
  };

  const handleStartSim = () => setStep(2);

  const handleNextToChallenge = () => setStep(3);

  const checkDecryption = () => {
    const cleanAnswer = userDecryptedText.trim().toUpperCase();
    if (cleanAnswer === 'HATI-HATI') {
      setIsChallengeSuccess(true);
      setErrorMsg('');
      canvasConfetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        setStep(4);
      }, 1500);
    } else {
      setIsChallengeSuccess(false);
      setErrorMsg('Ups, kodenya belum tepat. Coba dekripsi lagi dengan teliti!');
    }
  };

  const handleComplete = () => {
    onComplete({
      score: isChallengeSuccess ? 50 : 20,
      maxScore: 50,
      decisions: [
        {
          scenarioId: 'caesar-cipher-encryption',
          choice: `Encrypted "${textToEncrypt}" with shift ${shiftKey}`,
          isCorrect: true,
        },
        {
          scenarioId: 'caesar-cipher-decryption',
          choice: userDecryptedText,
          isCorrect: !!isChallengeSuccess,
        },
      ],
    });
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-gradient-to-br from-indigo-950 to-slate-900 rounded-[40px] border-[10px] border-slate-800 p-4 shadow-2xl relative overflow-hidden h-[520px] sm:h-[620px] flex flex-col text-white">
      {/* Phone status bar */}
      <div className="flex justify-between items-center px-4 py-1 text-[10px] font-semibold opacity-75 select-none z-10 shrink-0">
        <span>20:26</span>
        <div className="w-12 h-4 bg-slate-800 rounded-full border border-slate-700/60" />
        <span> 100%</span>
      </div>

      <div className="flex justify-between items-center px-3 py-2 border-b border-white/10 select-none z-10 shrink-0 font-sans">
        <span className="font-bold tracking-wider text-sm text-indigo-300">
          SiberCrypt
        </span>
        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">
          Level: Pemula
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-between py-3 min-h-0 font-sans">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-between"
            >
              <div className="space-y-4 text-center mt-4">
                <div className="w-20 h-20 bg-indigo-500/20 border border-indigo-500/40 rounded-full flex items-center justify-center mx-auto text-indigo-300 animate-pulse">
                  <Lock className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">Sandi Kriptografi: Caesar Cipher</h3>
                  <p className="text-xs text-slate-300 px-4 leading-relaxed">
                    Tahukah kamu bagaimana pesan rahasia diamankan di internet? Konsepnya mirip dengan **Caesar Cipher** — sandi geser tertua di dunia yang digunakan oleh Julius Caesar!
                  </p>
                  <p className="text-[11px] text-indigo-200 px-4">
                    Setiap huruf digeser beberapa langkah ke depan di alfabet untuk menjadi kode rahasia. Yuk, pelajari cara enkripsi dan dekripsinya!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleStartSim}
                className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white py-3.5 rounded-2xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 mt-4"
              >
                Mulai Simulasi
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Langkah 1: Coba Enkripsi</h4>
                  <p className="text-[11px] text-slate-300">
                    Ketik sebuah kata (dalam huruf besar) dan ubah pergeseran kuncinya. Lihat bagaimana kata aslimu tersandikan secara otomatis!
                  </p>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 block">Ketik Kata (Huruf Besar):</label>
                    <input
                      type="text"
                      value={textToEncrypt}
                      onChange={(e) => setTextToEncrypt(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                      className="w-full bg-slate-800 border border-white/20 rounded-xl px-3 py-2 text-sm text-center font-bold font-mono focus:outline-none focus:border-indigo-500 uppercase"
                      placeholder="SIBER"
                      maxLength={10}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Kunci Pergeseran (Shift):</span>
                      <span className="font-bold text-indigo-300">+{shiftKey}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={shiftKey}
                      onChange={(e) => setShiftKey(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/40 border border-white/5 rounded-xl p-3 text-center">
                    <span className="text-[9px] text-slate-400 block font-bold">KATA ASLI</span>
                    <span className="text-base font-mono font-bold tracking-wider">{textToEncrypt || '-'}</span>
                  </div>
                  <div className="bg-indigo-900/40 border border-indigo-500/20 rounded-xl p-3 text-center">
                    <span className="text-[9px] text-indigo-300 block font-bold">KODE RAHASIA</span>
                    <span className="text-base font-mono font-bold tracking-wider text-indigo-200">
                      {encryptCaesar(textToEncrypt, shiftKey) || '-'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextToChallenge}
                className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white py-3.5 rounded-2xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                Coba Tantangan Dekripsi
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                    <Key className="w-3.5 h-3.5" />
                    Langkah 2: Pecahkan Kode!
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Kamu mendeteksi kode pesan rahasia berikut yang terenkripsi dengan **Caesar Cipher (Pergeseran +3)**:
                  </p>
                  
                  <div className="bg-slate-950/80 border border-white/10 rounded-xl py-3 text-center font-mono text-lg font-black tracking-widest text-indigo-300">
                    {encryptedChallenge}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 block">Ketik Hasil Dekripsi (Petunjuk: Geser mundur 3 huruf! K → H, D → A, W → T, L → I):</label>
                    <input
                      type="text"
                      value={userDecryptedText}
                      onChange={(e) => setUserDecryptedText(e.target.value.toUpperCase().replace(/[^A-Z-]/g, ''))}
                      className="w-full bg-slate-800 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-center font-bold font-mono focus:outline-none focus:border-indigo-500 uppercase"
                      placeholder="HATI-HATI"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="bg-rose-950/40 border border-rose-500/20 p-2.5 rounded-xl text-[10px] text-rose-300 flex items-start gap-1.5 leading-snug">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={checkDecryption}
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white py-3.5 rounded-2xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                Kirim Jawaban
                <Unlock className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex-1 flex flex-col justify-center items-center text-center p-6 space-y-6"
            >
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center text-emerald-300 text-3xl">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="font-bold text-lg">
                  Tantangan Berhasil!
                </h4>
                <p className="text-xs text-white/70 mt-2 max-w-[240px] leading-relaxed">
                  Hebat! Kamu berhasil mendekripsi kode rahasia **"HATI-HATI"**. Kamu sekarang mengerti bagaimana sandi geser digunakan untuk melindungi pesan penting.
                </p>
                <div className="mt-4 inline-block bg-white/10 border border-white/20 px-5 py-2 rounded-xl">
                  <span className="text-[9px] text-white/50 block font-bold">SKOR KRIPTOGRAFI</span>
                  <span className="text-xl font-black text-indigo-300">
                    50 / 50
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleComplete}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 active:scale-95 text-white py-3.5 px-8 rounded-xl font-bold text-xs shadow-lg transition-all"
              >
                Simpan & Selesai
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
