import { motion } from 'framer-motion';
import { TrendingUp, Clock, Phone, DollarSign, CheckCircle, Zap } from 'lucide-react';
import { Button } from './ui/button';

const timeline = [
  {
    time: 'Day 0',
    title: 'Go Live',
    description: 'Number provisioned, AI trained on your brand',
    icon: Zap,
  },
  {
    time: 'First Call',
    title: 'Instant Capture',
    description: 'AI answers and alerts your team',
    icon: Phone,
  },
  {
    time: 'Week 1',
    title: '12+ Calls Saved',
    description: 'After-hours calls captured',
    icon: Clock,
  },
  {
    time: 'Month 1',
    title: 'ROI Achieved',
    description: 'One job pays for the year',
    icon: DollarSign,
  },
  {
    time: 'Ongoing',
    title: '24/7 Coverage',
    description: 'Never miss a call again',
    icon: CheckCircle,
  },
];

const stats = [
  { value: '< 60s', label: 'Average answer time' },
  { value: '12+', label: 'Calls saved per week' },
  { value: '$3-15K', label: 'Typical job value' },
];

function TimelineItem({ item, index, isLast }) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex flex-col items-center text-center flex-1"
    >
      {/* Horizontal connector line */}
      {!isLast && (
        <div className="hidden lg:block absolute top-5 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-primary/20" />
      )}

      {/* Icon circle */}
      <div className="relative z-10 w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-primary" />
      </div>

      {/* Content */}
      <div className="px-2">
        <span className="inline-block px-2 py-0.5 rounded bg-white/10 text-xs font-mono text-white/60 mb-2">
          {item.time}
        </span>
        <h3 className="text-white font-medium text-sm lg:text-base mb-1">{item.title}</h3>
        <p className="text-white/40 text-xs lg:text-sm">{item.description}</p>
      </div>
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
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs text-white/60 uppercase tracking-widest">ROI From Day One</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6">
            Value that compounds with every call
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            No complex setup. No learning curve.
            One captured emergency pays for months of service.
          </p>
        </motion.div>

        {/* Horizontal Timeline */}
        <div className="mb-16 bg-white/[0.02] border border-white/10 rounded-2xl p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-4">
            {timeline.map((item, index) => (
              <TimelineItem
                key={item.time}
                item={item}
                index={index}
                isLast={index === timeline.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid sm:grid-cols-3 gap-6 mb-12"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/[0.02] border border-white/10 rounded-xl p-6 text-center"
            >
              <div className="font-serif text-3xl text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-white/50">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <a href="https://cal.com/anuragvishwa/voice-agent" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="px-8">
              Book a Demo
            </Button>
          </a>
          <p className="mt-4 text-sm text-white/40">
            No credit card required. See ROI in your first week.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
