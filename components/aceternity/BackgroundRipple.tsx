"use client";

import { useCallback, useRef } from "react";

interface BackgroundRippleProps {
  className?: string;
  rippleColor?: string;
}

export function BackgroundRipple({
  className = "",
  rippleColor = "rgba(59, 130, 246, 0.5)",
}: BackgroundRippleProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create ripple element
    const ripple = document.createElement("div");
    ripple.className = "absolute rounded-full pointer-events-none";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.style.width = "0px";
    ripple.style.height = "0px";
    ripple.style.backgroundColor = rippleColor;
    ripple.style.transform = "translate(-50%, -50%)";
    ripple.style.boxShadow = `0 0 0 1px ${rippleColor}`;

    containerRef.current.appendChild(ripple);

    // Animate ripple
    const startTime = Date.now();
    const duration = 600;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const size = progress * 400;

      ripple.style.width = size + "px";
      ripple.style.height = size + "px";
      ripple.style.opacity = String(Math.max(0, 1 - progress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        ripple.remove();
      }
    };

    animate();
  }, [rippleColor]);

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`absolute inset-0 overflow-hidden cursor-pointer ${className}`}
    >
      {/* Grid pattern for visual feedback */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
}
