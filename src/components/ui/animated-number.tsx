"use client";

import { useEffect, useState, useRef } from "react";
import { useInView, animate } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedNumber({
  value,
  duration = 2,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const formatNumber = (num: number) => {
    return (
      prefix +
      Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(Number(num.toFixed(decimals))) +
      suffix
    );
  };

  const [displayValue, setDisplayValue] = useState(() => formatNumber(0));

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration,
        ease: "easeOut",
        onUpdate(latest) {
          setDisplayValue(formatNumber(latest));
        },
      });

      return () => controls.stop();
    }
  }, [isInView, value, duration, decimals, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}
