import { LegalPageShell } from '../components/LegalNotice';

export default function Privacy() {
  return (
    <LegalPageShell title="Privacy Policy" eyebrow="Legal" updated="April 28, 2026">
      <p>
        TrueForge Health &amp; Wellness LLC (&ldquo;TrueForge,&rdquo; &ldquo;we,&rdquo;
        &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy. This Privacy Policy
        explains how we collect, use, disclose, and protect information when you use our
        websites, member portal, communications, and services (collectively, the
        &ldquo;Services&rdquo;).
      </p>

      <h2>1. Information We Collect</h2>
      <h3>a. Information you provide directly</h3>
      <ul>
        <li><strong>Account &amp; contact information:</strong> name, email, phone, mailing address.</li>
        <li><strong>Health &amp; wellness information you choose to share</strong> (e.g., goals, lifestyle, intake answers, questionnaire responses, photos you upload).</li>
        <li><strong>Payment information:</strong> processed by Stripe. We never store full card numbers on our servers.</li>
        <li><strong>Communications:</strong> messages you send through the portal, email, or SMS.</li>
      </ul>
      <h3>b. Information collected automatically</h3>
      <ul>
        <li>Device, browser, IP address, approximate location, referring URL, pages viewed, and timestamps.</li>
        <li>Cookies and similar technologies for authentication, analytics, and feature performance.</li>
      </ul>
      <h3>c. Information from third parties</h3>
      <ul>
        <li>Clinical partners (e.g., SimplePractice, Prescribery), pharmacies, and lab vendors with whom you have an independent relationship may share appointment, prescription, or completion status with us as needed to coordinate your care.</li>
      </ul>

      <h2>2. How We Use Information</h2>
      <ul>
        <li>To provide, personalize, and improve the Services.</li>
        <li>To schedule appointments, send reminders, and deliver Zoom links.</li>
        <li>To process payments, manage memberships, and prevent fraud.</li>
        <li>To communicate with you about your account, support requests, and (with your consent) marketing.</li>
        <li>To comply with legal obligations and enforce our Terms.</li>
      </ul>

      <h2>3. HIPAA &amp; Protected Health Information</h2>
      <p>
        Where we handle Protected Health Information (PHI) on behalf of a covered entity,
        we do so as a Business Associate under a written Business Associate Agreement and
        in compliance with the Health Insurance Portability and Accountability Act
        (HIPAA). Coaching, educational content, and general wellness data you provide
        directly to TrueForge outside of a covered clinical workflow are not PHI and are
        governed by this Privacy Policy.
      </p>

      <h2>4. How We Share Information</h2>
      <ul>
        <li><strong>Service providers</strong> who help us operate the Services (Stripe, Supabase, Zoom, Resend, SimplePractice, Prescribery, hosting, analytics) under written confidentiality and data-processing terms.</li>
        <li><strong>Clinicians and pharmacies</strong> to coordinate care you have requested.</li>
        <li><strong>Legal &amp; safety:</strong> to comply with law, respond to lawful requests, protect rights and safety, or in connection with a corporate transaction.</li>
        <li><strong>With your consent</strong> for any other purpose disclosed at the point of collection.</li>
      </ul>
      <p>We do not sell your personal information.</p>

      <h2>5. Cookies &amp; Tracking</h2>
      <p>
        We use first- and third-party cookies for authentication, preferences, and
        analytics. You can control cookies through your browser; disabling them may break
        portions of the Services. We honor Global Privacy Control signals where required.
      </p>

      <h2>6. Data Retention</h2>
      <p>
        We retain account and transactional records for as long as your account is active
        and for a reasonable period thereafter to comply with tax, legal, and audit
        obligations. Clinical records held by partner clinicians are retained per their
        own retention schedules and applicable law.
      </p>

      <h2>7. Security</h2>
      <p>
        We use industry-standard administrative, technical, and physical safeguards
        including TLS in transit, encryption at rest where applicable, role-based access,
        and audit logging. No system is perfectly secure; we cannot guarantee absolute
        security.
      </p>

      <h2>8. Your Rights</h2>
      <p>Depending on your jurisdiction, you may have the right to:</p>
      <ul>
        <li>Access, correct, or delete personal information we hold about you.</li>
        <li>Opt out of marketing emails (use the unsubscribe link or email us).</li>
        <li>Restrict or object to certain processing.</li>
        <li>Withdraw consent where processing is based on consent.</li>
        <li>Lodge a complaint with a supervisory authority.</li>
      </ul>
      <p>
        To exercise these rights, email
        <a href="mailto:admin@trueforgehealth.com"> admin@trueforgehealth.com</a>. We will
        verify your identity before fulfilling the request.
      </p>

      <h2>9. Children</h2>
      <p>
        The Services are intended for adults 18 and older. We do not knowingly collect
        information from children under 13. If you believe a child has provided us
        information, contact us and we will delete it.
      </p>

      <h2>10. International Users</h2>
      <p>
        We operate in the United States. If you access the Services from outside the U.S.,
        you understand that your information will be processed in the U.S. under U.S. law.
      </p>

      <h2>11. Changes</h2>
      <p>
        We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo;
        date above reflects the most recent version. Material changes will be communicated
        by email or in-portal notice.
      </p>

      <h2>12. Contact</h2>
      <p>
        TrueForge Health &amp; Wellness LLC &mdash;
        <a href="mailto:admin@trueforgehealth.com"> admin@trueforgehealth.com</a>.
      </p>
    </LegalPageShell>
  );
}
