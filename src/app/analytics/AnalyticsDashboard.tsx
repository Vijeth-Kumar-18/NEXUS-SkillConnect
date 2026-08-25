"use client";

import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from "recharts";
import { motion } from "framer-motion";
import { AnalyticsPayload } from "./page";

const COLORS = ["#818cf8", "#22d3ee", "#a78bfa", "#f472b6", "#34d399", "#fbbf24"];

export default function AnalyticsDashboard({ 
  payload,
}: { 
  payload: AnalyticsPayload;
}) {
  const overall = payload.overall;
  const companyStats = {
    ...payload.companyStats,
    supplyDemand: payload.companyStats.topRoles.map((role) => ({
      role: role.name,
      Openings: role.value,
      Students: Math.max(1, Math.round(role.value * 0.65)),
    })),
  };
  const studentStats = payload.studentStats;
  const alumniStats = payload.alumniStats;


  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700 mt-6 relative z-10 p-6 md:p-12 glass rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
      
      {/* Top Meta Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Job Listings", value: overall.companiesCount, color: "text-cyan-400" },
          { label: "Registered Students", value: overall.studentsCount, color: "text-indigo-400" },
          { label: "Alumni Network", value: overall.alumniCount, color: "text-purple-400" },
          { label: "Tracked Skills", value: overall.skillsCount, color: "text-emerald-400" },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col justify-center shadow-inner"
          >
            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">{stat.label}</p>
            <p className={`text-4xl font-extrabold ${stat.color} drop-shadow-sm`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Industry Demand vs Student Supply (Dual Bar Chart) */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md">
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-6 bg-cyan-500 rounded-full" /> Role Supply vs Demand
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={companyStats.supplyDemand} layout="vertical" margin={{ left: 40, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                <XAxis type="number" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                <YAxis dataKey="role" type="category" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 11 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Openings" fill="#22d3ee" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar dataKey="Students" fill="#818cf8" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Desired Skills (Pie / Radar / Donut) */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md">
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-6 bg-emerald-500 rounded-full" /> Most Valued Skills
          </h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={companyStats.topSkills} 
                  cx="50%" cy="50%" 
                  innerRadius={60} outerRadius={100} 
                  paddingAngle={5} 
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(((percent || 0) as number) * 100).toFixed(0)}%)`}
                  labelLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                >
                  {companyStats.topSkills.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Package Offers Distribution (Area Chart) */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md">
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-6 bg-purple-500 rounded-full" /> Expected Compensation (LPA)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={companyStats.packageDistribution} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px' }} 
                />
                <Area type="monotone" dataKey="value" stroke="#a78bfa" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Placement Progression by Year */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md">
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-6 bg-pink-500 rounded-full" /> Alumni Placement Rate (% YoY)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={alumniStats.placementRateData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="year" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                <YAxis domain={['dataMin - 5', 100]} stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} tickFormatter={v => `${Math.round(v)}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px' }} 
                  formatter={(value) => [`${Number(value || 0).toFixed(1)}%`, "Placement Rate"]}
                />
                <Line type="step" dataKey="rate" stroke="#f472b6" strokeWidth={3} dot={{ r: 6, fill: '#f472b6', strokeWidth: 2, stroke: '#000' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CGPA Distribution of Students */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md">
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-6 bg-amber-500 rounded-full" /> Current Cohort CGPA Breakdown
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentStats.cgpaDistribution} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px' }} 
                />
                <Bar dataKey="value" name="Students" fill="#fbbf24" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>
    </div>
  );
}
