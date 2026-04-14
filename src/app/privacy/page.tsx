import React from 'react';
import Navbar from '@/components/layout/Navbar';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-32 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-white mb-12 text-center">Privacy Policy</h1>
        <div className="max-w-4xl mx-auto space-y-12 text-gray-300 relative z-10 p-6 md:p-12 glass rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md w-full">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Your Data, Your Control</h2>
            <p className="text-lg leading-relaxed">
              We believe your data belongs to you. NEXUS collects information about your academic history and projects solely to match you with the best career opportunities. We don't sell your data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Info</h2>
            <p className="leading-relaxed">
              Your uploaded resume, project links, and test scores are used exclusively to build your skill graph. This helps our algorithms suggest relevant job roles and learning roadmaps tailored just for you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Security Measures</h2>
            <p className="leading-relaxed">
              We use industry-standard encryption to protect your profile. You can delete your account and all associated data at any time from your settings page.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}