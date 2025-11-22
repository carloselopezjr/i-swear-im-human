"use client";

import { useState } from "react";
import CircleCaptcha from "../../components/CircleCaptcha";

export default function CircleTestPage() {
  const [showCaptcha, setShowCaptcha] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white gap-6">
      <h1 className="text-3xl font-bold">You Thought You Were Done?</h1>

      <button
        onClick={() => setShowCaptcha(true)}
        className="bg-purple-600 px-6 py-3 rounded-lg"
      >
        open captcha
      </button>

      {showCaptcha && (
        <CircleCaptcha
          onSuccess={() => {
            alert("passed!");
            setShowCaptcha(false);
          }}
          onClose={() => {
            alert("closed");
            setShowCaptcha(false);
          }}
        />
      )}
    </div>
  );
}
