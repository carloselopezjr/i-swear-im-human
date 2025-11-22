"use client";

import { useEffect, useRef, useState } from "react";

// EMAIL-SAFE CHARACTERS (lowercase only)
const EMAIL_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789._-@";

function getRandomChar() {
  return EMAIL_CHARS[Math.floor(Math.random() * EMAIL_CHARS.length)];
}

export default function EmailCatchGame({
  onComplete = (email: string) => {},
}) {
  const [basketX, setBasketX] = useState(150);
  const [chars, setChars] = useState<
    { id: number; letter: string; x: number; y: number }[]
  >([]);

  const [email, setEmail] = useState("");

  // prevents double catching
  const caughtIds = useRef(new Set<number>());

  /** ---------------------------------------------
   * 1. Anti-bunching X coordinate generator
   * --------------------------------------------- **/
  const [lastX, setLastX] = useState<number | null>(null);

  function generateX(prev: number | null) {
    let x = Math.random() * 300;

    if (prev !== null && Math.abs(x - prev) < 150) {
      x = (x + 200) % 300;
    }
    return x;
  }

  /** ---------------------------------------------
   * 2. Basket movement
   * --------------------------------------------- **/
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setBasketX((x) => Math.max(0, x - 20));
      if (e.key === "ArrowRight") setBasketX((x) => Math.min(300, x + 20));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  /** ---------------------------------------------
   * 3. Spawn random email-safe lowercase characters
   * --------------------------------------------- **/
  useEffect(() => {
    const interval = setInterval(() => {
      if (chars.length > 10) return;

      const letter = getRandomChar();
      const x = generateX(lastX);
      setLastX(x);

      setChars((prev) => [
        ...prev,
        {
          id: Date.now(),
          letter,
          x,
          y: Math.random() * 120,
        },
      ]);
    }, 300);

    return () => clearInterval(interval);
  }, [lastX, chars.length]);

  /** ---------------------------------------------
   * 4. FALL + CATCH (TOP-ONLY HITBOX + NO DOUBLE CATCH)
   * --------------------------------------------- **/
  useEffect(() => {
    const fall = setInterval(() => {
      setChars((prev) =>
        prev
          .map((c) => ({
            ...c,
            y: c.y + 4,
          }))
          .filter((c) => {
            const basketWidth = 40;
            const basketHeight = 6;
            const basketTopY = 450 - basketHeight - 2;

            const letterWidth = 20;
            const letterHeight = 20;

            const basketLeft = basketX;
            const basketRight = basketX + basketWidth;

            const charLeft = c.x;
            const charRight = c.x + letterWidth;

            const charTop = c.y;
            const charBottom = c.y + letterHeight;

            const horizontal =
              charRight >= basketLeft && charLeft <= basketRight;

            const hitsTop =
              charBottom >= basketTopY && charTop <= basketTopY + 4;

            if (horizontal && hitsTop) {
              if (!caughtIds.current.has(c.id)) {
                caughtIds.current.add(c.id);
                setEmail((txt) => txt + c.letter);
              }
              return false;
            }

            return c.y < 500;
          })
      );
    }, 40);

    return () => clearInterval(fall);
  }, [basketX]);

  /** ---------------------------------------------
   * BACKSPACE FUNCTION
   * --------------------------------------------- **/
  function handleBackspace() {
    setEmail((txt) => txt.slice(0, -1)); // remove last char
  }

  /** ---------------------------------------------
   * 5. Render
   * --------------------------------------------- **/
  return (
    <div className="flex flex-col items-center">
      {/* GAME BOX */}
      <div className="relative w-[350px] h-[450px] bg-yellow-200 border-4 border-black overflow-hidden">
        {chars.map((c) => (
          <div
            key={c.id}
            className="absolute text-3xl font-bold text-green-700 select-none"
            style={{ top: c.y, left: c.x }}
          >
            {c.letter}
          </div>
        ))}

        {/* precision basket */}
        <div
          className="absolute bottom-2 w-10 h-6 bg-red-500 border-2 border-black"
          style={{ left: basketX }}
        />
      </div>

      {/* email display */}
      <div className="mt-3 text-white text-lg font-mono">
        Email: {email}
      </div>

      {/* BACKSPACE + CONFIRM SIDE BY SIDE */}
      <div className="mt-3 flex flex-row gap-4">
        <button
          className="px-3 py-1 bg-red-600 text-white rounded"
          onClick={handleBackspace}
        >
          Backspace
        </button>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => onComplete(email)}
        >
          Confirm Email
        </button>
      </div>
    </div>
  );
}

