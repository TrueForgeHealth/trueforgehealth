import { useMemo, useState } from 'react';
import { LogOut, Search, ShieldCheck, Layers, Pill, ArrowRight, Mail, Plus, Check } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { Link } from '../lib/router';
import { Eyebrow, H2 } from '../components/Section';
import { ITEMS, STACKS, customerPrice, customerPrice60, customerPrice90, stackTotal, isTRT, isNinetyDayOnly, SAVINGS_60, SAVINGS_90, PriceItem, Stack } from '../lib/pricing';
import { supabase } from '../lib/supabase';
import PaidMemberGate from '../components/PaidMemberGate';


function PriceCell({
  price, savings, onAdd, added, busy,
}: { price: number; savings?: number; onAdd: () => void; added: boolean; busy: boolean }) {
  return (
    <div className="flex flex-col items-end gap-1.5">
      <span className="font-display text-2xl text-forge-600 leading-none">${price}</span>
      {savings ? (
        <span className="text-[10px] uppercase tracking-wider font-semibold text-forge-500 bg-forge-500/10 px-2 py-0.5 rounded-full">
          Save ${savings}
        </span>
      ) : null}
      <button onClick={onAdd} disabled={busy}
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${added ? 'bg-forge-600 text-cream-50' : 'bg-steel-900 text-cream-50 hover:bg-forge-500'}`}>
        {added ? <><Check className="w-3 h-3" /> Added</> : <><Plus className="w-3 h-3" /> Add</>}
      </button>
    </div>
  );
}

function PriceRow({ i, userId }: { i: PriceItem; userId: string }) {
  const [addedKey, setAddedKey] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const trt = isTRT(i);
  const ninetyOnly = isNinetyDayOnly(i);

  const add = async (durationDays: 30 | 60 | 90, price: number) => {
    const key = String(durationDays);
    setBusyKey(key);
    await supabase.from('cart_items').insert({
      user_id: userId,
      product: i.product,
      concentration: i.concentration,
      pharmacy: i.pharmacy,
      category: i.category,
      price,
      kind: 'product',
      notes: `${durationDays}-day supply`,
    });
    setBusyKey(null);
    setAddedKey(key);
    setTimeout(() => setAddedKey((k) => (k === key ? null : k)), 1800);
  };

  return (
    <tr className="border-b border-cream-200 hover:bg-cream-100 transition align-top">
      <td className="py-4 px-4 text-steel-900 font-medium">{i.product}</td>
      <td className="py-4 px-4 text-steel-600 text-sm">{i.concentration}</td>
      <td className="py-4 px-4 text-steel-500 text-xs uppercase tracking-wider">{i.pharmacy}</td>
      <td className="py-4 px-4 text-right">
        {ninetyOnly ? (
          <span className="text-steel-300 text-sm">—</span>
        ) : (
          <PriceCell
            price={customerPrice(i)}
            onAdd={() => add(30, customerPrice(i))}
            added={addedKey === '30'}
            busy={busyKey === '30'}
          />
        )}
      </td>
      <td className="py-4 px-4 text-right">
        {trt || ninetyOnly ? (
          <span className="text-steel-300 text-sm">—</span>
        ) : (
          <PriceCell
            price={customerPrice60(i)}
            savings={SAVINGS_60}
            onAdd={() => add(60, customerPrice60(i))}
            added={addedKey === '60'}
            busy={busyKey === '60'}
          />
        )}
      </td>
      <td className="py-4 px-4 text-right">
        {ninetyOnly ? (
          <PriceCell
            price={customerPrice(i)}
            onAdd={() => add(90, customerPrice(i))}
            added={addedKey === '90'}
            busy={busyKey === '90'}
          />
        ) : trt ? (
          <span className="text-steel-300 text-sm">—</span>
        ) : (
          <PriceCell
            price={customerPrice90(i)}
            savings={SAVINGS_90}
            onAdd={() => add(90, customerPrice90(i))}
            added={addedKey === '90'}
            busy={busyKey === '90'}
          />
        )}
      </td>
    </tr>
  );
}

function PricingDirectory({ userId }: { userId: string }) {
  const [q, setQ] = useState('');
  const cats = useMemo(() => {
    const filtered = ITEMS.filter((i) =>
      [i.product, i.pharmacy, i.category, i.concentration].join(' ').toLowerCase().includes(q.toLowerCase())
    );
    const grouped: Record<string, PriceItem[]> = {};
    filtered.forEach((i) => { (grouped[i.category] ||= []).push(i); });
    return grouped;
  }, [q]);

  return (
    <>
      <div className="relative max-w-md mb-10">
        <Search className="w-4 h-4 text-steel-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search products, peptides, pharmacies..."
          className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-cream-200 focus:border-forge-500 focus:outline-none"
        />
      </div>
      <div className="space-y-12">
        {Object.entries(cats).map(([cat, items]) => (
          <div key={cat}>
            <div className="flex items-center gap-3 mb-5">
              <h3 className="font-display text-3xl text-steel-900">{cat}</h3>
              <span className="text-xs uppercase tracking-[0.3em] text-forge-500">{items.length} items</span>
            </div>
            <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead className="bg-cream-100 border-b border-cream-200">
                    <tr className="text-xs uppercase tracking-wider text-steel-500">
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">Concentration</th>
                      <th className="text-left py-3 px-4">Pharmacy</th>
                      <th className="text-right py-3 px-4 w-32">30-Day</th>
                      <th className="text-right py-3 px-4 w-32">60-Day</th>
                      <th className="text-right py-3 px-4 w-32">90-Day</th>
                    </tr>
                  </thead>
                  <tbody>{items.map((i, k) => <PriceRow key={k} i={i} userId={userId} />)}</tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
        {Object.keys(cats).length === 0 && (
          <p className="text-steel-500 text-center py-12">No products match your search.</p>
        )}
      </div>
    </>
  );
}

function StackCard({ s, userId }: { s: Stack; userId: string }) {
  const [added, setAdded] = useState(false);
  const [busy, setBusy] = useState(false);
  const total = stackTotal(s);

  const addAll = async () => {
    setBusy(true);
    const rows = s.components.map((c) => {
      const item = ITEMS.find((x) => x.product === c.product && x.concentration === c.concentration)!;
      return {
        user_id: userId,
        product: item.product,
        concentration: item.concentration,
        pharmacy: item.pharmacy,
        category: item.category,
        price: customerPrice(item),
        kind: 'stack',
        notes: `Part of "${s.name}" stack`,
      };
    });
    await supabase.from('cart_items').insert(rows);
    setBusy(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="card-lift bg-white rounded-3xl border border-cream-200 p-8 flex flex-col">
      <div className="flex items-start justify-between mb-5">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-forge-500 font-semibold">Stack</span>
          <h3 className="font-display text-3xl text-steel-900 mt-1">{s.name}</h3>
        </div>
        <Layers className="w-6 h-6 text-forge-500" />
      </div>
      <p className="text-steel-600 mb-2">{s.tagline}</p>
      <p className="text-steel-500 text-sm italic mb-6">{s.goal}</p>
      <ul className="space-y-2 mb-6 flex-1">
        {s.components.map((c, k) => (
          <li key={k} className="flex items-start gap-2 text-sm text-steel-700">
            <Pill className="w-4 h-4 text-forge-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-medium">{c.product}</span>
              <span className="text-steel-500"> — {c.concentration}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="border-t border-cream-200 pt-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-steel-500">Stack Total</p>
          <p className="font-display text-4xl text-forge-600">${total}</p>
        </div>
        <button onClick={addAll} disabled={busy}
          className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition ${added ? 'bg-forge-600 text-cream-50' : 'bg-steel-900 text-cream-50 hover:bg-forge-500'}`}>
          {added ? <><Check className="w-4 h-4" /> Added to cart</> : <><Plus className="w-4 h-4" /> Add stack</>}
        </button>
      </div>
    </div>
  );
}

function StackBoard({ userId }: { userId: string }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {STACKS.map((s) => <StackCard key={s.name} s={s} userId={userId} />)}
    </div>
  );
}

function PriceListContent() {
  const { session, signOut } = useAuth();
  const [tab, setTab] = useState<'individual' | 'stacks'>('individual');

  if (!session) return null;

  return (
    <>
      <section className="bg-steel-900 text-cream-50 py-20 px-5 md:px-10">
        <div className="container-tf">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-forge-500/15 border border-forge-500/30 text-forge-300 text-xs uppercase tracking-[0.2em]">
                <ShieldCheck className="w-3 h-3" /> <span className="text-metallic-gold">Members Only</span>
              </div>
              <H2 light>Your Member <span className="text-metallic">Price List.</span></H2>
              <p className="mt-4 text-cream-200/70">Live pricing on every protocol available inside the TrueForge ecosystem. Member rates include product, provider fee, and shipping. Labs quoted separately.</p>
              <p className="mt-2 text-cream-200/50 text-sm flex items-center gap-2"><Mail className="w-4 h-4" /> Signed in as {session.user.email}</p>
            </div>
            <div className="flex items-center gap-3 self-start md:self-auto">
              <Link to="/portal/cart" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forge-500 text-cream-50 hover:bg-forge-600 transition text-sm font-semibold">
                <ShieldCheck className="w-4 h-4" /> My Portal
              </Link>
              <button onClick={signOut} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cream-50/30 text-cream-100 hover:bg-cream-50 hover:text-steel-900 transition text-sm">
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          </div>

          <div className="mt-10 inline-flex bg-steel-800 border border-steel-700 rounded-full p-1">
            <button onClick={() => setTab('individual')} className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${tab === 'individual' ? 'bg-forge-500 text-cream-50' : 'text-cream-200/70'}`}>Individual Products</button>
            <button onClick={() => setTab('stacks')} className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${tab === 'stacks' ? 'bg-forge-500 text-cream-50' : 'text-cream-200/70'}`}>Common Stacks</button>
          </div>
        </div>
      </section>

      <section className="section bg-cream-50">
        <div className="container-tf">
          {tab === 'individual' ? <PricingDirectory userId={session.user.id} /> : <StackBoard userId={session.user.id} />}
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-tf max-w-3xl text-center">
          <Eyebrow>Need Guidance?</Eyebrow>
          <H2>Not sure which stack fits you?</H2>
          <p className="mt-5 text-steel-600 text-lg">Message your care team in the patient portal — or book a 1:1 with your clinician to design a custom protocol.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/book" className="btn-forge">Book 15-Min Call <ArrowRight className="w-4 h-4" /></Link>
            <Link to="/login" className="btn-ghost">Open Patient Portal</Link>
          </div>
          <p className="mt-10 text-xs text-steel-500 max-w-xl mx-auto">
            Pricing reflects member rates and is subject to clinician approval, lab review, and state-specific availability. Some products are not available in CA or WI. Pricing may change without notice.
          </p>
        </div>
      </section>
    </>
  );
}

export default function MemberPricing() {
  return (
    <PaidMemberGate context="the member price list">
      <PriceListContent />
    </PaidMemberGate>
  );
}