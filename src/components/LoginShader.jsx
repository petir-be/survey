// import Motion
import React, { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
} from "motion/react";

const LoginShader = () => {
  const canvasRef = useRef(null);
  const phase = useMotionValue(0); // Motion value for animation phase
  const waveOffset = useTransform(phase, (p) => p % (Math.PI * 2)); // convert to workable offset

  // Update phase continuously
  useAnimationFrame(() => {
    // increment phase (you may adjust speed)
    phase.set(phase.get() + 0.02);
    draw();
  });

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.clearRect(0, 0, width, height);

    const dotSpacing = 30;
    const baseRadius = 3.5;
    const offset = waveOffset.get(); // get the current transformed value

    for (let x = 0; x < width; x += dotSpacing) {
      for (let y = 0; y < height; y += dotSpacing) {
        const wave =
          Math.sin((x + offset * 100) * 0.02) *
          Math.cos((y + offset * 100) * 0.02);
        const radius = baseRadius + wave * 1.2;

        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.5, radius), 0, Math.PI * 2);
        ctx.fillStyle = "#C8C9DA";
        ctx.fill();
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-screen bg-[#DFE0F0] overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-50"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default LoginShader;