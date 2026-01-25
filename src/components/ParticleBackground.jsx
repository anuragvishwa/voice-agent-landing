import { useEffect, useRef } from 'react';

export function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    // Colors
    const GREEN = { r: 34, g: 197, b: 94 };   // #22c55e
    const PURPLE = { r: 139, g: 92, b: 246 }; // #8b5cf6

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 12000);

      for (let i = 0; i < count; i++) {
        // 30% green, 70% purple
        const isGreen = Math.random() < 0.3;
        const color = isGreen ? GREEN : PURPLE;

        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          opacity: isGreen ? (Math.random() * 0.4 + 0.3) : (Math.random() * 0.35 + 0.2),
          color,
          isGreen,
          shadowBlur: isGreen ? 8 : 6,
        });
      }
    };

    const drawConnections = () => {
      const maxDistance = 120;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.15;
            const p = particles[i];

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);

            if (p.isGreen) {
              ctx.strokeStyle = `rgba(${GREEN.r}, ${GREEN.g}, ${GREEN.b}, ${opacity * 0.8})`;
            } else {
              ctx.strokeStyle = `rgba(${PURPLE.r}, ${PURPLE.g}, ${PURPLE.b}, ${opacity * 0.7})`;
            }
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections first (behind particles)
      drawConnections();

      // Draw particles with glow
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Add glow effect
        ctx.shadowBlur = p.shadowBlur;
        ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.isGreen ? 0.5 : 0.4})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity})`;
        ctx.fill();

        // Reset shadow for next particle
        ctx.shadowBlur = 0;
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate();

    const handleResize = () => {
      resize();
      createParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
}
