"use client";

import { useEffect, useRef } from "react";

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export function Spotlight({
  className = "",
  fill = "white",
}: SpotlightProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!svgRef.current || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create a spotlight effect that follows the mouse
      svgRef.current.setAttribute("cx", String(x));
      svgRef.current.setAttribute("cy", String(y));
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    >
      <svg
        ref={svgRef}
        className="absolute w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="spotlight-gradient">
            <stop offset="0%" stopColor={fill} stopOpacity="0.8" />
            <stop offset="50%" stopColor={fill} stopOpacity="0.3" />
            <stop offset="100%" stopColor={fill} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle
          cx="600"
          cy="400"
          r="300"
          fill="url(#spotlight-gradient)"
          style={{
            filter: "blur(40px)",
          }}
        />
      </svg>
    </div>
  );
}
