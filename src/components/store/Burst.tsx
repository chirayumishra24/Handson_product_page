"use client";
import { motion, useReducedMotion } from "framer-motion";

const COLORS = ["#2fbf71", "#ffc83d", "#ff5c9a", "#3da5ff", "#8b6cff", "#ff8a3d"];
const PIECES = 14;

// A small confetti pop from the centre of its (relative) parent.
// Increment `fire` to replay it; 0 renders nothing.
export default function Burst({ fire }: { fire: number }) {
  const reduce = useReducedMotion();
  if (!fire || reduce) return null;

  return (
    <span key={fire} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-visible">
      {Array.from({ length: PIECES }, (_, i) => {
        const angle = (i / PIECES) * Math.PI * 2 + (fire % 3) * 0.4;
        const dist = 46 + ((i * 37) % 28);
        return (
          <motion.span
            key={i}
            className={`absolute left-1/2 top-1/2 h-2.5 w-2.5 ${i % 3 === 0 ? "rounded-sm" : "rounded-full"}`}
            style={{ backgroundColor: COLORS[i % COLORS.length], marginLeft: -5, marginTop: -5 }}
            initial={{ x: 0, y: 0, scale: 0.4, opacity: 1, rotate: 0 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist - 10,
              scale: 1,
              opacity: 0,
              rotate: 180,
            }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          />
        );
      })}
    </span>
  );
}
