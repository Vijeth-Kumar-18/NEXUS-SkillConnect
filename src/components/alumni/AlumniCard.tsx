import Card from "@/components/common/Card";

interface AlumniCardProps {
  name: string;
  batch: string;
  company: string;
  role: string;
}

export default function AlumniCard({ name, batch, company, role }: AlumniCardProps) {
  return (
    <Card hover>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-bold text-indigo-300">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-200">{name}</p>
          <p className="text-xs text-slate-500">Batch {batch}</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-white/[0.06]">
        <p className="text-xs text-slate-400">
          <span className="text-slate-300 font-medium">{role}</span> at{" "}
          <span className="text-indigo-400">{company}</span>
        </p>
      </div>
    </Card>
  );
}
