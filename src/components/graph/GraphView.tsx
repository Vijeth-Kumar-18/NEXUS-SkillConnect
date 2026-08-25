"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchJson } from "@/lib/apiClient";

interface GraphViewProps {
  className?: string;
}

interface GraphNode {
  id: string;
  label: string;
  type: "student" | "skill" | "company";
  score: number;
}

interface GraphLink {
  source: string;
  target: string;
  type: string;
}

export default function GraphView({ className = "" }: GraphViewProps) {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJson<{ nodes: GraphNode[]; links: GraphLink[] }>("/api/graph")
      .then((data) => {
        setNodes(data.nodes);
        setLinks(data.links);
        setError("");
      })
      .catch((err) => {
        setNodes([]);
        setLinks([]);
        setError(err instanceof Error ? err.message : "Failed to load graph");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const layout = useMemo(() => {
    const skillCount = nodes.filter((node) => node.type === "skill").length;
    const companyCount = nodes.filter((node) => node.type === "company").length;
    const maxColumnCount = Math.max(8, skillCount, companyCount);
    const width = Math.max(900, maxColumnCount * 90);
    const height = 340;
    const centerX = width / 2;

    const student = nodes.find((node) => node.type === "student");
    const skills = nodes.filter((node) => node.type === "skill");
    const companies = nodes.filter((node) => node.type === "company");

    const pointMap = new Map<string, { x: number; y: number }>();
    if (student) {
      pointMap.set(student.id, { x: centerX, y: 44 });
    }

    skills.forEach((skill, idx) => {
      const x = (idx + 1) * (width / (skills.length + 1));
      pointMap.set(skill.id, { x, y: 162 });
    });

    companies.forEach((company, idx) => {
      const x = (idx + 1) * (width / (companies.length + 1));
      pointMap.set(company.id, { x, y: 286 });
    });

    return { width, height, pointMap };
  }, [nodes]);

  return (
    <div className={`glass rounded-2xl p-6 ${className}`}>
      <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
        Graph Visualization
      </h3>

      {error ? <p className="text-xs text-rose-300 mb-3">{error}</p> : null}

      <div className="flex items-center justify-center h-80 rounded-xl border border-dashed border-white/10 bg-white/[0.02] overflow-x-auto">
        {loading ? (
          <div className="text-center">
            <p className="text-sm text-slate-400">Loading graph...</p>
          </div>
        ) : nodes.length ? (
          <svg viewBox={`0 0 ${layout.width} ${layout.height}`} className="h-full min-w-[900px] w-full">
            {links.map((link, idx) => {
              const source = layout.pointMap.get(link.source);
              const target = layout.pointMap.get(link.target);
              if (!source || !target) {
                return null;
              }

              return (
                <line
                  key={`${link.source}-${link.target}-${idx}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="rgba(99,102,241,0.35)"
                  strokeWidth="1.2"
                />
              );
            })}

            {nodes.map((node) => {
              const point = layout.pointMap.get(node.id);
              if (!point) {
                return null;
              }
              const color =
                node.type === "student"
                  ? "#22d3ee"
                  : node.type === "skill"
                    ? "#818cf8"
                    : "#34d399";
              const radius = node.type === "student" ? 15 : node.type === "skill" ? 10 : 11;

              return (
                <g key={node.id}>
                  <circle cx={point.x} cy={point.y} r={radius} fill={color} fillOpacity="0.85" />
                  <text x={point.x} y={point.y + 26} textAnchor="middle" fontSize="10" fill="rgba(226,232,240,0.85)">
                    {node.label.length > 18 ? `${node.label.slice(0, 18)}...` : node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        ) : (
          <div className="text-center">
            <p className="text-sm text-slate-500">Neo4j Graph View</p>
            <p className="text-xs text-slate-600 mt-1">Login as student to render your graph network.</p>
          </div>
        )}
      </div>
    </div>
  );
}
