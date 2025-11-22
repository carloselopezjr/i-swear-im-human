export default function Home() {
  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg.jpg')" }}
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
          className="w-full px-4 py-2 mb-6 rounded-md bg-[#a322f2] text-white placeholder-white/80 outline-none"
        />

        {/* Password */}
        <label className="block mb-2 font-semibold">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full px-4 py-2 mb-8 rounded-md bg-[#a322f2] text-white placeholder-white/80 outline-none"
        />

        {/* Button */}
        <button
          className="w-full py-2 rounded-md bg-[#8F2CC9] hover:bg-[#b933ff] text-white font-semibold transition"
        >
          Sign in
        </button>
      </div>
    </main>
  );
}
