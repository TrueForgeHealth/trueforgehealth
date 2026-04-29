import { useEffect, useState } from 'react';
import { Menu, X, ChevronDown, ShieldCheck } from 'lucide-react';
import { Link, useRouter } from '../lib/router';
import { useAuth } from '../lib/auth';

const treatments = [
  { to: '/treatments', label: 'All Treatments' },
  { to: '/weight-loss', label: 'Weight Loss / GLP' },
  { to: '/hormone', label: 'Hormone Optimization' },
  { to: '/sexual-wellness', label: 'Sexual Wellness' },
  { to: '/hair-skin', label: 'Hair & Skin' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [tOpen, setTOpen] = useState(false);
  const { path } = useRouter();
  const { isAdmin, refreshAdmin } = useAuth();

  useEffect(() => { refreshAdmin(); }, [path, refreshAdmin]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); setTOpen(false); }, [path]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled || open ? 'bg-steel-900/95 backdrop-blur-md shadow-xl' : 'bg-gradient-to-b from-steel-900/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center">
          <img src="/TrueForge_Health_&_Wellness_logo_small_horz.png" alt="TrueForge Health & Wellness" className="h-11 md:h-12 object-contain brightness-110" />
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-cream-100 text-sm font-medium">
          <div
            className="relative"
            onMouseEnter={() => setTOpen(true)}
            onMouseLeave={() => setTOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-forge-300 transition">
              Treatments <ChevronDown className="w-4 h-4" />
            </button>
            {tOpen && (
              <div className="absolute top-full -left-4 pt-3 w-64">
                <div className="bg-steel-800 border border-steel-700 rounded-xl p-2 shadow-2xl">
                  {treatments.map((t) => (
                    <Link key={t.to} to={t.to} className="block px-4 py-2.5 text-cream-100 hover:bg-forge-500/20 hover:text-forge-300 rounded-lg transition">
                      {t.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link to="/membership" className="hover:text-forge-300 transition">Membership</Link>
          <Link to="/programs" className="hover:text-forge-300 transition">Programs</Link>
          <Link to="/results" className="hover:text-forge-300 transition">Results</Link>
          <Link to="/learn" className="hover:text-forge-300 transition">Learn</Link>
          <Link to="/founder" className="hover:text-forge-300 transition">Founder</Link>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/member/pricing" className="text-cream-100 text-sm hover:text-forge-300 transition">Pricing</Link>
          <Link to="/portal" className="text-cream-100 text-sm hover:text-forge-300 transition">Portal</Link>
          {isAdmin && (
            <Link to="/admin" className="inline-flex items-center gap-1 text-forge-300 text-sm hover:text-forge-200 transition font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Admin
            </Link>
          )}
          <Link to="/book" className="px-5 py-2.5 bg-forge-500 hover:bg-forge-600 text-cream-50 rounded-full text-sm font-semibold shadow-lg transition">
            Book 15-Min Call
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="lg:hidden text-cream-50 p-2" aria-label="Menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-steel-900 border-t border-steel-700 px-5 py-6 space-y-1 max-h-[80vh] overflow-y-auto">
          {[
            { to: '/', label: 'Home' },
            { to: '/treatments', label: 'Treatments' },
            { to: '/weight-loss', label: 'Weight Loss / GLP' },
            { to: '/hormone', label: 'Hormone Optimization' },
            { to: '/sexual-wellness', label: 'Sexual Wellness' },
            { to: '/hair-skin', label: 'Hair & Skin' },
            { to: '/membership', label: 'Membership' },
            { to: '/programs', label: 'Programs' },
            { to: '/results', label: 'Results' },
            { to: '/learn', label: 'Learn' },
            { to: '/founder', label: 'Founder Story' },
            { to: '/member/pricing', label: 'Member Pricing' },
            { to: '/portal', label: 'Member Portal' },
            ...(isAdmin ? [{ to: '/admin', label: 'Admin Console' }] : []),
          ].map((l) => (
            <Link key={l.to} to={l.to} className="block px-4 py-3 text-cream-100 hover:bg-forge-500/20 hover:text-forge-300 rounded-lg">
              {l.label}
            </Link>
          ))}
          <Link to="/book" className="block mt-3 text-center px-5 py-3 bg-forge-500 text-cream-50 rounded-full font-semibold">
            Book 15-Min Call
          </Link>
        </div>
      )}
    </header>
  );
}
