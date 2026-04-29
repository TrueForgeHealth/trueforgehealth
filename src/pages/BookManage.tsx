import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { Eyebrow, H2 } from '../components/Section';
import { Link } from '../lib/router';
import { manageAppointment } from '../lib/booking';

export default function BookManage() {
  const [state, setState] = useState<'working' | 'confirmed' | 'cancelled' | 'error'>('working');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '');
    const id = params.get('id') ?? '';
    const t = params.get('t') ?? '';
    const action = (params.get('action') ?? '') as 'confirm' | 'cancel';
    if (!id || !t || (action !== 'confirm' && action !== 'cancel')) {
      setState('error');
      setMessage('This link is missing required information.');
      return;
    }
    manageAppointment(id, t, action)
      .then((r) => {
        if (r.status === 'confirmed') setState('confirmed');
        else setState('cancelled');
      })
      .catch((e) => {
        setState('error');
        setMessage(e.message);
      });
  }, []);

  return (
    <section className="min-h-[70vh] bg-cream-50 flex items-center justify-center px-5 py-24">
      <div className="max-w-md w-full bg-white border border-cream-200 rounded-3xl p-10 shadow-xl text-center">
        {state === 'working' && (
          <>
            <Loader2 className="w-10 h-10 text-forge-500 animate-spin mx-auto mb-4" />
            <p className="text-steel-600 text-sm">Updating your appointment...</p>
          </>
        )}
        {state === 'confirmed' && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-forge-500/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-7 h-7 text-forge-500" />
            </div>
            <Eyebrow>Confirmed</Eyebrow>
            <H2>You're <span className="text-forge-600">locked in.</span></H2>
            <p className="mt-3 text-steel-600 text-sm">Thanks for confirming — we'll see you on Zoom. Watch for the 10-minute reminder with the link.</p>
            <Link to="/" className="mt-6 btn-forge w-full">Back to home <ArrowRight className="w-4 h-4" /></Link>
          </>
        )}
        {state === 'cancelled' && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-steel-200 flex items-center justify-center mx-auto mb-5">
              <XCircle className="w-7 h-7 text-steel-700" />
            </div>
            <Eyebrow>Cancelled</Eyebrow>
            <H2>No problem.</H2>
            <p className="mt-3 text-steel-600 text-sm">Your appointment has been cancelled. Whenever you're ready, you can rebook in seconds.</p>
            <Link to="/book" className="mt-6 btn-forge w-full">Book a new time <ArrowRight className="w-4 h-4" /></Link>
          </>
        )}
        {state === 'error' && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-5">
              <XCircle className="w-7 h-7 text-red-600" />
            </div>
            <Eyebrow>Something went wrong</Eyebrow>
            <H2>Let's try again.</H2>
            <p className="mt-3 text-steel-600 text-sm">{message || 'We could not update this appointment.'}</p>
            <Link to="/book" className="mt-6 btn-forge w-full">Go to booking <ArrowRight className="w-4 h-4" /></Link>
          </>
        )}
      </div>
    </section>
  );
}
