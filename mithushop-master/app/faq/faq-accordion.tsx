"use client"

import { faqConfig } from "@/config/faq"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FaqAccordion() {
  return (
    <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Accordion defaultValue={[]} className="px-1 sm:px-2">
        {faqConfig.items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="px-4 py-4 text-base font-semibold hover:no-underline sm:px-5">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-[15px] leading-relaxed text-muted-foreground sm:px-5">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
