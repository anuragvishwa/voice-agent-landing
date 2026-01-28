import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ArrowRight, Phone, MessageSquare, Filter, Send, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Call or Message Comes In',
    description: 'Answers calls in 2-3 rings, WhatsApp messages instantly. Brand greeting and recording disclosure.',
    icon: Phone,
  },
  {
    number: '02',
    title: 'Capture Details',
    description: 'AI collects name, phone, address, property type, damage type, and insurance.',
    icon: MessageSquare,
  },
  {
    number: '03',
    title: 'Safety Triage',
    description: 'Detect flooding, electrical hazards, fire aftermath. Classify by urgency.',
    icon: Filter,
  },
  {
    number: '04',
    title: 'Dispatch Team',
    description: 'Alert on-call PM. Auto-create ticket. Live transfer for critical cases.',
    icon: Send,
  },
  {
    number: '05',
    title: 'Job Created',
    description: 'Full intake record, recording, transcript. Critical cases dispatched <2 hours.',
    icon: CheckCircle,
  },
];

function StepCard({ step, index, isActive }) {
  const Icon = step.icon;

  return (
    <div
      className={`group relative rounded-xl transition-all duration-300 p-5
        ${isActive
          ? 'bg-white/[0.02] border border-white/10 shadow-sm'
          : 'bg-transparent border border-transparent hover:bg-white/[0.02]'
        }
      `}
    >
      <div className="flex items-start gap-4">
        {/* Step number */}
        <span
          className={`flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full font-mono text-xs font-medium transition-colors duration-300 ${
            isActive
              ? 'bg-primary text-black'
              : 'bg-white/10 text-white/60'
          }`}
        >
          {index + 1}
        </span>

        <div className="flex-1 min-w-0">
          {/* Icon and Title row */}
          <div className="flex items-center gap-2 mb-2">
            <Icon
              className={`w-5 h-5 transition-colors duration-300 ${
                isActive ? 'text-primary' : 'text-white/40'
              }`}
            />
            <h3
              className={`font-medium text-base transition-colors duration-300 ${
                isActive ? 'text-white' : 'text-white/60'
              }`}
            >
              {step.title}
            </h3>
          </div>

          {/* Description */}
          <p
            className={`text-sm leading-relaxed transition-colors duration-300 ${
              isActive ? 'text-white/60' : 'text-white/40'
            }`}
          >
            {step.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function StepConnector({ activeStep, totalSteps }) {
  return (
    <div className="hidden lg:flex absolute top-8 left-0 right-0 z-0 justify-between px-[3rem]">
      {[...Array(totalSteps - 1)].map((_, i) => (
        <div key={i} className="flex-1 flex items-center mx-4">
          <div className="relative w-full h-px bg-white/10 rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 bg-primary/50 rounded-full transition-all duration-500 ${
                activeStep > i ? 'w-full' : 'w-0'
              }`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HowItWorks() {
  const stepsRef = useRef(null);
  const [stepsInView, setStepsInView] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStepsInView(true);
        }
      },
      { threshold: 0.2 }
    );

    if (stepsRef.current) {
      observer.observe(stepsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!stepsInView) return;

    const stepDuration = 600;
    const timeouts = [];

    steps.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setActiveStep(index);
      }, index * stepDuration);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [stepsInView]);

  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] mb-6">
            <ArrowRight className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs text-white/60 uppercase tracking-widest">How It Works</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6">
            From ring to dispatch in under 60 seconds
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            No complex setup. No learning curve.
            <br className="hidden sm:block" />
            Just calls & messages → intake → dispatch → jobs.
          </p>
        </motion.div>

        {/* Steps */}
        <div ref={stepsRef} className="relative">
          <StepConnector activeStep={activeStep} totalSteps={steps.length} />
          <div className="grid md:grid-cols-5 gap-4 relative z-10">
            {steps.map((step, index) => (
              <StepCard
                key={step.number}
                step={step}
                index={index}
                isActive={activeStep >= index}
              />
            ))}
          </div>
        </div>

        {/* Security note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 bg-white/[0.02] border border-white/10 rounded-xl p-6"
        >
          <h3 className="font-medium text-white mb-4">Security & Compliance</h3>
          <div className="grid sm:grid-cols-3 gap-4 text-sm text-white/50">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Configurable recording disclosures</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Encrypted data in transit and at rest</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Retention policies you control</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
