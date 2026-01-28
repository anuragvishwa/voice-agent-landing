import { useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Player } from "@remotion/player";
import { HeroAnimation } from "../../remotion/HeroAnimation";

export function Hero() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const playerRef = useRef(null);

  // Cycle to next scenario when animation loops
  const handleLoop = useCallback(() => {
    setScenarioIndex((prev) => (prev + 1) % 5);
  }, []);

  return (
    <section className="relative pt-32 pb-16 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Content */}
        <div className="text-center">
          {/* Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] mb-8">
            <span className="w-2 h-4 bg-primary animate-blink rounded-sm" />
            <span className="font-mono text-xs text-white/60">24/7 Voice & WhatsApp AI &bull; Restoration Industry</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white mb-6 leading-[1.1]">
            Never miss an emergency call or message again
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered intake and dispatch system that answers every call and WhatsApp message, captures the right details, and routes to on-call teams instantly.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href="#demo"
              className="bg-primary text-black px-8 py-3 rounded-xl font-mono text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Book a 15-min Demo
            </a>
            <Link
              to="/video"
              className="border border-white/10 bg-white/5 px-8 py-3 rounded-xl font-mono text-sm text-white hover:bg-white/10 transition-colors"
            >
              See How It Works
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {["2-3 Ring Pickup", "WhatsApp Intake", "Safety Triage", "Instant Dispatch", "CRM Integration"].map(
              (item) => (
                <span
                  key={item}
                  className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] font-mono text-xs text-white/60"
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>

        {/* Call Flow Animation */}
        <div className="relative mt-12">
          <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            <Player
              ref={playerRef}
              component={HeroAnimation}
              inputProps={{ scenarioIndex }}
              durationInFrames={450}
              compositionWidth={1200}
              compositionHeight={550}
              fps={30}
              style={{
                width: "100%",
              }}
              loop
              autoPlay
              onEnded={handleLoop}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
