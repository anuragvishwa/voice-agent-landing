import { motion } from 'framer-motion';
import { AlertTriangle, PhoneOff, Clock, DollarSign } from 'lucide-react';

const problems = [
  {
    icon: PhoneOff,
    title: 'Calls go unanswered',
    description: 'Your team is on-site, driving, or short-staffed. After-hours? Forget it.',
  },
  {
    icon: Clock,
    title: 'Slow response time',
    description: 'Voicemails pile up. Callbacks are delayed. Customers move on.',
  },
  {
    icon: AlertTriangle,
    title: 'Incomplete intake',
    description: 'Details get lost. Address is wrong. Insurance info missing. Back-and-forth chaos.',
  },
  {
    icon: DollarSign,
    title: 'Lost revenue',
    description: 'One missed emergency call can cost thousands. Competitors win the job.',
  },
];

export function WhyExists() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/20 bg-red-500/10 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="font-mono text-xs text-white/60 uppercase tracking-widest">The Problem</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6">
            When emergencies hit, customers call <span className="text-red-400">multiple companies</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            The first to answer, qualify, and dispatch wins the job. If your team can't pick up, the lead goes to your competitor.
          </p>
        </motion.div>

        {/* Problem Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-red-400/50 transition-colors group shadow-sm"
            >
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
                <problem.icon className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="font-medium text-white mb-2">{problem.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{problem.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom stat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl border border-red-500/20 bg-red-500/10">
            <span className="font-serif text-4xl font-light text-red-400">$3,500+</span>
            <span className="text-white/60 text-sm text-left">
              Average value of a<br />missed emergency call
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
