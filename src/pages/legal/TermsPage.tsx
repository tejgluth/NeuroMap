import Container from '../../components/ui/Container'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-ink-900 mb-3">{title}</h2>
      <div className="text-sm text-ink-700 leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

export default function TermsPage() {
  return (
    <Container className="py-12 md:py-16">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-ink-900">Terms of Service</h1>
          <p className="mt-2 text-sm text-ink-500">Last updated: April 2025</p>
        </div>

        <Section title="1. About NeuroMap">
          <p>
            NeuroMap is a community platform that helps families find sensory-friendly places. It is a student Social Innovation project from The Bishop's School and is provided free of charge.
          </p>
        </Section>

        <Section title="2. Acceptance of terms">
          <p>
            By accessing or using NeuroMap, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.
          </p>
        </Section>

        <Section title="3. User accounts">
          <p>
            You must provide accurate information when creating an account. You are responsible for keeping your password secure and for all activity under your account. Notify us immediately if you suspect unauthorized access.
          </p>
          <p>
            You must be at least 13 years old to create an account. If you are under 18, a parent or guardian must review and agree to these terms on your behalf.
          </p>
        </Section>

        <Section title="4. User content">
          <p>
            You retain ownership of reviews and content you submit. By posting, you grant NeuroMap a non-exclusive, royalty-free license to display and distribute that content on the platform.
          </p>
          <p>
            You agree not to post content that is false, defamatory, harassing, hateful, or otherwise harmful. We reserve the right to remove content that violates these terms.
          </p>
        </Section>

        <Section title="5. Not medical advice">
          <p>
            Reviews and ratings on NeuroMap reflect individual family experiences and are not medical or therapeutic advice. Sensory environments vary by time of day, staffing, and other factors. Always use your own judgment when visiting a place.
          </p>
        </Section>

        <Section title="6. Accuracy of information">
          <p>
            Place information and reviews are user-generated and may be out of date. NeuroMap makes no guarantees about the accuracy, completeness, or timeliness of any content.
          </p>
        </Section>

        <Section title="7. Prohibited conduct">
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Post false, misleading, or fraudulent reviews</li>
            <li>Harass, threaten, or harm other users</li>
            <li>Attempt to gain unauthorized access to any part of the platform</li>
            <li>Scrape or collect data from the platform without permission</li>
            <li>Use the platform for commercial solicitation without consent</li>
          </ul>
        </Section>

        <Section title="8. Account termination">
          <p>
            We may suspend or terminate accounts that violate these terms. You may delete your account at any time from your account settings.
          </p>
        </Section>

        <Section title="9. Limitation of liability">
          <p>
            NeuroMap is provided "as is" without warranties of any kind. To the fullest extent permitted by law, NeuroMap and its operators shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.
          </p>
        </Section>

        <Section title="10. Changes to these terms">
          <p>
            We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the updated terms. We will note the date of the most recent update at the top of this page.
          </p>
        </Section>

        <Section title="11. Contact">
          <p>
            For questions about these terms, contact us through the About page.
          </p>
        </Section>
      </div>
    </Container>
  )
}
