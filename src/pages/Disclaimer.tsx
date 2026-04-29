import { LegalPageShell } from '../components/LegalNotice';

export default function Disclaimer() {
  return (
    <LegalPageShell title="Medical &amp; Wellness Disclaimer" eyebrow="Legal" updated="April 28, 2026">
      <p>
        TrueForge Health &amp; Wellness provides general wellness coaching, educational
        resources, member portal access, and personalized support services only.
      </p>
      <p>
        All information, protocols, recommendations, and communications are for
        informational and educational purposes only. They are not intended to diagnose,
        treat, cure, or prevent any disease or medical condition and do not constitute
        medical advice, diagnosis, or treatment.
      </p>
      <p>
        You are solely responsible for your own health decisions. We strongly recommend
        you consult with a qualified healthcare provider before making any changes to
        your diet, exercise, supplementation, medication, or health regimen. TrueForge
        and its team are not liable for any injury, illness, or adverse outcome related
        to the use of our services or information provided.
      </p>

      <h2>Clinical Care Is Independent</h2>
      <p>
        Where prescriptions, diagnoses, lab orders, or treatment plans are issued, they
        are provided independently by licensed clinicians and 503A pharmacies who
        establish their own provider-patient relationship with you, subject to their own
        terms, privacy practices, and professional judgment. TrueForge does not practice
        medicine.
      </p>

      <h2>Emergencies</h2>
      <p>
        If you are experiencing a medical or mental-health emergency, call 911 or your
        local emergency number, or go to the nearest emergency department. Do not use
        TrueForge messaging, the member portal, or email for emergencies; messages are
        not monitored 24/7.
      </p>

      <h2>Results Vary</h2>
      <p>
        Testimonials and outcomes shown across the site reflect individual experience and
        are not a guarantee of any specific result. Outcomes depend on adherence,
        physiology, and many factors outside our control.
      </p>
    </LegalPageShell>
  );
}
