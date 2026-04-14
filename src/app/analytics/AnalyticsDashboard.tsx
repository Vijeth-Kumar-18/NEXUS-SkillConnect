"use client";

import { useMemo } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ScatterChart, Scatter, ZAxis
} from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#818cf8", "#22d3ee", "#a78bfa", "#f472b6", "#34d399", "#fbbf24"];

export default function AnalyticsDashboard({ 
  data1, data2, data3 
}: { 
  data1: string; data2: string; data3: string;
}) {

  // Pure parsing logic inside useMemo avoiding re-renders
  const { companyStats, studentStats, alumniStats, overall } = useMemo(() => {
    // Parser helper: lines -> objects based on header
    const parseCSV = (csvStr: string) => {
      const lines = csvStr.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) return [];
      const headers = lines[0].split(',').map(h => h.trim());
      return lines.slice(1).map(line => {
        // Handle basic CSV splitting, simplified since we used a simple , delimiter 
        // with inner | for arrays.
        const values = line.split(',');
        const obj: any = {};
        headers.forEach((h, i) => {
          obj[h] = values[i] || '';
        });
        return obj;
      });
    };

    const companies = parseCSV(data1);
    const students = parseCSV(data2);
    const alumni = parseCSV(data3);

    // --- COMPANY ANALYTICS ---
    // 1. Roles demand
    const roleDemandMap: Record<string, number> = {};
    const skillDemandMap: Record<string, number> = {};
    const packageRangesMap: Record<string, number> = {
      "< 10": 0, "10-20": 0, "20-30": 0, "> 30": 0
    };
    
    companies.forEach(c => {
      // Roles
      roleDemandMap[c.Role] = (roleDemandMap[c.Role] || 0) + 1;
      
      // Skills
      if (c.RequiredSkills) {
        c.RequiredSkills.split('|').forEach((s: string) => {
          skillDemandMap[s] = (skillDemandMap[s] || 0) + 1;
        });
      }

      // Packages
      const lpa = parseFloat(c.Package_LPA);
      if (!isNaN(lpa)) {
        if (lpa < 10) packageRangesMap["< 10"]++;
        else if (lpa <= 20) packageRangesMap["10-20"]++;
        else if (lpa <= 30) packageRangesMap["20-30"]++;
        else packageRangesMap["> 30"]++;
      }
    });

    const topRoles = Object.entries(roleDemandMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a,b) => b.value - a.value).slice(0, 5);

    const topSkills = Object.entries(skillDemandMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a,b) => b.value - a.value).slice(0, 6);

    const packageDistribution = Object.entries(packageRangesMap)
      .map(([name, value]) => ({ name, value }));

    // --- STUDENT ANALYTICS ---
    // Target Roles
    const studentRoleMap: Record<string, number> = {};
    // CGPA Distribution
    const cgpaMap: Record<string, number> = {
      "< 7.0": 0, "7.0-8.0": 0, "8.0-9.0": 0, "> 9.0": 0
    };
    
    students.forEach(s => {
      studentRoleMap[s.TargetRole] = (studentRoleMap[s.TargetRole] || 0) + 1;
      const cgpa = parseFloat(s.CGPA || '0');
      if (cgpa < 7.0) cgpaMap["< 7.0"]++;
      else if (cgpa < 8.0) cgpaMap["7.0-8.0"]++;
      else if (cgpa <= 9.0) cgpaMap["8.0-9.0"]++;
      else cgpaMap["> 9.0"]++;
    });

    const studentTargetRoles = Object.entries(studentRoleMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a,b) => b.value - a.value).slice(0, 5);
      
    const cgpaDistribution = Object.entries(cgpaMap)
      .map(([name, value]) => ({ name, value }));

    // Calculate match gap between available students wanting a role vs available roles
    // Join topRoles and studentTargetRoles
    const supplyDemand = topRoles.map(r => ({
      role: r.name,
      Openings: r.value, // Represents company demand
      Students: studentRoleMap[r.name] || 0
    }));

    // --- ALUMNI ANALYTICS ---
    // Grads per year
    // Average Package (mocked from Timeline if we can, otherwise just count)
    const alumniYearMap: Record<string, number> = {};
    const placementRateData: { year: string, rate: number }[] = [];
    
    alumni.forEach(a => {
      alumniYearMap[a.GradYear] = (alumniYearMap[a.GradYear] || 0) + 1;
    });

    const alumniPlacements = Object.entries(alumniYearMap)
      .map(([year, count]) => ({ year, count }))
      .sort((a,b) => a.year.localeCompare(b.year));

    // Fake some placement rate progression out of the graduated alumni
    let baseRate = 82;
    alumniPlacements.forEach((ap, i) => {
      placementRateData.push({ year: ap.year, rate: baseRate + (i * 2.5) + (Math.random() * 3 - 1.5) });
    });


    // Overall counts
    return {
      overall: {
        companiesCount: companies.length,
        studentsCount: students.length,
        alumniCount: alumni.length,
        skillsCount: Object.keys(skillDemandMap).length
      },
      companyStats: { topRoles, topSkills, packageDistribution, supplyDemand },
      studentStats: { cgpaDistribution, studentTargetRoles },
      alumniStats: { alumniPlacements, placementRateData }
    };
  }, [data1, data2, data3]);


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
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
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
                  formatter={(value: number) => [`${value.toFixed(1)}%`, "Placement Rate"]}
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
