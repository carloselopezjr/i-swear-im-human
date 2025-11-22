"use client";

import React, { useRef, useEffect, useState } from "react";

interface CircleCaptchaProps {
  onSuccess: () => void;
  onClose: () => void;
}

export default function CircleCaptcha({ onSuccess, onClose }: CircleCaptchaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isDrawing = useRef(false);
  const points = useRef<{ x: number; y: number }[]>([]);
  const failedFromLift = useRef(false);

  const beep = useRef<HTMLAudioElement | null>(null);

  const timers = useRef<NodeJS.Timeout[]>([]);
  const intervals = useRef<NodeJS.Timeout[]>([]);

  const [result, setResult] = useState<null | { score: number; pass: boolean; reason?: string }>(null);
  const [showRetry, setShowRetry] = useState(false);

  const [isShaking, setIsShaking] = useState(false);
  const [driftOffset, setDriftOffset] = useState({ x: 0, y: 0 });

  const DRIFT_MIN = 8;
  const DRIFT_MAX = 12;

  useEffect(() => {
    startFresh();
    return () => cleanupAll();
  }, []);

  // timer helpers

  function setTimer(cb: () => void, delay: number) {
    const t = setTimeout(cb, delay);
    timers.current.push(t);
    return t;
  }

  function setIntervalTracked(cb: () => void, delay: number) {
    const i = setInterval(cb, delay);
    intervals.current.push(i);
    return i;
  }

  function cleanupAll() {
    timers.current.forEach(clearTimeout);
    intervals.current.forEach(clearInterval);
    timers.current = [];
    intervals.current = [];

    if (beep.current) {
      beep.current.pause();
      beep.current.currentTime = 0;
    }

    setIsShaking(false);
    setDriftOffset({ x: 0, y: 0 });
  }

  // captcha start

  function startFresh() {
    cleanupAll();

    beep.current = new Audio("/percusion-timer-sound.mp3");

    setTimer(() => {
      beep.current!.play().catch(() => {});
    }, 0);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, 400, 400);
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#A322F2";

    drawCenterDot(ctx);

    scheduleChaosEvents();
    startAutoStopTimer();
  }

  // center dot

  function drawCenterDot(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(200, 200, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // chaos timing

  function scheduleChaosEvents() {
    setTimer(() => {
      triggerShake(500);
      applyRandomDrift(500);
      playSingleBeep();
    }, 3000);

    setTimer(() => {
      triggerShake(1200);
      applyRandomDrift(1200);
      playRapidBeeps(1200);
    }, 5000);
  }

  function triggerShake(duration: number) {
    setIsShaking(true);
    setTimer(() => setIsShaking(false), duration);
  }

  function applyRandomDrift(duration: number) {
    const interval = setIntervalTracked(() => {
      const x =
        (Math.random() > 0.5 ? 1 : -1) *
        (Math.random() * (DRIFT_MAX - DRIFT_MIN) + DRIFT_MIN);

      const y =
        (Math.random() > 0.5 ? 1 : -1) *
        (Math.random() * (DRIFT_MAX - DRIFT_MIN) + DRIFT_MIN);

      setDriftOffset({ x, y });
    }, 80);

    setTimer(() => {
      clearInterval(interval);
      setDriftOffset({ x: 0, y: 0 });
    }, duration);
  }

  function playSingleBeep() {
    if (!beep.current) return;
    beep.current.currentTime = 0;
    beep.current.play();
  }

  function playRapidBeeps(duration: number) {
    if (!beep.current) return;

    const interval = setIntervalTracked(() => {
      beep.current!.currentTime = 0;
      beep.current!.play();
    }, 90);

    setTimer(() => clearInterval(interval), duration);
  }

  function startAutoStopTimer() {
    setTimer(() => finishDrawing(true), 9000); // 9 seconds timeout
  }

  // drawing events

  function handleMouseDown(e: React.MouseEvent) {
    isDrawing.current = true;
    failedFromLift.current = false;

    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    points.current = [{ x, y }];
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDrawing.current || result) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const last = points.current[points.current.length - 1];

    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    points.current.push({ x, y });

    checkForCircleCompletion(x, y);
  }

  function handleMouseUp() {
    if (!result) {
      failedFromLift.current = true;
      finishDrawing(false);
    }
    isDrawing.current = false;
  }

  // strict circle completion logic

  function checkForCircleCompletion(x: number, y: number) {
    const pts = points.current;
    if (pts.length < 150) return;

    const start = pts[0];
    const dx = x - start.x;
    const dy = y - start.y;
    const distToStart = Math.sqrt(dx * dx + dy * dy);

    if (distToStart > 15) return;

    const cx = 200;
    const cy = 200;

    let angles = pts.map(p => Math.atan2(p.y - cy, p.x - cx));
    angles = angles.map(a => (a < 0 ? a + Math.PI * 2 : a)).sort((a, b) => a - b);

    let maxGap = 0;
    for (let i = 0; i < angles.length - 1; i++) {
      const gap = angles[i + 1] - angles[i];
      if (gap > maxGap) maxGap = gap;
    }

    const endGap = (Math.PI * 2) - angles[angles.length - 1] + angles[0];
    if (endGap > maxGap) maxGap = endGap;

    const coverage = (Math.PI * 2) - maxGap;

    if (coverage > 4.2) finishDrawing(false);
  }

  // finish and scoring

  function finishDrawing(fromTimeout: boolean) {
    cleanupAll();

    if (failedFromLift.current) {
      setResult({ score: 0, pass: false, reason: "please draw a complete circle ✗" });
      setShowRetry(true);
      return;
    }

    if (fromTimeout && !isCircleClosed(points.current)) {
      setResult({ score: 0, pass: false, reason: "please draw a complete circle ✗" });
      setShowRetry(true);
      return;
    }

    const score = calculateCircleAccuracy(points.current);
    const pass = score >= 78;

    if (!isCircleClosed(points.current)) {
      setResult({ score, pass: false, reason: "please draw a complete circle ✗" });
      setShowRetry(true);
      return;
    }

    setResult({ score, pass });

    if (!pass) setShowRetry(true);
  }

  function isCircleClosed(path: { x: number; y: number }[]) {
    if (path.length < 150) return false;

    const cx = 200;
    const cy = 200;

    let angles = path.map(p => Math.atan2(p.y - cy, p.x - cx));
    angles = angles.map(a => (a < 0 ? a + Math.PI * 2 : a)).sort((a, b) => a - b);

    let maxGap = 0;
    for (let i = 0; i < angles.length - 1; i++) {
      const gap = angles[i + 1] - angles[i];
      if (gap > maxGap) maxGap = gap;
    }

    const endGap = (Math.PI * 2) - angles[angles.length - 1] + angles[0];
    if (endGap > maxGap) maxGap = endGap;

    const coverage = (Math.PI * 2) - maxGap;
    return coverage > 4.2;
  }

  function calculateCircleAccuracy(path: { x: number; y: number }[]) {
    if (path.length < 10) return 0;

    const cx = 200;
    const cy = 200;

    const distances = path.map(p =>
      Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2)
    );

    const avg = distances.reduce((a, b) => a + b, 0) / distances.length;
    const variance =
      distances.reduce((a, r) => a + (r - avg) ** 2, 0) / distances.length;
    const deviation = Math.sqrt(variance);

    if (avg < 60) return 0;

    return Math.round(Math.max(0, 100 - deviation * 4));
  }

  // reset

  function resetCaptcha() {
    cleanupAll();
    points.current = [];
    failedFromLift.current = false;
    setResult(null);
    setShowRetry(false);
    startFresh();
  }

  // ui

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 ${
        isShaking ? "animate-shake" : ""
      }`}
      style={{
        zIndex: 9999,
        transform: `translate(${driftOffset.x}px, ${driftOffset.y}px)`
      }}
    >
      <div className="absolute top-6 text-white text-xl font-semibold">
        draw a perfect circle in one continuous stroke
      </div>

      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="bg-black border border-white rounded-lg"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />

      {result && (
        <div className="absolute top-20 text-center text-white text-xl">
          {result.reason ? result.reason : `accuracy: ${result.score}% ${result.pass ? "✓" : "✗"}`}
        </div>
      )}

      {result?.pass && (
        <button
          onClick={onSuccess}
          className="absolute bottom-10 bg-purple-600 px-4 py-2 rounded text-white"
        >
          continue login
        </button>
      )}

      {showRetry && (
        <button
          onClick={resetCaptcha}
          className="absolute bottom-10 bg-red-600 px-4 py-2 rounded text-white"
        >
          retry
        </button>
      )}

      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white text-2xl"
      >
        ×
      </button>
    </div>
  );
}
