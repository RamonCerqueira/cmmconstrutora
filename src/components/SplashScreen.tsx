'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check session storage so it only displays once per session
    const hasSeenSplash = sessionStorage.getItem('cmm_has_seen_splash');
    if (hasSeenSplash === 'true') {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('cmm_has_seen_splash', 'true');
    }, 3800); // Wait 3.8 seconds for animation

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-primary"
        >
          <div className="relative w-80 h-96 flex flex-col items-center justify-center">
            {/* Immersive SVG building skeleton drawing animation */}
            <svg
              viewBox="0 0 200 240"
              fill="none"
              className="w-48 h-56 mb-8 text-accent"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ground level foundation */}
              <motion.line
                x1="20"
                y1="220"
                x2="180"
                y2="220"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />

              {/* Vertical Columns - erguendo o edifício */}
              {/* Left main column */}
              <motion.line
                x1="50"
                y1="220"
                x2="50"
                y2="40"
                stroke="currentColor"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.5, duration: 1.5, ease: 'easeInOut' }}
              />
              {/* Middle main column */}
              <motion.line
                x1="100"
                y1="220"
                x2="100"
                y2="20"
                stroke="currentColor"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.7, duration: 1.6, ease: 'easeInOut' }}
              />
              {/* Right main column */}
              <motion.line
                x1="150"
                y1="220"
                x2="150"
                y2="40"
                stroke="currentColor"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.6, duration: 1.5, ease: 'easeInOut' }}
              />

              {/* Horizontal Beams - vigas estruturais */}
              {/* Floor 1 */}
              <motion.line
                x1="50"
                y1="180"
                x2="150"
                y2="180"
                stroke="currentColor"
                strokeWidth="2.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.2, duration: 0.8, ease: 'easeOut' }}
              />
              {/* Floor 2 */}
              <motion.line
                x1="50"
                y1="140"
                x2="150"
                y2="140"
                stroke="currentColor"
                strokeWidth="2.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.6, duration: 0.8, ease: 'easeOut' }}
              />
              {/* Floor 3 */}
              <motion.line
                x1="50"
                y1="100"
                x2="150"
                y2="100"
                stroke="currentColor"
                strokeWidth="2.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 2.0, duration: 0.8, ease: 'easeOut' }}
              />
              {/* Floor 4 / Roof */}
              <motion.line
                x1="50"
                y1="60"
                x2="150"
                y2="60"
                stroke="currentColor"
                strokeWidth="2.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 2.4, duration: 0.8, ease: 'easeOut' }}
              />

              {/* Crane - guindaste no topo erguendo o bloco */}
              <motion.path
                d="M 100 20 L 100 10 L 140 10 L 140 30"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.0, duration: 1.2, ease: 'easeInOut' }}
              />

              {/* Structural Cross Bracings (Engenharia de alta estabilidade) */}
              <motion.line
                x1="50"
                y1="180"
                x2="100"
                y2="140"
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.8, duration: 0.5 }}
              />
              <motion.line
                x1="100"
                y1="180"
                x2="50"
                y2="140"
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.9, duration: 0.5 }}
              />
              <motion.line
                x1="100"
                y1="140"
                x2="150"
                y2="100"
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 2.2, duration: 0.5 }}
              />
              <motion.line
                x1="150"
                y1="140"
                x2="100"
                y2="100"
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 2.3, duration: 0.5 }}
              />

              {/* Glowing window dots showing completed floors */}
              <motion.circle
                cx="75"
                cy="200"
                r="3"
                fill="currentColor"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.9 }}
                transition={{ delay: 1.5, duration: 0.4 }}
              />
              <motion.circle
                cx="125"
                cy="200"
                r="3"
                fill="currentColor"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.9 }}
                transition={{ delay: 1.6, duration: 0.4 }}
              />
              <motion.circle
                cx="75"
                cy="160"
                r="3"
                fill="currentColor"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.9 }}
                transition={{ delay: 2.0, duration: 0.4 }}
              />
              <motion.circle
                cx="125"
                cy="160"
                r="3"
                fill="currentColor"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.9 }}
                transition={{ delay: 2.1, duration: 0.4 }}
              />
            </svg>

            {/* Logo Text and branding */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.6, duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-3xl font-heading font-extrabold tracking-wider text-white">
                CMM <span className="text-accent">CONSTRUTORA</span>
              </h1>
              <p className="mt-2 text-xs font-sans tracking-[0.25em] text-gray-400 uppercase">
                Construindo o futuro com excelência
              </p>
            </motion.div>

            {/* Glowing blur background highlight */}
            <div className="absolute inset-0 -z-10 bg-accent/5 rounded-full blur-[100px] w-72 h-72 animate-pulse" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
