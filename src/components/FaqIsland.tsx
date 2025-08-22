import * as React from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

interface FaqItem {
  question: string
  answer: string
}

interface FaqIslandProps {
  items: FaqItem[]
}

export default function FaqIsland({ items }: FaqIslandProps) {
  return (
    <Accordion type="single" collapsible>
      {items.map((item, index) => (
        <AccordionItem key={`item-${index + 1}`} value={`item-${index + 1}`}>
          <AccordionTrigger>
            {item.question}
          </AccordionTrigger>
          <AccordionContent>
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
