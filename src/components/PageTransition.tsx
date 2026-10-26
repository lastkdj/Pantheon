"use client";

import { usePathname } from "next/navigation";

/** Re-runs the entrance animation on every navigation. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="rise">
      {children}
    </div>
  );
}
