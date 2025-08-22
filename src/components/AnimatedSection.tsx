import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: 'light' | 'dark' | 'green' | 'yellow' | 'transparent';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}

const backgroundVariants = {
  light: 'bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300/100',
  dark: 'bg-gradient-to-br from-gray-200 to-gray-300 border border-gray-300/50',
  green: 'bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20',
  yellow: 'bg-gradient-to-br from-secondary/10 to-secondary/20 border border-secondary/20',
  transparent: 'bg-transparent'
};

const paddingVariants = {
  sm: 'py-8 px-4',
  md: 'py-12 px-6',
  lg: 'py-16 px-8',
  xl: 'py-20 px-12'
};

export default function AnimatedSection({ 
  children, 
  className = '', 
  delay = 0, 
  variant = 'transparent',
  padding = 'md'
}: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const backgroundClass = backgroundVariants[variant];
  const paddingClass = paddingVariants[padding];

  return (
    <motion.section
      ref={ref}
      className={`${backgroundClass} ${paddingClass} ${className} rounded-2xl mb-8`}
      initial={{ 
        opacity: 0, 
        y: 50, 
        scale: 0.95,
        filter: "blur(5px)" 
      }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        filter: "blur(0px)",
        transition: {
          duration: 0.5,
          delay: delay,
          ease: [0.21, 1.11, 0.81, 0.99]
        }
      } : {}}
    >
      {children}
    </motion.section>
  );
}
