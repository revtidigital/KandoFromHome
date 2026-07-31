import React from 'react';

export const LondonLandmarkIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 120 90" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {/* Big Ben Tower */}
    <rect x="48" y="20" width="16" height="60" rx="1" />
    <path d="M48 20 L56 6 L64 20 Z" />
    <circle cx="56" cy="30" r="4.5" />
    <line x1="56" y1="30" x2="56" y2="28" />
    <line x1="56" y1="30" x2="58" y2="30" />
    
    {/* London Eye Ferris Wheel */}
    <circle cx="24" cy="48" r="18" strokeDasharray="3 3" />
    <circle cx="24" cy="48" r="3" />
    <line x1="24" y1="48" x2="24" y2="80" />
    <line x1="15" y1="80" x2="33" y2="80" />
    <line x1="24" y1="48" x2="11" y2="38" />
    <line x1="24" y1="48" x2="37" y2="38" />
    <line x1="24" y1="48" x2="11" y2="58" />
    <line x1="24" y1="48" x2="37" y2="58" />
    
    {/* St Pauls Dome */}
    <path d="M76 80 L76 52 C76 42 94 42 94 52 L94 80" />
    <path d="M81 42 L85 32 L89 42 Z" />
    <line x1="85" y1="32" x2="85" y2="26" />

    {/* Tower Bridge arches detail */}
    <path d="M96 80 L96 65 L106 65 L106 80" />
    <path d="M106 80 L106 60 L114 60 L114 80" />
    <line x1="96" y1="68" x2="114" y2="68" strokeDasharray="2 2" />

    {/* Ground Baseline */}
    <line x1="4" y1="80" x2="116" y2="80" strokeWidth="2" />
  </svg>
);

export const IndiaGateIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 120 90" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {/* Baseline */}
    <line x1="10" y1="80" x2="110" y2="80" strokeWidth="2" />
    
    {/* Steps Base */}
    <rect x="22" y="74" width="76" height="6" rx="1" />
    <rect x="28" y="68" width="64" height="6" rx="1" />
    
    {/* Main Outer Pillars */}
    <rect x="32" y="30" width="16" height="38" />
    <rect x="72" y="30" width="16" height="38" />
    
    {/* Central Arch */}
    <path d="M48 68 L48 46 C48 36 72 36 72 46 L72 68" />
    <path d="M52 68 L52 48 C52 42 68 42 68 48 L68 68" strokeDasharray="2 2" />

    {/* Top Frieze Tiers */}
    <rect x="26" y="22" width="68" height="8" rx="1" />
    <rect x="34" y="14" width="52" height="8" rx="1" />
    
    {/* Top Dome Canopy */}
    <path d="M46 14 C46 8 74 8 74 14" />
    <line x1="60" y1="8" x2="60" y2="4" />
    
    {/* Inscription Lines */}
    <line x1="38" y1="26" x2="82" y2="26" strokeDasharray="2 2" />
  </svg>
);

export const GopuramIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 120 90" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {/* Baseline */}
    <line x1="12" y1="80" x2="108" y2="80" strokeWidth="2" />
    
    {/* Main Base Structure */}
    <rect x="24" y="64" width="72" height="16" rx="1" />
    
    {/* Entrance Arch */}
    <path d="M48 80 L48 69 C48 63 72 63 72 69 L72 80" />
    
    {/* Tier 1 */}
    <polygon points="28,64 92,64 86,48 34,48" />
    <line x1="42" y1="48" x2="42" y2="64" />
    <line x1="60" y1="48" x2="60" y2="64" />
    <line x1="78" y1="48" x2="78" y2="64" />
    
    {/* Tier 2 */}
    <polygon points="34,48 86,48 80,32 40,32" />
    <line x1="50" y1="32" x2="50" y2="48" />
    <line x1="70" y1="32" x2="70" y2="48" />
    
    {/* Tier 3 */}
    <polygon points="40,32 80,32 74,18 46,18" />
    <line x1="60" y1="18" x2="60" y2="32" />

    {/* Top Kalasam Spire Domes */}
    <path d="M44 18 C44 10 76 10 76 18 Z" />
    <line x1="48" y1="10" x2="48" y2="4" />
    <line x1="60" y1="10" x2="60" y2="2" />
    <line x1="72" y1="10" x2="72" y2="4" />
  </svg>
);
