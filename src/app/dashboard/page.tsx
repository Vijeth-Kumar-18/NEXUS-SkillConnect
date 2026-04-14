import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/common/Card";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight gradient-text mb-2">Welcome back, Abhi</h1>
        <p className="text-sm font-medium" style={{ color: 'var(--color-weak)' }}>
          Here is your comprehensive placement readiness OS.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Skills Tracked", value: "14", trend: "+3 this week", color: "text-indigo-500" },
          { label: "Average Match", value: "78%", trend: "+5% improvement", color: "text-emerald-500" },
          { label: "Companies Targeted", value: "8", trend: "Active Applications", color: "text-cyan-500" },
          { label: "Mock Interviews", value: "5", trend: "2 scheduled", color: "text-amber-500" },
        ].map((stat, i) => (
          <Card key={i} className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <p className="text-[10px] uppercase tracking-wider mb-2 font-semibold" style={{ color: 'var(--color-foreground)', opacity: 0.6 }}>{stat.label}</p>
            <p className={`text-3xl font-black ${stat.color} drop-shadow-md mb-2`}>{stat.value}</p>
            <p className="text-xs font-medium" style={{ color: 'var(--color-weak)' }}>{stat.trend}</p>
          </Card>
        ))}
      </div>

      {/* Main Grid sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Profile summary */}
        <Card className="lg:col-span-1 border-t-4 border-t-indigo-500">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-500">
              Student Profile
            </h3>
            <Link href="/profile" className="text-[10px] uppercase font-bold text-indigo-400 hover:text-indigo-300 transition">View Full</Link>
          </div>
          
          <div className="flex flex-col items-center text-center space-y-4 mb-6">
            <div className="relative">
              <div className="h-20 w-20 rounded-full flex items-center justify-center text-2xl font-black text-indigo-500 bg-indigo-500/10 border-2 border-indigo-500/30">
                A
              </div>
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-[#0a0b14]"></span>
            </div>
            <div>
              <p className="text-lg font-bold" style={{ color: 'var(--color-foreground)' }}>Abhishek Kumar</p>
              <p className="text-xs font-medium tracking-wide mt-1" style={{ color: 'var(--color-foreground)', opacity: 0.6 }}>B.Tech CSE • Class of 2026</p>
            </div>
          </div>
          
          <div className="pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-[10px] uppercase font-bold tracking-widest mb-3" style={{ color: 'var(--color-foreground)', opacity: 0.5 }}>Top Skills</p>
            <div className="flex flex-wrap gap-2">
              {['React', 'Node.js', 'Python', 'System Design', 'AWS'].map(skill => (
                <span key={skill} className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Actionable Insights */}
        <Card className="lg:col-span-2 border-t-4 border-t-emerald-500">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-500">
              AI Priority Roadmap
            </h3>
            <Link href="/skill-gap" className="text-[10px] uppercase font-bold text-emerald-400 hover:text-emerald-300 transition">Analyze Gap</Link>
          </div>
          
          <div className="space-y-4">
            {[
              { task: "Master Dynamic Programming", impact: "High Impact for Amazon", progress: "60%" },
              { task: "Learn System Design Basics", impact: "Required for Google SDE", progress: "20%" },
              { task: "Build a Full-stack Project", impact: "Portfolio boost", progress: "85%" },
              { task: "Practice Behavioral Questions", impact: "Crucial for Culture Fit", progress: "10%" }
            ].map((insight, idx) => (
              <div key={idx} className="flex flex-col gap-2 p-4 rounded-xl border transition-colors hover:bg-black/5 hover:dark:bg-white/5 cursor-default" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold" style={{ color: 'var(--color-foreground)' }}>{insight.task}</h4>
                    <p className="text-[10px] uppercase font-bold mt-1" style={{ color: 'var(--color-weak)' }}>{insight.impact}</p>
                  </div>
                  <span className="text-xs font-bold" style={{ color: 'var(--color-foreground)' }}>{insight.progress}</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-glass)' }}>
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: insight.progress }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-foreground)', opacity: 0.8 }}>
              Upcoming Company Visits
            </h3>
            <Link href="/companies" className="text-[10px] uppercase font-bold text-indigo-400 hover:text-indigo-300 pl-2">View All</Link>
          </div>
          <div className="space-y-4">
            {[
              { name: "Google", role: "Software Engineer", date: "Oct 15, 2026", type: "On-Campus" },
              { name: "Amazon", role: "SDE I", date: "Oct 22, 2026", type: "Virtual" },
              { name: "Microsoft", role: "Cloud Support", date: "Nov 02, 2026", type: "On-Campus" },
            ].map((company, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-transparent hover:border-indigo-500/20 hover:bg-indigo-500/5 transition">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center font-bold text-lg bg-black/5 dark:bg-white/5 border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-foreground)' }}>
                    {company.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold" style={{ color: 'var(--color-foreground)' }}>{company.name}</h4>
                    <p className="text-[10px] uppercase font-bold tracking-wider mt-0.5" style={{ color: 'var(--color-foreground)', opacity: 0.6 }}>{company.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-indigo-500">{company.date}</p>
                  <p className="text-[10px] uppercase font-bold mt-1" style={{ color: 'var(--color-foreground)', opacity: 0.4 }}>{company.type}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-foreground)', opacity: 0.8 }}>
              Recent Alumni Highlights
            </h3>
            <Link href="/alumni" className="text-[10px] uppercase font-bold text-indigo-400 hover:text-indigo-300 pl-2">Explore Graph</Link>
          </div>
          <div className="space-y-4">
            {[
              { name: "Priya Sharma", role: "Senior Engineer at Netflix", shift: "Promoted this month" },
              { name: "Rahul Verma", role: "SDE II at Amazon", shift: "Switched from TCS" },
              { name: "Neha Gupta", role: "Product Manager at Meta", shift: "New Role" },
            ].map((alumni, i) => (
              <div key={i} className="flex gap-3 items-start p-3 rounded-lg cursor-pointer hover:bg-black/5 hover:dark:bg-white/5 transition">
                <div className="h-2 w-2 rounded-full mt-2 shrink-0 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                <div>
                  <h4 className="text-sm font-bold" style={{ color: 'var(--color-foreground)' }}>{alumni.name}</h4>
                  <p className="text-xs font-medium mt-1" style={{ color: 'var(--color-foreground)', opacity: 0.8 }}>{alumni.role}</p>
                  <p className="text-[10px] uppercase font-bold tracking-wider mt-1 text-amber-500/80">{alumni.shift}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

    </PageWrapper>
  );
}
