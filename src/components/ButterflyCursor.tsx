import React, { useEffect, useRef, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

export default function ButterflyCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const leftWingRef = useRef<SVGPathElement>(null);
  const rightWingRef = useRef<SVGPathElement>(null);

  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // High performance coordinates and movement cache
  const mouseCoords = useRef({ x: 0, y: 0 });
  const butterflyCoords = useRef({ x: 0, y: 0 });
  const currentRotation = useRef(0);
  const isMoving = useRef(false);
  const moveTimerRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastParticleTime = useRef(0);

  useEffect(() => {
    // Only enable on devices that have a precise pointer cursor (no touch devices)
    const hasPointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasPointer) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseCoords.current.x = e.clientX;
      mouseCoords.current.y = e.clientY;

      // Set moving flag and clear timeout
      isMoving.current = true;
      if (moveTimerRef.current) {
        window.clearTimeout(moveTimerRef.current);
      }
      moveTimerRef.current = window.setTimeout(() => {
        isMoving.current = false;
      }, 150);

      // Detect clickable elements under the cursor
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = (
          target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.closest("button") ||
          target.closest("a") ||
          target.getAttribute("role") === "button" ||
          target.classList.contains("cursor-pointer") ||
          window.getComputedStyle(target).cursor === "pointer"
        );
        setIsHoveringClickable(!!isClickable);
      }
    };

    const handleMouseLeave = () => {
      isMoving.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Canvas sizing setup
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Physics & Drawing loop (Smooth 60fps)
    let animationFrameId: number;

    const tick = () => {
      // 1. Ease the butterfly position towards mouse coordinates
      const dx = mouseCoords.current.x - butterflyCoords.current.x;
      const dy = mouseCoords.current.y - butterflyCoords.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Elastic glide effect
      butterflyCoords.current.x += dx * 0.12;
      butterflyCoords.current.y += dy * 0.12;

      // Update actual DOM node for top performance
      if (containerRef.current) {
        // Calculate angle of motion
        if (distance > 1.5) {
          const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // offset 90deg to face top
          // Smooth rotation interpolation
          let diff = targetAngle - currentRotation.current;
          while (diff < -180) diff += 360;
          while (diff > 180) diff -= 360;
          currentRotation.current += diff * 0.18;
        }

        containerRef.current.style.transform = `translate3d(${butterflyCoords.current.x}px, ${butterflyCoords.current.y}px, 0) rotate(${currentRotation.current}deg)`;
      }

      // 2. Control flapping speed on wings dynamically
      if (leftWingRef.current && rightWingRef.current) {
        const speed = isMoving.current ? (isHoveringClickable ? "0.08s" : "0.13s") : "1.2s";
        leftWingRef.current.style.animationDuration = speed;
        rightWingRef.current.style.animationDuration = speed;
      }

      // 3. Spawning particles (Sparkle Trail)
      const now = performance.now();
      if (distance > 1.2 && now - lastParticleTime.current > (isHoveringClickable ? 18 : 45)) {
        lastParticleTime.current = now;
        
        // Spawn configuration
        const colors = isHoveringClickable
          ? ["#f59e0b", "#fbbf24", "#fef08a", "#d946ef", "#ff007f", "#ec4899", "#a855f7"] // Gorgeous hover cocktail
          : ["#38bdf8", "#06b6d4", "#a5f3fc", "#ffffff", "#e2e8f0"]; // Elegant ambient colors

        const particleCount = isHoveringClickable ? 2 : 1;
        for (let i = 0; i < particleCount; i++) {
          const angleOffset = Math.random() * Math.PI * 2;
          const speedFactor = Math.random() * 1.5 + 0.2;
          
          particlesRef.current.push({
            id: Math.random(),
            x: butterflyCoords.current.x,
            y: butterflyCoords.current.y + 10, // spawn slightly behind body
            vx: Math.cos(angleOffset) * speedFactor * 0.5 - (dx * 0.03), // subtle drift away from movement direction
            vy: Math.sin(angleOffset) * speedFactor * 0.5 - (dy * 0.03) + 0.1, // floating slightly upwards or downwards
            life: 1.0,
            size: Math.random() * (isHoveringClickable ? 7.5 : 4.5) + (isHoveringClickable ? 4 : 2),
            color: colors[Math.floor(Math.random() * colors.length)]
          });
        }
      }

      // 4. Update and render particles on canvas
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particlesRef.current.forEach((p) => {
          // Physics
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.015; // light gravity drift
          p.life -= isHoveringClickable ? 0.018 : 0.025; // fade rate

          // Draw custom glittering stars / diamond sparkle shapes
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillStyle = p.color;
          
          // Shadow glow effect for gorgeous sparkles in dark themes
          ctx.shadowBlur = isHoveringClickable ? 8 : 4;
          ctx.shadowColor = p.color;

          // 4-point Diamond Sparkle Path
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.28, -p.size * 0.28);
          ctx.lineTo(p.size, 0);
          ctx.lineTo(p.size * 0.28, p.size * 0.28);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.28, p.size * 0.28);
          ctx.lineTo(-p.size, 0);
          ctx.lineTo(-p.size * 0.28, -p.size * 0.28);
          ctx.closePath();
          ctx.fill();
          
          ctx.restore();
        });

        // Filter out dead particles
        particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (moveTimerRef.current) window.clearTimeout(moveTimerRef.current);
    };
  }, [isHoveringClickable]);

  if (!isVisible) return null;

  return (
    <>
      {/* High-frequency canvas overlay for trail rendering */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-[9998] no-print"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Butterfly hardware-accelerated wrapper */}
      <div
        ref={containerRef}
        className="fixed top-0 left-0 w-9 h-9 -ml-4.5 -mt-4.5 pointer-events-none z-[9999] transition-opacity duration-300 no-print"
        style={{ perspective: "1000px" }}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_5px_rgba(0,0,0,0.15)]"
        >
          <defs>
            {/* Ambient gradients */}
            <linearGradient id="normalLeft" x1="4" y1="12" x2="32" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2563eb" /> {/* Dark Blue */}
              <stop offset="50%" stopColor="#06b6d4" /> {/* Electric Cyan */}
              <stop offset="100%" stopColor="#38bdf8" /> {/* Ice Blue */}
            </linearGradient>
            <linearGradient id="normalRight" x1="60" y1="12" x2="32" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1d4ed8" />
              <stop offset="50%" stopColor="#0891b2" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>

            {/* Premium hover gradients (Magic gold & bright ruby rosa) */}
            <linearGradient id="hoverLeft" x1="4" y1="12" x2="32" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#d946ef" /> {/* Magenta */}
              <stop offset="60%" stopColor="#f59e0b" /> {/* Amber */}
              <stop offset="100%" stopColor="#fef08a" /> {/* Golden light */}
            </linearGradient>
            <linearGradient id="hoverRight" x1="60" y1="12" x2="32" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#c084fc" /> {/* Purple */}
              <stop offset="65%" stopColor="#ff007f" /> {/* Ruby Rose */}
              <stop offset="100%" stopColor="#f59e0b" /> {/* Golden light */}
            </linearGradient>
          </defs>

          {/* Butterfly SVG Elements */}
          <g>
            {/* Left Wings */}
            <path
              ref={leftWingRef}
              d="M32 29 C12 8, 2 18, 6 34 C8 42, 23 37, 32 29 M32 33 C18 40, 10 48, 16 54 C22 60, 28 47, 32 33"
              fill={`url(#${isHoveringClickable ? "hoverLeft" : "normalLeft"})`}
              className="left-wing-flap"
            />

            {/* Right Wings */}
            <path
              ref={rightWingRef}
              d="M32 29 C52 8, 62 18, 58 34 C56 42, 41 37, 32 29 M32 33 C46 40, 54 48, 48 54 C42 60, 36 47, 32 33"
              fill={`url(#${isHoveringClickable ? "hoverRight" : "normalRight"})`}
              className="right-wing-flap"
            />

            {/* Sleek Minimalist Butterfly Antennae */}
            <path
              d="M30 22 C24 13, 20 15, 17 19"
              stroke={isHoveringClickable ? "#f59e0b" : "#475569"}
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
            <path
              d="M34 22 C40 13, 44 15, 47 19"
              stroke={isHoveringClickable ? "#f59e0b" : "#475569"}
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />

            {/* Soft antennae dots */}
            <circle cx="17" cy="19" r="1.5" fill={isHoveringClickable ? "#f59e0b" : "#475569"} />
            <circle cx="47" cy="19" r="1.5" fill={isHoveringClickable ? "#f59e0b" : "#475569"} />

            {/* Butterfly core body */}
            <path
              d="M32 18 C33 18, 34 21, 33.5 28 C33 34, 32.5 45, 32 48 C31.5 45, 31 34, 30.5 28 C30 21, 31 18, 32 18 Z"
              fill={isHoveringClickable ? "#ffffff" : "#0f172a"}
              className="transition-colors duration-250 shadow-sm"
            />
          </g>
        </svg>
      </div>

      <style>{`
        /* Core Left & Right wing flapping using hardware-accelerated 3D rotateY */
        .left-wing-flap {
          transform-origin: 32px 30px;
          animation: flap-left 0.15s infinite alternate ease-in-out;
          will-change: transform;
        }

        .right-wing-flap {
          transform-origin: 32px 30px;
          animation: flap-right 0.15s infinite alternate ease-in-out;
          will-change: transform;
        }

        @keyframes flap-left {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(-65deg);
          }
        }

        @keyframes flap-right {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(65deg);
          }
        }
      `}</style>
    </>
  );
}
