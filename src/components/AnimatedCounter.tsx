import * as React from "react";
import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

interface Props {
  to: number;
  className?: string;
}

export default function AnimatedCounter({ to, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView && ref.current) {
      const controls = animate(0, to, {
        duration: 2, // Длительность анимации в секундах
        ease: "easeOut",
        onUpdate(value) {
          if (ref.current) {
            ref.current.textContent = Math.round(value).toString() + "+";
          }
        },
      });
      return () => controls.stop();
    }
  }, [isInView, to]);

  return <span ref={ref} className={className}>0+</span>;
}
