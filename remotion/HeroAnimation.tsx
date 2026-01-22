import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
} from "remotion";

// Service scenarios that rotate each loop
const scenarios = [
  { service: "Water Damage", emoji: "💧", caller: "Pipe burst flooding basement!", color: "#0ea5e9", emergency: "Water leak detected" },
  { service: "Fire Damage", emoji: "🔥", caller: "Smoke damage from kitchen fire", color: "#f97316", emergency: "Fire damage reported" },
  { service: "Roofing", emoji: "🏠", caller: "Storm damaged my roof!", color: "#ef4444", emergency: "Roof damage urgent" },
  { service: "Carpet Cleaning", emoji: "🧹", caller: "Emergency stain removal needed", color: "#a855f7", emergency: "Priority cleaning" },
  { service: "Construction", emoji: "🏗️", caller: "Foundation crack emergency", color: "#eab308", emergency: "Structural concern" },
];

// Bezier curve helper for particle paths
const getBezierPoint = (
  t: number,
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number }
) => {
  const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
  const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
  return { x, y };
};

// Floating background particles - expanded for full canvas
const BackgroundParticles = () => {
  const frame = useCurrentFrame();

  const particles = [
    { x: 80, y: 60, size: 2, speed: 0.3, phase: 0 },
    { x: 200, y: 100, size: 3, speed: 0.25, phase: 1 },
    { x: 350, y: 50, size: 2, speed: 0.35, phase: 2 },
    { x: 500, y: 120, size: 2.5, speed: 0.28, phase: 3 },
    { x: 650, y: 80, size: 2, speed: 0.32, phase: 4 },
    { x: 800, y: 140, size: 3, speed: 0.22, phase: 5 },
    { x: 950, y: 70, size: 2, speed: 0.3, phase: 6 },
    { x: 1100, y: 110, size: 2.5, speed: 0.27, phase: 7 },
    { x: 120, y: 450, size: 2, speed: 0.33, phase: 8 },
    { x: 280, y: 480, size: 2, speed: 0.29, phase: 9 },
    { x: 450, y: 460, size: 2.5, speed: 0.31, phase: 10 },
    { x: 620, y: 490, size: 2, speed: 0.26, phase: 11 },
    { x: 780, y: 470, size: 3, speed: 0.34, phase: 12 },
    { x: 940, y: 450, size: 2, speed: 0.28, phase: 13 },
    { x: 1080, y: 480, size: 2.5, speed: 0.32, phase: 14 },
    { x: 180, y: 280, size: 2, speed: 0.3, phase: 15 },
    { x: 1020, y: 300, size: 2, speed: 0.27, phase: 16 },
  ];

  return (
    <>
      {particles.map((p, i) => {
        const offsetX = Math.sin(frame * 0.02 * p.speed + p.phase) * 20;
        const offsetY = Math.cos(frame * 0.015 * p.speed + p.phase) * 15;
        const opacity = 0.15 + Math.sin(frame * 0.03 + p.phase) * 0.1;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x + offsetX,
              top: p.y + offsetY,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: i % 2 === 0 ? "#0ea5e9" : "#8b5cf6",
              opacity,
            }}
          />
        );
      })}
      {/* Connection lines */}
      <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {[
          [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
          [8, 9], [9, 10], [10, 11], [11, 12], [12, 13],
        ].map(([a, b], i) => {
          const p1 = particles[a];
          const p2 = particles[b];
          const x1 = p1.x + Math.sin(frame * 0.02 * p1.speed + p1.phase) * 20;
          const y1 = p1.y + Math.cos(frame * 0.015 * p1.speed + p1.phase) * 15;
          const x2 = p2.x + Math.sin(frame * 0.02 * p2.speed + p2.phase) * 20;
          const y2 = p2.y + Math.cos(frame * 0.015 * p2.speed + p2.phase) * 15;

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(14, 165, 233, 0.06)"
              strokeWidth="1"
            />
          );
        })}
      </svg>
    </>
  );
};

// Node label - text below nodes
const NodeLabel = ({
  text,
  x,
  y,
  delay,
  color,
}: {
  text: string;
  x: number;
  y: number;
  delay: number;
  color: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 120 },
  });

  if (frame < delay) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translateX(-50%)",
        opacity: progress,
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 13,
        fontWeight: 500,
        color,
        textAlign: "center",
        letterSpacing: 0.5,
      }}
    >
      {text}
    </div>
  );
};

// Caller popup - shows phone number and issue
const CallerPopup = ({
  x,
  y,
  delay,
  scenario,
}: {
  x: number;
  y: number;
  delay: number;
  scenario: typeof scenarios[0];
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const slideX = interpolate(slideProgress, [0, 1], [-40, 0]);

  if (frame < delay) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translateX(${slideX}px)`,
        opacity: slideProgress,
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        border: `1px solid ${scenario.color}60`,
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 16 }}>{scenario.emoji}</span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 13,
            color: scenario.color,
            fontWeight: 600,
          }}
        >
          (415) 555-0123
        </span>
      </div>
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 12,
          color: "#94a3b8",
          fontStyle: "italic",
          maxWidth: 180,
        }}
      >
        "{scenario.caller}"
      </div>
    </div>
  );
};

// Emergency popup - dramatic alert
const EmergencyPopup = ({
  x,
  y,
  delay,
  scenario,
}: {
  x: number;
  y: number;
  delay: number;
  scenario: typeof scenarios[0];
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  const pulse = 1 + Math.sin(frame * 0.2) * 0.03;

  if (frame < delay) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scaleProgress * pulse})`,
        opacity: scaleProgress,
        backgroundColor: "rgba(127, 29, 29, 0.95)",
        border: "2px solid #ef4444",
        borderRadius: 10,
        padding: "12px 18px",
        boxShadow: "0 0 30px rgba(239, 68, 68, 0.4)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 18 }}>{scenario.emoji}</span>
        <span
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 14,
            color: "#fca5a5",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          {scenario.service}
        </span>
      </div>
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 12,
          color: "#fecaca",
        }}
      >
        {scenario.emergency}
      </div>
    </div>
  );
};

// Dispatch popup - tech assignment
const DispatchPopup = ({
  x,
  y,
  delay,
  isComplete,
}: {
  x: number;
  y: number;
  delay: number;
  isComplete: boolean;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const slideX = interpolate(slideProgress, [0, 1], [40, 0]);

  if (frame < delay) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translateX(${slideX}px)`,
        opacity: slideProgress,
        backgroundColor: isComplete
          ? "rgba(20, 83, 45, 0.95)"
          : "rgba(15, 23, 42, 0.95)",
        border: `1px solid ${isComplete ? "#22c55e" : "rgba(34, 197, 94, 0.4)"}`,
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: isComplete
          ? "0 0 20px rgba(34, 197, 94, 0.3)"
          : "0 4px 20px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 16 }}>{isComplete ? "✅" : "📤"}</span>
        <span
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 13,
            color: "#4ade80",
            fontWeight: 600,
          }}
        >
          {isComplete ? "Mike T. assigned" : "Dispatching..."}
        </span>
      </div>
      {isComplete && (
        <div
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 11,
            color: "#86efac",
          }}
        >
          ETA: 15 minutes
        </div>
      )}
    </div>
  );
};

// Time counter - shows elapsed time
const TimeCounter = ({
  startFrame,
  currentFrame,
  isComplete,
}: {
  startFrame: number;
  currentFrame: number;
  isComplete: boolean;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  // Calculate elapsed "seconds" (scaled for animation)
  const elapsedFrames = Math.max(0, currentFrame - startFrame);
  const displaySeconds = isComplete ? 54 : Math.min(54, Math.floor(elapsedFrames / 4));

  return (
    <div
      style={{
        position: "absolute",
        left: 600,
        top: 510,
        transform: "translateX(-50%)",
        opacity: progress,
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <span style={{ fontSize: 14 }}>⏱️</span>
      <span style={{ fontSize: 12, color: "#64748b" }}>Ring → Dispatch:</span>
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: isComplete ? "#22c55e" : "#94a3b8",
          fontFamily: "monospace",
        }}
      >
        {displaySeconds}s
      </span>
    </div>
  );
};

// Phone ring effect - expanding sonar circles
const PhoneRingEffect = ({
  x,
  y,
  isActive,
}: {
  x: number;
  y: number;
  isActive: boolean;
}) => {
  const frame = useCurrentFrame();

  if (!isActive) return null;

  const rings = [0, 20, 40];

  return (
    <>
      {rings.map((delay, i) => {
        const ringFrame = (frame + delay) % 80;
        const radius = interpolate(ringFrame, [0, 80], [40, 120]);
        const opacity = interpolate(ringFrame, [0, 40, 80], [0.5, 0.25, 0]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: radius * 2,
              height: radius * 2,
              borderRadius: "50%",
              border: "3px solid #0ea5e9",
              transform: "translate(-50%, -50%)",
              opacity,
              boxShadow: "0 0 20px rgba(14, 165, 233, 0.3)",
            }}
          />
        );
      })}
    </>
  );
};

// Sound wave arcs emanating from phone
const SoundWaves = ({
  x,
  y,
  isActive,
  direction = "right",
}: {
  x: number;
  y: number;
  isActive: boolean;
  direction?: "left" | "right";
}) => {
  const frame = useCurrentFrame();

  if (!isActive) return null;

  const waves = [0, 10, 20];
  const baseAngle = direction === "right" ? -45 : 135;

  return (
    <svg
      style={{
        position: "absolute",
        left: x - 50,
        top: y - 50,
        width: 100,
        height: 100,
        overflow: "visible",
      }}
    >
      {waves.map((delay, i) => {
        const waveFrame = (frame + delay) % 40;
        const radius = 25 + i * 12 + waveFrame * 0.8;
        const opacity = interpolate(waveFrame, [0, 20, 40], [0.6, 0.3, 0]);

        return (
          <path
            key={i}
            d={`M ${50 + Math.cos(((baseAngle - 40) * Math.PI) / 180) * radius} ${50 + Math.sin(((baseAngle - 40) * Math.PI) / 180) * radius} A ${radius} ${radius} 0 0 1 ${50 + Math.cos(((baseAngle + 40) * Math.PI) / 180) * radius} ${50 + Math.sin(((baseAngle + 40) * Math.PI) / 180) * radius}`}
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="3"
            opacity={opacity}
          />
        );
      })}
    </svg>
  );
};

// Audio waveform visualization - animated frequency bars
const AudioWaveform = ({
  x,
  y,
  isActive,
  intensity = 1,
}: {
  x: number;
  y: number;
  isActive: boolean;
  intensity?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bars = 12;
  const barWidth = 4;
  const gap = 3;
  const totalWidth = bars * (barWidth + gap) - gap;

  const entryProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  if (!isActive && frame < 30) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: x - totalWidth / 2,
        top: y,
        display: "flex",
        gap,
        alignItems: "center",
        opacity: entryProgress,
        transform: `scale(${entryProgress})`,
      }}
    >
      {Array.from({ length: bars }).map((_, i) => {
        const phase = i * 0.5;
        const baseHeight = isActive
          ? 15 + Math.sin(frame * 0.2 + phase) * 12 * intensity
          : 5;
        const height = Math.max(4, baseHeight);

        return (
          <div
            key={i}
            style={{
              width: barWidth,
              height,
              backgroundColor: "#0ea5e9",
              borderRadius: 2,
              opacity: 0.6 + Math.sin(frame * 0.15 + phase) * 0.3,
              boxShadow: isActive ? "0 0 8px rgba(14, 165, 233, 0.5)" : "none",
            }}
          />
        );
      })}
    </div>
  );
};

// Progress arc - visual timeline at bottom
const ProgressArc = ({ progress, stage }: { progress: number; stage: string }) => {
  const frame = useCurrentFrame();

  const centerX = 600;
  const centerY = 470;
  const radius = 30;
  const strokeWidth = 5;

  // Color based on stage
  const getColor = () => {
    if (stage === "complete") return "#22c55e";
    if (stage === "dispatch") return "#22c55e";
    if (stage === "emergency") return "#ef4444";
    return "#0ea5e9";
  };

  const color = getColor();
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const glowIntensity =
    stage === "complete" ? 0.5 + Math.sin(frame * 0.1) * 0.3 : 0.3;

  return (
    <svg
      style={{
        position: "absolute",
        left: centerX - radius - strokeWidth,
        top: centerY - radius - strokeWidth,
        width: (radius + strokeWidth) * 2,
        height: (radius + strokeWidth) * 2,
      }}
    >
      {/* Background circle */}
      <circle
        cx={radius + strokeWidth}
        cy={radius + strokeWidth}
        r={radius}
        fill="none"
        stroke="rgba(100, 116, 139, 0.2)"
        strokeWidth={strokeWidth}
      />
      {/* Progress circle */}
      <circle
        cx={radius + strokeWidth}
        cy={radius + strokeWidth}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${radius + strokeWidth} ${radius + strokeWidth})`}
        style={{
          filter: `drop-shadow(0 0 ${10 * glowIntensity}px ${color})`,
        }}
      />
      {/* Center dot */}
      <circle
        cx={radius + strokeWidth}
        cy={radius + strokeWidth}
        r={6}
        fill={color}
        opacity={0.3 + Math.sin(frame * 0.1) * 0.2}
      />
    </svg>
  );
};

// Data capture icons - orbit and absorb into AI hub
const DataCapture = ({
  hubX,
  hubY,
  startFrame,
}: {
  hubX: number;
  hubY: number;
  startFrame: number;
}) => {
  const frame = useCurrentFrame();

  const icons = [
    { emoji: "📍", delay: 0, startAngle: 0 },
    { emoji: "🏠", delay: 15, startAngle: 120 },
    { emoji: "💧", delay: 30, startAngle: 240 },
  ];

  return (
    <>
      {icons.map((icon, i) => {
        const iconFrame = frame - startFrame - icon.delay;
        if (iconFrame < 0) return null;

        // Animation phases
        const enterDuration = 20;
        const orbitDuration = 40;
        const absorbDuration = 15;
        const totalDuration = enterDuration + orbitDuration + absorbDuration;

        if (iconFrame > totalDuration) return null;

        let x, y, scale, opacity;

        if (iconFrame < enterDuration) {
          // Enter from outside
          const t = iconFrame / enterDuration;
          const startRadius = 200;
          const orbitRadius = 80;
          const angle = (icon.startAngle * Math.PI) / 180;
          const currentRadius = startRadius - (startRadius - orbitRadius) * t;
          x = hubX + Math.cos(angle) * currentRadius;
          y = hubY + Math.sin(angle) * currentRadius;
          scale = 0.5 + t * 0.5;
          opacity = t;
        } else if (iconFrame < enterDuration + orbitDuration) {
          // Orbit around hub
          const orbitFrame = iconFrame - enterDuration;
          const orbitRadius = 80;
          const angle =
            ((icon.startAngle + orbitFrame * 3) * Math.PI) / 180;
          x = hubX + Math.cos(angle) * orbitRadius;
          y = hubY + Math.sin(angle) * orbitRadius;
          scale = 1;
          opacity = 1;
        } else {
          // Absorb into center
          const absorbFrame = iconFrame - enterDuration - orbitDuration;
          const t = absorbFrame / absorbDuration;
          const orbitRadius = 80 * (1 - t);
          const finalAngle =
            icon.startAngle + orbitDuration * 3 + absorbFrame * 5;
          const angle = (finalAngle * Math.PI) / 180;
          x = hubX + Math.cos(angle) * orbitRadius;
          y = hubY + Math.sin(angle) * orbitRadius;
          scale = 1 - t * 0.8;
          opacity = 1 - t;
        }

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity,
              fontSize: 24,
              filter: "drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))",
            }}
          >
            {icon.emoji}
          </div>
        );
      })}
    </>
  );
};

// Confetti burst for success celebration
const ConfettiBurst = ({
  x,
  y,
  triggerFrame,
}: {
  x: number;
  y: number;
  triggerFrame: number;
}) => {
  const frame = useCurrentFrame();

  const particleCount = 24;
  const duration = 60;

  if (frame < triggerFrame || frame > triggerFrame + duration) return null;

  const t = (frame - triggerFrame) / duration;

  const particles = Array.from({ length: particleCount }).map((_, i) => {
    const angle = (i / particleCount) * Math.PI * 2 + (i % 3) * 0.2;
    const speed = 80 + (i % 5) * 30;
    const gravity = 150;
    const size = 4 + (i % 3) * 2;
    const colors = ["#22c55e", "#0ea5e9", "#8b5cf6", "#f59e0b"];
    const color = colors[i % colors.length];

    const px = x + Math.cos(angle) * speed * t;
    const py = y + Math.sin(angle) * speed * t + gravity * t * t;
    const opacity = 1 - t;
    const scale = 1 - t * 0.5;

    return { px, py, size, color, opacity, scale };
  });

  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.px,
            top: p.py,
            width: p.size,
            height: p.size,
            borderRadius: i % 2 === 0 ? "50%" : "2px",
            backgroundColor: p.color,
            opacity: p.opacity,
            transform: `translate(-50%, -50%) scale(${p.scale}) rotate(${i * 30 + frame * 5}deg)`,
          }}
        />
      ))}
    </>
  );
};

// Curved connection with particle stream
const CurvedConnection = ({
  start,
  end,
  controlOffset,
  delay,
  color,
  isActive,
  speed = 0.03,
}: {
  start: { x: number; y: number };
  end: { x: number; y: number };
  controlOffset: { x: number; y: number };
  delay: number;
  color: string;
  isActive: boolean;
  speed?: number;
}) => {
  const frame = useCurrentFrame();

  const control = {
    x: (start.x + end.x) / 2 + controlOffset.x,
    y: (start.y + end.y) / 2 + controlOffset.y,
  };

  // Path drawing progress
  const pathProgress = interpolate(frame, [delay, delay + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pathD = `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`;

  // Particles with trails
  const particleCount = 4;
  const particles: Array<{
    x: number;
    y: number;
    size: number;
    opacity: number;
    key: string;
  }> = [];

  if (isActive && pathProgress >= 1) {
    for (let i = 0; i < particleCount; i++) {
      const particleDelay = i * 15;
      const t = ((frame - delay - 30 - particleDelay) * speed) % 1;
      if (t > 0) {
        const pos = getBezierPoint(t, start, control, end);
        particles.push({ ...pos, size: 8, opacity: 1, key: `main-${i}` });

        // Trail
        for (let j = 1; j <= 6; j++) {
          const trailT = Math.max(0, t - j * 0.05);
          const trailPos = getBezierPoint(trailT, start, control, end);
          particles.push({
            ...trailPos,
            size: 8 - j,
            opacity: 1 - j * 0.15,
            key: `trail-${i}-${j}`,
          });
        }
      }
    }
  }

  return (
    <>
      <svg style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <defs>
          <linearGradient
            id={`grad-${delay}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={color} stopOpacity="0.1" />
            <stop offset="50%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {/* Dashed background */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(100, 116, 139, 0.15)"
          strokeWidth="3"
          strokeDasharray="8 6"
        />
        {/* Animated fill */}
        <path
          d={pathD}
          fill="none"
          stroke={`url(#grad-${delay})`}
          strokeWidth="4"
          strokeDasharray="1000"
          strokeDashoffset={1000 - pathProgress * 1000}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>

      {particles.map((p) => (
        <div
          key={p.key}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: color,
            transform: "translate(-50%, -50%)",
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 2}px ${color}`,
          }}
        />
      ))}
    </>
  );
};

// AI Hub with rotating rings and orbiting particles
const AIProcessingHub = ({
  x,
  y,
  isProcessing,
  isEmergency,
}: {
  x: number;
  y: number;
  isProcessing: boolean;
  isEmergency: boolean;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const size = 100;
  const color = isEmergency ? "#ef4444" : "#8b5cf6";
  const rotationSpeed = isProcessing ? (isEmergency ? 4 : 2.5) : 1;
  const pulseScale = isProcessing ? 1 + Math.sin(frame * 0.15) * 0.08 : 1;

  // Orbiting particles
  const orbitParticles = isProcessing
    ? [0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (frame * 0.06 * rotationSpeed + (i * Math.PI) / 3) % (Math.PI * 2);
        const orbitRadius = size * 0.65;
        return {
          x: Math.cos(angle) * orbitRadius,
          y: Math.sin(angle) * orbitRadius,
          opacity: 0.5 + Math.sin(frame * 0.1 + i) * 0.3,
          size: 6 + (i % 2) * 2,
        };
      })
    : [];

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${entryProgress * pulseScale})`,
        opacity: entryProgress,
      }}
    >
      {/* Outer glow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: size * 2,
          height: size * 2,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}25 0%, transparent 70%)`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Rotating outer ring */}
      <svg
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: size + 30,
          height: size + 30,
          transform: `translate(-50%, -50%) rotate(${frame * rotationSpeed}deg)`,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const startAngle = i * 45 + 8;
          const endAngle = i * 45 + 32;
          const r = (size + 20) / 2;
          const cx = (size + 30) / 2;
          const cy = (size + 30) / 2;
          const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180);
          const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180);
          const x2 = cx + r * Math.cos((endAngle * Math.PI) / 180);
          const y2 = cy + r * Math.sin((endAngle * Math.PI) / 180);
          const segmentOpacity = isProcessing
            ? 0.4 + Math.sin(frame * 0.12 + i) * 0.35
            : 0.25;

          return (
            <path
              key={i}
              d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
              fill="none"
              stroke={color}
              strokeWidth="4"
              strokeLinecap="round"
              opacity={segmentOpacity}
            />
          );
        })}
      </svg>

      {/* Inner rotating ring */}
      <svg
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: size - 10,
          height: size - 10,
          transform: `translate(-50%, -50%) rotate(${-frame * rotationSpeed * 0.6}deg)`,
        }}
      >
        {[0, 1, 2, 3].map((i) => {
          const startAngle = i * 90 + 15;
          const endAngle = i * 90 + 65;
          const r = (size - 30) / 2;
          const cx = (size - 10) / 2;
          const cy = (size - 10) / 2;
          const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180);
          const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180);
          const x2 = cx + r * Math.cos((endAngle * Math.PI) / 180);
          const y2 = cy + r * Math.sin((endAngle * Math.PI) / 180);

          return (
            <path
              key={i}
              d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              opacity={0.5}
            />
          );
        })}
      </svg>

      {/* Main circle */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: `${color}15`,
          border: `3px solid ${color}50`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 40px ${color}30`,
        }}
      >
        <span style={{ fontSize: 40 }}>🎧</span>
      </div>

      {/* Orbiting particles */}
      {orbitParticles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: color,
            transform: `translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y}px))`,
            opacity: p.opacity,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      ))}
    </div>
  );
};

// Emergency flash overlay
const EmergencyFlash = ({ triggerFrame }: { triggerFrame: number }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [triggerFrame, triggerFrame + 8, triggerFrame + 20],
    [0, 0.35, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (opacity <= 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#ef4444",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

// Success checkmark with glow
const SuccessCheckmark = ({
  delay,
  x,
  y,
}: {
  delay: number;
  x: number;
  y: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 8, stiffness: 150 },
  });

  if (frame < delay) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${progress})`,
      }}
    >
      {/* Expanding glow rings */}
      {[0, 10, 20].map((d, i) => {
        const ringProgress = interpolate(
          frame - delay - d,
          [0, 40],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 50 + ringProgress * 60,
              height: 50 + ringProgress * 60,
              borderRadius: "50%",
              border: "2px solid #22c55e",
              transform: "translate(-50%, -50%)",
              opacity: (1 - ringProgress) * 0.5,
            }}
          />
        );
      })}
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          backgroundColor: "#22c55e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 30px rgba(34, 197, 94, 0.6)",
          fontSize: 28,
        }}
      >
        ✓
      </div>
    </div>
  );
};

// Visual node (phone or tech) - with icon
const VisualNode = ({
  emoji,
  x,
  y,
  delay,
  color,
  isActive,
  size = 80,
}: {
  emoji: string;
  x: number;
  y: number;
  delay: number;
  color: string;
  isActive?: boolean;
  size?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const wobble = isActive ? Math.sin(frame * 0.6) * 4 : 0;
  const pulse = isActive ? 1 + Math.sin(frame * 0.15) * 0.1 : 1;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${entryProgress * pulse}) rotate(${wobble}deg)`,
        opacity: entryProgress,
      }}
    >
      {/* Outer glow when active */}
      {isActive && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: size * 1.6,
            height: size * 1.6,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: `${color}15`,
          border: `3px solid ${color}50`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isActive ? `0 0 30px ${color}40` : "none",
        }}
      >
        <span style={{ fontSize: size * 0.45 }}>{emoji}</span>
      </div>
    </div>
  );
};

// Main animation component - scenarioIndex can be passed as prop to control which scenario shows
export const HeroAnimation = ({ scenarioIndex = 0 }: { scenarioIndex?: number } = {}) => {
  const frame = useCurrentFrame();

  // Select scenario based on index prop (cycles 0-4)
  const scenario = scenarios[scenarioIndex % scenarios.length];

  // Fade in/out for loop
  const fadeIn = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [400, 450], [1, 0], { extrapolateLeft: "clamp" });
  const opacity = Math.min(fadeIn, fadeOut);

  // Screen shake during emergency
  const shakeX =
    frame >= 140 && frame < 155
      ? Math.sin(frame * 4) * 3 * (1 - (frame - 140) / 15)
      : 0;
  const shakeY =
    frame >= 140 && frame < 155
      ? Math.cos(frame * 3) * 2 * (1 - (frame - 140) / 15)
      : 0;

  // Timeline stages
  const isRinging = frame >= 30 && frame < 70;
  const isConnecting = frame >= 70 && frame < 100;
  const isProcessing = frame >= 100 && frame < 140;
  const isEmergency = frame >= 140;
  const isDispatching = frame >= 180 && frame < 220;
  const isComplete = frame >= 220;

  // Progress calculation
  const progress = interpolate(
    frame,
    [30, 100, 140, 180, 260],
    [0, 0.3, 0.5, 0.7, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const getStage = () => {
    if (isComplete) return "complete";
    if (isDispatching) return "dispatch";
    if (isEmergency) return "emergency";
    return "intake";
  };

  // Node positions - centered in full canvas
  const phoneX = 250;
  const phoneY = 220;
  const hubX = 600;
  const hubY = 220;
  const techX = 950;
  const techY = 220;

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(145deg, #0a0f18 0%, #0f172a 50%, #0a0f15 100%)",
        opacity,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* Background particles */}
      <BackgroundParticles />

      {/* Phone ring effects */}
      <PhoneRingEffect x={phoneX} y={phoneY} isActive={isRinging} />
      <SoundWaves
        x={phoneX + 50}
        y={phoneY}
        isActive={isRinging || isConnecting}
        direction="right"
      />

      {/* Audio waveform under phone */}
      <AudioWaveform
        x={phoneX}
        y={phoneY + 60}
        isActive={isConnecting || isProcessing || isEmergency}
        intensity={isEmergency ? 1.5 : 1}
      />

      {/* Connection: Phone to Hub */}
      <CurvedConnection
        start={{ x: phoneX + 45, y: phoneY }}
        end={{ x: hubX - 60, y: hubY }}
        controlOffset={{ x: 0, y: -60 }}
        delay={65}
        color="#0ea5e9"
        isActive={isConnecting || isProcessing || isEmergency}
      />

      {/* Connection: Hub to Tech */}
      <CurvedConnection
        start={{ x: hubX + 60, y: hubY }}
        end={{ x: techX - 45, y: techY }}
        controlOffset={{ x: 0, y: -60 }}
        delay={175}
        color="#22c55e"
        isActive={isDispatching || isComplete}
        speed={0.04}
      />

      {/* Phone node */}
      <VisualNode
        emoji="📞"
        x={phoneX}
        y={phoneY}
        delay={10}
        color="#0ea5e9"
        isActive={isRinging}
        size={80}
      />

      {/* Phone label */}
      <NodeLabel
        text="Incoming Call"
        x={phoneX}
        y={phoneY + 55}
        delay={15}
        color="#64748b"
      />

      {/* Caller popup */}
      <CallerPopup x={phoneX - 100} y={phoneY + 100} delay={35} scenario={scenario} />

      {/* AI Hub */}
      <AIProcessingHub
        x={hubX}
        y={hubY}
        isProcessing={isProcessing || isEmergency}
        isEmergency={isEmergency}
      />

      {/* AI label */}
      <NodeLabel
        text={isProcessing ? "Analyzing..." : isEmergency ? "Triage Complete" : "VoiceAI"}
        x={hubX}
        y={hubY + 70}
        delay={25}
        color={isEmergency ? "#ef4444" : "#64748b"}
      />

      {/* Data capture icons */}
      <DataCapture hubX={hubX} hubY={hubY} startFrame={100} />

      {/* Emergency popup */}
      {isEmergency && !isDispatching && (
        <EmergencyPopup x={hubX} y={hubY - 100} delay={145} scenario={scenario} />
      )}

      {/* Tech node */}
      <VisualNode
        emoji="👨‍🔧"
        x={techX}
        y={techY}
        delay={180}
        color="#22c55e"
        isActive={isComplete}
        size={80}
      />

      {/* Tech label */}
      <NodeLabel
        text="Technician"
        x={techX}
        y={techY + 55}
        delay={185}
        color="#64748b"
      />

      {/* Dispatch popup */}
      {(isDispatching || isComplete) && (
        <DispatchPopup
          x={techX + 80}
          y={techY + 30}
          delay={185}
          isComplete={isComplete}
        />
      )}

      {/* Success checkmark on tech */}
      <SuccessCheckmark delay={225} x={techX + 35} y={techY - 35} />

      {/* Confetti celebration */}
      <ConfettiBurst x={techX} y={techY} triggerFrame={260} />

      {/* Progress arc at bottom */}
      <ProgressArc progress={progress} stage={getStage()} />

      {/* Time counter */}
      <TimeCounter startFrame={30} currentFrame={frame} isComplete={isComplete} />

      {/* Emergency flash overlay */}
      <EmergencyFlash triggerFrame={140} />
    </AbsoluteFill>
  );
};
