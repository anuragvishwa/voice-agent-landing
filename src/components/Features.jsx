import { Phone, Filter, Send, BarChart3 } from 'lucide-react';
import {
  VoiceIntakeIllustration,
  TriageIllustration,
  DispatchIllustration,
} from './FeatureIllustrations';

const features = [
  {
    icon: Phone,
    label: 'Voice Intake',
    title: 'Answer every call, capture every detail',
    description: 'AI-powered system answers immediately with your brand greeting, collects structured details, and handles voicemails gracefully.',
    bullets: [
      'Instant answer - no voicemail limbo',
      'Recording disclosure & brand greeting',
      'Structured intake (address, severity, insurance)',
      'Warm transfer for true emergencies',
    ],
    Illustration: VoiceIntakeIllustration,
  },
  {
    icon: Filter,
    label: 'Smart Triage',
    title: 'Prioritize automatically, route intelligently',
    description: 'Calls are classified into Emergency, Urgent, or Routine based on severity, then tagged and routed to the right team.',
    bullets: [
      'Emergency: active leak, smoke, health risk',
      'Urgent: same-day inspection needed',
      'Routine: estimates, scheduling',
      'Geo-routing for multi-location teams',
    ],
    Illustration: TriageIllustration,
  },
  {
    icon: Send,
    label: 'Instant Dispatch',
    title: 'Get the right tech on-site, fast',
    description: 'Dispatch alerts go out via SMS, email, or Slack. Team members acknowledge with one tap. Escalation if no response.',
    bullets: [
      'SMS/Email/Slack notifications',
      'One-tap acknowledgment',
      'Auto-escalation if no response',
      'Customer ETA updates',
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-900/60 mb-6">
            <Icon className="w-4 h-4 text-secondary" />
            <span className="font-mono text-xs uppercase tracking-widest text-secondary">
              {feature.label}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-foreground mb-4 leading-tight">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-base lg:text-lg text-muted leading-relaxed mb-6 max-w-xl">
            {feature.description}
          </p>

          {/* Bullets */}
          <ul className="space-y-3">
            {feature.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm lg:text-base text-muted">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Illustration */}
        <div className={isReversed ? 'lg:order-1' : 'lg:order-2'}>
          <div className="rounded-xl bg-[#0f172a] border border-[#1e293b] overflow-hidden shadow-2xl">
            <Illustration />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 bg-slate-900/60 mb-6">
            <BarChart3 className="w-4 h-4 text-secondary" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              Core Capabilities
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground mb-6">
            From ring to dispatch in seconds
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Every call becomes a tracked, triaged, dispatched job — without relying on someone being free to pick up.
          </p>
        </div>

        {/* Feature blocks */}
        <div className="divide-y divide-border">
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
