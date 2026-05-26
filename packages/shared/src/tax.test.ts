import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  selfEmploymentTax,
  federalIncomeTax,
  qbiDeduction,
  estimateAnnualTax,
  quarterlyEstimate,
  safeHarborTarget,
  quarterDueDate,
  SS_WAGE_BASE_CENTS_2026
} from './tax.ts';

// ---- SE tax ---------------------------------------------------------------

test('selfEmploymentTax: zero income returns 0', () => {
  assert.equal(selfEmploymentTax(0), 0);
});

test('selfEmploymentTax: negative income returns 0', () => {
  assert.equal(selfEmploymentTax(-50_00), 0);
});

test('selfEmploymentTax: small income applies 15.3% on 92.35%', () => {
  // $10,000 -> taxable base $9,235; ssTax = 1145; medicareTax = 268; total ~1413
  const tax = selfEmploymentTax(10_000_00);
  // Sanity: between 14% and 16% of gross.
  assert.ok(tax > 140_000, `expected > $1400, got ${tax}`);
  assert.ok(tax < 160_000, `expected < $1600, got ${tax}`);
  // Exact: 0.9235 * 10000 = 9235; *0.124 = 1145.14, *0.029 = 267.815
  // Rounded: 114514 + 26782 = 141296
  assert.equal(tax, 141_296);
});

test('selfEmploymentTax: income above SS wage base caps SS portion', () => {
  // $300k net SE: taxable base = 277,050; SS cap kicks in at 177,000
  const tax = selfEmploymentTax(300_000_00);
  // SS = 177000 * 0.124 = 21,948
  // Medicare = 277050 * 0.029 = 8034.45 -> 8034
  // Total = 29,982 -> 2,998,245 cents... let's just sanity-check
  const ssPortion = Math.round(SS_WAGE_BASE_CENTS_2026 * 0.124);
  const taxableBase = Math.round(300_000_00 * 0.9235);
  const medicare = Math.round(taxableBase * 0.029);
  assert.equal(tax, ssPortion + medicare);
});

// ---- Federal income tax ---------------------------------------------------

test('federalIncomeTax: zero income returns 0', () => {
  assert.equal(federalIncomeTax(0, 'single'), 0);
});

test('federalIncomeTax: single below standard deduction returns 0', () => {
  // standard deduction is $15,000 placeholder
  assert.equal(federalIncomeTax(10_000_00, 'single'), 0);
});

test('federalIncomeTax: single in 22% bracket — $80k income', () => {
  // taxable after std = 80,000 - 15,000 = 65,000
  // 10% on first 11,925 = 1192.50
  // 12% on (48,475-11,925) = 36,550 * 0.12 = 4,386
  // 22% on (65,000-48,475) = 16,525 * 0.22 = 3,635.50
  // total = 9,214 -> 921,400 cents (give or take a cent from rounding)
  const tax = federalIncomeTax(80_000_00, 'single');
  assert.ok(tax > 900_000 && tax < 940_000, `got ${tax}`);
});

test('federalIncomeTax: mfj at edge of 12% bracket', () => {
  // mfj 12% bracket goes up to $96,950. With $30k std deduction, gross of
  // $126,950 lands exactly at the 12% top.
  const tax = federalIncomeTax(126_950_00, 'mfj');
  // 10% on 23,850 = 2,385
  // 12% on (96,950-23,850) = 73,100 * 0.12 = 8,772
  // total = 11,157
  assert.equal(tax, 11_157_00);
});

// ---- QBI -----------------------------------------------------------------

test('qbiDeduction: zero income returns 0', () => {
  assert.equal(qbiDeduction(0), 0);
});

test('qbiDeduction: small income ~20% of net minus half SE', () => {
  const qbi = qbiDeduction(50_000_00);
  // half SE on 50k ≈ 3,532; QBI ≈ (50,000 - 3,532) * 0.20 ≈ 9,293
  assert.ok(qbi > 900_000 && qbi < 960_000, `got ${qbi}`);
});

test('qbiDeduction: capped at 20% of taxable income', () => {
  // Net SE huge, taxable income small → cap kicks in
  const cap = qbiDeduction(200_000_00, 10_000_00);
  assert.equal(cap, 2_000_00); // 20% of $10k
});

// ---- estimateAnnualTax ----------------------------------------------------

test('estimateAnnualTax: realistic $120k single', () => {
  const r = estimateAnnualTax({
    netSEIncomeCents: 120_000_00,
    filingStatus: 'single'
  });
  // Sanity: SE tax ~ $16,955; federal somewhere around $14k after QBI/std.
  assert.ok(r.seTax > 15_000_00 && r.seTax < 18_000_00, `SE tax: ${r.seTax}`);
  assert.ok(r.federalIncomeTax > 10_000_00 && r.federalIncomeTax < 18_000_00, `fed: ${r.federalIncomeTax}`);
  assert.ok(r.qbi > 0, 'expected non-zero QBI');
  assert.ok(r.totalTax > r.seTax, 'total should exceed SE-only');
  // Effective rate sanity: 20-30% range
  assert.ok(r.effectiveRate > 0.20 && r.effectiveRate < 0.35, `eff rate: ${r.effectiveRate}`);
});

test('estimateAnnualTax: zero income produces zero tax', () => {
  const r = estimateAnnualTax({ netSEIncomeCents: 0, filingStatus: 'single' });
  assert.equal(r.totalTax, 0);
  assert.equal(r.effectiveRate, 0);
});

// ---- quarterlyEstimate ----------------------------------------------------

test('quarterlyEstimate: divides by 4', () => {
  assert.equal(quarterlyEstimate(4000_00, 1), 1000_00);
  assert.equal(quarterlyEstimate(0, 1), 0);
});

// ---- safeHarborTarget -----------------------------------------------------

test('safeHarborTarget: 100% below $150k AGI', () => {
  assert.equal(safeHarborTarget(20_000_00, 100_000_00), 20_000_00);
});

test('safeHarborTarget: 110% above $150k AGI', () => {
  assert.equal(safeHarborTarget(20_000_00, 200_000_00), 22_000_00);
});

// ---- quarterDueDate -------------------------------------------------------

test('quarterDueDate: Q1 = Apr 15, Q4 = Jan 15 next year', () => {
  const q1 = quarterDueDate(2026, 1);
  assert.equal(q1.getUTCMonth(), 3); // April
  assert.equal(q1.getUTCDate(), 15);
  assert.equal(q1.getUTCFullYear(), 2026);

  const q4 = quarterDueDate(2026, 4);
  assert.equal(q4.getUTCMonth(), 0); // January
  assert.equal(q4.getUTCDate(), 15);
  assert.equal(q4.getUTCFullYear(), 2027);
});
