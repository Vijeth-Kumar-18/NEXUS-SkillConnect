"use client";

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
                  <a href={`mailto:${contact.email}`} className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors w-max">{contact.email}</a>
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
}