import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, PhoneOff, Clock, AlertTriangle, CheckCircle, XCircle, ArrowRight, Zap } from 'lucide-react';

const auditData = {
  companyName: 'Sample Restoration Co.',
  auditDate: 'January 2024',
  overallScore: 42,
  currentFlow: [
    {
      step: 'After-Hours Call',
      status: 'fail',
      issue: 'Goes to voicemail',
      impact: '67% of callers hang up without leaving message',
    },
    {
      step: 'Voicemail Response',
      status: 'warning',
      issue: 'Next business day callback',
      impact: 'Average 14-hour response time',
    },
    {
      step: 'Lead Capture',
      status: 'fail',
      issue: 'Manual note-taking',
      impact: 'Missing critical details 40% of time',
    },
    {
      step: 'Dispatch',
      status: 'warning',
      issue: 'Phone tree to on-call tech',
      impact: '8-minute average dispatch time',
    },
  ],
  recommendations: [
    {
      title: '24/7 AI Answering',
      description: 'Never miss a call with instant pickup',
      improvement: '+40% lead capture',
    },
    {
      title: 'Structured Intake',
      description: 'AI captures all required fields every time',
      improvement: '100% data completeness',
    },
    {
      title: 'Instant Dispatch',
      description: 'Automatic alerts to on-call team',
      improvement: '< 60 second dispatch',
    },
  ],
  potentialRevenue: '$127,000',
  missedCallsPerMonth: 47,
};

function StatusIcon({ status }) {
  if (status === 'pass') {
    return <CheckCircle className="w-5 h-5 text-green-400" />;
  }
  if (status === 'warning') {
    return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
  }
  return <XCircle className="w-5 h-5 text-red-400" />;
}

function ScoreGauge({ score }) {
  const getColor = () => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getLabel = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Needs Work';
    return 'Critical';
  };

  return (
    <div className="text-center">
      <div className={`font-serif text-6xl ${getColor()}`}>{score}</div>
      <div className="text-xs text-white/40 mt-1">out of 100</div>
      <div className={`text-sm font-medium mt-2 ${getColor()}`}>{getLabel()}</div>
    </div>
  );
}

export function CallFlowAuditModal({ isOpen, onClose }) {
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-3xl max-h-[90vh] bg-[#0f0f0f] border border-white/10 rounded-2xl z-[9999] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Sample Call-Flow Audit</h3>
                  <p className="text-xs text-white/50">See what we analyze for your business</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto flex-1">
              {/* Score Section */}
              <div className="flex items-center justify-between mb-6 p-4 bg-white/[0.02] border border-white/10 rounded-xl">
                <div>
                  <div className="text-xs text-white/40 mb-1">Audit for</div>
                  <div className="text-white font-medium">{auditData.companyName}</div>
                  <div className="text-xs text-white/40 mt-1">{auditData.auditDate}</div>
                </div>
                <ScoreGauge score={auditData.overallScore} />
                <div className="text-right">
                  <div className="text-xs text-white/40 mb-1">Potential Annual Revenue Lost</div>
                  <div className="text-2xl font-serif text-red-400">{auditData.potentialRevenue}</div>
                  <div className="text-xs text-white/40 mt-1">{auditData.missedCallsPerMonth} missed calls/month</div>
                </div>
              </div>

              {/* Current Flow Analysis */}
              <div className="mb-6">
                <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                  <PhoneOff className="w-4 h-4 text-red-400" />
                  Current Call Flow Issues
                </h4>
                <div className="space-y-3">
                  {auditData.currentFlow.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/10 rounded-xl"
                    >
                      <StatusIcon status={item.status} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-white text-sm font-medium">{item.step}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            item.status === 'fail' ? 'bg-red-500/20 text-red-400' :
                            item.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {item.status === 'fail' ? 'Critical' : item.status === 'warning' ? 'Warning' : 'Good'}
                          </span>
                        </div>
                        <p className="text-white/50 text-xs mt-1">{item.issue}</p>
                        <p className="text-white/40 text-xs mt-1 italic">Impact: {item.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="mb-6">
                <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Recommended Improvements
                </h4>
                <div className="grid sm:grid-cols-3 gap-3">
                  {auditData.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="p-4 bg-primary/5 border border-primary/20 rounded-xl"
                    >
                      <h5 className="text-white text-sm font-medium mb-1">{rec.title}</h5>
                      <p className="text-white/50 text-xs mb-3">{rec.description}</p>
                      <div className="flex items-center gap-1 text-primary text-xs font-medium">
                        <ArrowRight className="w-3 h-3" />
                        {rec.improvement}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
                <p className="text-white/70 text-sm mb-3">
                  Want a personalized audit for your business?
                </p>
                <a
                  href="https://cal.com/anuragvishwa/voice-agent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-black px-6 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                  Get Your Free Audit
                  <ArrowRight className="w-4 h-4" />
                </a>
                <p className="text-white/40 text-xs mt-2">15-minute call • No commitment</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
