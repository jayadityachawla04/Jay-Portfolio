"use client";

import { useEffect, useRef } from "react";

export function KineticCursor() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node || !window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const core = node.querySelector<HTMLElement>(".kinetic-cursor__core");
    const ring = node.querySelector<HTMLElement>(".kinetic-cursor__ring");
    const tail = Array.from(node.querySelectorAll<HTMLElement>(".kinetic-cursor__tail i"));
    const target = { x: -80, y: -80 };
    const ringPosition = { x: -80, y: -80 };
    const trail = tail.map(() => ({ x: -80, y: -80 }));
    let frame = 0;

    const move = (event: MouseEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      node.classList.add("is-visible");
      node.classList.toggle("is-active", Boolean((event.target as Element | null)?.closest("a, button, summary")));
      if (core) core.style.transform = `translate3d(${target.x}px,${target.y}px,0)`;
    };
    const down = () => node.classList.add("is-down");
    const up = () => node.classList.remove("is-down");
    const leave = () => node.classList.remove("is-visible");
    const animate = () => {
      ringPosition.x += (target.x - ringPosition.x) * 0.14;
      ringPosition.y += (target.y - ringPosition.y) * 0.14;
      if (ring) ring.style.transform = `translate3d(${ringPosition.x}px,${ringPosition.y}px,0)`;
      trail.forEach((point, index) => {
        const leader = index === 0 ? target : trail[index - 1];
        const ease = Math.max(0.12, 0.28 - index * 0.02);
        point.x += (leader.x - point.x) * ease;
        point.y += (leader.y - point.y) * ease;
        tail[index].style.transform = `translate3d(${point.x}px,${point.y}px,0) scale(${1 - index * 0.1})`;
      });
      frame = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div ref={root} className="kinetic-cursor" aria-hidden="true">
      <div className="kinetic-cursor__tail">{Array.from({ length: 7 }, (_, i) => <i key={i} />)}</div>
      <i className="kinetic-cursor__ring" />
      <i className="kinetic-cursor__core" />
    </div>
  );
}
