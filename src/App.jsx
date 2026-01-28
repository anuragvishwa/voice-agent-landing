import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LiveVoiceDemo } from './components/LiveVoiceDemo';
import { Services } from './components/Services';
import { WhyExists } from './components/WhyExists';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { ParticleBackground } from './components/ParticleBackground';

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-x-hidden">
      <ParticleBackground />
      <Navbar />
      <main>
        <Hero />
        <LiveVoiceDemo />
        <Services />
        <WhyExists />
        <Features />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
