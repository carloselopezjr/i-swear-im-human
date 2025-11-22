'use client';
  
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
  // After creating the account send to a win page or smth
  // router.push('/win');
  }

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
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
      <div className="bg-[bg-[#3A0AA0] border border-white/20 shadow-xl backdrop-blur-md 
                      p-10 rounded-xl w-[350px] text-white">
        <h2 className="text-center text-2xl font-bold mb-6">Sign Up</h2>

        {/* Email */}
        <label className="block mb-2 font-semibold">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-6 rounded-md bg-[#a322f2] text-white placeholder-white/80 outline-none"
        />

        {/* Password */}
        <label className="block mb-2 font-semibold">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-8 rounded-md bg-[#a322f2] text-white placeholder-white/80 outline-none"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-md bg-[#8F2CC9] hover:bg-[#b933ff] text-white font-semibold transition"
        >
          Sign in
        </button>
      </div>
      </form>
    </main>
  );
}
