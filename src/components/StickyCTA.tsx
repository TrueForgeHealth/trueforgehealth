import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { Link } from '../lib/router';

export default function StickyCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 800);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`fixed bottom-4 inset-x-4 md:hidden z-40 transition-all duration-500 ${show ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}>
      <Link
        to="/book"
        className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-forge-500 text-cream-50 font-semibold shadow-2xl"
      >
        <Calendar className="w-5 h-5" /> Book Your 15-Minute Call
      </Link>
    </div>
  );
}
