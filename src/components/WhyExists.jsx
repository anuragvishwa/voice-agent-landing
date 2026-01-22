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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 bg-slate-900/60 mb-6">
            <AlertTriangle className="w-4 h-4 text-danger" />
            <span className="font-mono text-xs text-muted uppercase tracking-widest">The Problem</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground mb-6">
            When emergencies hit, customers call <span className="text-danger">multiple companies</span>
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
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
              className="bg-slate-900/60 border border-slate-700 rounded-xl p-6 hover:border-danger/50 transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-danger/10 flex items-center justify-center mb-4 group-hover:bg-danger/20 transition-colors">
                <problem.icon className="w-6 h-6 text-danger" />
              </div>
              <h3 className="font-medium text-foreground mb-2">{problem.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{problem.description}</p>
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
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl border border-danger/20 bg-danger/5">
            <span className="font-serif text-4xl font-light text-danger">$3,500+</span>
            <span className="text-muted text-sm text-left">
              Average value of a<br />missed water damage call
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
