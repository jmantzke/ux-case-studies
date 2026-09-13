// ─── Case-study card — background "blade" decoration ──────────────────────────
// Data for the animated hover/press blade layer behind CaseStudyCard's title
// and summary. Geometry, angles and combinations come from the Figma-sourced
// design handoff (`design_handoff_case_study_card_blades/README.md`) — treat
// this file as the single source of truth for that spec inside the codebase.

export type BladeShape = {
  viewBox: string
  d: string
}

// The 12 blade vectors exported from Figma node 1439:5667.
export const BLADE_SHAPES: Record<string, BladeShape> = {
  'top-01': { viewBox: '0 0 390 163', d: 'M390 0H0V6L82 42L146 98L327 119L390 163V0Z' },
  'top-02': { viewBox: '0 0 415 151', d: 'M414.5 0H0L97 119.5L323 54.5L414.5 150.5V0Z' },
  'top-03': { viewBox: '0 0 363 117', d: 'M363 0H12.5L0 22.5L124 31L160.5 116.5L308 51.5L363 101V0Z' },
  'top-04': { viewBox: '0 0 334 125', d: 'M333.5 0V125L283.5 109V66L49 81.5L0 0H333.5Z' },
  'top-05': { viewBox: '0 0 265 101', d: 'M264.5 0H0L264.5 101V0Z' },
  'top-06': { viewBox: '0 0 303 155', d: 'M303 0C203.333 0.5 3.2 1.2 0 0L106 40.5L303 155V0Z' },
  'bottom-01': { viewBox: '0 0 381 148', d: 'M380.5 147.5V12.5L328.5 23.5L162.5 0L205 92.5L0 147.5H380.5Z' },
  'bottom-02': { viewBox: '0 0 319 135', d: 'M319 135V0L240.5 31.5L215.5 54.5H112L0 135H319Z' },
  'bottom-03': { viewBox: '0 0 397 91', d: 'M397 90.5V0L48.5 70L0 90.5H397Z' },
  'bottom-04': { viewBox: '0 0 242 131', d: 'M242 131V0L0 131H242Z' },
  'bottom-05': { viewBox: '0 0 400 143', d: 'M399.5 142.5V0L352.5 16L271 0L57 89.5L0 142.5H399.5Z' },
  'bottom-06': { viewBox: '0 0 269 100', d: 'M268.5 99.5H0L268.5 0V99.5Z' },
}

export type SlotName = 'top-1' | 'top-2' | 'top-3' | 'bottom-1' | 'bottom-2' | 'bottom-3'

// Fixed per-slot geometry and stagger — identical for every card. Only the
// blade *shape* dropped into each slot varies per case study (see
// BLADE_COMBINATIONS below). Angles are signed for direct use in `rotate()`:
// positive = clockwise (top set), negative = counter-clockwise (bottom set).
export const BLADE_SLOTS: Record<
  SlotName,
  {
    width: number
    right: number
    edge: 'top' | 'bottom'
    inset: number
    angle: number
    openDelayMs: number
    closeDelayMs: number
  }
> = {
  'top-1':    { width: 300, right: -24, edge: 'top',    inset: -14, angle: 15,  openDelayMs: 0,   closeDelayMs: 130 },
  'top-2':    { width: 280, right: -32, edge: 'top',    inset: -8,  angle: 16,  openDelayMs: 65,  closeDelayMs: 0 },
  'top-3':    { width: 290, right: -18, edge: 'top',    inset: -20, angle: 14,  openDelayMs: 130, closeDelayMs: 65 },
  'bottom-1': { width: 300, right: -28, edge: 'bottom', inset: -16, angle: -15, openDelayMs: 33,  closeDelayMs: 163 },
  'bottom-2': { width: 250, right: -16, edge: 'bottom', inset: -10, angle: -14, openDelayMs: 98,  closeDelayMs: 65 },
  'bottom-3': { width: 320, right: -36, edge: 'bottom', inset: -22, angle: -16, openDelayMs: 163, closeDelayMs: 0 },
}

export const BLADE_SLOT_ORDER: SlotName[] = [
  'top-1', 'top-2', 'top-3', 'bottom-1', 'bottom-2', 'bottom-3',
]

// Per-card blade combination — three top shapes into the three top slots (in
// slot order) and three bottom shapes into the three bottom slots. Keyed by
// `content/case-studies.json` slug so it stays correct if studies are
// reordered. No combination repeats (design handoff README, "Blade
// combination per card").
export const BLADE_COMBINATIONS: Record<string, { top: string[]; bottom: string[] }> = {
  'alaska-airlines-flight-attendant-training': { top: ['01', '02', '03'], bottom: ['01', '02', '03'] },
  'boeing-ngps-search':                        { top: ['04', '05', '06'], bottom: ['04', '05', '06'] },
  'ecommerce-branding-kit':                    { top: ['01', '03', '05'], bottom: ['02', '04', '06'] },
  'alaska-airlines-pilot-vacation-trading':    { top: ['02', '04', '06'], bottom: ['01', '03', '05'] },
  'atmosphere-adoption-study':                 { top: ['01', '04', '05'], bottom: ['03', '05', '02'] },
  'hitachi-data-reduction-estimator':          { top: ['02', '03', '06'], bottom: ['06', '01', '04'] },
  'alaska-airlines-personal-drop-request':     { top: ['03', '04', '05'], bottom: ['05', '02', '06'] },
  'ngps-aircraft-detail-redesign':             { top: ['01', '02', '06'], bottom: ['04', '01', '03'] },
  'wanderlist':                                { top: ['02', '05', '06'], bottom: ['03', '06', '05'] },
  'smart-response-geneva':                     { top: ['01', '03', '04'], bottom: ['02', '01', '05'] },
}

export function getCardBlades(slug: string) {
  const combo = BLADE_COMBINATIONS[slug]
  if (!combo) return null

  return BLADE_SLOT_ORDER.map((slot, i) => {
    const isTop = slot.startsWith('top')
    const localIndex = i % 3
    const shapeKey = isTop ? `top-${combo.top[localIndex]}` : `bottom-${combo.bottom[localIndex]}`
    return { slot, shape: BLADE_SHAPES[shapeKey] }
  })
}
