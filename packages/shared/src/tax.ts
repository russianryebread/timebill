import type { Cents } from './money';

export type FilingStatus = 'single' | 'mfj' | 'mfs' | 'hoh';

// ---------------------------------------------------------------------------
// Self-employment tax
// ---------------------------------------------------------------------------

// Social Security wage base — placeholder; update yearly. The IRS sets this
// number annually; 2025 was $176,100, 2026 not yet published as of writing.
// We use $177,000 as a forward-looking placeholder.
export const SS_WAGE_BASE_CENTS_2026 = 17_700_000;
export const SS_RATE = 0.124;
export const MEDICARE_RATE = 0.029;
export const SE_TAX_INCOME_FACTOR = 0.9235;

/**
 * Self-employment tax: 15.3% on 92.35% of net SE earnings, with the SS
 * portion capped at the annual wage base. Medicare is uncapped (additional
 * 0.9% Medicare surtax on high earners is NOT modeled here — out of scope).
 *
 * Returns 0 for non-positive income.
 */
export function selfEmploymentTax(netSEIncomeCents: Cents): Cents {
  if (netSEIncomeCents <= 0) return 0;
  const taxableBase = Math.round(netSEIncomeCents * SE_TAX_INCOME_FACTOR);
  const ssTaxable = Math.min(taxableBase, SS_WAGE_BASE_CENTS_2026);
  const ssTax = Math.round(ssTaxable * SS_RATE);
  const medicareTax = Math.round(taxableBase * MEDICARE_RATE);
  return ssTax + medicareTax;
}

// ---------------------------------------------------------------------------
// Federal income tax
//
// Placeholder 2025-ish brackets. **Update yearly** when the IRS publishes
// inflation-adjusted figures. Brackets are encoded as cumulative marginal
// brackets in cents: each entry is [upperBoundInclusiveCents, rate]. The
// final entry's upper bound is Infinity.
// ---------------------------------------------------------------------------

type Bracket = [upperBoundCents: number, rate: number];

// 2025 IRS brackets (placeholder; update yearly).
const BRACKETS_2025: Record<FilingStatus, Bracket[]> = {
  single: [
    [1_192_500, 0.10],
    [4_847_500, 0.12],
    [10_335_000, 0.22],
    [19_730_000, 0.24],
    [25_052_500, 0.32],
    [62_635_000, 0.35],
    [Infinity, 0.37]
  ],
  mfj: [
    [2_385_000, 0.10],
    [9_695_000, 0.12],
    [20_670_000, 0.22],
    [39_460_000, 0.24],
    [50_105_000, 0.32],
    [75_160_000, 0.35],
    [Infinity, 0.37]
  ],
  mfs: [
    [1_192_500, 0.10],
    [4_847_500, 0.12],
    [10_335_000, 0.22],
    [19_730_000, 0.24],
    [25_052_500, 0.32],
    [37_580_000, 0.35],
    [Infinity, 0.37]
  ],
  hoh: [
    [1_700_000, 0.10],
    [6_485_000, 0.12],
    [10_335_000, 0.22],
    [19_730_000, 0.24],
    [25_052_500, 0.32],
    [62_635_000, 0.35],
    [Infinity, 0.37]
  ]
};

// 2025 standard deduction in cents (placeholder; update yearly).
const STANDARD_DEDUCTION_2025: Record<FilingStatus, Cents> = {
  single: 1_500_000,
  mfj: 3_000_000,
  mfs: 1_500_000,
  hoh: 2_250_000
};

export const STANDARD_DEDUCTION = STANDARD_DEDUCTION_2025;

/**
 * Federal income tax owed on `taxableIncomeCents`, applying the standard
 * deduction for the chosen filing status first, then bracketed marginal
 * tax. Returns 0 if income after the standard deduction is non-positive.
 *
 * NOTE: Uses 2025 placeholder brackets and standard deduction. Update
 * yearly when the IRS publishes the next year's figures.
 */
export function federalIncomeTax(
  taxableIncomeCents: Cents,
  filingStatus: FilingStatus
): Cents {
  const std = STANDARD_DEDUCTION_2025[filingStatus];
  const taxable = Math.max(0, taxableIncomeCents - std);
  if (taxable === 0) return 0;
  return applyBrackets(taxable, BRACKETS_2025[filingStatus]);
}

function applyBrackets(income: Cents, brackets: Bracket[]): Cents {
  let tax = 0;
  let prevUpper = 0;
  for (const [upper, rate] of brackets) {
    if (income <= prevUpper) break;
    const slice = Math.min(income, upper) - prevUpper;
    tax += slice * rate;
    if (income <= upper) break;
    prevUpper = upper;
  }
  return Math.round(tax);
}

/**
 * Backwards-compat shim — kept so any older callers still resolve.
 * Prefer `federalIncomeTax` going forward.
 */
export function estimatedFederalIncomeTax(
  taxableIncomeCents: Cents,
  filingStatus: FilingStatus
): Cents {
  return federalIncomeTax(taxableIncomeCents, filingStatus);
}

// ---------------------------------------------------------------------------
// Qualified Business Income (QBI) deduction — Section 199A
//
// Simplified: 20% of QBI (which we approximate as net SE income minus the
// employer-equivalent half of SE tax). We cap at 20% of pre-QBI taxable
// income. This intentionally ignores:
//   - W-2 wage / UBIA limits
//   - Specified Service Trade or Business (SSTB) phaseouts
//   - Income threshold phase-ins
// Those only kick in at higher income levels and require additional inputs
// the app doesn't collect. Documented limitation.
// ---------------------------------------------------------------------------

/**
 * 20% QBI deduction (simplified — no W-2 wage limit, no SSTB phaseout).
 * Pass the **pre-QBI taxable income** as the second arg if you want the
 * "lesser of" cap applied. Returns 0 for non-positive inputs.
 */
export function qbiDeduction(
  netSEIncomeCents: Cents,
  preQbiTaxableIncomeCents?: Cents
): Cents {
  if (netSEIncomeCents <= 0) return 0;
  const halfSe = Math.round(selfEmploymentTax(netSEIncomeCents) / 2);
  const qbi = Math.max(0, netSEIncomeCents - halfSe);
  const fromQbi = Math.round(qbi * 0.20);
  if (preQbiTaxableIncomeCents === undefined) return fromQbi;
  const cap = Math.max(0, Math.round(preQbiTaxableIncomeCents * 0.20));
  return Math.min(fromQbi, cap);
}

// ---------------------------------------------------------------------------
// Headline annual estimate
// ---------------------------------------------------------------------------

export type AnnualTaxBreakdown = {
  seTax: Cents;
  federalIncomeTax: Cents;
  qbi: Cents;
  totalTax: Cents;
  /** Total tax ÷ gross-ish income (netSE + other). Float in [0, 1]. */
  effectiveRate: number;
};

export function estimateAnnualTax(args: {
  netSEIncomeCents: Cents;
  filingStatus: FilingStatus;
  otherIncomeCents?: Cents;
  estimatedDeductionsCents?: Cents;
}): AnnualTaxBreakdown {
  const netSE = Math.max(0, args.netSEIncomeCents);
  const other = Math.max(0, args.otherIncomeCents ?? 0);
  const extraDeductions = Math.max(0, args.estimatedDeductionsCents ?? 0);

  const seTax = selfEmploymentTax(netSE);
  const halfSe = Math.round(seTax / 2);

  // Pre-QBI taxable income: net SE + other income, minus the employer-half
  // of SE tax (above-the-line deduction) and any extra deductions the user
  // entered. Standard deduction is applied inside federalIncomeTax().
  const preQbi = Math.max(0, netSE + other - halfSe - extraDeductions);

  const qbi = qbiDeduction(netSE, preQbi);

  const federalTax = federalIncomeTax(Math.max(0, preQbi - qbi), args.filingStatus);

  const total = seTax + federalTax;
  const denom = netSE + other;
  const effectiveRate = denom > 0 ? total / denom : 0;

  return {
    seTax,
    federalIncomeTax: federalTax,
    qbi,
    totalTax: total,
    effectiveRate
  };
}

// ---------------------------------------------------------------------------
// Quarterly schedule
// ---------------------------------------------------------------------------

export function quarterlyEstimate(annualTaxOwed: Cents, quarter: 1 | 2 | 3 | 4): Cents {
  void quarter;
  if (annualTaxOwed <= 0) return 0;
  return Math.round(annualTaxOwed / 4);
}

/**
 * Safe-harbor minimum required payment for the year to avoid the
 * underpayment penalty: 100% of prior year tax, or 110% if current AGI
 * exceeds $150,000.
 */
export function safeHarborTarget(priorYearTaxCents: Cents, currentAGICents: Cents): Cents {
  if (priorYearTaxCents <= 0) return 0;
  const multiplier = currentAGICents > 15_000_000 ? 1.10 : 1.00;
  return Math.round(priorYearTaxCents * multiplier);
}

/**
 * IRS estimated tax payment due dates. Q4's deadline falls in January of
 * the following year. We return a Date at noon UTC to dodge timezone
 * edge cases for callers that only care about the calendar day.
 */
export function quarterDueDate(year: number, quarter: 1 | 2 | 3 | 4): Date {
  switch (quarter) {
    case 1:
      return new Date(Date.UTC(year, 3, 15, 12, 0, 0)); // Apr 15
    case 2:
      return new Date(Date.UTC(year, 5, 15, 12, 0, 0)); // Jun 15
    case 3:
      return new Date(Date.UTC(year, 8, 15, 12, 0, 0)); // Sep 15
    case 4:
      return new Date(Date.UTC(year + 1, 0, 15, 12, 0, 0)); // Jan 15 next year
  }
}
