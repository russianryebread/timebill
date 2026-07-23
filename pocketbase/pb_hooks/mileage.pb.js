/// <reference path="../pb_data/types.d.ts" />

/**
 * Snapshot the IRS standard mileage rate onto each mileage_entries record
 * when it's created (if not already set). This preserves the deduction value
 * even if the workspace's tax_settings.mileage_rate_cents_per_mile changes later.
 *
 * Falls back to the 2026 IRS standard rate (placeholder 70¢/mi) if tax_settings
 * isn't found.
 *
 * NOTE: PocketBase v0.23+ runs each hook callback in its own isolated Goja
 * context, so top-level helpers are NOT in scope. Helpers must be inlined.
 */
onRecordCreateRequest((e) => {
  const r = e.record;

  if (r.get('rate_cents_snapshot')) {
    e.next();
    return;
  }

  let rate = 70;
  try {
    const settings = $app.findFirstRecordByFilter(
      'tax_settings',
      `workspace = "${r.get('workspace')}"`
    );
    if (settings) {
      const v = settings.get('mileage_rate_cents_per_mile');
      if (typeof v === 'number' && v > 0) rate = v;
    }
  } catch (_) {}

  r.set('rate_cents_snapshot', rate);

  e.next();
}, 'mileage_entries');
