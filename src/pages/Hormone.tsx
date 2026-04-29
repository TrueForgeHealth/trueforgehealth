import TreatmentPage from '../components/TreatmentPage';

export default function Hormone() {
  return (
    <TreatmentPage
      eyebrow="Hormone Optimization"
      title={<>Get your <span className="text-metallic">edge</span> back.</>}
      subtitle="Energy. Drive. Recovery. Sleep. Body composition. When your hormones are off, everything is off — and most providers will tell you 'your labs are normal' while you feel like a stranger in your own body."
      heroImg="https://images.pexels.com/photos/4498132/pexels-photo-4498132.jpeg?auto=compress&cs=tinysrgb&w=1600"
      problems={[
        'You\'re flat. Tired. Foggy. Watching your drive disappear quietly.',
        'You\'ve been told your labs are "fine" while everything in your life says they are not.',
        'You\'re curious about TRT or peptides but want a real clinician, not a TikTok protocol.',
        'You want to optimize, not just survive — and you want it done correctly.',
      ]}
      protocols={[
        { name: 'TRT (Testosterone)', desc: 'Injectable, cream, or pellet — dosed and monitored by labs, not guesswork. Estrogen, hematocrit, and DHT managed.' },
        { name: 'Peptide Therapy', desc: 'BPC-157, TB-500, sermorelin, ipamorelin and more for recovery, sleep, and longevity.' },
        { name: 'Female Hormone Care', desc: 'Estrogen, progesterone, testosterone for women — with a clinician who actually listens.' },
        { name: 'Thyroid & Adrenal', desc: 'Full panel including free T3/T4, reverse T3, antibodies. Cortisol rhythm work where indicated.' },
        { name: 'HCG / Fertility-Aware', desc: 'Protocols that protect fertility for clients who want to keep that door open.' },
        { name: 'Add-On Stacks', desc: 'NAD+, glutathione, methylated B-vitamins. Stacked thoughtfully, not chaotically.' },
      ]}
      includes={[
        'Comprehensive baseline labs',
        'Clinician consult and protocol design',
        'Quarterly follow-up labs',
        'Monthly check-ins and dose tuning',
        'Symptom tracking with your coach',
        'Direct messaging — fast answers',
      ]}
      faq={[
        { q: 'Will I be on TRT forever?', a: 'Many clients choose to stay on long-term because their quality of life is dramatically better. Some use it as a bridge. We design either path with eyes open.' },
        { q: 'Is this safe long-term?', a: 'When monitored properly with labs and a clinician — yes. The risks come from unmonitored, internet-protocol use. That is exactly what we exist to prevent.' },
        { q: 'What about side effects?', a: 'Most are dose- and ester-related and fully manageable. We adjust based on your labs and how you actually feel — not a textbook.' },
        { q: 'Do you treat women?', a: 'Yes. Female hormone work is one of our most underserved and impactful pillars. We do this carefully and well.' },
      ]}
      related={[
        { to: '/sexual-wellness', label: 'Sexual Wellness' },
        { to: '/weight-loss', label: 'Weight Loss / GLP' },
        { to: '/programs', label: '12 Week Hormone Reset' },
      ]}
    />
  );
}
