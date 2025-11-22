import { useRef, useEffect } from "react";

export default function JumpscareOverlay({ play }: { play: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (play) {
      video.currentTime = 0.1; // rewind to start
      video.play();            // play from the beginning
    } else {
      video.pause();           // pause when hidden
      video.currentTime = 0.1; // reset so it's ready for next jumpscare
    }
  }, [play]);

  return (
    <div
      className={` fixed inset-0 bg-black transition-opacity duration-200
        ${play ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
    >
      <video
        ref={videoRef}
        src="/ahhh.mp4"
        className="w-screen h-screen object-cover bg-black"
        preload="auto"
        playsInline
      />
    </div>
  );
}
