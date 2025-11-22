"use client";

import { useState, useRef, useEffect } from "react";

const KEYBOARD = [
  "1234567890",
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
  "._-@",
];

const ALL_KEYS = KEYBOARD.join("").split("");

// SLOWER METER — 4 seconds
const MAX_HOLD_MS = 4000;

export default function PasswordAimGame({ onComplete, onCancel }) {
  const [password, setPassword] = useState("");
  const [isHolding, setIsHolding] = useState(false);
  const [holdTime, setHoldTime] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  function holdToKey(ms: number) {
    const clamped = Math.min(ms, MAX_HOLD_MS);
    const ratio = clamped / MAX_HOLD_MS;
    const index = Math.floor(ratio * (ALL_KEYS.length - 1));
    return ALL_KEYS[index];
  }

  function startHold() {
    if (isHolding) return;

    setIsHolding(true);
    startTimeRef.current = Date.now();
    setHoldTime(0);

    intervalRef.current = setInterval(() => {
      if (!startTimeRef.current) return;
      setHoldTime(Date.now() - startTimeRef.current);
    }, 20);
  }

  function releaseHold() {
    if (!isHolding) return;

    setIsHolding(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    const key = holdToKey(holdTime);
    setPassword((prev) => prev + key);

    setHoldTime(0);
    startTimeRef.current = null;
  }

  useEffect(() => {
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, []);

  function backspace() {
    setPassword((p) => p.slice(0, -1));
  }

  function clearAll() {
    setPassword("");
  }

  const progressRatio = Math.min(holdTime / MAX_HOLD_MS, 1);
  const previewLetter = isHolding ? holdToKey(holdTime) : null;

  return (
    <div className="min-h-screen w-full text-white flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-bold">Generate Your Password</h1>

      <div className="text-xl font-mono bg-gray-800 px-4 py-2 rounded border border-white/20">
        {password || <span className="text-white/40">No characters yet…</span>}
      </div>

      <div className="w-full max-w-md flex flex-col items-center gap-2">
        <div className="text-4xl h-10 font-bold">{previewLetter || ""}</div>

        <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden border border-white/30">
          <div
            className="bg-purple-500 h-full"
            style={{ width: `${progressRatio * 100}%` }}
          />
        </div>
      </div>

      <button
        onMouseDown={startHold}
        onMouseUp={releaseHold}
        onMouseLeave={releaseHold}
        onTouchStart={(e) => { e.preventDefault(); startHold(); }}
        onTouchEnd={(e) => { e.preventDefault(); releaseHold(); }}
        className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded text-lg font-semibold active:scale-95 transition"
      >
        HOLD to aim → RELEASE to select
      </button>

      <div className="flex flex-col gap-2 mt-4">
        {KEYBOARD.map((row, idx) => (
          <div key={idx} className="flex gap-1 justify-center">
            {row.split("").map((k) => (
              <div
                key={k}
                className={[
                  "px-3 py-2 rounded bg-gray-800 border border-white/10 font-mono",
                  previewLetter === k ? "bg-purple-500 text-black" : "",
                ].join(" ")}
              >
                {k}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={backspace}
          className="px-3 py-2 bg-red-500 rounded hover:bg-red-400"
        >
          Backspace
        </button>

        <button
          onClick={clearAll}
          className="px-3 py-2 bg-gray-600 rounded hover:bg-gray-500"
        >
          Clear
        </button>

        <button
          onClick={() => onComplete(password)}
          className="px-4 py-2 hover:bg-[#8F2CC9] bg-[#b933ff] rounded font-semibold"
        >
          Done
        </button>
      </div>

      <button
        onClick={onCancel}
        className="text-white/50 underline mt-4"
      >
        Cancel
      </button>
    </div>
  );
}
