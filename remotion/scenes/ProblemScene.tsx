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

// Animated danger background
const DangerBackground = () => {
  const frame = useCurrentFrame();
  const pulseIntensity = 0.04 + Math.sin(frame * 0.04) * 0.02;

  return (
    <>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 20%, rgba(239, 68, 68, ${pulseIntensity}) 0%, transparent 60%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 20% 80%, rgba(239, 68, 68, ${pulseIntensity * 0.5}) 0%, transparent 40%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 80% 70%, rgba(239, 68, 68, ${pulseIntensity * 0.5}) 0%, transparent 40%)`,
        }}
      />
    </>
  );
};

// Problem card component with enhanced animations
const ProblemCard = ({
  title,
  description,
  icon,
  delay,
  index,
  isLostRevenue,
}: {
  title: string;
  description: string;
  icon: string;
  delay: number;
  index: number;
  isLostRevenue?: boolean;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  // More dramatic shake for the Lost Revenue card
  const shakeIntensity = isLostRevenue ? 4 : 2;
  const shakeSpeed = isLostRevenue ? 0.15 : 0.1;
  const shake = Math.sin(frame * shakeSpeed + index) * shakeIntensity * (entryProgress > 0.9 ? 1 : 0);

  // Glow effect for Lost Revenue card
  const glowPulse = isLostRevenue ? 0.3 + Math.sin(frame * 0.08) * 0.15 : 0;

  return (
    <div
      style={{
        backgroundColor: isLostRevenue ? "rgba(239, 68, 68, 0.12)" : "rgba(239, 68, 68, 0.08)",
        border: `1px solid rgba(239, 68, 68, ${isLostRevenue ? 0.4 : 0.25})`,
        borderRadius: 16,
        padding: "32px 28px",
        opacity: entryProgress,
        transform: `translateY(${(1 - entryProgress) * 40}px) translateX(${shake}px) scale(${0.9 + entryProgress * 0.1})`,
        width: 280,
        boxShadow: isLostRevenue ? `0 0 40px rgba(239, 68, 68, ${glowPulse})` : "none",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          fontSize: 28,
          transform: isLostRevenue ? `scale(${1 + Math.sin(frame * 0.1) * 0.05})` : "none",
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: 22,
          fontWeight: 600,
          color: "#ef4444",
          margin: "0 0 12px 0",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 16,
          color: "#94a3b8",
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
    </div>
  );
};

// Animated stat counter with counting effect
const StatCounter = ({ targetValue, label }: { targetValue: number; label: string }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [180, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(frame, [180, 220], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(2)),
  });

  const pulse = 1 + Math.sin(frame * 0.08) * 0.04;
  const glowPulse = 20 + Math.sin(frame * 0.06) * 10;

  // Animated counter that counts up
  const countProgress = interpolate(frame, [210, 270], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const displayValue = Math.floor(targetValue * countProgress);

  return (
    <div
      style={{
        textAlign: "center",
        opacity,
        transform: `scale(${scale * pulse})`,
      }}
    >
      <div
        style={{
          fontSize: 80,
          fontWeight: 300,
          color: "#ef4444",
          fontFamily: "Georgia, serif",
          lineHeight: 1,
          textShadow: `0 0 ${glowPulse}px rgba(239, 68, 68, 0.5)`,
        }}
      >
        ${displayValue.toLocaleString()}+
      </div>
      <div
        style={{
          fontSize: 18,
          color: "#94a3b8",
          marginTop: 12,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const ProblemScene = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleY = interpolate(frame, [0, 40], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Badge pulse animation
  const badgePulse = 1 + Math.sin(frame * 0.1) * 0.03;

  const problems = [
    {
      title: "Calls Go Unanswered",
      description: "Team on-site, driving, or short-staffed. After-hours gaps.",
      icon: "📵",
    },
    {
      title: "Slow Response",
      description: "Voicemails pile up. Callbacks delayed. Customers move on.",
      icon: "⏳",
    },
    {
      title: "Incomplete Intake",
      description: "Missing addresses, insurance info. Back-and-forth chaos.",
      icon: "📋",
    },
    {
      title: "Lost Revenue",
      description: "Competitors answer first. High-ticket jobs slip away.",
      icon: "💸",
      isLostRevenue: true,
    },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(145deg, #0a0505 0%, #150a0a 50%, #0a0505 100%)",
        fontFamily,
      }}
    >
      {/* Animated danger gradient overlays */}
      <DangerBackground />

      {/* Content */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "80px 100px",
        }}
      >
        {/* Badge with pulse */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: 9999,
            marginBottom: 32,
            opacity: titleOpacity,
            transform: `scale(${badgePulse})`,
            boxShadow: "0 0 20px rgba(239, 68, 68, 0.2)",
          }}
        >
          <span style={{ fontSize: 14 }}>⚠️</span>
          <span
            style={{
              fontSize: 14,
              fontFamily: "monospace",
              color: "#ef4444",
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            The Problem
          </span>
        </div>

        {/* Title with animated gradient */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          <h2
            style={{
              fontSize: 64,
              fontWeight: 300,
              color: "white",
              margin: 0,
              fontFamily: "Georgia, serif",
            }}
          >
            Customers call
          </h2>
          <svg width="550" height="80" viewBox="0 0 550 80" style={{ marginTop: -5 }}>
            <defs>
              <linearGradient id="problemGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#f87171" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <text
              x="275"
              y="55"
              textAnchor="middle"
              fill="url(#problemGradient)"
              style={{
                fontSize: 64,
                fontWeight: 500,
                fontFamily: "Georgia, serif",
              }}
            >
              multiple companies
            </text>
          </svg>
        </div>

        <p
          style={{
            fontSize: 24,
            color: "#94a3b8",
            margin: "0 0 60px 0",
            opacity: titleOpacity,
            textAlign: "center",
          }}
        >
          The first to answer, qualify, and dispatch wins the job.
        </p>

        {/* Problem cards with staggered animations */}
        <div
          style={{
            display: "flex",
            gap: 24,
            marginBottom: 60,
          }}
        >
          {problems.map((problem, i) => (
            <ProblemCard
              key={problem.title}
              {...problem}
              delay={50 + i * 25}
              index={i}
              isLostRevenue={problem.isLostRevenue}
            />
          ))}
        </div>

        {/* Stat with animated counter */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: "28px 56px",
            backgroundColor: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.25)",
            borderRadius: 20,
            boxShadow: `0 0 ${30 + Math.sin(frame * 0.05) * 15}px rgba(239, 68, 68, 0.15)`,
          }}
        >
          <StatCounter targetValue={3500} label="Average value of a missed water damage call" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
