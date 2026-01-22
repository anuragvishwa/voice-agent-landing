import { useEffect, useRef } from 'react';

export function GlobalParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    let phoneRings = [];
    let signalLines = [];
    let soundWaves = [];

    // Responsive particle count - scale based on page height
    const getParticleCount = () => {
      if (typeof window === 'undefined') return 300;
      const docHeight = document.documentElement.scrollHeight || window.innerHeight;
      const heightMultiplier = Math.max(1, docHeight / window.innerHeight);
      const baseCount = window.innerWidth < 768 ? 80 : 150;
      return Math.floor(baseCount * heightMultiplier);
    };

    // Resize handler - use full document height for scrollable pages
    const resize = () => {
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );

      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = docHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      initParticles(window.innerWidth, docHeight);
      initPhoneRings(window.innerWidth, docHeight);
      initSignalLines(window.innerWidth, docHeight);
      initSoundWaves(window.innerWidth, docHeight);
    };

    // Initialize particles on LEFT and RIGHT edges only (no center)
    const initParticles = (width, height) => {
      const count = getParticleCount();
      const edgeZone = width * 0.22; // 22% from each edge

      particles = Array(count).fill(null).map(() => {
        // Place particles only on left or right edges
        const isLeftSide = Math.random() > 0.5;
        const x = isLeftSide
          ? Math.random() * edgeZone
          : width - (Math.random() * edgeZone);
        const y = Math.random() * height;

        // Particle types: phone, signal, dot
        const type = Math.random();
        let particleType = 'dot';
        if (type > 0.94) particleType = 'phone';
        else if (type > 0.86) particleType = 'signal';

        return {
          x,
          y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: particleType === 'dot' ? 2 + Math.random() * 3 : 3,
          isAccent: Math.random() > 0.6,
          isLeftSide,
          type: particleType,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    // Initialize phone ring pulse effects distributed across full page
    const initPhoneRings = (width, height) => {
      const edgeZone = width * 0.2;
      const viewportHeight = window.innerHeight;
      const numSections = Math.ceil(height / viewportHeight);
      phoneRings = [];

      // Add phone rings for each section of the page
      for (let section = 0; section < numSections; section++) {
        const sectionTop = section * viewportHeight;
        for (let i = 0; i < 4; i++) {
          const isLeft = i < 2;
          phoneRings.push({
            x: isLeft ? Math.random() * edgeZone : width - (Math.random() * edgeZone),
            y: sectionTop + Math.random() * viewportHeight,
            radius: 0,
            maxRadius: 45 + Math.random() * 25,
            alpha: 0,
            delay: Math.random() * 120 + section * 40 + i * 25,
            active: false,
            isLeft,
          });
        }
      }
    };

    // Initialize flowing signal lines on edges (not crossing center)
    const initSignalLines = (width, height) => {
      const edgeZone = width * 0.18;
      signalLines = [
        // Left side vertical flows
        { startX: edgeZone * 0.3, startY: 0, endX: edgeZone * 0.7, endY: height, isLeft: true },
        { startX: edgeZone * 0.6, startY: height, endX: edgeZone * 0.4, endY: 0, isLeft: true },
        // Right side vertical flows
        { startX: width - edgeZone * 0.3, startY: 0, endX: width - edgeZone * 0.7, endY: height, isLeft: false },
        { startX: width - edgeZone * 0.6, startY: height, endX: width - edgeZone * 0.4, endY: 0, isLeft: false },
      ].map(line => ({
        ...line,
        progress: Math.random(),
        speed: 0.0015 + Math.random() * 0.001,
      }));
    };

    // Initialize sound wave elements distributed across full page height
    const initSoundWaves = (width, height) => {
      const viewportHeight = window.innerHeight;
      const numSections = Math.ceil(height / viewportHeight);
      soundWaves = [];

      // Add sound waves for each viewport section
      for (let section = 0; section < numSections; section++) {
        const sectionTop = section * viewportHeight;
        soundWaves.push(
          { x: width * 0.07, y: sectionTop + viewportHeight * 0.25, phase: section * 0.5 },
          { x: width * 0.93, y: sectionTop + viewportHeight * 0.4, phase: Math.PI / 3 + section * 0.3 },
          { x: width * 0.05, y: sectionTop + viewportHeight * 0.65, phase: Math.PI / 2 + section * 0.4 },
          { x: width * 0.95, y: sectionTop + viewportHeight * 0.8, phase: Math.PI + section * 0.2 },
        );
      }
    };

    let time = 0;
    let frameCount = 0;

    // Animation loop
    function animate() {
      const width = window.innerWidth;
      const height = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      time += 0.016;
      frameCount++;

      ctx.clearRect(0, 0, width, height);

      // Draw flowing signal lines on edges
      signalLines.forEach((line) => {
        line.progress += line.speed;
        if (line.progress > 1) line.progress = 0;

        // Simple vertical line with slight curve
        const midX = (line.startX + line.endX) / 2 + Math.sin(time * 0.5) * 15;
        const midY = height / 2;

        // Draw the line path (subtle)
        ctx.beginPath();
        ctx.moveTo(line.startX, line.startY);
        ctx.quadraticCurveTo(midX, midY, line.endX, line.endY);
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.06)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw flowing particle on the line
        const t = line.progress;
        const particleX = (1 - t) * (1 - t) * line.startX + 2 * (1 - t) * t * midX + t * t * line.endX;
        const particleY = (1 - t) * (1 - t) * line.startY + 2 * (1 - t) * t * midY + t * t * line.endY;

        ctx.beginPath();
        ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(14, 165, 233, 0.5)';
        ctx.shadowColor = 'rgba(14, 165, 233, 0.6)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw phone ring pulses
      phoneRings.forEach((ring, i) => {
        ring.delay--;
        if (ring.delay <= 0 && !ring.active) {
          ring.active = true;
          ring.radius = 0;
          ring.alpha = 0.5;
        }

        if (ring.active) {
          ring.radius += 1.5;
          ring.alpha -= 0.008;

          if (ring.alpha > 0) {
            ctx.beginPath();
            ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(14, 165, 233, ${ring.alpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Inner ring
            if (ring.radius > 15) {
              ctx.beginPath();
              ctx.arc(ring.x, ring.y, ring.radius - 15, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(139, 92, 246, ${ring.alpha * 0.5})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          } else {
            // Reset the ring on edges only
            ring.active = false;
            ring.delay = 120 + Math.random() * 150;
            const edgeZone = width * 0.2;
            ring.x = ring.isLeft ? Math.random() * edgeZone : width - (Math.random() * edgeZone);
            ring.y = Math.random() * height;
          }
        }
      });

      // Draw sound wave visualizations
      soundWaves.forEach((wave) => {
        const bars = 5;
        const barWidth = 3;
        const gap = 4;
        const maxHeight = 18;

        for (let i = 0; i < bars; i++) {
          const barHeight = (Math.sin(time * 3 + wave.phase + i * 0.5) + 1) * 0.5 * maxHeight + 3;
          const barX = wave.x + (i - bars / 2) * (barWidth + gap);
          const barY = wave.y - barHeight / 2;

          const gradient = ctx.createLinearGradient(barX, barY, barX, barY + barHeight);
          gradient.addColorStop(0, 'rgba(14, 165, 233, 0.5)');
          gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.3)');
          gradient.addColorStop(1, 'rgba(14, 165, 233, 0.5)');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(barX, barY, barWidth, barHeight, 1.5);
          ctx.fill();
        }
      });

      // Draw connections between nearby particles (only on same side)
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          // Only connect particles on the same side
          if (particles[i].isLeftSide !== particles[j].isLeftSide) continue;

          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const baseOpacity = 0.2 * (1 - dist / 130);

            if (particles[i].isAccent || particles[j].isAccent) {
              ctx.strokeStyle = `rgba(14, 165, 233, ${baseOpacity * 0.8})`;
            } else {
              ctx.strokeStyle = `rgba(139, 92, 246, ${baseOpacity * 0.6})`;
            }
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particles (constrained to edges)
      const edgeZone = width * 0.22;

      particles.forEach((p) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Keep particles on their respective edge
        if (p.isLeftSide) {
          if (p.x < 0 || p.x > edgeZone) p.vx *= -1;
          p.x = Math.max(0, Math.min(edgeZone, p.x));
        } else {
          if (p.x < width - edgeZone || p.x > width) p.vx *= -1;
          p.x = Math.max(width - edgeZone, Math.min(width, p.x));
        }

        // Wrap vertically
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Full opacity for edge particles
        const particleOpacity = 0.7;

        if (p.type === 'phone') {
          // Draw mini phone icon
          ctx.save();
          ctx.translate(p.x, p.y);
          const scale = 0.4 + Math.sin(time * 2 + p.phase) * 0.1;
          ctx.scale(scale, scale);
          ctx.beginPath();
          ctx.arc(0, 0, 8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(14, 165, 233, ${particleOpacity * 0.3})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(14, 165, 233, ${particleOpacity * 0.6})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Phone handset shape (simplified)
          ctx.beginPath();
          ctx.arc(0, 0, 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(14, 165, 233, ${particleOpacity * 0.8})`;
          ctx.fill();
          ctx.restore();
        } else if (p.type === 'signal') {
          // Draw signal wave emanation
          const pulseRadius = 4 + Math.sin(time * 3 + p.phase) * 2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, pulseRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(14, 165, 233, ${particleOpacity * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Outer wave
          const outerRadius = 8 + Math.sin(time * 3 + p.phase + 1) * 3;
          ctx.beginPath();
          ctx.arc(p.x, p.y, outerRadius, -Math.PI * 0.4, Math.PI * 0.4);
          ctx.strokeStyle = `rgba(139, 92, 246, ${particleOpacity * 0.3})`;
          ctx.stroke();
        } else {
          // Regular dot particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

          if (p.isAccent) {
            ctx.shadowColor = `rgba(14, 165, 233, ${particleOpacity * 0.5})`;
            ctx.shadowBlur = 6;
            ctx.fillStyle = `rgba(14, 165, 233, ${particleOpacity * 0.7})`;
          } else {
            ctx.shadowColor = `rgba(139, 92, 246, ${particleOpacity * 0.4})`;
            ctx.shadowBlur = 4;
            ctx.fillStyle = `rgba(139, 92, 246, ${particleOpacity * 0.5})`;
          }
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      animationId = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    animate();

    // Re-initialize after a short delay to catch dynamically loaded content
    const delayedResize = setTimeout(() => {
      resize();
    }, 500);

    // Watch for DOM changes that might affect page height
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener('resize', resize);
      clearTimeout(delayedResize);
      resizeObserver.disconnect();
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
