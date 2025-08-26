"use client";

import { motion } from "motion/react";

export default function FloatingElements() {
  // Generate floating particles
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 4,
  }));

  const healthIcons = [
    // Heart icon
    "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    // Plus/Medical cross
    "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
    // Stethoscope-like circle
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
    // Wellness leaf
    "M12 2l3.09 6.26L22 9l-5.09 3.09L19 22l-7-3.27L5 22l2.09-9.91L2 9l6.91-0.74L12 2z",
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {/* Animated background gradients */}
      <motion.div
        className="absolute top-20 -left-20 w-72 h-72 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-full blur-2xl"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1, 0.8, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/3 -right-20 w-96 h-96 bg-gradient-to-l from-blue-400/25 to-purple-400/25 rounded-full blur-2xl"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.8, 0.6, 0.8],
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="absolute bottom-20 left-1/4 w-64 h-64 bg-gradient-to-tr from-teal-200/20 to-emerald-200/20 rounded-full blur-2xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Floating health icons */}
      {particles.slice(0, 4).map((particle, index) => (
        <motion.div
          key={`icon-${particle.id}`}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
            y: [-20, -40, -60],
            x: [0, Math.random() * 20 - 10, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        >
          <div className="w-8 h-8 text-emerald-400/40">
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path d={healthIcons[index % healthIcons.length]} />
            </svg>
          </div>
        </motion.div>
      ))}

      {/* Floating particles */}
      {particles.slice(4).map((particle) => (
        <motion.div
          key={`particle-${particle.id}`}
          className="absolute rounded-full bg-gradient-to-r from-emerald-500/40 to-teal-500/40"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Pulse rings */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
        initial={{ scale: 1, opacity: 0 }}
        animate={{
          scale: [1, 2.5, 1],
          opacity: [0, 0.6, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-32 h-32 border-2 border-emerald-400/50 rounded-full" />
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
        initial={{ scale: 1, opacity: 0 }}
        animate={{
          scale: [1, 3, 1],
          opacity: [0, 0.4, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <div className="w-24 h-24 border-2 border-teal-400/40 rounded-full" />
      </motion.div>

      {/* Floating medical symbols */}
      <motion.div
        className="absolute top-1/4 left-1/5 z-30"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0, 0.8, 0.6, 0.8],
          scale: [0, 1.2, 1, 1.2],
          y: [0, -15, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="text-emerald-500 text-3xl">💚</div>
      </motion.div>

      <motion.div
        className="absolute top-3/4 right-1/4"
        animate={{
          y: [0, -20, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      >
        <div className="text-teal-400/30 text-2xl">🩺</div>
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-1/6"
        animate={{
          y: [0, -10, 0],
          x: [0, 5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <div className="text-blue-400/30 text-xl">✨</div>
      </motion.div>

      {/* Subtle moving dots */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-2 h-2 bg-emerald-300/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
