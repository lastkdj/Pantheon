"use client";

import { useEffect, useRef, useState } from "react";

/** Counts from 0 to `value` once, easing out. Shows the final number straight away when motion is reduced. */
export function CountUp({ value, decimals = 0, prefix = "", suffix = "", duration = 1100 }: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [shown, setShown] = useState(0);
  const frame = useRef<number>(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setShown(value * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [value, duration]);

  return (
    <span aria-label={`${prefix}${value.toFixed(decimals)}${suffix}`}>
      <span aria-hidden="true">
        {prefix}
        {shown.toFixed(decimals)}
        {suffix}
      </span>
    </span>
  );
}
