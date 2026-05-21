import type { Metadata } from "next"
import Link from "next/link"

import { site } from "@/config/site"

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Terms and conditions for using Mithu Mobile Center website and services.",
}

const siteUrl = site.host
const contactEmail = site.contact.email
const contactPhone = site.contact.phone
const contactPhoneTel = site.contact.phoneTel
const contactAddress = site.contact.address

export default function TermsAndConditionsPage() {
  return (
    <main className="flex flex-1 flex-col px-4 py-10 sm:py-14">
      <article className="mx-auto w-full max-w-3xl text-foreground">
        <h1 className="mb-2 text-center text-3xl font-semibold tracking-tight">
          Terms and Conditions
        </h1>
        <p className="mb-10 text-center text-[15px] leading-relaxed text-muted-foreground">
          Welcome to Mithu Mobile Center. By accessing or using our website{" "}
          <span className="text-foreground">{siteUrl}</span> you agree to be
          bound by these terms and conditions. Please read them carefully.
        </p>

        <div className="space-y-10 text-[15px] leading-relaxed text-foreground/90">
          <section className="scroll-mt-24 space-y-4" id="general">
            <h2 className="text-xl font-semibold text-foreground">
              1. General provisions
            </h2>
            <div className="space-y-3">
              <p>
                <span className="font-semibold text-foreground">1.1 </span>
                These Terms and Conditions (“Terms”) govern your use of our
                website and all related services, content, and products.
              </p>
              <p>
                <span className="font-semibold text-foreground">1.2 </span>
                By accessing or using our website, you agree to comply with
                these Terms, along with our{" "}
                <Link
                  href="/policies/privacy"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Privacy Policy
                </Link>{" "}
                and any additional terms specific to certain products or
                services.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              2. Account registration
            </h2>
            <div className="space-y-3">
              <p>
                <span className="font-semibold text-foreground">2.1 </span>
                You may need to create an account to access certain features of
                our website.
              </p>
              <p>
                <span className="font-semibold text-foreground">2.2 </span>
                You are responsible for maintaining the confidentiality of your
                account information and for all activities under your account.
              </p>
              <p>
                <span className="font-semibold text-foreground">2.3 </span>
                We reserve the right to suspend or terminate your account if we
                suspect unauthorized or fraudulent activity.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              3. Product information and availability
            </h2>
            <p>
              We strive to provide accurate product descriptions and pricing.
              However, errors may occur, and we reserve the right to correct them
              without notice.
            </p>
            <p>
              Product availability is subject to change. We do not guarantee the
              availability of any particular product at any given time.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              4. Orders and payments
            </h2>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                Placing an order does not guarantee acceptance. We reserve the
                right to accept or decline orders at our discretion.
              </li>
              <li>
                Payments must be made through the methods specified on our
                website. By placing an order, you authorize us to charge the
                total order amount.
              </li>
              <li>
                Prices are subject to change without notice, but once an order
                is accepted, the price will not change for that order.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              5. Shipping and delivery
            </h2>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                We ship products to the address specified in your order.
                Shipping times and costs are provided at checkout.
              </li>
              <li>
                We are not responsible for delays caused by carriers or other
                events beyond our control.
              </li>
              <li>
                Title and risk of loss for products pass to you upon delivery.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              6. Returns and refunds
            </h2>
            <p>
              Returns and refunds are governed by our{" "}
              <Link
                href="/policies#return-refund"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Refund and Return Policy
              </Link>
              . Please review it for detailed information.
            </p>
            <p>
              You must follow the procedures outlined in our Refund and Return
              Policy to initiate a return or refund.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              7. Intellectual property
            </h2>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                All content on our website, including text, images, logos, and
                other media, is protected by intellectual property laws and
                belongs to Mithu Mobile Center or its licensors.
              </li>
              <li>
                You may not use our content without our express written
                permission, except as permitted by law.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              8. User conduct
            </h2>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                You agree not to use our website for any illegal or unauthorized
                purpose.
              </li>
              <li>
                You must not engage in any activity that disrupts or harms our
                website or other users.
              </li>
              <li>
                We reserve the right to monitor user activity and take action if
                we suspect violations of these Terms.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              9. Disclaimer of warranties and limitation of liability
            </h2>
            <p>
              Our website is provided “as is” without any warranties, express or
              implied. We do not guarantee the accuracy or completeness of our
              content.
            </p>
            <p>
              To the extent permitted by law, we disclaim all liability for any
              damages resulting from your use of our website or products.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              10. Indemnification
            </h2>
            <p>
              You agree to indemnify and hold harmless Mithu Mobile Center, its
              affiliates, employees, and agents from any claims, damages, or
              losses arising from your use of our website or violation of these
              Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              11. Governing law
            </h2>
            <p>
              These Terms are governed by and interpreted in accordance with the
              laws of West Bengal, India, without regard to conflict-of-law
              principles.
            </p>
            <p>
              Any disputes arising from these Terms or your use of our website
              must be resolved in the courts located in Kolkata, West Bengal,
              India.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              12. Changes to terms and conditions
            </h2>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                We may update these Terms at any time without prior notice. We
                will post any changes on this page.
              </li>
              <li>
                By continuing to use our website after changes are posted, you
                agree to the updated Terms.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              13. Contact information
            </h2>
            <p>
              If you have any questions or concerns about these Terms and
              Conditions, please contact us at:
            </p>
            <ul className="mt-3 space-y-2 border-l-2 border-border pl-4">
              <li>
                <span className="text-muted-foreground">Email: </span>
                <Link
                  href={`mailto:${contactEmail}`}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  {contactEmail}
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground">Phone: </span>
                <a
                  href={contactPhoneTel}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  {contactPhone}
                </a>
              </li>
              <li>
                <span className="text-muted-foreground">Address: </span>
                {contactAddress}
              </li>
            </ul>
          </section>

          <p className="pt-4 text-sm text-muted-foreground">
            <Link
              href="/policies"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Back to all policies
            </Link>
          </p>
        </div>
      </article>
    </main>
  )
}
