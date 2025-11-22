'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EmailCatchGame from '@/components/EmailCatchGame';
import PasswordAimGame from '@/components/PasswordAimGame';
import Fnaf from '@/components/jumpscare/fnaf';

export default function Home() {
  
  // Email and password states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Game toggles
  const [showEmailGame, setShowEmailGame] = useState(false);
  const [showPasswordGame, setShowPasswordGame] = useState(false);

  // Jumpscare state
  const [showJumpscare, setShowJumpscare] = useState(false);
  const [jumpscareActive, setJumpscareActive] = useState(false);

  useEffect(() => {
    if (!jumpscareActive) return;

    let showTimeout: ReturnType<typeof setTimeout>;
    let hideTimeout: ReturnType<typeof setTimeout>;

    function scheduleNextJumpscare() {
      const delay = (Math.random() * 5 + 5) * 1000;

      showTimeout = setTimeout(() => {
        setShowJumpscare(true);

        hideTimeout = setTimeout(() => {
          setShowJumpscare(false);
          scheduleNextJumpscare();
        }, 1500);
      }, delay);
    }

    scheduleNextJumpscare();

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, [jumpscareActive]);


  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Signup failed');
      return;
    }

    router.push('/loginsuccess');

  }

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg.jpg')" }}
      onClick={() => setJumpscareActive(true)}
    >

      {/* EMAIL GAME SCREEN */}
      {showEmailGame && (
        <div className="flex flex-col items-center">
          <EmailCatchGame
            onComplete={(value: string) => {
              setEmail(value);
              setShowEmailGame(false);
            }}
          />
          <button
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded"
            onClick={() => setShowEmailGame(false)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* PASSWORD GAME SCREEN */}
      {showPasswordGame && (
        <div className="flex flex-col items-center">
          <PasswordAimGame
            onComplete={(value: string) => {
              setPassword(value);
              setShowPasswordGame(false);
            }}
            onCancel={() => setShowPasswordGame(false)}
          />
          <button
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded"
            onClick={() => setShowPasswordGame(false)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* ONLY SHOW FORM IF NO GAME IS ACTIVE */}
      {!showEmailGame && !showPasswordGame && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center"
        >
          {/* Title */}
          <div className="text-center text-white mb-8 drop-shadow-xl">
            <h2 className="text-4xl font-bold mb-3">Welcome to...</h2>
            <h1 className="text-5xl font-bold">i swear im human :&gt;</h1>
          </div>

          {/* Login Card */}
          <div className="border border-white/20 shadow-xl backdrop-blur-md 
                          p-10 rounded-xl w-[350px] text-white">
            <h2 className="text-center text-2xl font-bold mb-6">Sign Up</h2>

            {/* Email */}
            <label className="block mb-2 font-semibold">Email</label>
            <input
              type="text"
              placeholder="Click to enter email"
              value={email}
              readOnly
              onClick={() => setShowEmailGame(true)}
              className="w-full px-4 py-2 mb-6 rounded-md bg-[#a322f2] text-white placeholder-white/80 outline-none cursor-pointer"
            />

            {/* Password */}
            <label className="block mb-2 font-semibold">Password</label>
            <input
              type="text"
              placeholder="Click to generate password"
              value={password}
              readOnly
              onClick={() => setShowPasswordGame(true)}
              className="w-full px-4 py-2 mb-8 rounded-md bg-[#a322f2] text-white placeholder-white/80 outline-none cursor-pointer"
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-md bg-[#8F2CC9] hover:bg-[#b933ff] text-white font-semibold transition"
            >
              Sign in
            </button>
          </div>
        </form>
      )}

      <Fnaf play={showJumpscare} />
    </main>
  );
}
