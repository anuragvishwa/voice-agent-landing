import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Calendar, FileText, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { SampleDispatchModal } from './SampleDispatchModal';
import { CallFlowAuditModal } from './CallFlowAuditModal';

export function CTA() {
  const [showDispatch, setShowDispatch] = useState(false);
  const [showAudit, setShowAudit] = useState(false);

  return (
    <section id="demo" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 lg:p-12"
        >
          <div className="text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Phone className="w-8 h-8 text-primary" />
            </div>

            {/* Headline */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-4">
              Stop losing emergency jobs
            </h2>
            <p className="text-lg text-white/60 mb-8 max-w-xl mx-auto">
              See a live call flow, dispatch packet, and dashboard tailored to your service area.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <a href="https://cal.com/anuragvishwa/voice-agent" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Book a 15-min Demo
                </Button>
              </a>
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => setShowAudit(true)}
              >
                <FileText className="w-4 h-4" />
                Get a Call-Flow Audit
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => setShowDispatch(true)}
              >
                <ExternalLink className="w-4 h-4" />
                See Sample Dispatch
              </Button>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                Free trial available
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                No credit card required
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <SampleDispatchModal isOpen={showDispatch} onClose={() => setShowDispatch(false)} />
      <CallFlowAuditModal isOpen={showAudit} onClose={() => setShowAudit(false)} />
    </section>
  );
}
