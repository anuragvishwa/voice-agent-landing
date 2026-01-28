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

// Enhanced particle field with flowing data effect
const ParticleField = () => {
  const frame = useCurrentFrame();
  const particles = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: (i * 137.5) % 100,
    y: (i * 61.8) % 100,
    size: 2 + (i % 6),
    speed: 0.2 + (i % 5) * 0.1,
    phase: (i * 0.5) % (Math.PI * 2),
  }));

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {particles.map((p) => {
        const yOffset = Math.sin(frame * 0.025 * p.speed + p.phase) * 40;
        const xOffset = Math.cos(frame * 0.02 * p.speed + p.phase) * 30;
        const opacity = interpolate(
          Math.sin(frame * 0.04 + p.id * 0.5),
          [-1, 1],
          [0.08, 0.35]
        );
        const colorIndex = p.id % 5;
        const colors = ["#0ea5e9", "#8b5cf6", "#06b6d4", "#38bdf8", "#a78bfa"];
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
              backgroundColor: colors[colorIndex],
              opacity,
              transform: `translate(${xOffset}px, ${yOffset}px)`,
              filter: `blur(${p.size > 4 ? 1.5 : 0}px)`,
              boxShadow: p.size > 4 ? `0 0 ${p.size * 2}px ${colors[colorIndex]}40` : "none",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Animated grid lines
const AnimatedGrid = () => {
  const frame = useCurrentFrame();
  const gridOffset = (frame * 0.3) % 80;

  return (
    <AbsoluteFill
      style={{
        backgroundImage: `
          linear-gradient(rgba(14, 165, 233, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(14, 165, 233, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
        backgroundPosition: `${gridOffset}px ${gridOffset}px`,
      }}
    />
  );
};

// Animated phone with enhanced pulse effect
const AnimatedPhone = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 80, stiffness: 100 },
    durationInFrames: 50,
  });

  const floatY = Math.sin(frame * 0.04) * 10;
  const rotateZ = Math.sin(frame * 0.02) * 2;

  const glowIntensity = interpolate(
    Math.sin(frame * 0.06),
    [-1, 1],
    [25, 50]
  );

  const glowOpacity = interpolate(
    Math.sin(frame * 0.06),
    [-1, 1],
    [0.5, 0.8]
  );

  // Multiple pulse ring animations for depth
  const pulseScale1 = interpolate(frame % 50, [0, 50], [1, 2.8]);
  const pulseOpacity1 = interpolate(frame % 50, [0, 50], [0.7, 0]);
  const pulseScale2 = interpolate((frame + 25) % 50, [0, 50], [1, 2.8]);
  const pulseOpacity2 = interpolate((frame + 25) % 50, [0, 50], [0.7, 0]);
  const pulseScale3 = interpolate((frame + 12) % 50, [0, 50], [1, 2.8]);
  const pulseOpacity3 = interpolate((frame + 12) % 50, [0, 50], [0.5, 0]);

  return (
    <div
      style={{
        transform: `scale(${scale}) translateY(${floatY}px) rotate(${rotateZ}deg)`,
        filter: `drop-shadow(0 0 ${glowIntensity}px rgba(14, 165, 233, ${glowOpacity}))`,
        position: "relative",
      }}
    >
      {/* Pulse rings with varied styles */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 180,
          height: 180,
          borderRadius: "50%",
          border: "3px solid rgba(14, 165, 233, 0.6)",
          transform: `translate(-50%, -50%) scale(${pulseScale1})`,
          opacity: pulseOpacity1,
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
          border: "2px solid rgba(56, 189, 248, 0.5)",
          transform: `translate(-50%, -50%) scale(${pulseScale2})`,
          opacity: pulseOpacity2,
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
          border: "1px solid rgba(139, 92, 246, 0.4)",
          transform: `translate(-50%, -50%) scale(${pulseScale3})`,
          opacity: pulseOpacity3,
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
            <stop offset="0%" stopColor="rgba(14, 165, 233, 0.25)" />
            <stop offset="50%" stopColor="rgba(139, 92, 246, 0.15)" />
            <stop offset="100%" stopColor="rgba(14, 165, 233, 0.08)" />
          </linearGradient>
          <linearGradient id="phoneStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#phoneGrad)" stroke="url(#phoneStroke)" strokeWidth="1.5" />
        <path
          d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
          stroke="url(#phoneStroke)"
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

// FlexDash logo component
const FlexDashLogo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowPulse = 1 + Math.sin(frame * 0.05) * 0.15;

  return (
    <div
      style={{
        position: "absolute",
        top: 40,
        left: 60,
        display: "flex",
        alignItems: "center",
        gap: 12,
        opacity: logoOpacity,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: "linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%)",
          border: "1px solid rgba(14, 165, 233, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 ${20 * glowPulse}px rgba(14, 165, 233, ${0.3 * glowPulse})`,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
            stroke="#0ea5e9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 20,
          fontWeight: 600,
          color: "white",
          letterSpacing: "-0.02em",
        }}
      >
        FlexDash
      </span>
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

  // Animated gradient position for title
  const gradientAngle = 135 + Math.sin(frame * 0.03) * 15;

  const pills = ["24/7 Intake", "Smart Triage", "Instant Dispatch", "Full Visibility"];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(145deg, #050508 0%, #0a0f15 30%, #050510 70%, #050505 100%)",
        fontFamily,
      }}
    >
      {/* Animated grid pattern */}
      <AnimatedGrid />

      <ParticleField />

      {/* Multiple radial gradients for depth */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 30% 70%, rgba(139, 92, 246, 0.05) 0%, transparent 40%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 70% 60%, rgba(6, 182, 212, 0.05) 0%, transparent 40%)",
        }}
      />

      {/* FlexDash Logo */}
      <FlexDashLogo />

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
              background: `linear-gradient(${gradientAngle}deg, #0ea5e9 0%, #38bdf8 40%, #8b5cf6 70%, #7dd3fc 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              fontWeight: 600,
            }}
          >
            emergency call
          </span>
        </h1>

        {/* Subtitle with FlexDash mention */}
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
          <span style={{ color: "#0ea5e9", fontWeight: 500 }}>FlexDash</span> — AI-powered intake and dispatch for restoration businesses
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
