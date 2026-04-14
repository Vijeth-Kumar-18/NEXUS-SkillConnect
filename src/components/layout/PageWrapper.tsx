interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className = "" }: PageWrapperProps) {
  return (
    <div className={`px-6 py-6 sm:px-8 sm:py-8 max-w-7xl mx-auto w-full ${className}`}>
      {children}
    </div>
  );
}
