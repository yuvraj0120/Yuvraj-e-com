import Link from "next/link"

import { site } from "@/config/site"

const { email: contactEmail, phone: contactPhone, phoneTel: contactPhoneTel } =
  site.contact
const returnAddress = site.contact.address

/** Return window from delivery; refund timeline after approval. */
const returnDays = 30
const refundBusinessDaysMin = 7
const refundBusinessDaysMax = 14

export default function PoliciesPage() {
  return (
    <main className="flex flex-1 flex-col px-4 py-10 sm:py-14">
      <article className="mx-auto w-full max-w-3xl text-foreground">
        <h1 className="mb-8 text-center text-3xl font-semibold tracking-tight">
          Website Policies
        </h1>

        <div className="space-y-10 text-[15px] leading-relaxed text-foreground/90">
          <section id="return-refund" className="scroll-mt-24 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Refund and Return Policy
              </h2>
              <h3 className="mt-6 text-lg font-semibold text-foreground">
                Overview
              </h3>
              <p className="mt-3">
                At mithumobilecente, we want you to be completely satisfied with
                your purchase. If you are not entirely satisfied, we&apos;re here
                to help. This policy outlines the guidelines and procedures for
                returns, refunds, and exchanges.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Returns</h3>
              <ul className="list-disc space-y-3 pl-5">
                <li>
                  You have {returnDays} days to return an item from the date you
                  received it.
                </li>
                <li>
                  To be eligible for a return, your item must be unused and in
                  the same condition that you received it.
                </li>
                <li>Your item must be in the original packaging.</li>
                <li>You must provide a receipt or proof of purchase.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Refunds</h3>
              <ul className="list-disc space-y-3 pl-5">
                <li>
                  Once we receive your item, we will inspect it and notify you of
                  the status of your refund.
                </li>
                <li>
                  If your return is approved, we will initiate a refund to your
                  original method of payment.
                </li>
                <li>
                  Refund processing times may vary, but typically you can expect
                  your refund within{" "}
                  {`${refundBusinessDaysMin}–${refundBusinessDaysMax}`} business
                  days (depending on your bank or card issuer).
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Exchanges
              </h3>
              <ul className="list-disc space-y-3 pl-5">
                <li>
                  If you received a defective or damaged item, we can replace it
                  with the same item, provided it is in stock.
                </li>
                <li>
                  If you would like to exchange your item for a different one,
                  the item must be in original condition and the same rules for
                  returns apply.
                </li>
                <li>
                  Contact our customer service team to arrange exchanges:{" "}
                  <Link
                    className="font-medium text-primary underline-offset-4 hover:underline"
                    href={`mailto:${contactEmail}`}
                  >
                    {contactEmail}
                  </Link>{" "}
                  or{" "}
                  <a
                    href={contactPhoneTel}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {contactPhone}
                  </a>
                  .
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Shipping costs
              </h3>
              <ul className="list-disc space-y-3 pl-5">
                <li>
                  You are responsible for paying for your own shipping costs for
                  returning your item.
                </li>
                <li>
                  Shipping costs are non-refundable. If you receive a refund, the
                  cost of return shipping will be deducted from your refund.
                </li>
                <li>
                  If we sent you the wrong item or a defective product, we will
                  cover the return shipping costs.
                </li>
              </ul>
              <p className="text-muted-foreground">
                Mail returns to: {returnAddress}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Non-returnable items
              </h3>
              <p>Some items are exempt from being returned, including:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Gift cards</li>
                <li>Downloadable software products</li>
                <li>Certain health and personal care items</li>
                <li>Perishable goods</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                How to start a return
              </h3>
              <ul className="list-disc space-y-3 pl-5">
                <li>
                  To start a return, contact our customer service team at{" "}
                  <Link
                    className="font-medium text-primary underline-offset-4 hover:underline"
                    href={`mailto:${contactEmail}`}
                  >
                    {contactEmail}
                  </Link>{" "}
                  or{" "}
                  <a
                    href={contactPhoneTel}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {contactPhone}
                  </a>
                  .
                </li>
                <li>
                  Provide your order number, item details, and reason for the
                  return.
                </li>
                <li>
                  Follow the instructions given by our team for shipping your
                  item back.
                </li>
              </ul>
            </div>

            <div className="space-y-4 rounded-xl border border-border bg-muted/30 px-5 py-6">
              <h3 className="text-lg font-semibold text-foreground">
                Contact us
              </h3>
              <p>
                If you have any questions about our Refund and Return Policy,
                contact us at:
              </p>
              <ul className="mt-2 space-y-2 border-l-2 border-border pl-4">
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
                  {returnAddress}
                </li>
              </ul>
            </div>
          </section>

          <section id="shipping-payment" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Shipping &amp; payment
            </h2>
            <p>
              Our Shipping Policy covers processing times, carriers, rates,
              domestic and international delivery, tracking, restrictions, and
              what to do if a shipment is damaged or lost. Payment options for
              your order are shown at checkout.
            </p>
            <p>
              <Link
                className="font-medium text-primary underline-offset-4 hover:underline"
                href="/policies/shipping"
              >
                Read the full Shipping Policy
              </Link>
            </p>
          </section>

          <section id="terms" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Terms &amp; conditions
            </h2>
            <p>
              Our full Terms and Conditions describe how you may use our
              website, place orders, and your rights and responsibilities. They
              work together with our Privacy Policy and product-specific terms.
            </p>
            <p>
              <Link
                className="font-medium text-primary underline-offset-4 hover:underline"
                href="/policies/terms"
              >
                Read the full Terms and Conditions
              </Link>
            </p>
          </section>

          <section id="privacy" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Privacy policy
            </h2>
            <p>
              Our Privacy Policy explains how we collect, use, store, and share
              your information when you use our website and services, and your
              rights under applicable law.
            </p>
            <p>
              <Link
                className="font-medium text-primary underline-offset-4 hover:underline"
                href="/policies/privacy"
              >
                Read the full Privacy Policy
              </Link>
            </p>
          </section>

          <section className="rounded-xl border border-border bg-muted/30 px-5 py-6">
            <h2 className="text-xl font-semibold text-foreground">Need help?</h2>
            <p className="mt-2">
              For questions about privacy, shipping, or other policies, contact
              us at{" "}
              <Link
                className="font-medium text-primary underline-offset-4 hover:underline"
                href={`mailto:${contactEmail}`}
              >
                {contactEmail}
              </Link>
              .
            </p>
          </section>
        </div>
      </article>
    </main>
  )
}
