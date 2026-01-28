import { Phone } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    product: ['Features', 'Pricing', 'How It Works', 'Demo'],
    industries: ['Water Damage', 'Fire Damage', 'Mold Remediation', 'Contents & Reconstruction'],
    legal: ['Privacy', 'Terms', 'Compliance'],
  };

  return (
    <footer className="py-16 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="/" className="flex items-center gap-2 text-white mb-4">
              <Phone className="w-5 h-5 text-primary" />
              <span className="font-mono text-sm font-medium">VoiceCapture</span>
            </a>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              24/7 emergency call and WhatsApp intake and dispatch for restoration operators.
              Never miss a high-ticket job again.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-white/40 mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-white/40 mb-4">
              Industries
            </h4>
            <ul className="space-y-3">
              {links.industries.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-white/40 mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-sm font-mono">
            &copy; {currentYear} VoiceCapture
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-blink" />
            <span className="text-white/60 text-sm font-mono">Capturing every call, 24/7</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
