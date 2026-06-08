"use client";

import {
  COURSE_CATEGORIES,
  type CourseDelivery,
  type CourseLevel,
} from "@/lib/course-display";

export interface CourseFiltersState {
  categories: string[];
  levels: CourseLevel[];
  delivery: CourseDelivery[];
  priceMin: number;
  priceMax: number;
}

export const DEFAULT_FILTERS: CourseFiltersState = {
  categories: [],
  levels: [],
  delivery: [],
  priceMin: 0,
  priceMax: 5000,
};

interface CourseFiltersPanelProps {
  filters: CourseFiltersState;
  onChange: (filters: CourseFiltersState) => void;
  maxPrice: number;
}

export function CourseFiltersPanel({
  filters,
  onChange,
  maxPrice,
}: CourseFiltersPanelProps) {
  const toggleCategory = (category: string) => {
    const categories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onChange({ ...filters, categories });
  };

  const toggleLevel = (level: CourseLevel) => {
    const levels = filters.levels.includes(level)
      ? filters.levels.filter((l) => l !== level)
      : [...filters.levels, level];
    onChange({ ...filters, levels });
  };

  const toggleDelivery = (type: CourseDelivery) => {
    const delivery = filters.delivery.includes(type)
      ? filters.delivery.filter((d) => d !== type)
      : [...filters.delivery, type];
    onChange({ ...filters, delivery });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-bold text-[#151525] font-heading">المجال</h3>
        <ul className="space-y-2">
          {COURSE_CATEGORIES.map((category) => (
            <li key={category}>
              <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-body">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="h-4 w-4 rounded border-border-default text-brand-violet-600 focus:ring-brand-violet-600"
                />
                {category}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold text-[#151525] font-heading">المستوى</h3>
        <ul className="space-y-2">
          {(["مبتدئ", "متوسط", "متقدم"] as CourseLevel[]).map((level) => (
            <li key={level}>
              <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-body">
                <input
                  type="checkbox"
                  checked={filters.levels.includes(level)}
                  onChange={() => toggleLevel(level)}
                  className="h-4 w-4 rounded border-border-default text-brand-violet-600 focus:ring-brand-violet-600"
                />
                {level}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold text-[#151525] font-heading">النوع</h3>
        <ul className="space-y-2">
          {(["حضوري", "أونلاين"] as CourseDelivery[]).map((type) => (
            <li key={type}>
              <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-body">
                <input
                  type="checkbox"
                  checked={filters.delivery.includes(type)}
                  onChange={() => toggleDelivery(type)}
                  className="h-4 w-4 rounded border-border-default text-brand-violet-600 focus:ring-brand-violet-600"
                />
                {type}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold text-[#151525] font-heading">السعر (ر.س)</h3>
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={maxPrice}
            step={50}
            value={filters.priceMax}
            onChange={(event) =>
              onChange({ ...filters, priceMax: Number(event.target.value) })
            }
            className="w-full accent-brand-violet-600"
            aria-label="الحد الأقصى للسعر"
          />
          <div className="flex items-center justify-between text-sm text-text-secondary font-body">
            <span>{filters.priceMin} ر.س</span>
            <span>حتى {filters.priceMax} ر.س</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function hasActiveFilters(filters: CourseFiltersState) {
  return (
    filters.categories.length > 0 ||
    filters.levels.length > 0 ||
    filters.delivery.length > 0 ||
    filters.priceMin > 0 ||
    filters.priceMax < 5000
  );
}
