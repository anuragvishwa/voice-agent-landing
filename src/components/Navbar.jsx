import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Menu, X } from 'lucide-react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'ROI', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Demo', href: '/video', isRoute: true },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-white">
          <Phone className="w-5 h-5 text-primary" />
          <span className="font-mono text-sm font-medium">VoiceCapture</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            link.isRoute ? (
              <Link
                key={link.label}
                to={link.href}
                className="font-mono text-sm transition-colors text-white/60 hover:text-white"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="font-mono text-sm transition-colors text-white/60 hover:text-white"
              >
                {link.label}
              </a>
            )
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <a
            href="#demo"
            className="hidden sm:block bg-primary text-black px-4 py-2 rounded-xl font-mono text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            Book a Demo
          </a>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/5">
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block font-mono text-sm text-white/60 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="block font-mono text-sm text-white/60 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              )
            ))}
            <a
              href="#demo"
              className="block bg-primary text-black px-4 py-2 rounded-xl font-mono text-sm font-medium text-center shadow-lg shadow-primary/20"
            >
              Book a Demo
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
