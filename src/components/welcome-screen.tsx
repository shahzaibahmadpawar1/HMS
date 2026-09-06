"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function WelcomeScreen() {
  const [show, setShow] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [Icon, setIcon] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSeen = sessionStorage.getItem("hasSeenWelcome");
    if (!hasSeen) {
      setShow(true);
      
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting("GOOD MORNING");
        setIcon(() => Sun);
      } else if (hour >= 12 && hour < 17) {
        setGreeting("GOOD AFTERNOON");
        setIcon(() => Sun);
      } else {
        setGreeting("GOOD EVENING");
        setIcon(() => Moon);
      }
    }
  }, []);

  const handleDismiss = () => {
    setShow(false);
    sessionStorage.setItem("hasSeenWelcome", "true");
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleDismiss}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#171b36] bg-gradient-to-br from-[#1b2049] via-[#161836] to-[#0e0f21] text-white cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -10 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col items-center space-y-4"
          >
            {Icon && (
              <motion.div
                initial={{ rotate: -20, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Icon className="w-12 h-12 text-[#ffb74d] mb-4 fill-[#ffb74d]" strokeWidth={1.5} />
              </motion.div>
            )}
            <motion.h2
              initial={{ opacity: 0, letterSpacing: "0em" }}
              animate={{ opacity: 1, letterSpacing: "0.2em" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-sm font-semibold text-indigo-300 uppercase tracking-widest"
            >
              {greeting}
            </motion.h2>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-4xl sm:text-5xl md:text-5xl font-bold tracking-tight text-white/95 pb-4"
            >
              Welcome back, DOCTOR
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="pt-8 flex flex-col items-center gap-3"
            >
              <p className="text-sm text-slate-400/80 tracking-wide">Tap anywhere to continue</p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "3rem" }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="h-0.5 bg-indigo-500/50 rounded-full"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
