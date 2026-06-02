import { useEffect, useRef } from "react";

const COLORS = ["#fcc92c", "#ff6b6b", "#4ecdc4", "#a78bfa"] as const;

export default function ColorWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId = 0;
    let t = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#1d1d1d";
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < COLORS.length; i++) {
        const phase = t * 0.001 + i * 1.2;
        const x = width * (0.5 + Math.sin(phase) * 0.22);
        const y = height * (0.5 + Math.cos(phase * 0.9) * 0.18);
        const radius =
          Math.min(width, height) * (0.22 + Math.sin(phase * 1.3) * 0.06);

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, COLORS[i] + "cc");
        gradient.addColorStop(1, COLORS[i] + "00");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      t += 16;
      frameId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas.parentElement!);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-label="Color waves generative canvas"
    />
  );
}
