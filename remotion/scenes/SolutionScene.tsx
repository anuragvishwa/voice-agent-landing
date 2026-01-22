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

// Solution feature card
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
    config: { damping: 20, stiffness: 100 },
  });

  const glow = Math.sin(frame * 0.05 + index) * 0.1 + 0.9;

  return (
    <div
      style={{
        backgroundColor: "rgba(14, 165, 233, 0.06)",
        border: "1px solid rgba(14, 165, 233, 0.2)",
        borderRadius: 20,
        padding: "36px 32px",
        opacity: entryProgress,
        transform: `translateY(${(1 - entryProgress) * 40}px) scale(${0.95 + entryProgress * 0.05})`,
        width: 360,
        boxShadow: `0 0 ${30 * glow}px rgba(14, 165, 233, ${0.1 * glow})`,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          backgroundColor: "rgba(14, 165, 233, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          fontSize: 32,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: 26,
          fontWeight: 600,
          color: "#0ea5e9",
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
              marginBottom: 8,
              fontSize: 14,
              color: "#64748b",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#0ea5e9",
                marginTop: 6,
                flexShrink: 0,
              }}
            />
            {bullet}
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
      {/* Gradient overlay */}
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
          padding: "80px 100px",
        }}
      >
        {/* Badge */}
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

        {/* Title */}
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
          From ring to dispatch in <span style={{ color: "#0ea5e9" }}>seconds</span>
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

        {/* Solution cards */}
        <div
          style={{
            display: "flex",
            gap: 32,
          }}
        >
          {solutions.map((solution, i) => (
            <SolutionCard
              key={solution.title}
              {...solution}
              delay={50 + i * 25}
              index={i}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
