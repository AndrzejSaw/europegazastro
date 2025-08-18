import * as React from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

export default function FaqIsland() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          What types of cargo do you transport?
        </AccordionTrigger>
        <AccordionContent>
          We specialize in a wide range of cargo, including general goods, refrigerated products, and oversized loads. Our fleet is equipped to handle various transportation needs across Europe.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger>
          What are the requirements for drivers?
        </AccordionTrigger>
        <AccordionContent>
          We are looking for professional drivers with a valid CE license, a digital tachograph card, and proven experience in international transport. A commitment to safety and reliability is essential.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger>
          How can I track my shipment?
        </AccordionTrigger>
        <AccordionContent>
          All our trucks are equipped with modern GPS tracking systems. Clients receive access to a portal where they can monitor the location of their cargo in real-time, 24/7.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
