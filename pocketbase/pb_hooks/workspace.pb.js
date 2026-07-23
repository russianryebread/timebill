/// <reference path="../pb_data/types.d.ts" />

/**
 * On user creation: auto-create a personal workspace, seed Schedule C expense
 * categories, and create a default tax_settings row.
 *
 * v1 = single workspace per user; in v2 this becomes opt-in or a setup wizard.
 *
 * Code after e.next() runs after the user record is persisted.
 */
onRecordCreateRequest((e) => {
  e.next();

  const user = e.record;

  // 1. Create workspace
  const workspaces = $app.findCollectionByNameOrId('workspaces');
  const ws = new Record(workspaces, {
    name: 'My Workspace',
    owner: user.id,
    default_currency: 'USD',
    tax_profile_json: {}
  });
  $app.save(ws);

  // 2. Membership row (rule consistency with future team support)
  const members = $app.findCollectionByNameOrId('workspace_members');
  const membership = new Record(members, {
    workspace: ws.id,
    user: user.id,
    role: 'owner'
  });
  $app.save(membership);

  // 3. Seed Schedule C expense categories
  const expenseCategories = $app.findCollectionByNameOrId('expense_categories');
  const SCHEDULE_C_DEFAULTS = [
    ['Advertising', 'Line 8: Advertising'],
    ['Car & Truck', 'Line 9: Car and truck expenses'],
    ['Commissions & Fees', 'Line 10: Commissions and fees'],
    ['Contract Labor', 'Line 11: Contract labor'],
    ['Insurance', 'Line 15: Insurance (other than health)'],
    ['Interest', 'Line 16: Interest'],
    ['Legal & Professional', 'Line 17: Legal and professional services'],
    ['Office Expenses', 'Line 18: Office expense'],
    ['Rent (Equipment)', 'Line 20a: Rent or lease (vehicles, machinery, equipment)'],
    ['Rent (Other)', 'Line 20b: Rent or lease (other business property)'],
    ['Repairs & Maintenance', 'Line 21: Repairs and maintenance'],
    ['Supplies', 'Line 22: Supplies'],
    ['Taxes & Licenses', 'Line 23: Taxes and licenses'],
    ['Travel', 'Line 24a: Travel'],
    ['Meals (50% deductible)', 'Line 24b: Deductible meals'],
    ['Utilities', 'Line 25: Utilities'],
    ['Software & Subscriptions', 'Line 22: Supplies'],
    ['Other Expenses', 'Line 27a: Other expenses']
  ];
  for (const [name, line] of SCHEDULE_C_DEFAULTS) {
    const cat = new Record(expenseCategories, {
      workspace: ws.id,
      name,
      schedule_c_line: line
    });
    $app.save(cat);
  }

  // 4. Default tax settings (2026 IRS standard mileage rate placeholder = 70¢/mi)
  const taxSettings = $app.findCollectionByNameOrId('tax_settings');
  const settings = new Record(taxSettings, {
    workspace: ws.id,
    filing_status: 'single',
    state: '',
    estimated_other_income_cents: 0,
    mileage_rate_cents_per_mile: 70,
    quarterly_safe_harbor_pct: 110
  });
  $app.save(settings);
}, 'users');
