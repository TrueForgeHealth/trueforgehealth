import TreatmentPage from '../components/TreatmentPage';

export default function SexualWellness() {
  return (
    <TreatmentPage
      eyebrow="Sexual Wellness"
      title={<>Discreet. Effective. <span className="text-metallic">Yours.</span></>}
      subtitle="The conversation nobody wants to have, handled privately and clinically. Performance, libido, confidence — restored without the awkward pharmacy line."
      heroImg="https://images.pexels.com/photos/4046718/pexels-photo-4046718.jpeg?auto=compress&cs=tinysrgb&w=1600"
      problems={[
        'Performance has changed and you don\'t recognize yourself anymore.',
        'Libido has quietly disappeared — for you, for your partner, or for both.',
        'You don\'t want to walk into a clinic and explain this to a stranger at the front desk.',
        'You\'ve tried OTC stuff. None of it worked because none of it addressed the actual root cause.',
      ]}
      protocols={[
        { name: 'ED Medications', desc: 'Sildenafil, tadalafil, daily-dose tadalafil. Plus combo troches when standard meds fall short.' },
        { name: 'PT-141', desc: 'For desire and arousal — works centrally, not vascularly. Game-changer for the right person.' },
        { name: 'Hormone-Driven Libido', desc: 'Most "low desire" is actually low testosterone or estrogen imbalance. We fix the cause.' },
        { name: 'Female Sexual Wellness', desc: 'Vaginal estrogen, oxytocin, testosterone, and PT-141 protocols designed for women.' },
        { name: 'Couples Pathways', desc: 'Bring your partner. We\'ve helped both sides of the bed at the same time.' },
        { name: 'Confidence Stack', desc: 'Combine sexual wellness with hormone, weight, and aesthetic care for a full reset.' },
      ]}
      includes={[
        '100% telehealth and discreet shipping',
        'Clinician consult and intake',
        'Lab work where indicated',
        'Ongoing dose tuning',
        'Direct private messaging',
        'Partner-friendly support',
      ]}
      faq={[
        { q: 'Will my partner know?', a: 'Only if you choose to share. Everything ships in plain packaging and bills discreetly. The work itself is between you and your clinician.' },
        { q: 'What if meds haven\'t worked for me before?', a: 'There\'s usually a reason — wrong dose, wrong med, wrong cause. We dig in instead of throwing pills.' },
        { q: 'Is PT-141 safe?', a: 'For most healthy adults, yes — used at appropriate doses. We screen carefully and start low.' },
      ]}
      related={[
        { to: '/hormone', label: 'Hormone Optimization' },
        { to: '/membership', label: 'Membership' },
        { to: '/book', label: 'Free 15-Min Call' },
      ]}
    />
  );
}
