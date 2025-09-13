import Link from "next/link";
import { Users, Mail, Phone, MapPin, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-brand-gold rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-brand-charcoal" />
              </div>
              <span className="text-xl font-bold">MDPU</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Mathamba Descendants Progressive Union - Building stronger communities through togetherness and unity.
            </p>
            <p className="text-brand-gold font-semibold text-sm">
              "Togetherness is Strength"
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-brand-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/objectives" className="text-gray-300 hover:text-brand-gold transition-colors">
                  Our Objectives
                </Link>
              </li>
              <li>
                <Link href="/leadership" className="text-gray-300 hover:text-brand-gold transition-colors">
                  Leadership
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-300 hover:text-brand-gold transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-300 hover:text-brand-gold transition-colors">
                  Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 mt-0.5 text-brand-gold flex-shrink-0" />
                <div>
                  <p className="text-gray-300">
                    19n Thompson Bay,<br />
                    off Wilkinson Road,<br />
                    Freetown, Sierra Leone
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <a href="mailto:info@mdpu.org" className="text-gray-300 hover:text-brand-gold transition-colors">
                  info@mdpu.org
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <a href="tel:+232123456789" className="text-gray-300 hover:text-brand-gold transition-colors">
                  +232 123 456 789
                </a>
              </div>
            </div>
          </div>

          {/* Legal & Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal & Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-brand-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-brand-gold transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/code-of-conduct" className="text-gray-300 hover:text-brand-gold transition-colors">
                  Code of Conduct
                </Link>
              </li>
              <li>
                <Link href="/constitution" className="text-gray-300 hover:text-brand-gold transition-colors">
                  Constitution
                </Link>
              </li>
            </ul>
            
            <div className="pt-4">
              <Link 
                href="/donate" 
                className="inline-flex items-center space-x-2 bg-brand-gold text-brand-charcoal px-4 py-2 rounded-md hover:bg-brand-gold/90 transition-colors text-sm font-medium"
              >
                <Heart className="w-4 h-4" />
                <span>Support MDPU</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Mathamba Descendants Progressive Union. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/chapters" className="text-gray-400 hover:text-brand-gold transition-colors">
                Chapters
              </Link>
              <Link href="/membership" className="text-gray-400 hover:text-brand-gold transition-colors">
                Membership
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-brand-gold transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
