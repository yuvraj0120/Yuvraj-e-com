import { site } from "@/config/site"

export type FaqItem = {
  id: string
  question: string
  answer: string
}

export const faqConfig = {
  title: "Frequently Asked Questions",
  items: [
    {
      id: "products",
      question: "What type of products do you sell?",
      answer:
        "We sell popular, 7a quality products that are trending in the market at most affordable prices.",
    },
    {
      id: "courier",
      question: "Which courier company do you use?",
      answer: "ShipRocket.",
    },
    {
      id: "wrong-damaged",
      question: "What if I receive a wrong / damaged / defective product?",
      answer:
        "You need to share a proper unboxing video of the parcel if you claim a wrong or damaged product as soon as it is delivered to you. For a defective product, you need to report it within the specified warranty period of 24 hours.",
    },
    {
      id: "dispatch",
      question: "When will my order be dispatched?",
      answer:
        "Your order will be dispatched the next day if it is placed from Sunday to Friday. If you place your order on Saturday, it will be dispatched on Monday. This does not apply on public and regional holidays.",
    },
    {
      id: "contact",
      question: "How can I contact you?",
      answer: `Email us at ${site.contact.email}, call ${site.contact.phone}, or visit ${site.contact.address}.`,
    },
  ] satisfies FaqItem[],
} as const
