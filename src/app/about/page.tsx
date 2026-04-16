import React from 'react';
import Navbar from '@/components/layout/Navbar';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-32 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-white mb-12 text-center">About NEXUS</h1>
        <div className="max-w-4xl mx-auto space-y-12 text-gray-300 relative z-10 p-6 md:p-12 glass rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md">
          <section className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
            <p className="text-lg leading-relaxed">
              We built NEXUS because navigating early career steps is too confusing. You're expected to know exactly what companies want, but no one gives you a straight answer. We decided to fix that by building a platform that breaks down real job requirements and tells you exactly where you stand.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-indigo-400 mb-4">The Problem</h3>
              <p className="leading-relaxed">
                Students waste time applying to jobs they aren't ready for, or worse, they miss out on great roles because they didn't know they needed one specific skill.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Our Solution</h3>
              <p className="leading-relaxed">
                We take the guesswork out of the picture. Our tools analyze your current skills against what companies actually hire for, giving you a clear roadmap to employment.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}