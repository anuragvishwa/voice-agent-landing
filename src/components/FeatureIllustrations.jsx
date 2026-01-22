import { useRef, useEffect } from 'react';

// Voice Intake Illustration - Shows call being captured and processed
export function VoiceIntakeIllustration() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    // Sound wave bars
    const bars = Array.from({ length: 12 }, (_, i) => ({
      x: 40 + i * 25,
      baseHeight: 20 + Math.random() * 30,
      phase: i * 0.3,
    }));

    // Data flow particles
    const particles = Array.from({ length: 8 }, (_, i) => ({
      y: 50 + Math.random() * 150,
      x: 0,
      speed: 0.6 + Math.random() * 0.4,
      size: 2 + Math.random() * 2,
    }));

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      time += 0.016;

      ctx.clearRect(0, 0, width, height);

      // Background grid
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Phone icon on left
      const phoneX = 50;
      const phoneY = height / 2;

      // Phone glow
      const phoneGlow = ctx.createRadialGradient(phoneX, phoneY, 0, phoneX, phoneY, 40);
      phoneGlow.addColorStop(0, 'rgba(14, 165, 233, 0.3)');
      phoneGlow.addColorStop(1, 'rgba(14, 165, 233, 0)');
      ctx.fillStyle = phoneGlow;
      ctx.beginPath();
      ctx.arc(phoneX, phoneY, 40, 0, Math.PI * 2);
      ctx.fill();

      // Phone circle
      ctx.beginPath();
      ctx.arc(phoneX, phoneY, 25, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(14, 165, 233, 0.1)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Phone icon
      ctx.save();
      ctx.translate(phoneX - 10, phoneY - 10);
      ctx.scale(0.8, 0.8);
      ctx.beginPath();
      ctx.moveTo(22, 16.92);
      ctx.bezierCurveTo(22, 17.98, 21.1, 18.92, 19.82, 18.92);
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.9)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Pulse rings from phone
      const pulseRadius = 30 + (time * 20) % 40;
      const pulseAlpha = 0.4 - ((time * 20) % 40) / 100;
      if (pulseAlpha > 0) {
        ctx.beginPath();
        ctx.arc(phoneX, phoneY, pulseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(14, 165, 233, ${pulseAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Sound wave visualization in center
      const waveX = width * 0.4;
      bars.forEach((bar, i) => {
        const barHeight = bar.baseHeight * (0.5 + Math.sin(time * 3 + bar.phase) * 0.5);
        const x = waveX + i * 15;
        const y = height / 2 - barHeight / 2;

        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, 'rgba(14, 165, 233, 0.8)');
        gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.6)');
        gradient.addColorStop(1, 'rgba(14, 165, 233, 0.8)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, 8, barHeight, 4);
        ctx.fill();
      });

      // Data flow to right (database icon)
      const dbX = width - 60;
      const dbY = height / 2;

      particles.forEach((p) => {
        p.x += p.speed;
        if (p.x > width - 100) {
          p.x = waveX + 180;
          p.y = height / 2 + (Math.random() - 0.5) * 60;
        }

        const alpha = Math.min(1, (p.x - waveX - 180) / 50);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(14, 165, 233, ${alpha * 0.7})`;
        ctx.fill();

        // Trail
        for (let i = 1; i <= 4; i++) {
          ctx.beginPath();
          ctx.arc(p.x - i * 8, p.y, p.size * (1 - i * 0.2), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(14, 165, 233, ${alpha * 0.2 * (1 - i * 0.2)})`;
          ctx.fill();
        }
      });

      // Database icon
      const dbGlow = ctx.createRadialGradient(dbX, dbY, 0, dbX, dbY, 40);
      dbGlow.addColorStop(0, 'rgba(34, 197, 94, 0.3)');
      dbGlow.addColorStop(1, 'rgba(34, 197, 94, 0)');
      ctx.fillStyle = dbGlow;
      ctx.beginPath();
      ctx.arc(dbX, dbY, 40, 0, Math.PI * 2);
      ctx.fill();

      // Database cylinder
      ctx.beginPath();
      ctx.ellipse(dbX, dbY - 15, 20, 8, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(dbX - 20, dbY - 15);
      ctx.lineTo(dbX - 20, dbY + 15);
      ctx.ellipse(dbX, dbY + 15, 20, 8, 0, Math.PI, 0);
      ctx.lineTo(dbX + 20, dbY - 15);
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
      ctx.stroke();

      // Labels
      ctx.font = '11px monospace';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
      ctx.textAlign = 'center';
      ctx.fillText('INCOMING', phoneX, phoneY + 50);
      ctx.fillText('PROCESSING', waveX + 80, height - 20);
      ctx.fillText('CAPTURED', dbX, dbY + 50);

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
      className="w-full h-[280px]"
    />
  );
}

// Triage Illustration - Shows priority routing
export function TriageIllustration() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const priorities = [
      { label: 'EMERGENCY', color: '#ef4444', colorRgb: '239, 68, 68', y: 0.2 },
      { label: 'URGENT', color: '#f59e0b', colorRgb: '245, 158, 11', y: 0.5 },
      { label: 'ROUTINE', color: '#22c55e', colorRgb: '34, 197, 94', y: 0.8 },
    ];

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      time += 0.016;

      ctx.clearRect(0, 0, width, height);

      // Central funnel/triage point
      const centerX = width * 0.35;
      const centerY = height * 0.5;

      // Draw incoming call indicator
      const inX = 50;
      const inY = height / 2;

      ctx.beginPath();
      ctx.arc(inX, inY, 20 + Math.sin(time * 4) * 3, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = 'bold 10px monospace';
      ctx.fillStyle = 'rgba(14, 165, 233, 0.9)';
      ctx.textAlign = 'center';
      ctx.fillText('CALL', inX, inY + 4);

      // Arrow from call to center
      ctx.beginPath();
      ctx.moveTo(inX + 25, inY);
      ctx.lineTo(centerX - 30, inY);
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.4)';
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Triage hub
      const hubGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 50);
      hubGlow.addColorStop(0, 'rgba(139, 92, 246, 0.25)');
      hubGlow.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = hubGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = 'rgba(139, 92, 246, 0.9)';
      ctx.textAlign = 'center';
      ctx.fillText('TRIAGE', centerX, centerY + 3);

      // Rotating indicator
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 2);
      ctx.beginPath();
      ctx.arc(0, 0, 38, 0, Math.PI * 0.5);
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();

      // Priority outputs
      priorities.forEach((p, i) => {
        const targetX = width - 80;
        const targetY = height * p.y;

        // Path from center to priority
        ctx.beginPath();
        ctx.moveTo(centerX + 30, centerY);
        ctx.quadraticCurveTo(
          centerX + 80, centerY,
          centerX + 100, targetY
        );
        ctx.lineTo(targetX - 35, targetY);
        ctx.strokeStyle = `rgba(${p.colorRgb}, 0.3)`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Animated particle on path
        const t = ((time * 0.5 + i * 0.3) % 1);
        const px = centerX + 30 + (targetX - 35 - centerX - 30) * t;
        const py = centerY + (targetY - centerY) * Math.min(1, t * 2);

        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Priority badge
        const badgeGlow = ctx.createRadialGradient(targetX, targetY, 0, targetX, targetY, 35);
        badgeGlow.addColorStop(0, `rgba(${p.colorRgb}, 0.2)`);
        badgeGlow.addColorStop(1, `rgba(${p.colorRgb}, 0)`);
        ctx.fillStyle = badgeGlow;
        ctx.beginPath();
        ctx.arc(targetX, targetY, 35, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.roundRect(targetX - 45, targetY - 15, 90, 30, 6);
        ctx.fillStyle = `rgba(${p.colorRgb}, 0.15)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${p.colorRgb}, 0.5)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = p.color;
        ctx.textAlign = 'center';
        ctx.fillText(p.label, targetX, targetY + 4);
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
      className="w-full h-[280px]"
    />
  );
}

// Dispatch Illustration - Shows team routing
export function DispatchIllustration() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const teamMembers = [
      { label: 'Tech Mike', status: 'active', y: 0.25 },
      { label: 'Tech Sarah', status: 'busy', y: 0.5 },
      { label: 'Manager', status: 'backup', y: 0.75 },
    ];

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      time += 0.016;

      ctx.clearRect(0, 0, width, height);

      // Dispatch center on left
      const dispatchX = 70;
      const dispatchY = height / 2;

      const dispatchGlow = ctx.createRadialGradient(dispatchX, dispatchY, 0, dispatchX, dispatchY, 50);
      dispatchGlow.addColorStop(0, 'rgba(14, 165, 233, 0.3)');
      dispatchGlow.addColorStop(1, 'rgba(14, 165, 233, 0)');
      ctx.fillStyle = dispatchGlow;
      ctx.beginPath();
      ctx.arc(dispatchX, dispatchY, 50, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(dispatchX, dispatchY, 35, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dispatch arrows icon
      ctx.save();
      ctx.translate(dispatchX - 12, dispatchY - 10);
      ctx.scale(1, 1);
      ctx.beginPath();
      ctx.moveTo(8, 5);
      ctx.lineTo(18, 12);
      ctx.lineTo(8, 19);
      ctx.moveTo(16, 5);
      ctx.lineTo(26, 12);
      ctx.lineTo(16, 19);
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.9)';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();

      ctx.font = '9px monospace';
      ctx.fillStyle = 'rgba(14, 165, 233, 0.8)';
      ctx.textAlign = 'center';
      ctx.fillText('DISPATCH', dispatchX, dispatchY + 50);

      // Team members
      teamMembers.forEach((member, i) => {
        const memberX = width - 100;
        const memberY = height * member.y;

        // Connection line
        const isActive = member.status === 'active';
        const isBusy = member.status === 'busy';

        ctx.beginPath();
        ctx.moveTo(dispatchX + 35, dispatchY);
        ctx.bezierCurveTo(
          dispatchX + 100, dispatchY,
          memberX - 100, memberY,
          memberX - 45, memberY
        );
        ctx.strokeStyle = isActive
          ? 'rgba(34, 197, 94, 0.4)'
          : isBusy
            ? 'rgba(245, 158, 11, 0.2)'
            : 'rgba(148, 163, 184, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Animated message packet (only for active)
        if (isActive) {
          const t = (time * 0.8) % 1;
          const px = dispatchX + 35 + (memberX - 45 - dispatchX - 35) * t;
          const py = dispatchY + (memberY - dispatchY) * t;

          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
          ctx.fill();

          // Trail
          for (let j = 1; j <= 5; j++) {
            const tt = Math.max(0, t - j * 0.05);
            const tpx = dispatchX + 35 + (memberX - 45 - dispatchX - 35) * tt;
            const tpy = dispatchY + (memberY - dispatchY) * tt;
            ctx.beginPath();
            ctx.arc(tpx, tpy, 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(34, 197, 94, ${0.5 - j * 0.1})`;
            ctx.fill();
          }
        }

        // Member card
        const cardColor = isActive
          ? { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.5)', text: '#22c55e' }
          : isBusy
            ? { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', text: '#f59e0b' }
            : { bg: 'rgba(148, 163, 184, 0.1)', border: 'rgba(148, 163, 184, 0.3)', text: '#94a3b8' };

        ctx.beginPath();
        ctx.roundRect(memberX - 45, memberY - 25, 90, 50, 8);
        ctx.fillStyle = cardColor.bg;
        ctx.fill();
        ctx.strokeStyle = cardColor.border;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // User icon
        ctx.beginPath();
        ctx.arc(memberX - 25, memberY - 5, 8, 0, Math.PI * 2);
        ctx.strokeStyle = cardColor.text;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = cardColor.text;
        ctx.textAlign = 'left';
        ctx.fillText(member.label, memberX - 10, memberY - 2);

        // Status
        ctx.font = '8px monospace';
        ctx.fillStyle = cardColor.text;
        ctx.fillText(member.status.toUpperCase(), memberX - 10, memberY + 12);

        // Pulse for active member
        if (isActive) {
          const pulseSize = 55 + Math.sin(time * 4) * 5;
          ctx.beginPath();
          ctx.arc(memberX, memberY, pulseSize, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(34, 197, 94, 0.2)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Legend
      ctx.font = '9px monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(34, 197, 94, 0.8)';
      ctx.fillText('Acknowledged', 20, height - 10);

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
      className="w-full h-[280px]"
    />
  );
}
