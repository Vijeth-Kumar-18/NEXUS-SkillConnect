interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`
        glass rounded-2xl p-5
        ${hover ? "glass-hover cursor-pointer transition-shadow hover:shadow-[0_0_30px_rgba(99,102,241,0.06)]" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
