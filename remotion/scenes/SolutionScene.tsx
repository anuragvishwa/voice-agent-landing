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

// Animated checkmark component
const AnimatedCheckmark = ({ delay, index }: { delay: number; index: number }) => {
  const frame = useCurrentFrame();

  const checkProgress = interpolate(frame, [delay, delay + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const scale = spring({
    frame: frame - delay,
    fps: 30,
    config: { damping: 12, stiffness: 200 },
  });

  return (
    <div
      style={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        border: "1px solid rgba(34, 197, 94, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scale})`,
        flexShrink: 0,
      }}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
        <path
          d="M20 6L9 17L4 12"
          stroke="#22c55e"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="24"
          strokeDashoffset={24 - 24 * checkProgress}
        />
      </svg>
    </div>
  );
};

// Connection line between cards
const ConnectionLine = ({ delay }: { delay: number }) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [delay, delay + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Animated particle
  const particlePos = ((frame - delay) * 0.03) % 1;
  const particleOpacity = progress > 0.5 ? 1 : 0;

  return (
    <div
      style={{
        width: 60,
        height: 4,
        position: "relative",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Line */}
      <div
        style={{
          width: `${progress * 100}%`,
          height: 2,
          background: "linear-gradient(90deg, rgba(14, 165, 233, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)",
          borderRadius: 2,
        }}
      />
      {/* Particle */}
      <div
        style={{
          position: "absolute",
          left: `${particlePos * 100}%`,
          top: "50%",
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "#0ea5e9",
          transform: "translate(-50%, -50%)",
          opacity: particleOpacity,
          boxShadow: "0 0 8px #0ea5e9",
        }}
      />
    </div>
  );
};

// Solution feature card with enhanced animations
const SolutionCard = ({
  title,
  description,
  icon,
  bullets,
  delay,
  index,
}: {
  title: string;
  description: string;
  icon: string;
  bullets: string[];
  delay: number;
  index: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const glowIntensity = 0.15 + Math.sin(frame * 0.06 + index * 0.5) * 0.1;
  const iconBounce = Math.sin(frame * 0.08 + index) * 3;
  const iconScale = 1 + Math.sin(frame * 0.05 + index) * 0.05;

  // Different accent colors for each card
  const accentColors = ["#0ea5e9", "#8b5cf6", "#06b6d4"];
  const accent = accentColors[index % 3];

  return (
    <div
      style={{
        backgroundColor: "rgba(14, 165, 233, 0.06)",
        border: `1px solid ${accent}40`,
        borderRadius: 20,
        padding: "36px 32px",
        opacity: entryProgress,
        transform: `translateY(${(1 - entryProgress) * 50}px) scale(${0.9 + entryProgress * 0.1})`,
        width: 360,
        boxShadow: `0 0 40px rgba(14, 165, 233, ${glowIntensity}), inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: `linear-gradient(135deg, ${accent}20 0%, ${accent}10 100%)`,
          border: `1px solid ${accent}40`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          fontSize: 32,
          transform: `translateY(${iconBounce}px) scale(${iconScale})`,
          boxShadow: `0 0 20px ${accent}30`,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: 26,
          fontWeight: 600,
          color: accent,
          margin: "0 0 12px 0",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 16,
          color: "#94a3b8",
          margin: "0 0 20px 0",
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {bullets.map((bullet, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              marginBottom: 10,
              fontSize: 14,
              color: "#94a3b8",
            }}
          >
            <AnimatedCheckmark delay={delay + 30 + i * 12} index={i} />
            <span style={{ marginTop: 2 }}>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const SolutionScene = () => {
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

  // Animated gradient for title
  const gradientAngle = 135 + Math.sin(frame * 0.03) * 20;

  const solutions = [
    {
      title: "Voice Intake",
      description: "Answer every call instantly with AI-powered capture.",
      icon: "📞",
      bullets: [
        "Instant answer, no voicemail",
        "Structured data capture",
        "Warm transfer for emergencies",
      ],
    },
    {
      title: "Smart Triage",
      description: "Auto-classify by priority and route intelligently.",
      icon: "🎯",
      bullets: [
        "Emergency/Urgent/Routine",
        "Geo-based routing",
        "Multi-location support",
      ],
    },
    {
      title: "Instant Dispatch",
      description: "Alert teams and track acknowledgment in real-time.",
      icon: "🚀",
      bullets: [
        "SMS/Email/Slack alerts",
        "One-tap acknowledgment",
        "Auto-escalation backup",
      ],
    },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(145deg, #050508 0%, #0a0f15 50%, #050510 100%)",
        fontFamily,
      }}
    >
      {/* Multiple gradient overlays for depth */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 20% 60%, rgba(139, 92, 246, 0.06) 0%, transparent 40%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 80% 70%, rgba(6, 182, 212, 0.06) 0%, transparent 40%)",
        }}
      />

      {/* Content */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "80px 100px",
        }}
      >
        {/* Badge with glow */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            backgroundColor: "rgba(14, 165, 233, 0.1)",
            border: "1px solid rgba(14, 165, 233, 0.3)",
            borderRadius: 9999,
            marginBottom: 32,
            opacity: titleOpacity,
            boxShadow: "0 0 20px rgba(14, 165, 233, 0.15)",
          }}
        >
          <span style={{ fontSize: 14 }}>✨</span>
          <span
            style={{
              fontSize: 14,
              fontFamily: "monospace",
              color: "#0ea5e9",
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            The Solution
          </span>
        </div>

        {/* Title with animated gradient */}
        <h2
          style={{
            fontSize: 64,
            fontWeight: 300,
            color: "white",
            margin: "0 0 16px 0",
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textAlign: "center",
            fontFamily: "Georgia, serif",
          }}
        >
          From ring to dispatch in{" "}
          <span
            style={{
              background: `linear-gradient(${gradientAngle}deg, #0ea5e9 0%, #38bdf8 40%, #8b5cf6 70%, #06b6d4 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              fontWeight: 500,
            }}
          >
            seconds
          </span>
        </h2>

        <p
          style={{
            fontSize: 24,
            color: "#94a3b8",
            margin: "0 0 60px 0",
            opacity: titleOpacity,
            textAlign: "center",
          }}
        >
          Every call becomes a tracked, triaged, dispatched job.
        </p>

        {/* Solution cards with connection lines */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
          }}
        >
          {solutions.map((solution, i) => (
            <div key={solution.title} style={{ display: "flex", alignItems: "center" }}>
              <SolutionCard
                {...solution}
                delay={50 + i * 30}
                index={i}
              />
              {i < solutions.length - 1 && (
                <ConnectionLine delay={80 + i * 30} />
              )}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
