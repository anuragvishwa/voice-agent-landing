import { lazy, Suspense, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Phone, Loader2 } from 'lucide-react';

// Lazy load the Player to avoid SSR/hydration issues on Vercel
const RemotionPlayer = lazy(() =>
  import('@remotion/player').then(mod => ({ default: mod.Player }))
);

// Loading placeholder
function PlayerLoading() {
  return (
    <div className="w-full aspect-video bg-[#0a0f15] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
        <span className="text-white/60 font-mono text-sm">Loading video...</span>
      </div>
    </div>
  );
}

// Player wrapper component that only renders on client
function VideoPlayer() {
  const [isClient, setIsClient] = useState(false);
  const [VideoComponent, setVideoComponent] = useState(null);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import the video component
    import('../../remotion/VoiceLandingVideo').then(mod => {
      setVideoComponent(() => mod.VoiceLandingVideo);
    });
  }, []);

  if (!isClient || !VideoComponent) {
    return <PlayerLoading />;
  }

  return (
    <Suspense fallback={<PlayerLoading />}>
      <RemotionPlayer
        component={VideoComponent}
        durationInFrames={1410}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={30}
        style={{
          width: '100%',
          aspectRatio: '16/9',
        }}
        controls
        autoPlay
        loop
      />
    </Suspense>
  );
}

export function VideoPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-sm">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-sky-400" />
            <span className="font-mono text-sm font-medium">FlexDash</span>
          </div>
        </div>
      </header>

      {/* Video Player */}
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-white mb-4">
              See FlexDash in Action
            </h1>
            <p className="text-white/60 max-w-xl mx-auto">
              Watch how we transform missed calls into booked jobs — from ring to dispatch in seconds.
            </p>
          </div>

          {/* Player Container */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
            {/* Decorative glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 via-purple-500/20 to-sky-500/20 blur-xl opacity-50" />

            <div className="relative">
              <VideoPlayer />
            </div>
          </div>

          {/* CTA below video */}
          <div className="mt-10 text-center">
            <p className="text-white/60 mb-6">
              Ready to stop losing emergency jobs?
            </p>
            <a
              href="https://cal.com/anuragvishwa/voice-agent"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-sky-500 text-white px-8 py-3 rounded-md font-mono text-sm font-medium hover:bg-sky-500/90 transition-colors"
            >
              Book a Demo
            </a>
          </div>

        </div>
      </main>
    </div>
  );
}
