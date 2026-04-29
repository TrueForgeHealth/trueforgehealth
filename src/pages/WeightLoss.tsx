import TreatmentPage from '../components/TreatmentPage';

export default function WeightLoss() {
  return (
    <TreatmentPage
      eyebrow="Weight Loss / GLP"
      title={<>Lose the weight. <span className="text-metallic">Keep your life.</span></>}
      subtitle="GLP-1 medications work. But only when they're paired with the right coaching, the right labs, and someone who actually answers when you have a question at 9pm on a Thursday."
      heroImg="https://images.pexels.com/photos/4498482/pexels-photo-4498482.jpeg?auto=compress&cs=tinysrgb&w=1600"
      problems={[
        'You\'ve done every diet. The weight either won\'t move or it boomerangs.',
        'You\'re curious about GLPs but worried about side effects, muscle loss, or pricing tricks.',
        'You don\'t want a script-mill. You want someone who actually monitors your labs and adjusts.',
        'You want the medication, the coaching, and the food strategy — not just one piece of the puzzle.',
      ]}
      protocols={[
        { name: 'GLP-1 based metabolic protocols', desc: 'Compounded weekly injections, carefully titrated with appetite, GI tolerance, and energy as your guide. Often combined with coaching for sustainable results.' },
        { name: 'New advanced triple-agonist protocols', desc: 'Next-generation metabolic reset targeting multiple pathways. Delivered under close clinician supervision for clients who need stronger support.' },
        { name: 'Metabolic Reset', desc: 'Non-GLP path: lab-driven thyroid, insulin, cortisol work + nutrition and training reset.' },
        { name: 'Body Recomp Coaching', desc: 'Lose fat, protect muscle, look the way you actually want to look — not just lighter.' },
        { name: 'Add-Ons', desc: 'B12, lipo injections, NAD+, peptide stacks. Available as your plan evolves.' },
      ]}
      includes={[
        'Initial clinician consult and full intake',
        'Required labs (HSA/FSA eligible)',
        'Monthly check-ins and dose adjustments',
        'Direct messaging with your care team',
        'Coaching on food, training, sleep, stress',
        'Discreet shipping of medications',
      ]}
      faq={[
        { q: 'How fast will I see results?', a: 'Most clients notice appetite changes in week one and the scale moving in weeks two to four. Real body change shows up around the 8-12 week mark and accelerates from there. Individual results vary based on your starting point, adherence, and clinician guidance.' },
        { q: 'What about muscle loss?', a: 'This is where most GLP programs fall short. We protect your muscle with protein targets, resistance training guidance, and regular labs. If you want, we can layer in personal training.' },
        { q: 'How much does it cost?', a: 'Membership is $99/month. Medication and labs are separate and depend on your dose and stack. We quote you transparently on the consult — no surprises. Pharmacies and pricing details are available on the member pricing page.' },
        { q: 'What if I want to stop?', a: 'You can stop any time. We\'ll build a maintenance plan together so the work you put in actually sticks.' },
      ]}
      related={[
        { to: '/hormone', label: 'Hormone Optimization' },
        { to: '/programs', label: '90-Day Weight Program' },
        { to: '/results', label: 'Real Transformations' },
      ]}
    />
  );
}