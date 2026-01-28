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

// Success celebration confetti
const SuccessConfetti = ({ delay }: { delay: number }) => {
  const frame = useCurrentFrame();
  const startFrame = delay;

  if (frame < startFrame) return null;

  const confettiPieces = Array.from({ length: 25 }, (_, i) => {
    const angle = (i / 25) * Math.PI * 2;
    const speed = 2 + (i % 5) * 0.6;
    const t = (frame - startFrame) / 40;
    const x = Math.cos(angle) * speed * t * 80;
    const y = Math.sin(angle) * speed * t * 40 + t * t * 60;
    const rotation = t * 360 * (i % 2 === 0 ? 1 : -1);
    const opacity = interpolate(t, [0, 0.2, 1], [0, 1, 0], {
      extrapolateRight: "clamp",
    });
    const colors = ["#22c55e", "#0ea5e9", "#8b5cf6", "#f59e0b", "#38bdf8"];

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 6 + (i % 4) * 2,
          height: 6 + (i % 4) * 2,
          backgroundColor: colors[i % 5],
          borderRadius: i % 3 === 0 ? "50%" : 2,
          transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
          opacity,
        }}
      />
    );
  });

  return <>{confettiPieces}</>;
};

// Terminal line component with enhanced styling
const TerminalLine = ({
  icon,
  text,
  color,
  delay,
  isHighlight,
  isSuccess,
}: {
  icon: string;
  text: string;
  color: string;
  delay: number;
  isHighlight?: boolean;
  isSuccess?: boolean;
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const x = interpolate(frame, [delay, delay + 15], [-20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Faster typewriter effect
  const typedLength = Math.floor(
    interpolate(frame, [delay + 3, delay + 3 + text.length * 1.2], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const displayText = text.substring(0, typedLength);

  // Glow effect for success/highlight lines
  const glowPulse = isSuccess ? 0.3 + Math.sin(frame * 0.1) * 0.15 : 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: isHighlight || isSuccess ? "12px 16px" : "8px 0",
        backgroundColor: isSuccess
          ? "rgba(34, 197, 94, 0.1)"
          : isHighlight
          ? "rgba(239, 68, 68, 0.08)"
          : "transparent",
        border: isSuccess
          ? "1px solid rgba(34, 197, 94, 0.3)"
          : isHighlight
          ? "1px solid rgba(239, 68, 68, 0.2)"
          : "none",
        borderRadius: 8,
        opacity,
        transform: `translateX(${x}px)`,
        marginBottom: 8,
        boxShadow: isSuccess ? `0 0 20px rgba(34, 197, 94, ${glowPulse})` : "none",
        position: "relative",
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
              opacity: frame % 20 < 10 ? 1 : 0,
            }}
          />
        )}
      </span>
      {isSuccess && <SuccessConfetti delay={delay + 20} />}
    </div>
  );
};

// Call flow node with enhanced animation
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
    config: { damping: 12, stiffness: 120 },
  });

  const pulse = isCenter ? 1 + Math.sin(frame * 0.08) * 0.08 : 1;
  const glowIntensity = isCenter ? 40 + Math.sin(frame * 0.06) * 20 : 0;

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
          width: isCenter ? 110 : 75,
          height: isCenter ? 110 : 75,
          borderRadius: "50%",
          backgroundColor: `${color}18`,
          border: `2px solid ${color}60`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isCenter ? `0 0 ${glowIntensity}px ${color}40` : `0 0 15px ${color}20`,
        }}
      >
        <span style={{ fontSize: isCenter ? 32 : 22 }}>
          {isCenter ? "🎯" : label === "Caller" ? "📞" : "👤"}
        </span>
        <span
          style={{
            fontSize: 10,
            color,
            fontFamily: "monospace",
            marginTop: 4,
            fontWeight: 600,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

// Animated connection line with enhanced particles
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

  const progress = interpolate(frame, [delay, delay + 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const lineLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  // Multiple particles
  const particles = [0, 0.33, 0.66].map((offset) => {
    const particleT = ((frame - delay) * 0.025 + offset) % 1;
    return {
      x: x1 + (x2 - x1) * particleT,
      y: y1 + (y2 - y1) * particleT,
      opacity: progress > 0.3 ? 0.8 : 0,
    };
  });

  return (
    <>
      {/* Glow line */}
      <div
        style={{
          position: "absolute",
          left: x1,
          top: y1,
          width: lineLength * progress,
          height: 4,
          background: `linear-gradient(90deg, ${color}20 0%, ${color}50 50%, ${color}20 100%)`,
          transform: `rotate(${angle}deg)`,
          transformOrigin: "left center",
          borderRadius: 2,
          filter: "blur(2px)",
        }}
      />
      {/* Main line */}
      <div
        style={{
          position: "absolute",
          left: x1,
          top: y1,
          width: lineLength * progress,
          height: 2,
          backgroundColor: `${color}60`,
          transform: `rotate(${angle}deg)`,
          transformOrigin: "left center",
          borderRadius: 1,
        }}
      />
      {/* Particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: color,
            transform: "translate(-50%, -50%)",
            boxShadow: `0 0 12px ${color}`,
            opacity: p.opacity,
          }}
        />
      ))}
    </>
  );
};

// Recording indicator
const RecordingIndicator = () => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + Math.sin(frame * 0.15) * 0.5;

  return (
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: "#ef4444",
        display: "inline-block",
        marginRight: 8,
        opacity: pulse,
        boxShadow: `0 0 ${8 * pulse}px #ef4444`,
      }}
    />
  );
};

export const DemoScene = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const terminalLines = [
    { icon: "📞", text: "Incoming call: (415) 555-0123", color: "#0ea5e9", delay: 50 },
    { icon: "🎙️", text: "Playing disclosure & greeting...", color: "#94a3b8", delay: 85 },
    { icon: "👤", text: 'Caller: "Water everywhere, pipe burst!"', color: "#a78bfa", delay: 120 },
    { icon: "🚨", text: "TRIAGE: EMERGENCY - Active water damage", color: "#ef4444", delay: 155, highlight: true },
    { icon: "📍", text: "Address: 742 Oak Street, San Francisco", color: "#22c55e", delay: 190 },
    { icon: "✅", text: "Insurance: Yes, State Farm", color: "#22c55e", delay: 220 },
    { icon: "📤", text: "Dispatching to on-call team...", color: "#0ea5e9", delay: 250 },
    { icon: "✅", text: "Tech Mike acknowledged in 45 seconds", color: "#22c55e", delay: 290 },
    { icon: "✅", text: "ETA shared: 28 minutes", color: "#22c55e", delay: 320 },
    { icon: "🎉", text: "Job created: #WTR-2024-0847 - DISPATCHED", color: "#22c55e", delay: 350, isSuccess: true },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(145deg, #050508 0%, #0a0f15 50%, #050510 100%)",
        fontFamily,
      }}
    >
      {/* Gradient overlays */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 30% 50%, rgba(14, 165, 233, 0.06) 0%, transparent 50%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 70% 50%, rgba(139, 92, 246, 0.06) 0%, transparent 50%)",
        }}
      />

      {/* Content - Side by side layout */}
      <AbsoluteFill
        style={{
          display: "flex",
          padding: "80px 100px",
          gap: 50,
        }}
      >
        {/* Left side - Call flow visualization */}
        <div
          style={{
            width: 750,
            position: "relative",
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            borderRadius: 20,
            border: "1px solid rgba(30, 41, 59, 0.8)",
            overflow: "hidden",
            boxShadow: "0 0 40px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid rgba(30, 41, 59, 0.8)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, transparent 100%)",
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ef4444" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#f59e0b" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#22c55e" }} />
            </div>
            <span style={{ fontFamily: "monospace", fontSize: 13, color: "#64748b", marginLeft: "auto" }}>
              Call Flow Visualization
            </span>
          </div>

          {/* Flow diagram - adjusted positions for better fit */}
          <div style={{ position: "relative", height: "calc(100% - 44px)", padding: 30 }}>
            {/* Connection lines - scaled positions */}
            <ConnectionLine x1={80} y1={120} x2={300} y2={230} delay={30} color="#0ea5e9" />
            <ConnectionLine x1={80} y1={230} x2={300} y2={230} delay={40} color="#0ea5e9" />
            <ConnectionLine x1={80} y1={340} x2={300} y2={230} delay={50} color="#0ea5e9" />
            <ConnectionLine x1={390} y1={230} x2={580} y2={120} delay={180} color="#22c55e" />
            <ConnectionLine x1={390} y1={230} x2={580} y2={230} delay={190} color="#22c55e" />
            <ConnectionLine x1={390} y1={230} x2={580} y2={340} delay={200} color="#22c55e" />

            {/* Nodes - scaled positions */}
            <FlowNode label="Caller" x={80} y={120} delay={10} color="#0ea5e9" />
            <FlowNode label="Caller" x={80} y={230} delay={15} color="#0ea5e9" />
            <FlowNode label="Caller" x={80} y={340} delay={20} color="#0ea5e9" />
            <FlowNode label="FlexDash" x={345} y={230} delay={60} isCenter color="#8b5cf6" />
            <FlowNode label="Tech" x={610} y={120} delay={210} color="#22c55e" />
            <FlowNode label="Tech" x={610} y={230} delay={220} color="#22c55e" />
            <FlowNode label="Manager" x={610} y={340} delay={230} color="#22c55e" />
          </div>
        </div>

        {/* Right side - Terminal output */}
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(15, 23, 42, 0.8)",
            borderRadius: 20,
            border: "1px solid rgba(30, 41, 59, 0.8)",
            overflow: "hidden",
            boxShadow: "0 0 40px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid rgba(30, 41, 59, 0.8)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, transparent 100%)",
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ef4444" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#f59e0b" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#22c55e" }} />
            </div>
            <span style={{ fontFamily: "monospace", fontSize: 13, color: "#64748b", marginLeft: "auto" }}>
              <RecordingIndicator />
              Emergency Intake Log
            </span>
          </div>

          {/* Terminal content */}
          <div style={{ padding: 20, height: "calc(100% - 44px)", overflowY: "auto" }}>
            {terminalLines.map((line, i) => (
              <TerminalLine
                key={i}
                icon={line.icon}
                text={line.text}
                color={line.color}
                delay={line.delay}
                isHighlight={line.highlight}
                isSuccess={line.isSuccess}
              />
            ))}
          </div>
        </div>
      </AbsoluteFill>

      {/* Title overlay */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 100,
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
            boxShadow: "0 0 15px rgba(14, 165, 233, 0.2)",
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
