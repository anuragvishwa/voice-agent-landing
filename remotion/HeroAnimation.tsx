import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
} from "remotion";
import {
  Phone,
  Headphones,
  User,
  Check,
  Send,
  Clock,
  MapPin,
  Home,
  Droplets,
  Flame,
  Brush,
  Building,
} from "lucide-react";

// Service scenarios that rotate each loop
const scenarios = [
  { service: "Water Damage", icon: Droplets, caller: "Pipe burst flooding basement!", color: "#22c55e", emergency: "Water leak detected" },
  { service: "Fire Damage", icon: Flame, caller: "Smoke damage from kitchen fire", color: "#f97316", emergency: "Fire damage reported" },
  { service: "Roofing", icon: Home, caller: "Storm damaged my roof!", color: "#ef4444", emergency: "Roof damage urgent" },
  { service: "Carpet Cleaning", icon: Brush, caller: "Emergency stain removal needed", color: "#8b5cf6", emergency: "Priority cleaning" },
  { service: "Construction", icon: Building, caller: "Foundation crack emergency", color: "#eab308", emergency: "Structural concern" },
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

// Floating background particles - minimal and subtle
const BackgroundParticles = () => {
  const frame = useCurrentFrame();

  const particles = [
    { x: 150, y: 80, size: 2, speed: 0.2, phase: 0 },
    { x: 450, y: 100, size: 2, speed: 0.18, phase: 1 },
    { x: 750, y: 70, size: 2, speed: 0.22, phase: 2 },
    { x: 1050, y: 90, size: 2, speed: 0.2, phase: 3 },
    { x: 300, y: 450, size: 2, speed: 0.19, phase: 4 },
    { x: 900, y: 460, size: 2, speed: 0.21, phase: 5 },
  ];

  return (
    <>
      {particles.map((p, i) => {
        const offsetX = Math.sin(frame * 0.01 * p.speed + p.phase) * 10;
        const offsetY = Math.cos(frame * 0.008 * p.speed + p.phase) * 8;
        const opacity = 0.06 + Math.sin(frame * 0.02 + p.phase) * 0.03;

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
              backgroundColor: i % 2 === 0 ? "#22c55e" : "#8b5cf6",
              opacity,
            }}
          />
        );
      })}
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
    config: { damping: 25, stiffness: 120 },
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
    config: { damping: 25, stiffness: 120 },
  });

  const slideX = interpolate(slideProgress, [0, 1], [-30, 0]);

  if (frame < delay) return null;

  const IconComponent = scenario.icon;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translateX(${slideX}px)`,
        opacity: slideProgress,
        backgroundColor: "rgba(10, 10, 10, 0.95)",
        border: `1px solid ${scenario.color}40`,
        borderRadius: 8,
        padding: "10px 14px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <IconComponent size={16} color={scenario.color} />
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
          color: "rgba(255, 255, 255, 0.5)",
          fontStyle: "italic",
          maxWidth: 180,
        }}
      >
        "{scenario.caller}"
      </div>
    </div>
  );
};

// Emergency popup - professional alert
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
    config: { damping: 25, stiffness: 120 },
  });

  if (frame < delay) return null;

  const IconComponent = scenario.icon;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scaleProgress})`,
        opacity: scaleProgress,
        backgroundColor: "rgba(127, 29, 29, 0.95)",
        border: "1px solid rgba(239, 68, 68, 0.6)",
        borderRadius: 8,
        padding: "12px 18px",
        boxShadow: "0 0 12px rgba(239, 68, 68, 0.2)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <IconComponent size={18} color="#fca5a5" />
        <span
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 14,
            color: "#fca5a5",
            fontWeight: 600,
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
    config: { damping: 25, stiffness: 120 },
  });

  const slideX = interpolate(slideProgress, [0, 1], [30, 0]);

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
          : "rgba(10, 10, 10, 0.95)",
        border: `1px solid ${isComplete ? "rgba(34, 197, 94, 0.5)" : "rgba(34, 197, 94, 0.3)"}`,
        borderRadius: 8,
        padding: "10px 14px",
        boxShadow: isComplete
          ? "0 0 12px rgba(34, 197, 94, 0.15)"
          : "0 4px 16px rgba(0,0,0,0.3)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        {isComplete ? (
          <Check size={16} color="#4ade80" />
        ) : (
          <Send size={16} color="#4ade80" />
        )}
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
    config: { damping: 25, stiffness: 120 },
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
      <Clock size={14} color="rgba(255, 255, 255, 0.4)" />
      <span style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.4)" }}>Ring → Dispatch:</span>
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: isComplete ? "#22c55e" : "rgba(255, 255, 255, 0.5)",
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
              border: "3px solid #22c55e",
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
            stroke="#22c55e"
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
    config: { damping: 25, stiffness: 120 },
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
          ? 12 + Math.sin(frame * 0.12 + phase) * 8 * intensity
          : 5;
        const height = Math.max(4, baseHeight);

        return (
          <div
            key={i}
            style={{
              width: barWidth,
              height,
              backgroundColor: "#22c55e",
              borderRadius: 2,
              opacity: 0.4 + Math.sin(frame * 0.08 + phase) * 0.2,
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
  const strokeWidth = 4;

  // Color based on stage
  const getColor = () => {
    if (stage === "complete") return "#22c55e";
    if (stage === "dispatch") return "#22c55e";
    if (stage === "emergency") return "#ef4444";
    return "#22c55e";
  };

  const color = getColor();
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const glowIntensity =
    stage === "complete" ? 0.2 + Math.sin(frame * 0.06) * 0.1 : 0.15;

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
        stroke="rgba(255, 255, 255, 0.1)"
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
    { Icon: MapPin, delay: 0, startAngle: 0 },
    { Icon: Home, delay: 15, startAngle: 120 },
    { Icon: Droplets, delay: 30, startAngle: 240 },
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
            ((icon.startAngle + orbitFrame * 2) * Math.PI) / 180;
          x = hubX + Math.cos(angle) * orbitRadius;
          y = hubY + Math.sin(angle) * orbitRadius;
          scale = 1;
          opacity = 0.8;
        } else {
          // Absorb into center
          const absorbFrame = iconFrame - enterDuration - orbitDuration;
          const t = absorbFrame / absorbDuration;
          const orbitRadius = 80 * (1 - t);
          const finalAngle =
            icon.startAngle + orbitDuration * 2 + absorbFrame * 3;
          const angle = (finalAngle * Math.PI) / 180;
          x = hubX + Math.cos(angle) * orbitRadius;
          y = hubY + Math.sin(angle) * orbitRadius;
          scale = 1 - t * 0.8;
          opacity = (1 - t) * 0.8;
        }

        const IconComponent = icon.Icon;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity,
            }}
          >
            <IconComponent size={20} color="#8b5cf6" />
          </div>
        );
      })}
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
          stroke="rgba(255, 255, 255, 0.1)"
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

// AI Hub with rotating rings - professional version
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
    config: { damping: 25, stiffness: 120 },
  });

  const size = 100;
  const color = isEmergency ? "#ef4444" : "#8b5cf6";
  const rotationSpeed = isProcessing ? (isEmergency ? 1.5 : 1) : 0.5;
  const pulseScale = isProcessing ? 1 + Math.sin(frame * 0.08) * 0.02 : 1;

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
      {/* Subtle outer glow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: size * 1.6,
          height: size * 1.6,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Rotating outer ring - reduced to 4 segments */}
      <svg
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: size + 30,
          height: size + 30,
          transform: `translate(-50%, -50%) rotate(${frame * rotationSpeed * 0.5}deg)`,
        }}
      >
        {[0, 1, 2, 3].map((i) => {
          const startAngle = i * 90 + 10;
          const endAngle = i * 90 + 70;
          const r = (size + 20) / 2;
          const cx = (size + 30) / 2;
          const cy = (size + 30) / 2;
          const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180);
          const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180);
          const x2 = cx + r * Math.cos((endAngle * Math.PI) / 180);
          const y2 = cy + r * Math.sin((endAngle * Math.PI) / 180);
          const segmentOpacity = isProcessing
            ? 0.25 + Math.sin(frame * 0.06 + i) * 0.1
            : 0.15;

          return (
            <path
              key={i}
              d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              opacity={segmentOpacity}
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
          backgroundColor: `${color}10`,
          border: `2px solid ${color}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 15px ${color}15`,
        }}
      >
        <Headphones size={40} color={color} strokeWidth={1.5} />
      </div>
    </div>
  );
};

// Success checkmark - clean and professional
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
    config: { damping: 25, stiffness: 120 },
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
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: "#22c55e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 12px rgba(34, 197, 94, 0.25)",
        }}
      >
        <Check size={22} color="white" strokeWidth={3} />
      </div>
    </div>
  );
};

// Visual node (phone or tech) - with icon
const VisualNode = ({
  icon: IconComponent,
  x,
  y,
  delay,
  color,
  isActive,
  size = 80,
}: {
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
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
    config: { damping: 25, stiffness: 120 },
  });

  const pulse = isActive ? 1 + Math.sin(frame * 0.08) * 0.02 : 1;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${entryProgress * pulse})`,
        opacity: entryProgress,
      }}
    >
      {/* Subtle outer glow when active */}
      {isActive && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: size * 1.4,
            height: size * 1.4,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: `${color}10`,
          border: `2px solid ${color}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isActive ? `0 0 12px ${color}20` : "none",
        }}
      >
        <IconComponent size={size * 0.4} color={color} strokeWidth={1.5} />
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
        background: "#0a0a0a",
        opacity,
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
        intensity={isEmergency ? 1.2 : 1}
      />

      {/* Connection: Phone to Hub */}
      <CurvedConnection
        start={{ x: phoneX + 45, y: phoneY }}
        end={{ x: hubX - 60, y: hubY }}
        controlOffset={{ x: 0, y: -60 }}
        delay={65}
        color="#22c55e"
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
        icon={Phone}
        x={phoneX}
        y={phoneY}
        delay={10}
        color="#22c55e"
        isActive={isRinging}
        size={80}
      />

      {/* Phone label */}
      <NodeLabel
        text="Incoming Call"
        x={phoneX}
        y={phoneY + 55}
        delay={15}
        color="rgba(255, 255, 255, 0.4)"
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
        color={isEmergency ? "#ef4444" : "rgba(255, 255, 255, 0.4)"}
      />

      {/* Data capture icons */}
      <DataCapture hubX={hubX} hubY={hubY} startFrame={100} />

      {/* Emergency popup */}
      {isEmergency && !isDispatching && (
        <EmergencyPopup x={hubX} y={hubY - 100} delay={145} scenario={scenario} />
      )}

      {/* Tech node */}
      <VisualNode
        icon={User}
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
        color="rgba(255, 255, 255, 0.4)"
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

      {/* Progress arc at bottom */}
      <ProgressArc progress={progress} stage={getStage()} />

      {/* Time counter */}
      <TimeCounter startFrame={30} currentFrame={frame} isComplete={isComplete} />
    </AbsoluteFill>
  );
};
