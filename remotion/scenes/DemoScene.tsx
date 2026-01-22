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

// Terminal line component
const TerminalLine = ({
  icon,
  text,
  color,
  delay,
  isHighlight,
}: {
  icon: string;
  text: string;
  color: string;
  delay: number;
  isHighlight?: boolean;
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const x = interpolate(frame, [delay, delay + 20], [-20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Typewriter effect for text
  const typedLength = Math.floor(
    interpolate(frame, [delay + 5, delay + 5 + text.length * 1.5], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const displayText = text.substring(0, typedLength);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: isHighlight ? "12px 16px" : "8px 0",
        backgroundColor: isHighlight ? "rgba(255, 255, 255, 0.05)" : "transparent",
        borderRadius: 8,
        opacity,
        transform: `translateX(${x}px)`,
        marginBottom: 8,
      }}
    >
      <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{icon}</span>
      <span style={{ fontFamily: "monospace", fontSize: 16, color }}>
        {displayText}
        {typedLength < text.length && (
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: 16,
              backgroundColor: "#0ea5e9",
              marginLeft: 2,
              opacity: frame % 30 < 15 ? 1 : 0,
            }}
          />
        )}
      </span>
    </div>
  );
};

// Call flow node
const FlowNode = ({
  label,
  x,
  y,
  delay,
  isCenter,
  color,
}: {
  label: string;
  x: number;
  y: number;
  delay: number;
  isCenter?: boolean;
  color: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const pulse = isCenter ? 1 + Math.sin(frame * 0.08) * 0.05 : 1;

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
      <div
        style={{
          width: isCenter ? 100 : 70,
          height: isCenter ? 100 : 70,
          borderRadius: "50%",
          backgroundColor: `${color}15`,
          border: `2px solid ${color}50`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isCenter ? `0 0 40px ${color}30` : "none",
        }}
      >
        <span style={{ fontSize: isCenter ? 28 : 20 }}>
          {isCenter ? "🎯" : label === "Caller" ? "📞" : "👤"}
        </span>
        <span
          style={{
            fontSize: 10,
            color,
            fontFamily: "monospace",
            marginTop: 4,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

// Animated connection line
const ConnectionLine = ({
  x1,
  y1,
  x2,
  y2,
  delay,
  color,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
  color: string;
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [delay, delay + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  // Particle position
  const particleT = ((frame - delay) * 0.02) % 1;
  const particleX = x1 + (x2 - x1) * particleT;
  const particleY = y1 + (y2 - y1) * particleT;

  return (
    <>
      {/* Line */}
      <div
        style={{
          position: "absolute",
          left: x1,
          top: y1,
          width: lineLength * progress,
          height: 2,
          backgroundColor: `${color}40`,
          transform: `rotate(${angle}deg)`,
          transformOrigin: "left center",
        }}
      />
      {/* Particle */}
      {progress > 0.5 && (
        <div
          style={{
            position: "absolute",
            left: particleX,
            top: particleY,
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: color,
            transform: "translate(-50%, -50%)",
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      )}
    </>
  );
};

export const DemoScene = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const terminalLines = [
    { icon: "📞", text: "Incoming call: (415) 555-0123", color: "#0ea5e9", delay: 60 },
    { icon: "🎙️", text: "Playing disclosure & greeting...", color: "#94a3b8", delay: 100 },
    { icon: "👤", text: 'Caller: "Water everywhere, pipe burst!"', color: "#a78bfa", delay: 140 },
    { icon: "🚨", text: "TRIAGE: EMERGENCY - Active water damage", color: "#ef4444", delay: 180, highlight: true },
    { icon: "📍", text: "Address: 742 Oak Street, San Francisco", color: "#22c55e", delay: 220 },
    { icon: "✅", text: "Insurance: Yes, State Farm", color: "#22c55e", delay: 250 },
    { icon: "📤", text: "Dispatching to on-call team...", color: "#0ea5e9", delay: 280 },
    { icon: "✅", text: "Tech Mike acknowledged in 45 seconds", color: "#22c55e", delay: 320 },
    { icon: "✅", text: "ETA shared: 28 minutes", color: "#22c55e", delay: 350 },
    { icon: "🎉", text: "Job created: #WTR-2024-0847 - DISPATCHED", color: "#22c55e", delay: 380, highlight: true },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(145deg, #050508 0%, #0a0f15 50%, #050510 100%)",
        fontFamily,
      }}
    >
      {/* Content */}
      <AbsoluteFill
        style={{
          display: "flex",
          padding: "60px 80px",
          gap: 60,
        }}
      >
        {/* Left side - Call flow visualization */}
        <div
          style={{
            flex: 1,
            position: "relative",
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            borderRadius: 20,
            border: "1px solid rgba(30, 41, 59, 0.8)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid rgba(30, 41, 59, 0.8)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ef4444" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#f59e0b" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#22c55e" }} />
            </div>
            <span style={{ fontFamily: "monospace", fontSize: 14, color: "#64748b", marginLeft: "auto" }}>
              Call Flow Visualization
            </span>
          </div>

          {/* Flow diagram */}
          <div style={{ position: "relative", height: "calc(100% - 52px)", padding: 40 }}>
            {/* Connection lines */}
            <ConnectionLine x1={120} y1={150} x2={350} y2={280} delay={30} color="#0ea5e9" />
            <ConnectionLine x1={120} y1={280} x2={350} y2={280} delay={40} color="#0ea5e9" />
            <ConnectionLine x1={120} y1={410} x2={350} y2={280} delay={50} color="#0ea5e9" />
            <ConnectionLine x1={450} y1={280} x2={650} y2={150} delay={200} color="#22c55e" />
            <ConnectionLine x1={450} y1={280} x2={650} y2={280} delay={210} color="#22c55e" />
            <ConnectionLine x1={450} y1={280} x2={650} y2={410} delay={220} color="#22c55e" />

            {/* Nodes */}
            <FlowNode label="Caller" x={120} y={150} delay={10} color="#0ea5e9" />
            <FlowNode label="Caller" x={120} y={280} delay={15} color="#0ea5e9" />
            <FlowNode label="Caller" x={120} y={410} delay={20} color="#0ea5e9" />
            <FlowNode label="DISPATCH" x={400} y={280} delay={70} isCenter color="#8b5cf6" />
            <FlowNode label="Tech" x={680} y={150} delay={230} color="#22c55e" />
            <FlowNode label="Tech" x={680} y={280} delay={240} color="#22c55e" />
            <FlowNode label="Manager" x={680} y={410} delay={250} color="#22c55e" />
          </div>
        </div>

        {/* Right side - Terminal output */}
        <div
          style={{
            width: 550,
            backgroundColor: "rgba(15, 23, 42, 0.8)",
            borderRadius: 20,
            border: "1px solid rgba(30, 41, 59, 0.8)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid rgba(30, 41, 59, 0.8)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ef4444" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#f59e0b" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#22c55e" }} />
            </div>
            <span style={{ fontFamily: "monospace", fontSize: 14, color: "#64748b", marginLeft: "auto" }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#ef4444",
                  display: "inline-block",
                  marginRight: 8,
                  animation: "blink 1s infinite",
                }}
              />
              Emergency Intake Log
            </span>
          </div>

          {/* Terminal content */}
          <div style={{ padding: 24, height: "calc(100% - 52px)", overflowY: "auto" }}>
            {terminalLines.map((line, i) => (
              <TerminalLine
                key={i}
                icon={line.icon}
                text={line.text}
                color={line.color}
                delay={line.delay}
                isHighlight={line.highlight}
              />
            ))}
          </div>
        </div>
      </AbsoluteFill>

      {/* Title overlay */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 80,
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            backgroundColor: "rgba(14, 165, 233, 0.1)",
            border: "1px solid rgba(14, 165, 233, 0.3)",
            borderRadius: 9999,
          }}
        >
          <span style={{ fontSize: 12 }}>▶️</span>
          <span
            style={{
              fontSize: 12,
              fontFamily: "monospace",
              color: "#0ea5e9",
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            Live Demo
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
