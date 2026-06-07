import React from "react";

export default function Logo({ showText = true }: { showText?: boolean }) {
  return (
    <div className="logo-wrapper select-none">
      {/* Geometric Diamond/Crystal SVG matching the branding */}
      <svg
        className="logo-icon"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="50%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#D946EF" />
          </linearGradient>
        </defs>
        {/* Diamond frame */}
        <path
          d="M50 5 L90 40 L50 95 L10 40 Z"
          fill="url(#logoGrad)"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Inner camera/aperture lens representation */}
        <circle cx="50" cy="45" r="16" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="2" />
        <circle cx="47" cy="42" r="5" fill="white" />
        {/* Inner angular lines */}
        <path d="M50 5 L50 29" stroke="white" strokeWidth="1.5" strokeDasharray="2 2" />
        <path d="M50 61 L50 95" stroke="white" strokeWidth="1.5" strokeDasharray="2 2" />
        <path d="M10 40 L34 45" stroke="white" strokeWidth="1.5" strokeDasharray="2 2" />
        <path d="M66 45 L90 40" stroke="white" strokeWidth="1.5" strokeDasharray="2 2" />
      </svg>
      {showText && (
        <span className="logo-text">بيت المصور</span>
      )}
    </div>
  );
}
