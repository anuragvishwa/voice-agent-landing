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

// CTA button component
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
    config: { damping: 15, stiffness: 100 },
  });

  const hover = Math.sin(frame * 0.05) * 2;

  return (
    <div
      style={{
        padding: "20px 48px",
        borderRadius: 12,
        fontFamily: "monospace",
        fontSize: 20,
        fontWeight: 500,
        backgroundColor: isPrimary ? "#0ea5e9" : "transparent",
        border: isPrimary ? "none" : "2px solid rgba(255, 255, 255, 0.2)",
        color: isPrimary ? "white" : "rgba(255, 255, 255, 0.8)",
        opacity: entryProgress,
        transform: `translateY(${(1 - entryProgress) * 20 + hover}px)`,
        boxShadow: isPrimary ? "0 10px 40px rgba(14, 165, 233, 0.3)" : "none",
      }}
    >
      {text}
    </div>
  );
};

// Trust signal
const TrustSignal = ({ text, delay }: { text: string; delay: number }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "#0ea5e9",
        }}
      />
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
          background: "radial-gradient(ellipse at 50% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)",
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

        {/* Title */}
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
              background: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #7dd3fc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
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
          Book a 15-minute demo and see how VoiceCapture transforms every call into a dispatched job.
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: "flex",
            gap: 24,
            marginBottom: 50,
          }}
        >
          <CTAButton text="Book a Demo" isPrimary delay={80} />
          <CTAButton text="Learn More" delay={95} />
        </div>

        {/* Trust signals */}
        <div
          style={{
            display: "flex",
            gap: 40,
          }}
        >
          <TrustSignal text="Free trial available" delay={120} />
          <TrustSignal text="No credit card required" delay={135} />
          <TrustSignal text="Setup in under a week" delay={150} />
        </div>
      </AbsoluteFill>

      {/* Logo */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          opacity: interpolate(frame, [160, 190], [0, 0.8], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
            stroke="#0ea5e9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span style={{ fontFamily: "monospace", fontSize: 18, color: "white" }}>VoiceCapture</span>
      </div>
    </AbsoluteFill>
  );
};
