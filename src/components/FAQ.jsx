import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'Do you support WhatsApp messages?',
    answer: "Yes! Customers can reach you via phone call or WhatsApp. Our AI handles both channels identically — collecting the same structured intake data, triaging by urgency, and dispatching your team. WhatsApp messages get instant responses 24/7.",
  },
  {
    question: 'What information does the AI collect?',
    answer: "We collect everything your team needs to dispatch: caller name, callback number, property address (verified), property type (residential, commercial, healthcare, multi-family), damage type and severity, insurance carrier, and any safety concerns like active flooding or electrical hazards. Same data collected via phone or WhatsApp.",
  },
  {
    question: 'Do we need to replace our current phone system?',
    answer: "No. We can run alongside your existing number via call forwarding (after-hours, overflow, or parallel). Or we can provision a dedicated emergency line for you.",
  },
  {
    question: 'Will this feel robotic to customers?',
    answer: "You choose the mode: keypad-fast (most reliable), short AI-assisted intake, or full conversational. We always offer warm transfer for true emergencies.",
  },
  {
    question: 'What if the caller has a true emergency?',
    answer: "We can add 'Press 0 for immediate transfer' and connect them instantly to your on-call lead. No waiting, no friction.",
  },
  {
    question: 'How fast is the dispatch?',
    answer: "Alerts go out within seconds of call completion. Team members can acknowledge with one tap. If no response in X minutes, we escalate to backup.",
  },
  {
    question: 'Does this integrate with our CRM or scheduling tool?',
    answer: "Yes — via webhooks, Zapier, or direct integrations for common systems (Jobber, ServiceTitan, etc.). We also offer CSV export and API access.",
  },
  {
    question: 'What about compliance for recording and texts?',
    answer: "We provide configurable controls: recording disclosures, regional policies, consent flags, and retention rules. You decide what to enable based on your state requirements.",
  },
];

function FAQItem({ faq, isOpen, onToggle, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="border-b border-white/10"
    >
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <span className="font-medium text-white group-hover:text-primary transition-colors">
          {faq.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-white/60 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-white/50 leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] mb-6">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs text-white/60 uppercase tracking-widest">FAQ</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-white mb-4">
            Frequently asked questions
          </h2>
          <p className="text-white/60">
            Everything you need to know about FlexDash.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                index={index}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
          </div>
        </div>

        {/* Contact prompt */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-sm text-white/50 mt-8"
        >
          Have more questions?{' '}
          <a href="#demo" className="text-primary hover:underline">
            Book a call with us
          </a>
        </motion.p>
      </div>
    </section>
  );
}
