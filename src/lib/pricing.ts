export type PriceItem = {
  pharmacy: string;
  product: string;
  concentration: string;
  category: string;
  base: number;
  provider: number;
  shipping: number;
};

export const MARKUP = 1.5;
export const MONTH_SURCHARGE = 30;
export const SAVINGS_60 = 109;
export const SAVINGS_90 = 218;

export function customerPrice(i: PriceItem) {
  return Math.round((i.base + i.provider + i.shipping) * MARKUP) + MONTH_SURCHARGE;
}

export function customerPrice60(i: PriceItem) {
  return customerPrice(i) * 2 - SAVINGS_60;
}

export function customerPrice90(i: PriceItem) {
  return customerPrice(i) * 3 - SAVINGS_90;
}

export function isTRT(i: PriceItem) {
  return i.category.startsWith('TRT');
}

export function isNinetyDayOnly(i: PriceItem) {
  const p = i.product.toLowerCase();
  return p.includes('testosterone cypionate') || p.includes('enclomiphene');
}

export const ITEMS: PriceItem[] = [
  // GLP-1 / Weight Loss
  { pharmacy: 'Striker', product: 'Retatrutide', concentration: '1mg/0.5ml (2ml vial)', category: 'GLP-1 / Weight Loss', base: 109, provider: 39, shipping: 40 },
  { pharmacy: 'Striker', product: 'Retatrutide', concentration: '2mg/0.5ml (2ml vial)', category: 'GLP-1 / Weight Loss', base: 143, provider: 39, shipping: 40 },
  { pharmacy: 'Striker', product: 'Retatrutide', concentration: '4mg/0.5ml (2ml vial)', category: 'GLP-1 / Weight Loss', base: 208, provider: 39, shipping: 40 },
  { pharmacy: 'Striker', product: 'Retatrutide', concentration: '8mg/0.5ml (2ml vial)', category: 'GLP-1 / Weight Loss', base: 342, provider: 39, shipping: 40 },
  { pharmacy: 'Greenwich', product: 'Semaglutide (B6/B12) — 0.25 mg', concentration: '1mg/0.5mg/1ml (1ml vial)', category: 'GLP-1 / Weight Loss', base: 42, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'Semaglutide (B6/B12) — 0.5 mg', concentration: '2mg/0.5mg/1ml (1ml vial)', category: 'GLP-1 / Weight Loss', base: 48, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'Semaglutide (B6/B12) — 0.75 mg', concentration: '4mg/0.5mg/1ml (1ml vial)', category: 'GLP-1 / Weight Loss', base: 62, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'Semaglutide (B6/B12) — 1.0 mg', concentration: '6mg/0.5mg/1ml (1ml vial)', category: 'GLP-1 / Weight Loss', base: 83, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'Semaglutide (B6/B12) — 1.25 mg', concentration: '10mg/0.5mg/1ml (1ml vial)', category: 'GLP-1 / Weight Loss', base: 95, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'Tirzepatide (B6/B12) — 2.5 mg', concentration: '5mg/0.5mg/1ml (2ml vial)', category: 'GLP-1 / Weight Loss', base: 97, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'Tirzepatide (B6/B12) — 5.0 mg', concentration: '10mg/0.5mg/1ml (2ml vial)', category: 'GLP-1 / Weight Loss', base: 125, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'Tirzepatide (B6/B12) — 7.5 mg', concentration: '15mg/0.5mg/1ml (2ml vial)', category: 'GLP-1 / Weight Loss', base: 138, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'Tirzepatide (B6/B12) — 10.0 mg', concentration: '20mg/0.5mg/1ml (2ml vial)', category: 'GLP-1 / Weight Loss', base: 166, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'Tirzepatide (B6/B12) — 12.5 mg', concentration: '25mg/0.5mg/1ml (2ml vial)', category: 'GLP-1 / Weight Loss', base: 193, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'Tirzepatide (B6/B12) — 15.0 mg', concentration: '30mg/0.5mg/1ml (2ml vial)', category: 'GLP-1 / Weight Loss', base: 221, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'AOD-9604', concentration: '1.2mg/mL (5mL)', category: 'GLP-1 / Weight Loss', base: 90, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'AOD-9604 / MOTs-C / Tesamorelin', concentration: '1.2/2/3 mg/mL (5mL)', category: 'GLP-1 / Weight Loss', base: 125, provider: 39, shipping: 30 },

  // Peptides
  { pharmacy: 'Striker', product: 'GLOW Stack (GHK-Cu / BPC-157 / TB-500)', concentration: 'Combo vial', category: 'Peptides', base: 121, provider: 39, shipping: 40 },
  { pharmacy: 'Greenwich', product: 'BPC-157', concentration: '3mg/mL (5mL)', category: 'Peptides', base: 90, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'BPC-157 / GHK-Cu / KPV / TB-500', concentration: '3/10/3/3 mg/mL (5mL)', category: 'Peptides', base: 125, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'BPC-157 / KPV / TB-500', concentration: '3/3/3 mg/mL (5mL)', category: 'Peptides', base: 125, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'BPC-157 / TB-500', concentration: '3/3 mg/mL (5mL)', category: 'Peptides', base: 125, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'CJC-1295 / Ipamorelin', concentration: '1.2/2 mg (5mL)', category: 'Peptides', base: 125, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'DSIP', concentration: '1mg/mL (5mL)', category: 'Peptides', base: 90, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'DSIP / BPC / CJC', concentration: '1/2/2 mg (5mL)', category: 'Peptides', base: 125, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'Epithalon', concentration: '2mg/mL (5mL)', category: 'Peptides', base: 90, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'GHK-Cu', concentration: '10mg/mL (5mL)', category: 'Peptides', base: 90, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'Glutathione (injection)', concentration: '200mg/mL (10mL)', category: 'Peptides', base: 27, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'Kisspeptin', concentration: '1mg/mL (5mL)', category: 'Peptides', base: 90, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'Lipo-B (MICB)', concentration: '25/50/50/1 mg/mL (10mL)', category: 'Peptides', base: 35, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'LL-37', concentration: '2mg (5mL)', category: 'Peptides', base: 90, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'MOTS-C', concentration: '2mg/mL (5mL)', category: 'Peptides', base: 90, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'NAD+ Solution', concentration: '100mg/mL (10mL)', category: 'Peptides', base: 90, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'Pinealon / PE22-28 / Selank', concentration: '2/2/2 mg/mL (5mL)', category: 'Peptides', base: 125, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'PT-141', concentration: '2mg/mL (5mL)', category: 'Peptides', base: 90, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'Semax / Selank', concentration: '1/1 mg (5mL)', category: 'Peptides', base: 125, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'Sermorelin', concentration: '2mg/mL (5mL)', category: 'Peptides', base: 83, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'Tesamorelin', concentration: '3mg/mL (5mL)', category: 'Peptides', base: 90, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'Tesamorelin / Ipamorelin', concentration: '3/2 mg/mL (5mL)', category: 'Peptides', base: 125, provider: 39, shipping: 30 },
  { pharmacy: 'Greenwich', product: 'Thymosin', concentration: '5mg (5mL)', category: 'Peptides', base: 90, provider: 39, shipping: 30 },

  // Nasal Sprays
  { pharmacy: 'Strive', product: 'Glutathione Nasal Spray', concentration: '200mg/mL (10mL)', category: 'Nasal Sprays', base: 52, provider: 39, shipping: 20 },
  { pharmacy: 'Strive', product: 'NAD+ Nasal Spray', concentration: '300mg/mL (10mL)', category: 'Nasal Sprays', base: 52, provider: 39, shipping: 20 },
  { pharmacy: 'Strive', product: 'PT-141 Nasal Spray', concentration: '100mg/mL (5mg vial)', category: 'Nasal Sprays', base: 52, provider: 39, shipping: 20 },

  // TRT (non CA/WI)
  { pharmacy: 'Empower', product: 'Testosterone Cypionate (lab required)', concentration: '3-month supply', category: 'TRT (non CA/WI)', base: 115, provider: 69, shipping: 27 },
  { pharmacy: 'Empower', product: 'Enclomiphene', concentration: '25mg (90 caps)', category: 'TRT (non CA/WI)', base: 168, provider: 69, shipping: 15 },
  { pharmacy: 'Empower', product: 'GHK-Cu Cream', concentration: '0.5% (30mL)', category: 'TRT (non CA/WI)', base: 113, provider: 39, shipping: 15 },

  // TRT (CA/WI)
  { pharmacy: 'TPH', product: 'Testosterone Cypionate (lab required)', concentration: '3-month supply', category: 'TRT (CA/WI)', base: 134, provider: 69, shipping: 23 },
  { pharmacy: 'TPH', product: 'Enclomiphene (lab required)', concentration: '25mg (90 caps)', category: 'TRT (CA/WI)', base: 135, provider: 69, shipping: 23 },
  { pharmacy: 'TPH', product: 'hCG (lab required)', concentration: '1-month supply', category: 'TRT (CA/WI)', base: 215, provider: 69, shipping: 23 },

  // ED
  { pharmacy: 'TPH', product: 'Viagra 20mg', concentration: '20 capsules', category: 'ED', base: 25, provider: 39, shipping: 23 },
  { pharmacy: 'TPH', product: 'Viagra 100mg', concentration: '20 capsules', category: 'ED', base: 35, provider: 39, shipping: 23 },
  { pharmacy: 'TPH', product: 'Cialis 5mg', concentration: '60 capsules', category: 'ED', base: 55, provider: 39, shipping: 23 },
  { pharmacy: 'TPH', product: 'Cialis 10mg', concentration: '20 capsules', category: 'ED', base: 25, provider: 39, shipping: 23 },
  { pharmacy: 'TPH', product: 'Cialis 20mg', concentration: '20 capsules', category: 'ED', base: 35, provider: 39, shipping: 23 },
  { pharmacy: 'TPH', product: 'Vardenafil 20mg', concentration: '20 capsules', category: 'ED', base: 60, provider: 39, shipping: 23 },

  // Hair Health
  { pharmacy: 'Epiq', product: 'Finasteride 1mg / Minoxidil 2.5mg / Biotin / D3 / K2', concentration: '30 capsules', category: 'Hair Health', base: 60, provider: 39, shipping: 10 },
  { pharmacy: 'Epiq', product: 'Dutasteride 0.5mg / Minoxidil 2.5mg / Biotin / D3 / K2', concentration: '30 capsules', category: 'Hair Health', base: 65, provider: 39, shipping: 10 },
  { pharmacy: 'Epiq', product: 'Minoxidil 2.5mg / Biotin / D3 / K2', concentration: '30 capsules', category: 'Hair Health', base: 29, provider: 39, shipping: 10 },
  { pharmacy: 'Epiq', product: 'Minoxidil / GHK-Cu / Apigenin / Fisetin', concentration: '30 capsules', category: 'Hair Health', base: 35, provider: 39, shipping: 10 },

  // Female HRT
  { pharmacy: 'BEL', product: 'Estradiol Cream (vaginal)', concentration: '2mg/mL (30mL)', category: 'Female HRT', base: 49, provider: 69, shipping: 18 },
  { pharmacy: 'BEL', product: 'Estradiol Cream', concentration: '2mg/mL (45mL)', category: 'Female HRT', base: 74, provider: 69, shipping: 18 },
  { pharmacy: 'BEL', product: 'Estradiol / Testosterone Cream', concentration: '2/1 mg/mL (45mL)', category: 'Female HRT', base: 94, provider: 69, shipping: 18 },
  { pharmacy: 'BEL', product: 'Progesterone Capsules', concentration: 'up to 200mg (90 caps)', category: 'Female HRT', base: 77, provider: 69, shipping: 18 },
];

export type Stack = {
  name: string;
  tagline: string;
  goal: string;
  components: { product: string; concentration: string }[];
};

function find(product: string, concentration: string) {
  const i = ITEMS.find((x) => x.product === product && x.concentration === concentration);
  if (!i) throw new Error(`Missing: ${product} ${concentration}`);
  return i;
}

export function stackTotal(s: Stack) {
  return s.components.reduce((sum, c) => sum + customerPrice(find(c.product, c.concentration)), 0);
}

export const STACKS: Stack[] = [
  {
    name: 'The Forge',
    tagline: 'Aggressive fat loss + recovery + body recomp',
    goal: 'Weight loss with muscle protection, recovery, and skin support',
    components: [
      { product: 'Retatrutide', concentration: '4mg/0.5ml (2ml vial)' },
      { product: 'MOTS-C', concentration: '2mg/mL (5mL)' },
      { product: 'Tesamorelin', concentration: '3mg/mL (5mL)' },
      { product: 'BPC-157 / KPV / TB-500', concentration: '3/3/3 mg/mL (5mL)' },
    ],
  },
  {
    name: 'Reset & Recover',
    tagline: 'Restore growth signaling, recovery, and longevity',
    goal: 'Sleep, recovery, soft tissue, cellular repair',
    components: [
      { product: 'CJC-1295 / Ipamorelin', concentration: '1.2/2 mg (5mL)' },
      { product: 'BPC-157 / TB-500', concentration: '3/3 mg/mL (5mL)' },
      { product: 'NAD+ Solution', concentration: '100mg/mL (10mL)' },
    ],
  },
  {
    name: 'Performance Edge',
    tagline: 'For driven members optimizing every pillar',
    goal: 'Drive, recovery, libido, longevity',
    components: [
      { product: 'Tesamorelin / Ipamorelin', concentration: '3/2 mg/mL (5mL)' },
      { product: 'BPC-157 / TB-500', concentration: '3/3 mg/mL (5mL)' },
      { product: 'PT-141', concentration: '2mg/mL (5mL)' },
      { product: 'NAD+ Solution', concentration: '100mg/mL (10mL)' },
    ],
  },
  {
    name: 'GLOW Aesthetic',
    tagline: 'Skin, hair, recovery, and visible glow',
    goal: 'Aesthetic transformation from the inside out',
    components: [
      { product: 'GLOW Stack (GHK-Cu / BPC-157 / TB-500)', concentration: 'Combo vial' },
      { product: 'GHK-Cu', concentration: '10mg/mL (5mL)' },
      { product: 'Glutathione (injection)', concentration: '200mg/mL (10mL)' },
    ],
  },
  {
    name: 'Mind & Mood',
    tagline: 'Cognition, focus, sleep architecture',
    goal: 'Nervous system, sleep, cognition',
    components: [
      { product: 'Semax / Selank', concentration: '1/1 mg (5mL)' },
      { product: 'DSIP', concentration: '1mg/mL (5mL)' },
      { product: 'Pinealon / PE22-28 / Selank', concentration: '2/2/2 mg/mL (5mL)' },
    ],
  },
  {
    name: 'Lean Architect',
    tagline: 'Tirzepatide-driven body recomposition',
    goal: 'Aggressive fat loss with recovery layered in',
    components: [
      { product: 'Tirzepatide (B6/B12) — 10.0 mg', concentration: '20mg/0.5mg/1ml (2ml vial)' },
      { product: 'AOD-9604 / MOTs-C / Tesamorelin', concentration: '1.2/2/3 mg/mL (5mL)' },
      { product: 'BPC-157 / TB-500', concentration: '3/3 mg/mL (5mL)' },
    ],
  },
];
