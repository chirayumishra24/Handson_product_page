"use client";
import { MotionConfig } from "framer-motion";

// Every motion component in the tree falls back to instant changes when the
// visitor has asked their OS for reduced motion.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
