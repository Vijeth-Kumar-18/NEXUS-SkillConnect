import PageWrapper from "@/components/layout/PageWrapper";
import AlumniCard from "@/components/alumni/AlumniCard";
import CareerTimeline from "@/components/alumni/CareerTimeline";

const alumni = [
  { name: "Ravi Kumar", batch: "2023", company: "Google", role: "SDE-2" },
  { name: "Priya Sharma", batch: "2022", company: "Amazon", role: "SDE-1" },
  { name: "Amit Patel", batch: "2024", company: "Microsoft", role: "SWE" },
];

const sampleTimeline = [
  { year: "2022", title: "Intern — SDE", company: "Google" },
  { year: "2023", title: "Full-Time SDE-1", company: "Google" },
  { year: "2025", title: "SDE-2", company: "Google" },
];

export default function AlumniPage() {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-2xl font-bold gradient-text">Alumni Network</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track alumni career paths and placements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alumni cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {alumni.map((a) => (
            <AlumniCard key={a.name} {...a} />
          ))}
        </div>

        {/* Career timeline */}
        <div>
          <CareerTimeline steps={sampleTimeline} />
        </div>
      </div>
    </PageWrapper>
  );
}
