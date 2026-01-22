import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Player } from "@remotion/player";
import { HeroAnimation } from "../../remotion/HeroAnimation";

// Canvas-based floating phone and wave elements
function FloatingVoiceElements() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const floatingElements = [];
    const glowOrbs = [];
    const pulseRings = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      floatingElements.length = 0;
      const positions = [
        { x: 0.08, y: 0.15, size: 28, speed: 0.3, phase: 0 },
        { x: 0.92, y: 0.2, size: 24, speed: 0.25, phase: 1 },
        { x: 0.05, y: 0.7, size: 20, speed: 0.35, phase: 2 },
        { x: 0.95, y: 0.65, size: 26, speed: 0.28, phase: 3 },
        { x: 0.12, y: 0.45, size: 18, speed: 0.32, phase: 4 },
        { x: 0.88, y: 0.5, size: 22, speed: 0.38, phase: 5 },
      ];

      positions.forEach((p) => {
        floatingElements.push({
          baseX: p.x * rect.width,
          baseY: p.y * rect.height,
          x: p.x * rect.width,
          y: p.y * rect.height,
          size: p.size,
          speed: p.speed,
          phase: p.phase,
          type: ['phone', 'headset', 'wave', 'bell'][Math.floor(Math.random() * 4)],
          alpha: 0.25 + Math.random() * 0.15,
        });
      });

      glowOrbs.length = 0;
      for (let i = 0; i < 10; i++) {
        glowOrbs.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          baseX: Math.random() * rect.width,
          baseY: Math.random() * rect.height,
          radius: 3 + Math.random() * 4,
          speed: 0.2 + Math.random() * 0.3,
          phase: Math.random() * Math.PI * 2,
          color: Math.random() > 0.5 ? 'blue' : 'purple',
        });
      }
    };

    // Draw phone icon
    const drawPhone = (x, y, size, alpha) => {
      ctx.save();
      ctx.translate(x - size/2, y - size/2);
      ctx.scale(size / 24, size / 24);
      ctx.beginPath();
      ctx.moveTo(22, 16.92);
      ctx.lineTo(22, 19.92);
      ctx.bezierCurveTo(22, 20.99, 21.1, 21.92, 19.82, 21.92);
      ctx.bezierCurveTo(16, 21.5, 12.2, 19.9, 9.15, 16.85);
      ctx.bezierCurveTo(6.1, 13.8, 4.5, 10, 4.08, 6.18);
      ctx.bezierCurveTo(3.98, 4.9, 4.91, 3.92, 6.11, 3.92);
      ctx.lineTo(9.11, 3.92);
      ctx.bezierCurveTo(10.11, 3.92, 11, 4.64, 11.11, 5.64);
      ctx.bezierCurveTo(11.2, 6.2, 11.51, 7.45, 11.81, 8.45);
      ctx.bezierCurveTo(11.97, 8.95, 11.83, 9.5, 11.36, 9.91);
      ctx.lineTo(10.09, 11.18);
      ctx.bezierCurveTo(12.6, 15.18, 15.82, 17.4, 17.82, 18.91);
      ctx.lineTo(19.09, 17.64);
      ctx.bezierCurveTo(19.5, 17.17, 20.05, 17.03, 20.55, 17.19);
      ctx.bezierCurveTo(21.55, 17.49, 22.8, 17.8, 23.36, 17.89);
      ctx.bezierCurveTo(24.36, 18, 25.08, 18.89, 25.08, 19.89);
      ctx.closePath();
      ctx.strokeStyle = `rgba(14, 165, 233, ${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    };

    // Draw headset icon
    const drawHeadset = (x, y, size, alpha) => {
      ctx.save();
      ctx.translate(x - size/2, y - size/2);
      ctx.scale(size / 24, size / 24);
      ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
      ctx.lineWidth = 1.5;

      // Headset arc
      ctx.beginPath();
      ctx.arc(12, 12, 8, Math.PI, 0, false);
      ctx.stroke();

      // Left earpiece
      ctx.beginPath();
      ctx.roundRect(3, 12, 4, 6, 1);
      ctx.stroke();

      // Right earpiece
      ctx.beginPath();
      ctx.roundRect(17, 12, 4, 6, 1);
      ctx.stroke();

      ctx.restore();
    };

    // Draw wave icon (sound waves)
    const drawWave = (x, y, size, alpha) => {
      ctx.save();
      ctx.translate(x - size/2, y - size/2);
      ctx.scale(size / 24, size / 24);
      ctx.strokeStyle = `rgba(14, 165, 233, ${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';

      // Sound waves
      ctx.beginPath();
      ctx.arc(8, 12, 3, -Math.PI/2, Math.PI/2, false);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(8, 12, 6, -Math.PI/2, Math.PI/2, false);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(8, 12, 9, -Math.PI/2, Math.PI/2, false);
      ctx.stroke();

      ctx.restore();
    };

    // Draw bell icon
    const drawBell = (x, y, size, alpha) => {
      ctx.save();
      ctx.translate(x - size/2, y - size/2);
      ctx.scale(size / 24, size / 24);
      ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(18, 8);
      ctx.bezierCurveTo(18, 4.69, 15.31, 2, 12, 2);
      ctx.bezierCurveTo(8.69, 2, 6, 4.69, 6, 8);
      ctx.bezierCurveTo(6, 15, 3, 17, 3, 17);
      ctx.lineTo(21, 17);
      ctx.bezierCurveTo(21, 17, 18, 15, 18, 8);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(13.73, 21);
      ctx.bezierCurveTo(13.5, 21.5, 12.8, 22, 12, 22);
      ctx.bezierCurveTo(11.2, 22, 10.5, 21.5, 10.27, 21);
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      time += 0.016;

      ctx.clearRect(0, 0, width, height);

      // Draw connection lines between floating elements
      ctx.lineWidth = 1;
      for (let i = 0; i < floatingElements.length; i++) {
        for (let j = i + 1; j < floatingElements.length; j++) {
          const el1 = floatingElements[i];
          const el2 = floatingElements[j];
          const dist = Math.hypot(el2.x - el1.x, el2.y - el1.y);
          if (dist < 350) {
            const alpha = (1 - dist / 350) * 0.06;
            ctx.strokeStyle = `rgba(14, 165, 233, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(el1.x, el1.y);
            ctx.lineTo(el2.x, el2.y);
            ctx.stroke();
          }
        }
      }

      // Update and draw glow orbs
      glowOrbs.forEach((orb) => {
        orb.x = orb.baseX + Math.sin(time * orb.speed + orb.phase) * 30;
        orb.y = orb.baseY + Math.cos(time * orb.speed * 0.7 + orb.phase) * 20;

        const pulseAlpha = 0.15 + Math.sin(time * 2 + orb.phase) * 0.08;
        const pulseSize = orb.radius + Math.sin(time * 1.5 + orb.phase) * 2;

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, pulseSize * 3);
        if (orb.color === 'blue') {
          gradient.addColorStop(0, `rgba(14, 165, 233, ${pulseAlpha})`);
          gradient.addColorStop(1, 'rgba(14, 165, 233, 0)');
        } else {
          gradient.addColorStop(0, `rgba(139, 92, 246, ${pulseAlpha})`);
          gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
        }
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, pulseSize * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, pulseSize * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = orb.color === 'blue'
          ? `rgba(14, 165, 233, ${pulseAlpha * 2})`
          : `rgba(139, 92, 246, ${pulseAlpha * 2})`;
        ctx.fill();
      });

      // Update and draw floating elements
      floatingElements.forEach((el) => {
        el.x = el.baseX + Math.sin(time * el.speed + el.phase) * 15;
        el.y = el.baseY + Math.cos(time * el.speed * 0.8 + el.phase) * 10;

        const pulseAlpha = el.alpha + Math.sin(time * 1.5 + el.phase) * 0.08;

        if (el.type === 'phone') {
          drawPhone(el.x, el.y, el.size, pulseAlpha);
        } else if (el.type === 'headset') {
          drawHeadset(el.x, el.y, el.size, pulseAlpha);
        } else if (el.type === 'wave') {
          drawWave(el.x, el.y, el.size, pulseAlpha);
        } else {
          drawBell(el.x, el.y, el.size, pulseAlpha);
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

export function Hero() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const playerRef = useRef(null);

  // Cycle to next scenario when animation loops
  const handleLoop = useCallback(() => {
    setScenarioIndex((prev) => (prev + 1) % 5);
  }, []);

  return (
    <section className="relative pt-32 pb-16 px-6 overflow-hidden">
      {/* Floating voice elements */}
      <FloatingVoiceElements />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 bg-slate-900/60 mb-8">
          <span className="w-2 h-4 bg-secondary animate-blink rounded-sm" />
          <span className="font-mono text-xs text-muted">24/7 Voice AI &bull; Restoration Industry</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-foreground mb-6 leading-[1.1]">
          Never miss an emergency call again
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          AI-powered intake and dispatch system that answers every call, captures the right details, and routes to on-call teams instantly.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a
            href="#demo"
            className="bg-secondary text-white px-8 py-3 rounded-md font-mono text-sm font-medium hover:bg-secondary/90 transition-colors"
          >
            Book a 15-min Demo
          </a>
          <Link
            to="/video"
            className="border border-slate-700 px-8 py-3 rounded-md font-mono text-sm text-foreground hover:bg-slate-800/60 transition-colors"
          >
            See How It Works
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {["24/7 Intake", "Smart Triage", "Instant Dispatch", "Full Visibility", "Multi-Location"].map(
            (item) => (
              <span
                key={item}
                className="px-3 py-1 rounded-full border border-slate-700 bg-slate-900/60 font-mono text-xs text-muted"
              >
                {item}
              </span>
            )
          )}
        </div>
      </div>

      {/* Call Flow Animation */}
      <div className="relative max-w-5xl mx-auto mt-16 px-4">
        <div className="rounded-xl overflow-hidden border border-slate-800/50 shadow-2xl">
          {/* Decorative glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/10 via-purple-500/10 to-sky-500/10 blur-xl opacity-50 -z-10" />
          <Player
            ref={playerRef}
            component={HeroAnimation}
            inputProps={{ scenarioIndex }}
            durationInFrames={450}
            compositionWidth={1200}
            compositionHeight={550}
            fps={30}
            style={{
              width: "100%",
            }}
            loop
            autoPlay
            onEnded={handleLoop}
          />
        </div>
      </div>
    </section>
  );
}
