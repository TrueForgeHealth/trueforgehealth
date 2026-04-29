import { Instagram, Facebook, Mail, Phone, ShieldCheck } from 'lucide-react';
import { Link } from '../lib/router';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
  return (
    <footer className="bg-steel-900 text-cream-100 pt-20 pb-10 px-5 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 pb-14 border-b border-steel-700 grid md:grid-cols-[1.1fr_1fr] gap-10 items-center">
          <div>
            <h3 className="font-display text-2xl md:text-3xl text-cream-50">Join the TrueForge list.</h3>
            <p className="mt-2 text-sm text-cream-200/70 max-w-md">Protocols, member-only drops, and the occasional transformation story. One email, never noise.</p>
          </div>
          <div className="md:max-w-md md:ml-auto w-full">
            <NewsletterForm source="footer" variant="compact" />
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-12 pb-12 border-b border-steel-700">
          <div>
            <img src="/TrueForge_Health_&_Wellness_logo_small_horz.png" alt="TrueForge Health & Wellness" className="h-12 object-contain mb-5 brightness-110" />
            <p className="text-sm text-cream-200/70 leading-relaxed">
              Built by someone who lived it. Forging stronger, healthier humans through real medicine, real coaching, real accountability.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" className="w-10 h-10 rounded-full bg-steel-800 hover:bg-forge-500 flex items-center justify-center transition"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-steel-800 hover:bg-forge-500 flex items-center justify-center transition"><Facebook className="w-4 h-4" /></a>
              <a href="mailto:admin@trueforgehealth.com" className="w-10 h-10 rounded-full bg-steel-800 hover:bg-forge-500 flex items-center justify-center transition"><Mail className="w-4 h-4" /></a>
            </div>
          </div>
          <div>
            <h4 className="font-display text-lg mb-4 text-forge-300">Treatments</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/weight-loss" className="hover:text-forge-300">Weight Loss / GLP</Link></li>
              <li><Link to="/hormone" className="hover:text-forge-300">Hormone Optimization</Link></li>
              <li><Link to="/sexual-wellness" className="hover:text-forge-300">Sexual Wellness</Link></li>
              <li><Link to="/hair-skin" className="hover:text-forge-300">Hair & Skin</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-lg mb-4 text-forge-300">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/founder" className="hover:text-forge-300">Founder Story</Link></li>
              <li><Link to="/results" className="hover:text-forge-300">Real Results</Link></li>
              <li><Link to="/learn" className="hover:text-forge-300">Learn Hub</Link></li>
              <li><Link to="/membership" className="hover:text-forge-300">Membership</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-lg mb-4 text-forge-300">Get Started</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/book" className="hover:text-forge-300">Book 15-Min Call</Link></li>
              <li><Link to="/intake" className="hover:text-forge-300">New Patient Intake</Link></li>
              <li><Link to="/portal" className="hover:text-forge-300">Member Portal</Link></li>
              <li><Link to="/member/pricing" className="hover:text-forge-300">Member Pricing</Link></li>
              <li className="flex items-center gap-2 text-cream-200/70 pt-2"><Phone className="w-4 h-4" /> Concierge Support</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 max-w-4xl">
          <p className="text-xs uppercase tracking-[0.25em] text-forge-300 mb-2">Medical &amp; Wellness Disclaimer</p>
          <p className="text-xs text-cream-200/70 leading-relaxed">
            TrueForge Health &amp; Wellness provides general wellness coaching, educational resources, member portal
            access, and personalized support services only. All information, protocols, recommendations, and
            communications are for informational and educational purposes only and are not intended to diagnose, treat,
            cure, or prevent any disease or medical condition, and do not constitute medical advice. You are solely
            responsible for your own health decisions; consult a qualified healthcare provider before making changes to
            your diet, exercise, supplementation, medication, or health regimen. TrueForge and its team are not liable
            for any injury, illness, or adverse outcome related to use of our services or information provided. All
            treatments are prescribed by independent licensed clinicians and compounded by 503A pharmacies for
            individual patient needs. Results vary and are not guaranteed.
          </p>
        </div>
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cream-200/60">
          <p>&copy; {new Date().getFullYear()} TrueForge Health & Wellness. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-forge-400" />
            HIPAA-compliant. Telehealth services provided by licensed clinicians.
          </div>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-forge-300">Privacy</Link>
            <Link to="/terms" className="hover:text-forge-300">Terms</Link>
            <Link to="/disclaimer" className="hover:text-forge-300">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
