"use client";

import EmailCatchGame from "@/components/EmailCatchGame";

export default function Page() {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-black">
      <EmailCatchGame
        onComplete={(email) => {
          alert("Email entered: " + email);
          // In final version: setEmail(email); close popup; etc.
        }}
      />
    </div>
  );
}
