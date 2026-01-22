import { Player } from '@remotion/player';
import { Link } from 'react-router-dom';
import { ArrowLeft, Phone } from 'lucide-react';
import { VoiceLandingVideo } from '../../remotion/VoiceLandingVideo';

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
            <span className="font-mono text-sm font-medium">VoiceCapture</span>
          </div>
        </div>
      </header>

      {/* Video Player */}
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-white mb-4">
              See VoiceCapture in Action
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
              <Player
                component={VoiceLandingVideo}
                durationInFrames={1410}
                compositionWidth={1920}
                compositionHeight={1080}
                fps={30}
                style={{
                  width: '100%',
                  aspectRatio: '16/9',
                }}
                controls
                autoPlay={false}
              />
            </div>
          </div>

          {/* CTA below video */}
          <div className="mt-10 text-center">
            <p className="text-white/60 mb-6">
              Ready to stop losing emergency jobs?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/#demo"
                className="bg-sky-500 text-white px-8 py-3 rounded-md font-mono text-sm font-medium hover:bg-sky-500/90 transition-colors"
              >
                Book a Demo
              </a>
              <Link
                to="/"
                className="border border-white/20 px-8 py-3 rounded-md font-mono text-sm text-white/80 hover:bg-white/5 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
