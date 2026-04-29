import TreatmentPage from '../components/TreatmentPage';

export default function HairSkin() {
  return (
    <TreatmentPage
      eyebrow="Hair & Skin"
      title={<>Look like the version of you that <span className="text-metallic">runs the room.</span></>}
      subtitle="Hair loss, skin quality, recovery, glow. Aesthetic medicine that complements your internal work — so the outside finally matches what's happening inside."
      heroImg="https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1600"
      problems={[
        'You see the hair line creeping and you\'re not ready to give in.',
        'Skin texture, tone, or breakouts are stealing confidence.',
        'You want a real plan, not 12 random products that contradict each other.',
        'You want results without looking "done."',
      ]}
      protocols={[
        { name: 'Finasteride / Dutasteride', desc: 'Topical or oral DHT blockade — dosed to your tolerance and bloodwork.' },
        { name: 'Compounded Topicals', desc: 'Custom finasteride + minoxidil + adjunct stacks tailored to your scalp.' },
        { name: 'Peptides for Skin', desc: 'GHK-Cu, BPC-157 and others for collagen, recovery, and tone.' },
        { name: 'Tretinoin & Skincare', desc: 'Prescription-grade routines — built around your actual skin, not a TikTok video.' },
        { name: 'Anti-Aging Stack', desc: 'NAD+, glutathione, longevity peptides for the long game.' },
        { name: 'Body Aesthetic Add-Ons', desc: 'Targeted lipo injections, recovery peptides for training, scar protocols.' },
      ]}
      includes={[
        'Clinician evaluation and photos',
        'Custom topical or oral protocol',
        'Quarterly check-ins',
        'Adjustments as your skin and hair respond',
        'Member pricing on add-ons',
        'Direct messaging with care team',
      ]}
      faq={[
        { q: 'Will finasteride mess with my libido?', a: 'A small percentage of men report sexual side effects. We screen, dose carefully, and pivot to topical-only if needed.' },
        { q: 'How long until I see hair changes?', a: 'Shedding can stabilize in 8-12 weeks. Visible regrowth typically 4-6 months. Patience pays here.' },
        { q: 'Can I do this with TRT?', a: 'Yes — and we\'ll often pair them. The combination is one of our most-loved stacks.' },
      ]}
      related={[
        { to: '/hormone', label: 'Hormone Optimization' },
        { to: '/membership', label: 'Membership' },
        { to: '/results', label: 'See Results' },
      ]}
    />
  );
}
