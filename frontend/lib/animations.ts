import type { Variants, Transition } from "framer-motion";

// Standard ease curve — feels like things settling naturally
const easeOutExpo: Transition["ease"] = [0.22, 1, 0.36, 1];

/** Standard page element entrance — fade + slight upward slide */
export const fadeUp: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

export const fadeUpTransition: Transition = {
  duration: 0.48,
  ease: easeOutExpo,
};

/** Overlays, modals — simple opacity */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInTransition: Transition = {
  duration: 0.28,
  ease: "easeOut",
};

/** Drawers, bottom sheets — slide up from bottom */
export const slideUp: Variants = {
  initial: { y: "100%", opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: "100%", opacity: 0 },
};

export const slideUpTransition: Transition = {
  duration: 0.42,
  ease: easeOutExpo,
};

/** Mobile menu — slide in from left */
export const slideRight: Variants = {
  initial: { x: "-100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
};

export const slideRightTransition: Transition = {
  duration: 0.38,
  ease: easeOutExpo,
};

/** Slide in from right — cart drawer */
export const slideLeft: Variants = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "100%", opacity: 0 },
};

export const slideLeftTransition: Transition = {
  duration: 0.38,
  ease: easeOutExpo,
};

/** Product grid stagger container */
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

/** Scale up — search dropdown, tooltips */
export const scaleUp: Variants = {
  initial: { opacity: 0, scale: 0.95, y: -4 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -4 },
};

export const scaleUpTransition: Transition = {
  duration: 0.2,
  ease: "easeOut",
};

/** Checkmark draw animation for order confirmation */
export const drawCheck: Variants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.6, ease: easeOutExpo },
      opacity: { duration: 0.2 },
    },
  },
};

/** Circle draw animation */
export const drawCircle: Variants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.5, ease: easeOutExpo },
      opacity: { duration: 0.15 },
    },
  },
};

/** Pulse animation for delivery tracker current step */
export const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

/** Bell shake animation for new notification */
export const bellShake: Variants = {
  animate: {
    rotate: [0, -15, 15, -10, 10, -5, 5, 0],
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
};
