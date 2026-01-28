import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, User, Home, Droplets, Shield, AlertTriangle, FileText } from 'lucide-react';

const sampleDispatch = {
  ticketId: 'VC-2024-00847',
  timestamp: 'Jan 28, 2024 • 2:34 AM',
  priority: 'Emergency',
  caller: {
    name: 'Sarah Mitchell',
    phone: '(512) 555-0198',
    email: 'sarah.m@email.com',
  },
  property: {
    address: '4521 Oak Valley Drive',
    city: 'Austin, TX 78749',
    type: 'Single Family Home',
    access: 'Garage code: 4521',
  },
  damage: {
    type: 'Water Damage',
    source: 'Burst pipe in upstairs bathroom',
    affected: '2nd floor bathroom, hallway, master bedroom ceiling',
    severity: 'Active leak - water spreading',
  },
  insurance: {
    hasInsurance: true,
    carrier: 'State Farm',
    claimFiled: false,
  },
  notes: 'Caller mentioned water is dripping through ceiling into master bedroom. Has shut off main water supply. Requesting immediate response.',
  aiConfidence: 94,
};

export function SampleDispatchModal({ isOpen, onClose }) {
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
            className="fixed left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-2xl max-h-[85vh] bg-[#0f0f0f] border border-white/10 rounded-2xl z-[9999] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Sample Dispatch Packet</h3>
                  <p className="text-xs text-white/50">What your team receives instantly</p>
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
              {/* Ticket Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs text-white/40 mb-1">Ticket ID</div>
                  <div className="font-mono text-white">{sampleDispatch.ticketId}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/40 mb-1">{sampleDispatch.timestamp}</div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">
                    <AlertTriangle className="w-3 h-3" />
                    {sampleDispatch.priority}
                  </span>
                </div>
              </div>

              {/* Grid Layout */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Caller Info */}
                <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-white">Caller Information</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-white/50">Name</span>
                      <span className="text-sm text-white">{sampleDispatch.caller.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-white/50">Phone</span>
                      <span className="text-sm text-white font-mono">{sampleDispatch.caller.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-white/50">Email</span>
                      <span className="text-sm text-white">{sampleDispatch.caller.email}</span>
                    </div>
                  </div>
                </div>

                {/* Property Info */}
                <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Home className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-white">Property Details</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-white/50">Address</span>
                      <span className="text-sm text-white text-right">{sampleDispatch.property.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-white/50">City</span>
                      <span className="text-sm text-white">{sampleDispatch.property.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-white/50">Type</span>
                      <span className="text-sm text-white">{sampleDispatch.property.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-white/50">Access</span>
                      <span className="text-sm text-primary font-mono">{sampleDispatch.property.access}</span>
                    </div>
                  </div>
                </div>

                {/* Damage Assessment */}
                <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Droplets className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-white">Damage Assessment</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-white/50">Type</span>
                      <span className="text-sm text-white">{sampleDispatch.damage.type}</span>
                    </div>
                    <div>
                      <span className="text-xs text-white/50">Source</span>
                      <p className="text-sm text-white mt-1">{sampleDispatch.damage.source}</p>
                    </div>
                    <div>
                      <span className="text-xs text-white/50">Areas Affected</span>
                      <p className="text-sm text-white mt-1">{sampleDispatch.damage.affected}</p>
                    </div>
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 text-xs">
                        {sampleDispatch.damage.severity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Insurance */}
                <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-white">Insurance</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-white/50">Has Insurance</span>
                      <span className="text-sm text-primary">Yes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-white/50">Carrier</span>
                      <span className="text-sm text-white">{sampleDispatch.insurance.carrier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-white/50">Claim Filed</span>
                      <span className="text-sm text-white/60">Not yet</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Notes */}
              <div className="mt-4 bg-white/[0.02] border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-white">AI Call Summary</span>
                  </div>
                  <span className="text-xs text-white/40">
                    Confidence: <span className="text-primary">{sampleDispatch.aiConfidence}%</span>
                  </span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  {sampleDispatch.notes}
                </p>
              </div>

              {/* Footer Note */}
              <div className="mt-4 text-center">
                <p className="text-xs text-white/40">
                  This dispatch is generated automatically from AI conversation and sent to your team via SMS, email, or CRM webhook.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
