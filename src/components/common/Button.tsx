interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variants = {
  primary:
    "bg-indigo-500 text-white hover:bg-indigo-600 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]",
  secondary:
    "bg-white/[0.06] text-slate-200 hover:bg-white/[0.1] border-white/[0.08]",
  ghost:
    "bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border-transparent",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-sm",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl border font-medium
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-500/30
        disabled:opacity-50 disabled:pointer-events-none
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
