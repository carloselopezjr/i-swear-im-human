"use client";

import { useState } from "react";

interface ConfettiPiece {
  id: number;
  left: number;      // 0–100 (% across screen)
  size: number;      // px
  duration: number;  // seconds
  delay: number;     // seconds
  rotation: number;  // deg
  color: string;
}

const COLORS = ["#ff6b6b", "#ffd93d", "#6bcBff", "#b933ff", "#8FFF8F"];

export default function WinPage() {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [waves, setWaves] = useState(0);

  function spawnConfettiWave(count = 80) {
    const now = Date.now();
    const pieces: ConfettiPiece[] = [];

    for (let i = 0; i < count; i++) {
      pieces.push({
        id: now + i,
        left: Math.random() * 100,
        size: 6 + Math.random() * 10,
        duration: 3 + Math.random() * 2, // 3–5s
        delay: Math.random() * 0.8,
        rotation: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    setConfetti((prev) => [...prev, ...pieces]);
    setWaves((w) => w + 1);
  }

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      {/* Confetti overlay */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="absolute rounded-sm"
            style={{
              left: `${piece.left}%`,
              top: "-10%",
              width: piece.size,
              height: piece.size * 1.4,
              backgroundColor: piece.color,
              transform: `rotate(${piece.rotation}deg)`,
              animation: `confetti-fall ${piece.duration}s linear ${piece.delay}s forwards`,
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div className="border border-white/20 shadow-xl backdrop-blur-md 
                      p-10 rounded-xl w-[350px] text-white relative z-10 bg-black/30">
        <h1 className="text-3xl font-bold text-center mb-2">
          You have signed in 🎉
        </h1>

        <button
          type="button"
          onClick={() => spawnConfettiWave()}
          className="w-full py-3 rounded-md bg-[#8F2CC9] hover:bg-[#b933ff] 
                     text-white font-semibold text-lg transition active:scale-95"
        >
          YAYYY
        </button>

        <p className="mt-4 text-xs text-center text-white/70">
          Confetti waves launched: <span className="font-mono">{waves}</span>
          <br />
          (Each click = ~80 pieces. We&apos;re so sorry.)
        </p>

        <a
          href="/"
          className="block mt-4 text-center text-xs text-white/60 underline"
        >
          Back to login
        </a>
      </div>

      {/* keyframes for confetti */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translate3d(0, 120vh, 0) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </main>
  );
}
