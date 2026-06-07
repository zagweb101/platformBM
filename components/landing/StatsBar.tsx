"use client";

import { useEffect, useRef, useState } from "react";

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

function Counter({ value, suffix, label }: StatItem) {
  const [count, setCount] = useState(value);
  const elementRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const currentElement = elementRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          setCount(0);

          const duration = 1500;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easeProgress = progress * (2 - progress);
            setCount(Math.floor(easeProgress * value));

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(value);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [value, hasAnimated]);

  return (
    <div ref={elementRef} className="flex flex-col items-center justify-center p-6 text-center">
      <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-brand-indigo via-brand-violet to-brand-fuchsia bg-clip-text text-fill-transparent webkit-text-fill-transparent font-almarai mb-2">
        {count}
        {suffix}
      </div>
      <div className="text-sm text-gray-400 font-tajawal">{label}</div>
    </div>
  );
}

export default function StatsBar({ stats }: { stats: StatItem[] }) {
  return (
    <section className="relative w-full py-8 bg-[#0b0b12] border-y border-gray-900 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-0 divide-y md:divide-y-0 lg:divide-x lg:divide-x-reverse divide-gray-900/60">
          {stats.map((stat, idx) => (
            <div key={idx} className="first:border-t-0 border-gray-900/60">
              <Counter value={stat.value} suffix={stat.suffix} label={stat.label} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
