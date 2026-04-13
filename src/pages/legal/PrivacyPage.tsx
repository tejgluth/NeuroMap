import Container from '../../components/ui/Container'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-ink-900 mb-3">{title}</h2>
      <div className="text-sm text-ink-700 leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <Container className="py-12 md:py-16">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-ink-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-ink-500">Last updated: April 2025</p>
        </div>

        <Section title="1. Information we collect">
          <p>When you create an account, we collect:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your email address (used for authentication and notifications)</li>
            <li>Your display name (shown on reviews you publish)</li>
          </ul>
          <p>When you use the platform, we collect:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Reviews and ratings you submit</li>
            <li>Places you save to your favorites</li>
            <li>Basic usage data (pages visited, errors) for debugging</li>
          </ul>
        </Section>

        <Section title="2. How we use your information">
          <p>We use your information to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Operate and improve the NeuroMap platform</li>
            <li>Display your reviews and display name to other users</li>
            <li>Send account-related emails (confirmation, password reset)</li>
            <li>Detect and prevent abuse</li>
          </ul>
          <p>We do not sell your personal information to third parties.</p>
        </Section>

        <Section title="3. Data storage">
          <p>
            Your data is stored securely using Supabase, a managed database and authentication provider. Data is hosted in the United States. Supabase's security practices and sub-processors are described in their own privacy documentation.
          </p>
        </Section>

        <Section title="4. Cookies and local storage">
          <p>
            NeuroMap stores your authentication session in your browser's local storage to keep you signed in across visits. No third-party advertising cookies are used.
          </p>
        </Section>

        <Section title="5. What is public">
          <p>
            Your display name and the reviews you submit are publicly visible to all visitors. Your email address is never shown publicly.
          </p>
        </Section>

        <Section title="6. Data retention">
          <p>
            We retain your data for as long as your account is active. You can delete your account at any time from your account settings, which permanently removes your personal information and reviews from our systems.
          </p>
        </Section>

        <Section title="7. Your rights">
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate information via your account settings</li>
            <li>Delete your account and all associated data</li>
          </ul>
          <p>To exercise these rights, use the settings in your account or contact us through the About page.</p>
        </Section>

        <Section title="8. Changes to this policy">
          <p>
            We may update this policy as the platform evolves. The date of the latest update is shown at the top of this page. Continued use of NeuroMap after changes constitutes acceptance.
          </p>
        </Section>

        <Section title="9. Contact">
          <p>
            For privacy-related questions, contact us through the About page.
          </p>
        </Section>
      </div>
    </Container>
  )
}
