/** Small stroke icons, 22px. */
const base = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export const IconOverview = () => (<svg {...base}><rect x="3" y="3" width="7.5" height="7.5" rx="2" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="2" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="2" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" /></svg>);
export const IconBoard = () => (<svg {...base}><rect x="3" y="4" width="5" height="16" rx="1.5" /><rect x="9.5" y="4" width="5" height="10" rx="1.5" /><rect x="16" y="4" width="5" height="13" rx="1.5" /></svg>);
export const IconShield = () => (<svg {...base}><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z" /><path d="m9 12 2.2 2.2L15.5 10" /></svg>);
export const IconWallet = () => (<svg {...base}><path d="M4 7a2 2 0 0 1 2-2h11v3" /><rect x="3" y="8" width="18" height="12" rx="2.5" /><circle cx="16.5" cy="14" r="1.2" fill="currentColor" /></svg>);
export const IconPulse = () => (<svg {...base}><path d="M3 12h4l2.5-6 4 12L16 12h5" /></svg>);
export const IconSearch = () => (<svg {...base} width={18} height={18}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-3.8-3.8" /></svg>);
export const IconBell = () => (<svg {...base}><path d="M6 17V11a6 6 0 1 1 12 0v6l1.5 2h-15z" /><path d="M10 21a2 2 0 0 0 4 0" /></svg>);
export const IconChevron = () => (<svg {...base} width={16} height={16}><path d="m6 9 6 6 6-6" /></svg>);
export const IconArrowRight = () => (<svg {...base} width={18} height={18}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const IconArrowLeft = () => (<svg {...base} width={18} height={18}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>);
export const IconFilter = () => (<svg {...base} width={16} height={16}><path d="M4 6h16M7 12h10M10 18h4" /></svg>);
export const IconTasks = () => (<svg {...base}><path d="M9 6h11M9 12h11M9 18h11" /><path d="m3.5 6 1.3 1.3L7 5M3.5 12l1.3 1.3L7 11M3.5 18l1.3 1.3L7 17" /></svg>);
export const IconEye = () => (<svg {...base}><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" /><circle cx="12" cy="12" r="2.8" /></svg>);
export const IconDollar = () => (<svg {...base}><path d="M12 3v18M16.5 7.5c-.8-1.2-2.3-2-4.5-2-2.6 0-4 1.2-4 2.9 0 4.2 9 2 9 6.4 0 1.9-1.8 3.2-4.5 3.2-2.4 0-4-.9-4.8-2.4" /></svg>);
export const IconArrowUpRight = () => (<svg {...base} width={14} height={14}><path d="M7 17 17 7M8 7h9v9" /></svg>);
export const IconClose = () => (<svg {...base} width={16} height={16}><path d="m6 6 12 12M18 6 6 18" /></svg>);
