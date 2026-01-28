import { Phone, Filter, Send, BarChart3 } from 'lucide-react';
import {
  VoiceIntakeIllustration,
  TriageIllustration,
  DispatchIllustration,
} from './FeatureIllustrations';

const features = [
  {
    icon: Phone,
    label: 'Voice & WhatsApp Intake',
    title: 'Answer every call and message, capture every detail',
    description: 'AI-powered system answers calls in 2-3 rings and responds to WhatsApp messages instantly. Collects structured details and routes critical requests.',
    bullets: [
      'Answers calls in 2-3 rings, WhatsApp messages instantly',
      'Recording disclosure & brand greeting',
      'Structured intake: name, address, property type, damage, insurance',
      'Live transfer for active leaks, commercial & healthcare',
    ],
    Illustration: VoiceIntakeIllustration,
  },
  {
    icon: Filter,
    label: 'Smart Triage',
    title: 'Safety-first triage, intelligent routing',
    description: 'Calls and messages are classified into Emergency, Urgent, or Routine. Safety scripts detect hazards before dispatch.',
    bullets: [
      'Emergency: active flooding, electrical risk, fire aftermath',
      'Urgent: same-day inspection needed',
      'Routine: estimates, scheduling',
      'Safety scripts detect hazards before dispatch',
    ],
    Illustration: TriageIllustration,
  },
  {
    icon: Send,
    label: 'Instant Dispatch',
    title: 'Get the right tech on-site, fast',
    description: 'Dispatch alerts go out via SMS, email, or Slack. Auto-create job tickets. Critical cases dispatched within 2 hours.',
    bullets: [
      'SMS/Email/Slack to on-call PM',
      'One-tap acknowledgment',
      'Auto-create ticket in CRM (Jobber, ServiceTitan)',
      'Dispatch within 2 hours for critical cases',
    ],
    Illustration: DispatchIllustration,
  },
];

function FeatureBlock({ feature, index }) {
  const Illustration = feature.Illustration;
  const Icon = feature.icon;
  const isReversed = index % 2 === 1;

  return (
    <div className="py-16 lg:py-24">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Content */}
        <div className={isReversed ? 'lg:order-2' : 'lg:order-1'}>
          {/* Label badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] mb-6">
            <Icon className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs uppercase tracking-widest text-primary">
              {feature.label}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4 leading-tight">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-base lg:text-lg text-white/60 leading-relaxed mb-6 max-w-xl">
            {feature.description}
          </p>

          {/* Bullets */}
          <ul className="space-y-3">
            {feature.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm lg:text-base text-white/50">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Illustration */}
        <div className={isReversed ? 'lg:order-1' : 'lg:order-2'}>
          <div className="rounded-xl bg-white/[0.02] border border-white/10 overflow-hidden shadow-lg">
            <Illustration />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] mb-6">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs uppercase tracking-widest text-white/60">
              Core Capabilities
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6">
            From ring to dispatch in seconds
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Every call and message becomes a tracked, triaged, dispatched job — without relying on someone being free to pick up.
          </p>
        </div>

        {/* Feature blocks */}
        <div className="divide-y divide-white/10">
          {features.map((feature, index) => (
            <FeatureBlock
              key={index}
              feature={feature}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
