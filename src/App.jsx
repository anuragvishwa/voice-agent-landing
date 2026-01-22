import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { WhyExists } from './components/WhyExists';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { GlobalParticleBackground } from './components/GlobalParticleBackground';

function App() {
  return (
    <div className="min-h-screen bg-[#030712] relative overflow-x-hidden">
      {/* Page-wide particle background - covers entire scrollable area */}
      <GlobalParticleBackground />

      {/* All content above particles */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
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
    </div>
  );
}

export default App;
