import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

const tiers = [
  {
    name: 'Starter',
    price: '$497',
    period: '/month',
    description: 'Perfect for single-location operators',
    features: [
      '24/7 inbound intake',
      'Dispatch alerts (SMS + Email)',
      'Dashboard + call records',
      'Basic scheduling integration',
      'Up to 100 calls/month',
    ],
    cta: 'Start Free Trial',
    ctaVariant: 'outline',
    popular: false,
  },
  {
    name: 'Growth',
    price: '$997',
    period: '/month',
    description: 'Multi-crew and multi-location teams',
    features: [
      'Everything in Starter',
      'Unlimited calls',
      'Geo-routing by zip/county',
      'On-call rotations',
      'Overflow escalation',
      'Slack/Teams integration',
      'SLA dashboards',
    ],
    cta: 'Start Free Trial',
    ctaVariant: 'default',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For franchise networks and large operations',
    features: [
      'Everything in Growth',
      'SSO / SCIM',
      'Custom retention policies',
      'CRM integrations',
      'Dedicated support',
      'SLA guarantee',
      'White-label options',
    ],
    cta: 'Contact Sales',
    ctaVariant: 'outline',
    popular: false,
  },
];

function PricingCard({ tier, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative bg-white/[0.02] border rounded-xl p-6 flex flex-col h-full shadow-sm ${
        tier.popular
          ? 'border-primary shadow-lg shadow-primary/20 scale-105 z-10'
          : 'border-white/10'
      }`}
    >
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-black text-xs font-mono">
            <Sparkles className="w-3 h-3" />
            Most Popular
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="font-mono text-sm uppercase tracking-widest text-white/60 mb-2">
          {tier.name}
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="font-serif text-4xl font-light text-white">
            {tier.price}
          </span>
          {tier.period && (
            <span className="text-sm text-white/60">{tier.period}</span>
          )}
        </div>
        <p className="mt-2 text-sm text-white/50">{tier.description}</p>
      </div>

      {/* Features */}
      <ul className="flex-1 space-y-3 mb-6">
        {tier.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-sm text-white/50">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        variant={tier.ctaVariant}
        className="w-full"
        size="lg"
      >
        {tier.cta}
      </Button>
    </motion.div>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] mb-6">
            <span className="font-mono text-xs text-white/60 uppercase tracking-widest">Simple Pricing</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6">
            ROI from day one
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            One captured emergency call pays for months of service.
            No per-seat pricing. No hidden fees.
          </p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, index) => (
            <PricingCard key={tier.name} tier={tier} index={index} />
          ))}
        </div>

        {/* Performance-based note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl border border-primary/20 bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm text-white/60">
              Ask about <span className="text-primary font-medium">performance-based pilots</span> — pay per booked inspection with a cap.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
