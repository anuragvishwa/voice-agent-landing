import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Calculator, PhoneIncoming, DollarSign, Percent, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

function SliderInput({ label, value, onChange, min, max, step, icon: Icon, prefix = '', suffix = '' }) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          <span className="text-sm text-white/70">{label}</span>
        </div>
        <span className="font-mono text-lg text-white">
          {prefix}{value.toLocaleString()}{suffix}
        </span>
      </div>
      <div className="relative h-2">
        {/* Track background */}
        <div className="absolute inset-0 rounded-full bg-white/10" />
        {/* Filled track */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary"
          style={{ width: `${percentage}%` }}
        />
        {/* Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full appearance-none cursor-pointer bg-transparent
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-primary
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:shadow-primary/30
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-webkit-slider-thumb]:relative
            [&::-webkit-slider-thumb]:z-10
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-primary
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-track]:bg-transparent"
        />
      </div>
    </div>
  );
}

function ResultCard({ label, value, highlight = false, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      className={`p-4 rounded-xl border ${
        highlight
          ? 'bg-primary/10 border-primary/30'
          : 'bg-white/[0.02] border-white/10'
      }`}
    >
      <div className="text-xs text-white/50 mb-1 uppercase tracking-wider">{label}</div>
      <div className={`font-serif text-2xl ${highlight ? 'text-primary' : 'text-white'}`}>
        {value}
      </div>
    </motion.div>
  );
}

export function Pricing() {
  const [missedCalls, setMissedCalls] = useState(15);
  const [avgJobValue, setAvgJobValue] = useState(5000);
  const [conversionRate, setConversionRate] = useState(25);

  const calculations = useMemo(() => {
    const monthlyMissedCalls = missedCalls * 4;
    const potentialLeads = Math.round(monthlyMissedCalls * (conversionRate / 100));
    const monthlyRevenue = potentialLeads * avgJobValue;
    const annualRevenue = monthlyRevenue * 12;
    const serviceCost = 299 * 12;
    const roi = Math.round(((annualRevenue - serviceCost) / serviceCost) * 100);

    return {
      monthlyMissedCalls,
      potentialLeads,
      monthlyRevenue,
      annualRevenue,
      roi: roi > 0 ? roi : 0,
    };
  }, [missedCalls, avgJobValue, conversionRate]);

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
            <Calculator className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs text-white/60 uppercase tracking-widest">ROI Calculator</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6">
            Calculate your potential ROI
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            See how much revenue you're leaving on the table with missed calls.
            Adjust the sliders to match your business.
          </p>
        </motion.div>

        {/* Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 lg:p-10"
        >
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Inputs */}
            <div className="space-y-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-white font-medium">Your Numbers</h3>
              </div>

              <SliderInput
                label="Missed calls per week"
                value={missedCalls}
                onChange={setMissedCalls}
                min={5}
                max={50}
                step={1}
                icon={PhoneIncoming}
                suffix=" calls"
              />

              <SliderInput
                label="Average job value"
                value={avgJobValue}
                onChange={setAvgJobValue}
                min={1000}
                max={20000}
                step={500}
                icon={DollarSign}
                prefix="$"
              />

              <SliderInput
                label="Lead-to-job conversion rate"
                value={conversionRate}
                onChange={setConversionRate}
                min={10}
                max={50}
                step={5}
                icon={Percent}
                suffix="%"
              />
            </div>

            {/* Results */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-white font-medium">Your Potential</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <ResultCard
                  label="Monthly missed calls"
                  value={calculations.monthlyMissedCalls}
                  delay={0}
                />
                <ResultCard
                  label="Potential jobs/month"
                  value={calculations.potentialLeads}
                  delay={0.1}
                />
                <ResultCard
                  label="Monthly revenue lost"
                  value={`$${calculations.monthlyRevenue.toLocaleString()}`}
                  delay={0.2}
                />
                <ResultCard
                  label="Annual revenue lost"
                  value={`$${calculations.annualRevenue.toLocaleString()}`}
                  delay={0.3}
                />
              </div>

              {/* ROI Highlight */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={calculations.roi}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-6 text-center"
                >
                  <div className="text-sm text-white/60 mb-2">Potential Return on Investment</div>
                  <div className="font-serif text-5xl text-primary mb-2">
                    {calculations.roi.toLocaleString()}%
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Bottom message */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-white/50 text-sm mb-6">
            Even capturing <span className="text-primary font-medium">one emergency job</span> per month
            can pay for the entire year of service.
          </p>
          <a href="https://cal.com/anuragvishwa/voice-agent" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="px-8 gap-2">
              See Your ROI in Action
              <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
          <p className="mt-4 text-sm text-white/40">
            No credit card required. Live demo in 15 minutes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
