import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { HeroScene } from "./scenes/HeroScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { SolutionScene } from "./scenes/SolutionScene";
import { DemoScene } from "./scenes/DemoScene";
import { CTAScene } from "./scenes/CTAScene";

// Total duration: ~47 seconds at 30fps = 1410 frames

export const VoiceLandingVideo = () => {
  return (
    <TransitionSeries>
      {/* Scene 1: Hero - Brand intro (7s = 210 frames) */}
      <TransitionSeries.Sequence durationInFrames={210}>
        <HeroScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 30 })}
      />

      {/* Scene 2: Problem - What can go wrong (10s = 300 frames) */}
      <TransitionSeries.Sequence durationInFrames={300}>
        <ProblemScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: 30 })}
      />

      {/* Scene 3: Solution - Three capabilities (10s = 300 frames) */}
      <TransitionSeries.Sequence durationInFrames={300}>
        <SolutionScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 30 })}
      />

      {/* Scene 4: Demo - See it in action (16s = 480 frames) */}
      <TransitionSeries.Sequence durationInFrames={480}>
        <DemoScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: 30 })}
      />

      {/* Scene 5: CTA - Get started (8s = 240 frames) */}
      <TransitionSeries.Sequence durationInFrames={240}>
        <CTAScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
