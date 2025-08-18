import { motion, MotionConfig } from "framer-motion"

export default function AnimatedCta() {
  return (
    <MotionConfig reducedMotion="never">
      <motion.span
        key="cta"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="inline-block text-sm text-muted-foreground"
      >
        Быстрая доставка по всей Европе
      </motion.span>
    </MotionConfig>
  )
}
