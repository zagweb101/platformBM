"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Section {
  id: string;
  title: string;
  lessons: { id: string; title: string; duration: number | null }[];
}

export function CourseCurriculumAccordion({ sections }: { sections: Section[] }) {
  const [openId, setOpenId] = useState<string | null>(sections[0]?.id ?? null);

  return (
    <div className="space-y-3">
      {sections.map((section) => {
        const isOpen = openId === section.id;
        return (
          <div
            key={section.id}
            className="overflow-hidden rounded-lg border border-border-default bg-white"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : section.id)}
              className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-violet-600"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-[#151525] font-body">{section.title}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-text-muted transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
            {isOpen ? (
              <ul className="border-t border-border-soft px-5 py-3">
                {section.lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    className="flex min-h-11 items-center justify-between gap-3 border-b border-border-soft py-2 text-sm last:border-0 font-body"
                  >
                    <span className="text-[#151525]">{lesson.title}</span>
                    {lesson.duration ? (
                      <span className="text-text-muted shrink-0">{lesson.duration} د</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function LearnPointsList({ points }: { points: string[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {points.map((point) => (
        <li key={point} className="flex items-start gap-2 text-sm font-body text-text-secondary">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-violet-600" aria-hidden="true" />
          {point}
        </li>
      ))}
    </ul>
  );
}
