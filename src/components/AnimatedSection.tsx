import * as React from "react"
import { motion } from "framer-motion"

export default function AnimatedSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 150 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  )
}
