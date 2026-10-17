type P = { size?: number; className?: string }

const base = (size = 24) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
})

export const IconHome = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M5.6 5.6c3.5 3.5 3.5 9.3 0 12.8M18.4 5.6c-3.5 3.5-3.5 9.3 0 12.8" />
  </svg>
)
export const IconPlan = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="4" width="18" height="17" rx="3" />
    <path d="M3 9h18M8 2v4M16 2v4M8 14h3M8 17h6" />
  </svg>
)
export const IconMeasure = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
)
export const IconFitness = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l2.5 2.5M9 2h6M12 2v3" />
  </svg>
)
export const IconMind = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 21c-4.4-2.6-8-6-8-10.2A4.8 4.8 0 0 1 12 7a4.8 4.8 0 0 1 8 3.8c0 4.2-3.6 7.6-8 10.2Z" />
  </svg>
)
export const IconFlame = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 22c4 0 7-2.8 7-6.8 0-3.7-2.6-6.2-4.4-8.7-.5 2-1.6 3.2-3 3.5.4-3-1-5.8-3.6-8C8.4 5.3 5 8.6 5 15.2 5 19.2 8 22 12 22Z" />
  </svg>
)
export const IconCheck = ({ size, className }: P) => (
  <svg {...base(size)} strokeWidth={3} className={className}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)
export const IconPlay = ({ size, className }: P) => (
  <svg {...base(size)} className={className} fill="currentColor" stroke="none">
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
  </svg>
)
export const IconPause = ({ size, className }: P) => (
  <svg {...base(size)} className={className} fill="currentColor" stroke="none">
    <rect x="6" y="5" width="4" height="14" rx="1.2" />
    <rect x="14" y="5" width="4" height="14" rx="1.2" />
  </svg>
)
export const IconReset = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />
  </svg>
)
export const IconBack = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="m15 18-6-6 6-6" />
  </svg>
)
export const IconChevron = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="m9 6 6 6-6 6" />
  </svg>
)
export const IconStanding = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="11" cy="4" r="2" />
    <path d="m8 21 2.5-7L8 11l2-4 4 2 3 3M10.5 14l3.5 2 1 5M17 12l3-6" />
  </svg>
)
export const IconWheelchair = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="10" cy="4" r="2" />
    <path d="M10 7v6h6l2 5M10 10h5" />
    <path d="M7 11.5a5.5 5.5 0 1 0 7.6 6.6" />
  </svg>
)
export const IconSpark = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
  </svg>
)
