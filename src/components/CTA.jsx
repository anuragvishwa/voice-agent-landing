import { motion } from 'framer-motion';
import { Phone, Calendar, FileText, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

export function CTA() {
  return (
    <section id="demo" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-slate-900/70 border border-slate-700 rounded-2xl p-8 md:p-12 overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-6">
              <Phone className="w-8 h-8 text-secondary" />
            </div>

            {/* Headline */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground mb-4">
              Stop losing emergency jobs
            </h2>
            <p className="text-lg text-muted mb-8 max-w-xl mx-auto">
              See a live call flow, dispatch packet, and dashboard tailored to your service area.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button size="lg" className="gap-2">
                <Calendar className="w-4 h-4" />
                Book a 15-min Demo
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <FileText className="w-4 h-4" />
                Get a Call-Flow Audit
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                See Sample Dispatch
              </Button>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full" />
                Free trial available
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full" />
                Setup in under a week
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
