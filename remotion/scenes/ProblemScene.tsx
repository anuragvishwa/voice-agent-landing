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

// Problem card component
const ProblemCard = ({
  title,
  description,
  icon,
  delay,
  index,
}: {
  title: string;
  description: string;
  icon: string;
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

  const shake = Math.sin(frame * 0.1 + index) * 2;

  return (
    <div
      style={{
        backgroundColor: "rgba(239, 68, 68, 0.08)",
        border: "1px solid rgba(239, 68, 68, 0.25)",
        borderRadius: 16,
        padding: "32px 28px",
        opacity: entryProgress,
        transform: `translateY(${(1 - entryProgress) * 30}px) translateX(${shake}px)`,
        width: 280,
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

// Animated stat counter
const StatCounter = ({ value, label }: { value: string; label: string }) => {
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

  const pulse = 1 + Math.sin(frame * 0.08) * 0.03;

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
          fontSize: 72,
          fontWeight: 300,
          color: "#ef4444",
          fontFamily: "Georgia, serif",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 18,
          color: "#94a3b8",
          marginTop: 8,
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
    },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(145deg, #0a0505 0%, #150a0a 50%, #0a0505 100%)",
        fontFamily,
      }}
    >
      {/* Subtle danger gradient overlay */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 20%, rgba(239, 68, 68, 0.06) 0%, transparent 60%)",
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
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: 9999,
            marginBottom: 32,
            opacity: titleOpacity,
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
          Customers call <span style={{ color: "#ef4444" }}>multiple companies</span>
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
          The first to answer, qualify, and dispatch wins the job.
        </p>

        {/* Problem cards */}
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
              delay={50 + i * 20}
              index={i}
            />
          ))}
        </div>

        {/* Stat */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: "24px 48px",
            backgroundColor: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: 20,
          }}
        >
          <StatCounter value="$3,500+" label="Average value of a missed water damage call" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
