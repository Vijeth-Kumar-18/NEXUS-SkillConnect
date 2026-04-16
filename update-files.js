const fs = require('fs');

const pageContent = `"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import EntryLoader from "@/components/common/EntryLoader";
import { useState, useEffect } from "react";

const CAROUSEL_IMAGES = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1770&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1770&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1770&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1769&auto=format&fit=crop"
];

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 4500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <>
      {loading && <EntryLoader />}
      
      {!loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex-1 flex flex-col bg-black overflow-hidden"
        >
          {/* Hero Section with Background Carousel - DRASTICALLY LIGHTER OVERLAY */}
          <div className="relative w-full min-h-[95vh] flex flex-col items-center justify-center pt-28 px-6">
            <div className="absolute inset-0 overflow-hidden z-0">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={CAROUSEL_IMAGES[currentIndex]}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Background"
                />
              </AnimatePresence>
              {/* Very minimal overlay, images fully visible */}
              <div className="absolute inset-0 bg-black/10 bg-gradient-to-t from-black via-transparent to-black/30 z-10" />
            </div>

            {/* Centralized Glassmorphism Panel to keep text readable against bright images */}
            <div className="relative z-20 w-full max-w-5xl mx-auto flex flex-col items-center text-center mt-10 mb-20 p-10 md:p-14 rounded-[3rem] glass border border-white/20 bg-black/40 backdrop-blur-md shadow-2xl">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-400/30 bg-indigo-500/20 text-indigo-200 text-sm font-bold mb-8"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Introducing NEXUS Matching
              </motion.div>

              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight drop-shadow-2xl"
              >
                Connect Ambition with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-300 to-indigo-300 drop-shadow-lg">Opportunity.</span>
              </motion.h1>

              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg md:text-2xl text-gray-100 max-w-3xl mb-12 font-medium drop-shadow-lg"
              >
                We map your skills against what top companies actually want. Drop the guesswork and start building a profile that gets you hired.
              </motion.p>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/register" className="px-8 py-4 rounded-xl font-bold bg-white text-black hover:bg-gray-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95">
                  Start Building Profile
                </Link>
                <Link href="/login" className="px-8 py-4 rounded-xl font-bold border border-white/50 text-white bg-black/30 hover:bg-white/20 transition-all backdrop-blur-md active:scale-95">
                  Access Dashboard
                </Link>
              </motion.div>

              <div className="flex gap-3 mt-16 pb-4">
                {CAROUSEL_IMAGES.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentIndex(i)}
                    className={\`h-1.5 rounded-full transition-all \${i === currentIndex ? 'bg-white w-8 shadow-[0_0_10px_rgba(255,255,255,0.9)]' : 'bg-white/40 w-2 hover:bg-white/80'}\`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Target Tracks / Skills Grid instead of boring paragraphs */}
          <section className="w-full max-w-7xl mx-auto px-6 py-20 relative z-10 -mt-10">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Popular Career Tracks</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { role: "Software Engineer", skills: ["React", "Node.js", "System Design"] },
                { role: "Data Scientist", skills: ["Python", "SQL", "Machine Learning"] },
                { role: "Product Manager", skills: ["Agile", "Roadmapping", "Strategy"] },
                { role: "UX Researcher", skills: ["Figma", "Wireframing", "User Testing"] }
              ].map((track, i) => (
                <div key={i} className="glass border border-white/10 bg-white/[0.02] p-6 rounded-2xl hover:bg-white/[0.05] transition-all cursor-default">
                  <h4 className="text-lg font-bold text-cyan-400 mb-3">{track.role}</h4>
                  <div className="flex flex-wrap gap-2">
                    {track.skills.map((skill, j) => (
                      <span key={j} className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-300 border border-white/10">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Interactive Steps With Visual Icons & Detailed Features */}
          <section className="w-full max-w-7xl mx-auto px-6 pb-24 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
              <p className="text-gray-400">Your journey from student to hired professional</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { title: "1. Build Profile", detail: "Connect GitHub, upload resume", icon: "📄" },
                { title: "2. Analyze Gaps", detail: "AI maps you to job reqs", icon: "🔍" },
                { title: "3. Learn Target Skills", detail: "Follow custom course pathways", icon: "📚" },
                { title: "4. Apply Confidently", detail: "Get referred by top alumni", icon: "🚀" }
              ].map((step, i) => (
                <div key={i} className="text-center flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full glass border border-white/10 bg-indigo-500/10 flex items-center justify-center text-4xl mb-6 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.detail}</p>
                </div>
              ))}
            </div>
          </section>

        </motion.div>
      )}
    </>
  );
}`;

const registerContent = `"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center relative overflow-hidden bg-black pt-28 pb-20">
      <div className="absolute inset-0 bg-dot-white/[0.05] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col md:flex-row gap-12 items-center">
        {/* Marketing Side */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-1/2 flex flex-col items-start"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Detailed Profile, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Better Matches.</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            NEXUS requires authentic details to perfectly align your current academic standing, projects, and target career roles with real market data.
          </p>
          
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="glass p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="text-2xl mb-2">🎓</div>
              <h4 className="text-white font-bold text-sm">Academic Sync</h4>
              <p className="text-xs text-gray-400 mt-1">Direct tie to university alumni.</p>
            </div>
            <div className="glass p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="text-2xl mb-2">💻</div>
              <h4 className="text-white font-bold text-sm">Code Analytics</h4>
              <p className="text-xs text-gray-400 mt-1">Live GitHub repo scraping.</p>
            </div>
            <div className="glass p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="text-white font-bold text-sm">Target Roles</h4>
              <p className="text-xs text-gray-400 mt-1">Specify where you want to go.</p>
            </div>
            <div className="glass p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="text-white font-bold text-sm">Skill Gap Graph</h4>
              <p className="text-xs text-gray-400 mt-1">Visual map of what you lack.</p>
            </div>
          </div>
        </motion.div>

        {/* Detailed Form Side */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-1/2"
        >
          <div className="w-full glass p-8 md:p-10 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Create Account</h2>
              <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">Step {step}/2</span>
            </div>

            <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); if (step === 1) setStep(2); else window.location.href = '/dashboard'; }}>
              {step === 1 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">First Name</label>
                      <input type="text" required placeholder="Jane" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Last Name</label>
                      <input type="text" required placeholder="Doe" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">University Email</label>
                    <input type="email" required placeholder="jane.doe@university.edu" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Current Degree</label>
                      <select required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm appearance-none">
                        <option value="">Select...</option>
                        <option value="bachelors">Bachelors (B.S. / B.A.)</option>
                        <option value="masters">Masters (M.S.)</option>
                        <option value="phd">Ph.D.</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Expected Grad</label>
                      <select required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm appearance-none">
                        <option value="">Year...</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Create Password</label>
                    <input type="password" required placeholder="••••••••" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm" />
                  </div>
                  
                  <button type="submit" className="w-full py-3.5 mt-2 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                    Continue to Deep Profile →
                  </button>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Target Career Role</label>
                    <select required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all text-sm appearance-none">
                      <option value="">Select your main goal...</option>
                      <option value="swe">Software Engineer (Backend/Frontend)</option>
                      <option value="data">Data Scientist / Analyst</option>
                      <option value="pm">Product Manager</option>
                      <option value="design">UI/UX Designer</option>
                      <option value="cyber">Cybersecurity Analyst</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">GitHub Username (For Auto-Sync)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-gray-500 text-sm">github.com/</span>
                      <input type="text" placeholder="username" className="w-full bg-black/50 border border-white/10 rounded-xl pl-28 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">LinkedIn URL</label>
                    <input type="url" placeholder="https://linkedin.com/in/..." className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all text-sm" />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Current Top Skills (Comma Separated)</label>
                    <input type="text" placeholder="e.g. React, Python, C++, Figma" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all text-sm" />
                  </div>

                  <div className="flex items-start gap-3 mt-2">
                    <input type="checkbox" id="terms" required className="mt-1" />
                    <label htmlFor="terms" className="text-xs text-gray-400 leading-tight">
                      I agree to the Terms of Service and Privacy Policy. I authorize NEXUS to analyze my academic and public repository data to provide career roadmap suggestions.
                    </label>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button type="button" onClick={() => setStep(1)} className="w-1/3 py-3.5 rounded-xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm">
                      Back
                    </button>
                    <button type="submit" className="w-2/3 py-3.5 rounded-xl font-bold text-black bg-cyan-400 hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] text-sm">
                      Build Dashboard
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}`;

const contactContent = `"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto w-full relative z-10 glass p-8 md:p-14 rounded-[3rem] border border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left: Contact Info Info blocks */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Get in Touch</h1>
            <p className="text-lg text-gray-400 mb-12">
              Whether you're a university looking to integrate NEXUS, an enterprise seeking top talent, or a student needing support, our detailed teams are ready to help.
            </p>

            <div className="space-y-6">
              {[
                { title: "University Partnerships", email: "universities@nexus.com", desc: "Integrate our skill gap engine into your CS curriculum." },
                { title: "Enterprise Hiring", email: "talent@nexus.com", desc: "Access our pre-vetted pool of alumni and graduating students." },
                { title: "Student Support", email: "support@nexus.com", desc: "Technical issues, account assistance, or buggy roadmaps." }
              ].map((contact, i) => (
                <div key={i} className="flex flex-col gap-1 p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
                  <h3 className="text-white font-bold text-lg">{contact.title}</h3>
                  <a href={\`mailto:\${contact.email}\`} className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors w-max">{contact.email}</a>
                  <p className="text-sm text-gray-500 mt-1">{contact.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-6 rounded-2xl glass border border-white/10 bg-indigo-500/5">
              <p className="text-white font-medium mb-1">Global Headquarters</p>
              <p className="text-gray-400 text-sm">123 Innovation Drive, Tech District<br/>San Francisco, CA 94105</p>
            </div>
          </motion.div>

          {/* Right: Detailed Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 glass border border-white/10 rounded-[2rem] bg-white/5">
                <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-4xl mb-6">✓</div>
                <h3 className="text-2xl font-bold text-white mb-2">Request Received</h3>
                <p className="text-gray-400">Our team will review your details and route it to the proper department within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="mt-8 text-sm font-bold text-indigo-400 hover:text-indigo-300">Submit Another Query</button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="p-8 md:p-10 rounded-[2rem] glass border border-white/10 bg-white/5">
                <h3 className="text-xl font-bold text-white mb-6">Detailed Inquiry Form</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">First Name</label>
                      <input type="text" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Last Name</label>
                      <input type="text" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                      <input type="email" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Organization / University</label>
                      <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Inquiry Type</label>
                    <select required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm appearance-none">
                      <option value="">Select category...</option>
                      <option value="sales">Enterprise Subscription Request</option>
                      <option value="partner">University Partnership</option>
                      <option value="support">Student Account Support</option>
                      <option value="other">Other Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Subject</label>
                    <input type="text" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm" />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Detailed Message</label>
                    <textarea required rows={4} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm resize-none"></textarea>
                  </div>

                  <button type="submit" className="w-full py-4 mt-2 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                    Send Secure Message
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}`;

fs.writeFileSync('C:/Users/Shash/OneDrive/Desktop/BDA/BigData/src/app/page.tsx', pageContent, 'utf-8');
fs.writeFileSync('C:/Users/Shash/OneDrive/Desktop/BDA/BigData/src/app/register/page.tsx', registerContent, 'utf-8');
fs.writeFileSync('C:/Users/Shash/OneDrive/Desktop/BDA/BigData/src/app/contact/page.tsx', contactContent, 'utf-8');

console.log('Successfully updated page, register, and contact with high-detail interactive components.');