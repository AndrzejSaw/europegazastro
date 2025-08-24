import * as React from "react";
import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

interface Props {
  to: number;
  className?: string;
  suffix?: string;
}

export default function AnimatedCounter({ to, className, suffix = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView && ref.current) {
      const controls = animate(0, to, {
        duration: 2, // Длительность анимации в секундах
        ease: "easeOut",
        onUpdate(value) {
          if (ref.current) {
            ref.current.textContent = Math.round(value).toString() + suffix;
          }
        },
      });
      return () => controls.stop();
    }
  }, [isInView, to, suffix]);

  return <span ref={ref} className={className}>0{suffix}</span>;
}
