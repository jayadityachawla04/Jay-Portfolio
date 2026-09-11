"use client";

import { useEffect, useRef } from "react";

export function PortraitField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = canvas?.parentElement;
    if (!canvas || !frame) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let animation = 0;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const resize = () => {
      const box = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width;
      height = box.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const move = (event: PointerEvent) => {
      const box = frame.getBoundingClientRect();
      pointer.targetX = Math.max(-1, Math.min(1, (event.clientX - box.left) / box.width * 2 - 1));
      pointer.targetY = Math.max(-1, Math.min(1, (event.clientY - box.top) / box.height * 2 - 1));
      frame.style.transform = `perspective(900px) rotateX(${-pointer.targetY * 2.2}deg) rotateY(${pointer.targetX * 3.2}deg)`;
    };
    const leave = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
      frame.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    };

    const render = (timestamp = 0) => {
      const time = reduced ? 2.4 : timestamp * 0.001;
      pointer.x += (pointer.targetX - pointer.x) * 0.05;
      pointer.y += (pointer.targetY - pointer.y) * 0.05;
      context.clearRect(0, 0, width, height);
      context.save();
      context.globalCompositeOperation = "lighter";
      const cx = width / 2 + pointer.x * 7;
      const cy = height / 2 + pointer.y * 5;
      const rx = width * 0.39;
      const ry = height * 0.34;

      for (let ring = 0; ring < 3; ring += 1) {
        const phase = time * (ring % 2 ? -0.2 : 0.16) + ring * 1.7;
        const gradient = context.createLinearGradient(cx - rx, cy, cx + rx, cy);
        gradient.addColorStop(0, "rgba(36,91,210,0)");
        gradient.addColorStop(0.35, `rgba(77,143,255,${0.18 + ring * 0.05})`);
        gradient.addColorStop(0.62, "rgba(211,229,255,0.55)");
        gradient.addColorStop(1, "rgba(36,91,210,0)");
        context.strokeStyle = gradient;
        context.lineWidth = 1 + ring * 0.45;
        context.beginPath();
        context.ellipse(cx, cy, rx + ring * 17, ry + ring * 10, -0.18 + ring * 0.14, phase, phase + Math.PI * (0.72 + ring * 0.1));
        context.stroke();
      }

      for (let index = 0; index < 58; index += 1) {
        const seed = index * 12.9898;
        const speed = 0.13 + (index % 7) * 0.012;
        const angle = seed + time * speed * (index % 2 ? 1 : -1);
        const depth = 0.72 + (index % 9) / 26;
        const x = cx + Math.cos(angle) * rx * depth;
        const y = cy + Math.sin(angle) * ry * depth;
        const alpha = 0.18 + ((index * 17) % 10) / 15;
        const radius = index % 13 === 0 ? 2.3 : 0.65 + (index % 3) * 0.32;
        context.fillStyle = index % 11 === 0 ? `rgba(232,242,255,${alpha})` : `rgba(77,143,255,${alpha})`;
        context.shadowColor = index % 11 === 0 ? "#d9e8ff" : "#4d8fff";
        context.shadowBlur = radius * 5;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
      if (!reduced) animation = requestAnimationFrame(render);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    frame.addEventListener("pointermove", move);
    frame.addEventListener("pointerleave", leave);
    resize();
    render();
    return () => {
      cancelAnimationFrame(animation);
      observer.disconnect();
      frame.removeEventListener("pointermove", move);
      frame.removeEventListener("pointerleave", leave);
      frame.style.transform = "";
    };
  }, []);

  return <canvas ref={canvasRef} className="portrait-field" aria-hidden="true" />;
}
