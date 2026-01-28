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

// Animated phone icon with pulse
const PulsingPhone = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 50, stiffness: 100 },
    durationInFrames: 40,
  });

  const pulse = 1 + Math.sin(frame * 0.08) * 0.05;
  const glow = 30 + Math.sin(frame * 0.06) * 15;

  // Pulse rings
  const ring1Scale = interpolate(frame % 60, [0, 60], [1, 3]);
  const ring1Opacity = interpolate(frame % 60, [0, 60], [0.6, 0]);
  const ring2Scale = interpolate((frame + 30) % 60, [0, 60], [1, 3]);
  const ring2Opacity = interpolate((frame + 30) % 60, [0, 60], [0.6, 0]);

  return (
    <div
      style={{
        position: "relative",
        transform: `scale(${scale * pulse})`,
        filter: `drop-shadow(0 0 ${glow}px rgba(14, 165, 233, 0.5))`,
      }}
    >
      {/* Pulse rings */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 140,
          height: 140,
          borderRadius: "50%",
          border: "2px solid rgba(14, 165, 233, 0.5)",
          transform: `translate(-50%, -50%) scale(${ring1Scale})`,
          opacity: ring1Opacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 140,
          height: 140,
          borderRadius: "50%",
          border: "2px solid rgba(14, 165, 233, 0.5)",
          transform: `translate(-50%, -50%) scale(${ring2Scale})`,
          opacity: ring2Opacity,
        }}
      />

      {/* Phone circle */}
      <div
        style={{
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(14, 165, 233, 0.05) 100%)",
          border: "2px solid rgba(14, 165, 233, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="70" height="70" viewBox="0 0 24 24" fill="none">
          <path
            d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
            stroke="#0ea5e9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

// CTA button component with animated gradient
const CTAButton = ({
  text,
  isPrimary,
  delay,
}: {
  text: string;
  isPrimary?: boolean;
  delay: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  const hover = Math.sin(frame * 0.06) * 3;
  const glowPulse = isPrimary ? 0.4 + Math.sin(frame * 0.08) * 0.2 : 0;
  const gradientPosition = (frame * 2) % 200;

  return (
    <div
      style={{
        position: "relative",
        padding: "22px 52px",
        borderRadius: 14,
        fontFamily: "monospace",
        fontSize: 20,
        fontWeight: 600,
        backgroundColor: isPrimary ? "transparent" : "transparent",
        border: isPrimary ? "none" : "2px solid rgba(255, 255, 255, 0.2)",
        color: "white",
        opacity: entryProgress,
        transform: `translateY(${(1 - entryProgress) * 25 + hover}px) scale(${0.95 + entryProgress * 0.05})`,
        boxShadow: isPrimary
          ? `0 10px 50px rgba(14, 165, 233, ${glowPulse}), 0 0 30px rgba(139, 92, 246, ${glowPulse * 0.5})`
          : "none",
        overflow: "hidden",
      }}
    >
      {/* Animated gradient background for primary button */}
      {isPrimary && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(${90 + gradientPosition}deg, #0ea5e9 0%, #8b5cf6 25%, #0ea5e9 50%, #06b6d4 75%, #0ea5e9 100%)`,
            backgroundSize: "200% 100%",
            zIndex: -1,
          }}
        />
      )}
      {/* Shimmer effect */}
      {isPrimary && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${-100 + ((frame * 1.5) % 300)}%`,
            width: "50%",
            height: "100%",
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
            zIndex: 0,
          }}
        />
      )}
      <span style={{ position: "relative", zIndex: 1 }}>{text}</span>
    </div>
  );
};

// Trust signal with animated checkmark
const TrustSignal = ({ text, delay }: { text: string; delay: number }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(frame, [delay, delay + 25], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(2)),
  });

  const checkProgress = interpolate(frame, [delay + 10, delay + 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          backgroundColor: "rgba(34, 197, 94, 0.15)",
          border: "1px solid rgba(34, 197, 94, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
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
      <span style={{ fontSize: 16, color: "#94a3b8" }}>{text}</span>
    </div>
  );
};

export const CTAScene = () => {
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

  const subtitleOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Animated gradient for title
  const gradientAngle = 135 + Math.sin(frame * 0.04) * 20;

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
          background: "radial-gradient(ellipse at 50% 40%, rgba(14, 165, 233, 0.12) 0%, transparent 50%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 30% 60%, rgba(139, 92, 246, 0.08) 0%, transparent 40%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 70% 70%, rgba(6, 182, 212, 0.08) 0%, transparent 40%)",
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
        {/* Phone icon */}
        <div style={{ marginBottom: 50 }}>
          <PulsingPhone />
        </div>

        {/* Title with animated gradient */}
        <h2
          style={{
            fontSize: 72,
            fontWeight: 300,
            color: "white",
            margin: "0 0 20px 0",
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textAlign: "center",
            fontFamily: "Georgia, serif",
            lineHeight: 1.2,
          }}
        >
          Stop losing{" "}
          <span
            style={{
              background: `linear-gradient(${gradientAngle}deg, #0ea5e9 0%, #38bdf8 30%, #8b5cf6 60%, #7dd3fc 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              fontWeight: 500,
            }}
          >
            emergency jobs
          </span>
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 28,
            color: "#94a3b8",
            margin: "0 0 50px 0",
            opacity: subtitleOpacity,
            textAlign: "center",
            maxWidth: 700,
          }}
        >
          Book a 15-minute demo and see how{" "}
          <span style={{ color: "#0ea5e9", fontWeight: 500 }}>FlexDash</span>{" "}
          transforms every call into a dispatched job.
        </p>

        {/* Trust signals */}
        <div
          style={{
            display: "flex",
            gap: 40,
          }}
        >
          <TrustSignal text="Free trial available" delay={120} />
          <TrustSignal text="No credit card required" delay={135} />
        </div>
      </AbsoluteFill>

      {/* Logo with glow */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          opacity: interpolate(frame, [160, 190], [0, 0.9], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)",
            border: "1px solid rgba(14, 165, 233, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 ${15 + Math.sin(frame * 0.05) * 5}px rgba(14, 165, 233, 0.3)`,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
              stroke="#0ea5e9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span style={{ fontFamily: "monospace", fontSize: 18, color: "white", fontWeight: 600 }}>FlexDash</span>
      </div>
    </AbsoluteFill>
  );
};
