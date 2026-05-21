import type { Metadata } from "next"
import Link from "next/link"

import { site } from "@/config/site"

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Shipping procedures, carriers, rates, and delivery information for Yuvraj-e-com Mobile Center.",
}

const contactEmail = site.contact.email
const contactPhone = site.contact.phone
const contactPhoneTel = site.contact.phoneTel
const contactAddress = site.contact.address

/** Business days to process an order after it is received. */
const orderProcessingDaysMin = 1
const orderProcessingDaysMax = 2

const carriersDescription =
  "Delhivery, Blue Dart, India Post, and other trusted logistics partners"

const domesticRegions = "India (all states and union territories)"

const domesticStandardDaysMin = 5
const domesticStandardDaysMax = 8
const domesticExpeditedDaysMax = 4

const internationalDaysMin = 10
const internationalDaysMax = 21

/** Days to report damaged delivery after receipt. */
const damagedReportDays = 7

export default function ShippingPolicyPage() {
  return (
    <main className="flex flex-1 flex-col px-4 py-10 sm:py-14">
      <article className="mx-auto w-full max-w-3xl text-foreground">
        <h1 className="mb-8 text-center text-3xl font-semibold tracking-tight">
          Shipping Policy
        </h1>

        <div className="space-y-10 text-[15px] leading-relaxed text-foreground/90">
          <section className="space-y-4">
            <p>
              Thank you for visiting Yuvraj-e-com Mobile Center. We aim to provide a
              smooth and reliable shipping experience for our customers. This
              policy outlines our shipping procedures, options, and other key
              information. Payment methods available for your order are shown at
              checkout.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              1. Order processing time
            </h2>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                Orders are typically processed within{" "}
                {`${orderProcessingDaysMin}–${orderProcessingDaysMax}`} business
                days after they are received.
              </li>
              <li>
                We do not process orders on weekends or public holidays.
              </li>
              <li>
                If there are delays in processing your order, we will notify you
                via email or phone.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              2. Shipping methods and carriers
            </h2>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                We offer various shipping methods, including standard and
                expedited options. You can select your preferred shipping method
                at checkout.
              </li>
              <li>
                We work with reputable carriers such as {carriersDescription}{" "}
                to ensure safe and timely delivery of your orders.
              </li>
              <li>
                Shipping times vary based on your location and selected shipping
                method.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              3. Shipping rates
            </h2>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                Shipping rates are calculated based on the weight of the items,
                shipping destination, and selected shipping method.
              </li>
              <li>
                The shipping cost will be displayed at checkout before you
                confirm your order.
              </li>
              <li>
                Additional charges, such as customs duties or taxes, may apply
                for international shipments. These costs are the responsibility
                of the customer.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              4. Domestic shipping
            </h2>
            <ul className="list-disc space-y-3 pl-5">
              <li>We ship to addresses within {domesticRegions}.</li>
              <li>
                Standard shipping typically takes{" "}
                {`${domesticStandardDaysMin}–${domesticStandardDaysMax}`}{" "}
                business days. Expedited shipping typically takes up to{" "}
                {domesticExpeditedDaysMax} business days after dispatch,
                depending on carrier and destination.
              </li>
              <li>
                Delivery times are estimates and cannot be guaranteed. We are
                not responsible for delays caused by the carrier or other factors
                beyond our control.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              5. International shipping
            </h2>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                We offer international shipping to selected countries. Please
                check at checkout to see if we ship to your location.
              </li>
              <li>
                International shipments may incur customs duties, taxes, or other
                charges upon arrival in the destination country. These costs are
                the responsibility of the customer.
              </li>
              <li>
                International shipping times vary, typically taking{" "}
                {`${internationalDaysMin}–${internationalDaysMax}`} business days.
                Delivery may be delayed due to customs clearance and other
                factors.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              6. Order tracking
            </h2>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                Once your order is shipped, you will receive an email with a
                tracking number and a link to track your shipment.
              </li>
              <li>
                Tracking information may take up to 24 hours to update after
                shipping.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              7. Shipping restrictions
            </h2>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                We cannot ship to P.O. Boxes, military addresses, or other
                restricted locations.
              </li>
              <li>
                Certain products may be restricted from shipping to specific
                regions or countries due to regulations or carrier restrictions.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              8. Damaged or lost shipments
            </h2>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                If your order arrives damaged, please contact us within{" "}
                {damagedReportDays} days with photos and a description of the
                damage.
              </li>
              <li>
                If your order is lost in transit, contact us, and we will work
                with the carrier to locate your shipment or process a
                replacement/refund.
              </li>
            </ul>
          </section>

          <section className="space-y-4 rounded-xl border border-border bg-muted/30 px-5 py-6">
            <h2 className="text-xl font-semibold text-foreground">9. Contact us</h2>
            <p>
              If you have any questions about our Shipping Policy or need
              assistance with a shipment, please contact us at:
            </p>
            <ul className="mt-2 space-y-2 border-l-2 border-border pl-4">
              <li>
                <span className="text-muted-foreground">Email: </span>
                <a
                  href={`mailto:${contactEmail}`}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  {contactEmail}
                </a>
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

          <p className="text-sm text-muted-foreground">
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
