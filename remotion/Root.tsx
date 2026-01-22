import { Composition } from "remotion";
import { VoiceLandingVideo } from "./VoiceLandingVideo";
import { HeroAnimation } from "./HeroAnimation";

// Calculate total duration:
// Hero: 210 frames (7s)
// Problem: 300 frames (10s)
// Solution: 300 frames (10s)
// Demo: 480 frames (16s)
// CTA: 240 frames (8s)
// Transitions overlap: 4 * 30 = 120 frames
// Total: 1530 - 120 = 1410 frames (~47 seconds at 30fps)

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="VoiceLanding"
        component={VoiceLandingVideo}
        durationInFrames={1410}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="HeroLoop"
        component={HeroAnimation}
        durationInFrames={450}
        fps={30}
        width={1200}
        height={550}
      />
    </>
  );
};
