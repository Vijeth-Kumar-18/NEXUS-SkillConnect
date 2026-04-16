"use client";

import { motion } from "framer-motion";

export default function TermsOfServicePage() {
  return (
    <div className="flex-1 flex flex-col items-center pt-32 px-6 pb-20 relative bg-black">
      <div className="absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-dot-white/[0.05] pointer-events-none" />

      <div className="max-w-3xl w-full relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-white mb-6 text-center"
        >
          Terms of Service
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 mb-12 text-center"
        >
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert prose-p:text-gray-400 prose-headings:text-white max-w-none space-y-8"
        >
          <section className="glass p-8 rounded-3xl border border-white/10 bg-white/5">
            <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              By accessing and using NEXUS Placement Intelligence, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our platform.
            </p>
          </section>

          <section className="glass p-8 rounded-3xl border border-white/10 bg-white/5">
            <h2 className="text-xl font-bold text-white mb-4">2. User Responsibilities</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate and up-to-date information when building your profile. Fraudulent academic records or falsified skills will result in immediate termination from platform drives.
            </p>
          </section>

          <section className="glass p-8 rounded-3xl border border-white/10 bg-white/5">
            <h2 className="text-xl font-bold text-white mb-4">3. Platform Modifications</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              We reserve the right to modify or discontinue any part of the service without prior notice. We will provide notifications for major architectural changes that significantly impact user flow or data processing.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
