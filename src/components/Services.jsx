import { motion } from "framer-motion";

const services = [
  { name: "Water Damage Restoration", icon: "💧", tagline: "24/7 emergency response", color: "#0ea5e9" },
  { name: "Fire Damage Restoration", icon: "🔥", tagline: "Smoke & fire cleanup", color: "#f97316" },
  { name: "Contractor", icon: "🔨", tagline: "General contracting", color: "#64748b" },
  { name: "Carpet Cleaning", icon: "🧹", tagline: "Deep cleaning services", color: "#a855f7" },
  { name: "General Contractor", icon: "🏗️", tagline: "Full-service building", color: "#eab308" },
  { name: "Construction Company", icon: "🏢", tagline: "Commercial & residential", color: "#6366f1" },
  { name: "Roofing Contractor", icon: "🏠", tagline: "Roof repair & install", color: "#ef4444" },
  { name: "Environmental Consultant", icon: "🌿", tagline: "Environmental services", color: "#22c55e" },
  { name: "Home Inspector", icon: "🔍", tagline: "Property inspections", color: "#06b6d4" },
  { name: "Asbestos Testing", icon: "⚠️", tagline: "Safety testing", color: "#f59e0b" },
];

function ServiceCard({ service, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm hover:border-slate-700 transition-colors cursor-default"
    >
      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
        style={{
          background: `radial-gradient(circle at center, ${service.color}15 0%, transparent 70%)`,
        }}
      />

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
        style={{
          backgroundColor: `${service.color}15`,
          border: `1px solid ${service.color}30`,
        }}
      >
        <span className="text-2xl">{service.icon}</span>
      </div>

      {/* Content */}
      <h3 className="font-medium text-foreground text-sm mb-1 leading-tight">
        {service.name}
      </h3>
      <p className="text-xs text-muted leading-relaxed">{service.tagline}</p>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: service.color }}
      />
    </motion.div>
  );
}

export function Services() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-700 bg-slate-900/60 mb-4">
            <span className="font-mono text-xs text-muted">Industries We Serve</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-foreground mb-4">
            Built for service businesses
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Purpose-built voice AI for contractors and restoration companies that can't afford to miss a call.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {services.map((service, index) => (
            <ServiceCard key={service.name} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
