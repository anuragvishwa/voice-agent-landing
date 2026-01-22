import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

// Particle field with voice/communication theme
const ParticleField = () => {
  const frame = useCurrentFrame();
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: (i * 137.5) % 100,
    y: (i * 61.8) % 100,
    size: 2 + (i % 5),
    speed: 0.15 + (i % 4) * 0.08,
    phase: (i * 0.5) % (Math.PI * 2),
  }));

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {particles.map((p) => {
        const yOffset = Math.sin(frame * 0.02 * p.speed + p.phase) * 30;
        const xOffset = Math.cos(frame * 0.015 * p.speed + p.phase) * 20;
        const opacity = interpolate(
          Math.sin(frame * 0.03 + p.id * 0.5),
          [-1, 1],
          [0.05, 0.25]
        );
        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: p.id % 4 === 0 ? "#0ea5e9" : p.id % 4 === 1 ? "#8b5cf6" : "#06b6d4",
              opacity,
              transform: `translate(${xOffset}px, ${yOffset}px)`,
              filter: `blur(${p.size > 4 ? 1 : 0}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Animated phone with pulse effect
const AnimatedPhone = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 80 },
    durationInFrames: 60,
  });

  const floatY = Math.sin(frame * 0.03) * 8;

  const glowIntensity = interpolate(
    Math.sin(frame * 0.05),
    [-1, 1],
    [20, 40]
  );

  const glowOpacity = interpolate(
    Math.sin(frame * 0.05),
    [-1, 1],
    [0.4, 0.7]
  );

  // Pulse ring animation
  const pulseScale = interpolate(frame % 60, [0, 60], [1, 2.5]);
  const pulseOpacity = interpolate(frame % 60, [0, 60], [0.6, 0]);

  return (
    <div
      style={{
        transform: `scale(${scale}) translateY(${floatY}px)`,
        filter: `drop-shadow(0 0 ${glowIntensity}px rgba(14, 165, 233, ${glowOpacity}))`,
        position: "relative",
      }}
    >
      {/* Pulse rings */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 180,
          height: 180,
          borderRadius: "50%",
          border: "2px solid rgba(14, 165, 233, 0.5)",
          transform: `translate(-50%, -50%) scale(${pulseScale})`,
          opacity: pulseOpacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 180,
          height: 180,
          borderRadius: "50%",
          border: "2px solid rgba(14, 165, 233, 0.5)",
          transform: `translate(-50%, -50%) scale(${interpolate((frame + 30) % 60, [0, 60], [1, 2.5])})`,
          opacity: interpolate((frame + 30) % 60, [0, 60], [0.6, 0]),
        }}
      />

      <svg
        width="180"
        height="180"
        viewBox="0 0 24 24"
        fill="none"
      >
        <defs>
          <linearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(14, 165, 233, 0.2)" />
            <stop offset="100%" stopColor="rgba(14, 165, 233, 0.05)" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#phoneGrad)" stroke="#0ea5e9" strokeWidth="1" />
        <path
          d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
          stroke="#0ea5e9"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(0, 0) scale(0.7)"
          style={{ transformOrigin: "12px 12px" }}
        />
      </svg>
    </div>
  );
};

// Feature pill component
const FeaturePill = ({
  text,
  delay,
  index,
}: {
  text: string;
  delay: number;
  index: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const hoverEffect = interpolate(
    Math.sin(frame * 0.04 + index),
    [-1, 1],
    [0, 4]
  );

  return (
    <div
      style={{
        padding: "14px 28px",
        backgroundColor: "rgba(14, 165, 233, 0.08)",
        border: "1px solid rgba(14, 165, 233, 0.25)",
        borderRadius: 9999,
        color: "#0ea5e9",
        fontSize: 18,
        fontWeight: 500,
        fontFamily: "monospace",
        opacity: entryProgress,
        transform: `scale(${entryProgress}) translateY(${(1 - entryProgress) * 20 + hoverEffect}px)`,
      }}
    >
      {text}
    </div>
  );
};

export const HeroScene = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const titleY = interpolate(frame, [20, 60], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const subtitleOpacity = interpolate(frame, [70, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const subtitleY = interpolate(frame, [70, 110], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const subtitle2Opacity = interpolate(frame, [100, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pills = ["24/7 Intake", "Smart Triage", "Instant Dispatch", "Full Visibility"];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(145deg, #050508 0%, #0a0f15 30%, #050510 70%, #050505 100%)",
        fontFamily,
      }}
    >
      {/* Grid pattern */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(rgba(14, 165, 233, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14, 165, 233, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <ParticleField />

      {/* Radial gradient */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(14, 165, 233, 0.08) 0%, transparent 60%)",
        }}
      />

      {/* Content */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 100px",
        }}
      >
        {/* Phone Icon */}
        <div style={{ marginBottom: 50 }}>
          <AnimatedPhone />
        </div>

        {/* Main Title */}
        <h1
          style={{
            fontSize: 100,
            fontWeight: 300,
            color: "white",
            margin: 0,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            letterSpacing: "-0.03em",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          Never miss an{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #7dd3fc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 600,
            }}
          >
            emergency call
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 32,
            color: "#94a3b8",
            margin: "32px 0 0 0",
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            fontWeight: 400,
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.5,
          }}
        >
          AI-powered intake and dispatch for restoration businesses
        </p>

        {/* Second line */}
        <p
          style={{
            fontSize: 28,
            color: "#64748b",
            margin: "16px 0 0 0",
            opacity: subtitle2Opacity,
            textAlign: "center",
          }}
        >
          Answer every call. Capture every detail. Dispatch instantly.
        </p>

        {/* Feature Pills */}
        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 60,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {pills.map((pill, i) => (
            <FeaturePill
              key={pill}
              text={pill}
              delay={140 + i * 12}
              index={i}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
