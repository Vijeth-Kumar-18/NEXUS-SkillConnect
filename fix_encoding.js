const fs = require('fs');

const about = `import React from 'react';
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
              We built NEXUS because navigating early career steps is too confusing. You are expected to know exactly what companies want, but no one gives you a straight answer. We decided to fix that by building a platform that breaks down real job requirements and tells you exactly where you stand.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-indigo-400 mb-4">The Problem</h3>
              <p className="leading-relaxed">
                Students waste time applying to jobs they are not ready for, or worse, they miss out on great roles because they didn't know they needed one specific skill.
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
}`;

const contact = `import React from 'react';
import Navbar from '@/components/layout/Navbar';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-32 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-white mb-12 text-center">Contact Us</h1>
        <div className="max-w-4xl mx-auto space-y-12 text-gray-300 relative z-10 p-6 md:p-12 glass rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md w-full">
          <section className="text-center">
            <p className="text-lg leading-relaxed">
              Have questions about how NEXUS can help you get hired? Let's talk. We are here to help you navigate your career options and make sense of the skills you need.
            </p>
          </section>
          <section className="text-center mt-8">
            <h3 className="text-xl font-bold text-indigo-400 mb-4">Get in Touch</h3>
            <p className="leading-relaxed">
              Email us at info@nexusplacements.com or give us a call at (555) 123-4567.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}`;

const privacy = `import React from 'react';
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
}`;

fs.writeFileSync('C:/Users/Shash/OneDrive/Desktop/BDA/BigData/src/app/about/page.tsx', about, 'utf8');
fs.writeFileSync('C:/Users/Shash/OneDrive/Desktop/BDA/BigData/src/app/contact/page.tsx', contact, 'utf8');
fs.writeFileSync('C:/Users/Shash/OneDrive/Desktop/BDA/BigData/src/app/privacy/page.tsx', privacy, 'utf8');

console.log('Fixed encoding and content for about, contact, and privacy pages.');
