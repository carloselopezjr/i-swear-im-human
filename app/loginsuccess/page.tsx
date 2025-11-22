"use client";

export default function Winpage() {
  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="border border-white/20 shadow-xl backdrop-blur-md 
                      p-10 rounded-xl w-[350px] text-white bg-black/30 text-center">
        
        <h1 className="text-3xl font-bold mb-4">
          🎉 Congrats! 🎉
        </h1>

        <p className="text-white/80 text-lg">
          You've succesfully logged in.
        </p>
      </div>
    </main>
  );
}
