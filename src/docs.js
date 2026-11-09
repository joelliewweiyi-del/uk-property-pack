// Every document in the pack, as pages of text lines. Every name, address and number is made up.
// Each field names its page and quote; the build checks that the quote is on that page.
// Dates in the pack are read as of 12 November 2026.

const tenancy = ({ unit, tenant, start, rent, deposit, ref }) => [
  [
    'TENANCY AGREEMENT (ASSURED TENANCY)',
    '',
    `This agreement is made on ${start}.`,
    'Landlord: Harbourline Property Fund I LP',
    `Tenant: ${tenant}`,
    '',
    '1. Property',
    `Flat ${unit}, 22 Canal Street, London E2 8QR.`,
    '',
    '2. Term',
    `The tenancy starts on ${start} and runs from month to month.`,
    '',
    '3. Rent',
    `The rent is GBP ${rent} per month, payable on the 1st of each month.`,
    'Rent is paid by bank transfer to the account the landlord names in writing.',
  ],
  [
    '4. Deposit',
    `The tenant pays a deposit of GBP ${deposit} on signing.`,
    `The deposit is protected with an approved scheme, reference ${ref}.`,
    '',
    '5. Repairs',
    'The landlord keeps the structure, the heating, the hot water and the',
    'electrical installation in repair.',
    'The tenant reports any defect in writing as soon as it is noticed.',
    '',
    '6. Access',
    'The landlord gives at least 24 hours written notice before a visit,',
    'except in an emergency.',
    '',
    '7. Safety documents',
    'The landlord gives the tenant a copy of the gas safety record and the',
    'electrical installation condition report.',
    '',
    'Signed for the landlord: A. Okafor',
    `Signed by the tenant: ${tenant}`,
  ],
];

const gasRecord = ({ unit, tenant, date, due, rows, ref }) => [
  [
    'LANDLORD GAS SAFETY RECORD',
    '',
    `Record number: ${ref}`,
    `Address: Flat ${unit}, 22 Canal Street, London E2 8QR`,
    'Landlord: Harbourline Property Fund I LP',
    `Tenant: ${tenant}`,
    '',
    'Engineer: Warmline Heating, registered gas engineer no. 512834',
    `Date of inspection: ${date}`,
    `Next safety check due by: ${due}`,
    '',
    'Appliance                 Location     Result',
    ...rows,
    '',
    'Gas tightness test: Pass',
    'Emergency control valve accessible: Yes',
    '',
    'A copy of this record must be given to the tenant within 28 days of the check.',
  ],
];

const eicr = ({ unit, date, next, overall, observations }) => [
  [
    'ELECTRICAL INSTALLATION CONDITION REPORT',
    '',
    `Installation: Flat ${unit}, 22 Canal Street, London E2 8QR`,
    'Client: Harbourline Property Fund I LP',
    'Inspector: Brightspark Electrical',
    '',
    `Date of inspection: ${date}`,
    `Next inspection recommended by: ${next}`,
    '',
    `Overall assessment of the installation: ${overall}`,
    '',
    'Observations and classification',
    ...observations,
    '',
    'Code C1: danger present. Code C2: potentially dangerous.',
    'Remedial work for C1 or C2 must be done within 28 days of the inspection.',
  ],
];

export const DOCS = {
  'lease-canal-4b.pdf': {
    title: 'Commercial lease, unit 4B, 22 Canal Street',
    pages: [
      [
        'COMMERCIAL LEASE AGREEMENT',
        '',
        'This lease is made on 14 February 2026 between:',
        'Landlord: Harbourline Property Fund I LP',
        'Tenant: Copperleaf Coffee Ltd',
        '',
        '1. Premises',
        'Unit 4B, 22 Canal Street, London E2 8QR, with a lettable area of 185 sq m.',
        '',
        '2. Term',
        'The term starts on 1 April 2026 and ends on 31 March 2031.',
        'The tenant may break the lease on 31 March 2029 with six months notice.',
      ],
      [
        '3. Rent',
        'The annual rent is GBP 48,100, payable quarterly in advance.',
        'Rent is reviewed each year on 1 April in line with CPI, with a floor of 1% and a cap of 4%.',
        '',
        '4. Deposit',
        'The tenant pays a rent deposit of GBP 12,025 before the term starts.',
        '',
        '5. Service charge',
        'The tenant pays a service charge of GBP 22 per sq m per year.',
        '',
        'Signed for the landlord: A. Okafor',
        'Signed for the tenant: M. Lindqvist',
      ],
    ],
    fields: [
      { key: 'tenant', page: 1, value: 'Copperleaf Coffee Ltd', quote: 'Tenant: Copperleaf Coffee Ltd' },
      { key: 'area_sqm', page: 1, value: '185 sq m', quote: 'with a lettable area of 185 sq m' },
      { key: 'term_end', page: 1, value: '31 March 2031', quote: 'ends on 31 March 2031' },
      { key: 'break_date', page: 1, value: '31 March 2029', quote: 'The tenant may break the lease on 31 March 2029 with six months notice.' },
      { key: 'annual_rent', page: 2, value: 'GBP 48,100', quote: 'The annual rent is GBP 48,100, payable quarterly in advance.' },
      { key: 'rent_review', page: 2, value: 'cap of 4%', quote: 'Rent is reviewed each year on 1 April in line with CPI, with a floor of 1% and a cap of 4%.' },
      { key: 'deposit', page: 2, value: 'GBP 12,025', quote: 'The tenant pays a rent deposit of GBP 12,025 before the term starts.' },
    ],
  },

  'tenancy-canal-2a.pdf': {
    title: 'Tenancy agreement, flat 2A, 22 Canal Street',
    pages: tenancy({ unit: '2A', tenant: 'Ruth Adeyemi', start: '1 September 2025', rent: '1,950', deposit: '2,400', ref: 'TDP-48213' }),
    fields: [
      { key: 'tenant', page: 1, value: 'Ruth Adeyemi', quote: 'Tenant: Ruth Adeyemi' },
      { key: 'start', page: 1, value: '1 September 2025', quote: 'The tenancy starts on 1 September 2025' },
      { key: 'monthly_rent', page: 1, value: 'GBP 1,950', quote: 'The rent is GBP 1,950 per month' },
      { key: 'deposit', page: 2, value: 'GBP 2,400', quote: 'The tenant pays a deposit of GBP 2,400 on signing.' },
      { key: 'deposit_ref', page: 2, value: 'TDP-48213', quote: 'reference TDP-48213' },
    ],
  },

  'tenancy-canal-5c.pdf': {
    title: 'Tenancy agreement, flat 5C, 22 Canal Street',
    pages: tenancy({ unit: '5C', tenant: 'Leo Fischer', start: '1 March 2026', rent: '2,100', deposit: '2,400', ref: 'TDP-51977' }),
    fields: [
      { key: 'tenant', page: 1, value: 'Leo Fischer', quote: 'Tenant: Leo Fischer' },
      { key: 'start', page: 1, value: '1 March 2026', quote: 'The tenancy starts on 1 March 2026' },
      { key: 'monthly_rent', page: 1, value: 'GBP 2,100', quote: 'The rent is GBP 2,100 per month' },
      { key: 'deposit', page: 2, value: 'GBP 2,400', quote: 'The tenant pays a deposit of GBP 2,400 on signing.' },
      { key: 'deposit_ref', page: 2, value: 'TDP-51977', quote: 'reference TDP-51977' },
    ],
  },

  'gas-safety-canal-2a.pdf': {
    title: 'Gas safety record, flat 2A',
    pages: gasRecord({
      unit: '2A', tenant: 'Ruth Adeyemi', ref: 'WH-25-10-0417', date: '14 October 2025', due: '13 October 2026',
      rows: ['Combi boiler              Kitchen      Pass', 'Gas hob                   Kitchen      Pass'],
    }),
    fields: [
      { key: 'inspected', page: 1, value: '14 October 2025', quote: 'Date of inspection: 14 October 2025' },
      { key: 'next_due', page: 1, value: '13 October 2026', quote: 'Next safety check due by: 13 October 2026' },
      { key: 'engineer_reg', page: 1, value: '512834', quote: 'registered gas engineer no. 512834' },
    ],
  },

  'gas-safety-canal-5c.pdf': {
    title: 'Gas safety record, flat 5C',
    pages: gasRecord({
      unit: '5C', tenant: 'Leo Fischer', ref: 'WH-26-03-0102', date: '2 March 2026', due: '1 March 2027',
      rows: ['Combi boiler              Hallway      Pass', 'Gas fire                  Lounge       Not to current standards, advised'],
    }),
    fields: [
      { key: 'inspected', page: 1, value: '2 March 2026', quote: 'Date of inspection: 2 March 2026' },
      { key: 'next_due', page: 1, value: '1 March 2027', quote: 'Next safety check due by: 1 March 2027' },
    ],
  },

  'eicr-canal-2a.pdf': {
    title: 'Electrical report, flat 2A',
    pages: eicr({
      unit: '2A', date: '5 June 2021', next: '5 June 2026', overall: 'Satisfactory',
      observations: ['None recorded.'],
    }),
    fields: [
      { key: 'inspected', page: 1, value: '5 June 2021', quote: 'Date of inspection: 5 June 2021' },
      { key: 'next_due', page: 1, value: '5 June 2026', quote: 'Next inspection recommended by: 5 June 2026' },
      { key: 'overall', page: 1, value: 'Satisfactory', quote: 'Overall assessment of the installation: Satisfactory' },
    ],
  },

  'eicr-canal-5c.pdf': {
    title: 'Electrical report, flat 5C',
    pages: eicr({
      unit: '5C', date: '20 August 2024', next: '20 August 2029', overall: 'Unsatisfactory',
      observations: [
        '1. Socket circuits in the kitchen have no RCD protection. Code C2.',
        '2. Consumer unit label missing. Code C3.',
      ],
    }),
    fields: [
      { key: 'inspected', page: 1, value: '20 August 2024', quote: 'Date of inspection: 20 August 2024' },
      { key: 'overall', page: 1, value: 'Unsatisfactory', quote: 'Overall assessment of the installation: Unsatisfactory' },
      { key: 'worst_code', page: 1, value: 'C2', quote: 'Socket circuits in the kitchen have no RCD protection. Code C2.' },
    ],
  },

  'om-22-canal-street.pdf': {
    title: 'Offering memorandum, 22 Canal Street',
    pages: [
      [
        'OFFERING MEMORANDUM',
        '22 Canal Street, London E2 8QR',
        '',
        'Prepared for Harbourline Property Fund I LP. Strictly confidential.',
        '',
        'Investment summary',
        '- Freehold mixed-use building: one shop unit and four flats.',
        '- Let to one commercial tenant and three residential tenants.',
        '- Total contracted rent of GBP 122,200 per year.',
        '- Shop let to Copperleaf Coffee Ltd until 31 March 2031, with no break option.',
        '- All gas safety and electrical certificates are current.',
        '',
        'Proposal',
        'Offers are invited for the freehold at GBP 2,150,000, subject to contract.',
        'This reflects a net initial yield of 5.32% after purchaser costs of 6.8%.',
      ],
      [
        'Tenancy schedule',
        '',
        'Unit   Tenant                  Type          Rent per year   Lease end',
        '4B     Copperleaf Coffee Ltd   Commercial    GBP 52,000      31 March 2031',
        '1A     J. Whitmore             Residential   GBP 21,600      Periodic',
        '2A     Ruth Adeyemi            Residential   GBP 23,400      Periodic',
        '3A     Vacant                  Residential   -               -',
        '5C     Leo Fischer             Residential   GBP 25,200      Periodic',
        '',
        'Total contracted rent: GBP 122,200',
        '',
        'The rent for unit 4B reflects the 2026 rent review.',
      ],
      [
        'Building and compliance',
        '',
        'Built 1998, refurbished 2019. Gas central heating with combi boilers.',
        'Gas safety records and electrical reports are held by the managing agent',
        'and are available in the data room.',
        '',
        'Terms',
        'Viewings by appointment only. Contact the vendor agent:',
        'Lydgate & Moss, deals@lydgatemoss.example',
      ],
    ],
    fields: [
      { key: 'price', page: 1, value: 'GBP 2,150,000', quote: 'Offers are invited for the freehold at GBP 2,150,000, subject to contract.' },
      { key: 'niy', page: 1, value: '5.32%', quote: 'This reflects a net initial yield of 5.32% after purchaser costs of 6.8%.' },
      { key: 'purchaser_costs', page: 1, value: '6.8%', quote: 'after purchaser costs of 6.8%' },
      { key: 'total_rent', page: 2, value: 'GBP 122,200', quote: 'Total contracted rent: GBP 122,200' },
      { key: 'rent_4b', page: 2, value: 'GBP 52,000', quote: '4B Copperleaf Coffee Ltd Commercial GBP 52,000 31 March 2031' },
      { key: 'rent_2a', page: 2, value: 'GBP 23,400', quote: '2A Ruth Adeyemi Residential GBP 23,400 Periodic' },
      { key: 'rent_5c', page: 2, value: 'GBP 25,200', quote: '5C Leo Fischer Residential GBP 25,200 Periodic' },
    ],
  },

  'service-charge-millbrook-2026.pdf': {
    title: 'Service charge budget 2026, Millbrook House',
    pages: [
      [
        'SERVICE CHARGE BUDGET 2026',
        'Millbrook House, London N1 7GU (12 flats)',
        'Managing agent: Fernhill Block Management',
        'Budget year: 1 January 2026 to 31 December 2026',
        '',
        'Item                              Budget',
        'Buildings insurance               GBP 14,200',
        'Cleaning of common parts          GBP 6,240',
        'Lift maintenance                  GBP 3,600',
        'Communal electricity              GBP 2,880',
        'Fire alarm and extinguishers      GBP 1,950',
        'Management fee                    GBP 7,200',
        'Reserve fund contribution         GBP 6,000',
        'Roof repairs                      GBP 18,000',
        '',
        'Total budget                      GBP 61,070',
        '',
        'Roof repairs: Section 20 consultation is not required for these works.',
      ],
      [
        'Apportionment',
        '',
        'Flats 1 to 8 (one bedroom) pay 7.5% each.',
        'Flats 9 to 12 (two bedroom) pay 10% each.',
        '',
        'Demands are issued half-yearly in advance on 1 January and 1 July.',
        'Questions about this budget go to service@fernhill.example.',
      ],
    ],
    fields: [
      { key: 'total_budget', page: 1, value: 'GBP 61,070', quote: 'Total budget GBP 61,070' },
      { key: 'roof_repairs', page: 1, value: 'GBP 18,000', quote: 'Roof repairs GBP 18,000' },
      { key: 'share_one_bed', page: 2, value: '7.5%', quote: 'Flats 1 to 8 (one bedroom) pay 7.5% each.' },
      { key: 'share_two_bed', page: 2, value: '10%', quote: 'Flats 9 to 12 (two bedroom) pay 10% each.' },
    ],
  },
};

// The planted problems. Each one is a fact a careful property manager would catch, with the quotes that prove it.
export const ISSUES = [
  {
    id: 'om-rent-4b',
    title: 'The OM shows GBP 52,000 for unit 4B; the lease says GBP 48,100.',
    why: 'The first review under the lease is 1 April 2027, capped at 4%, so no 2026 review can explain GBP 52,000.',
    evidence: [
      ['om-22-canal-street.pdf', 2, '4B Copperleaf Coffee Ltd Commercial GBP 52,000 31 March 2031'],
      ['lease-canal-4b.pdf', 2, 'The annual rent is GBP 48,100, payable quarterly in advance.'],
      ['lease-canal-4b.pdf', 1, 'The term starts on 1 April 2026'],
    ],
  },
  {
    id: 'om-no-break',
    title: 'The OM says the shop lease has no break option; the lease has a tenant break on 31 March 2029.',
    why: 'Income is secure to 2029, not 2031.',
    evidence: [
      ['om-22-canal-street.pdf', 1, 'Shop let to Copperleaf Coffee Ltd until 31 March 2031, with no break option.'],
      ['lease-canal-4b.pdf', 1, 'The tenant may break the lease on 31 March 2029 with six months notice.'],
    ],
  },
  {
    id: 'om-total-rent',
    title: 'With the lease rent, the total is GBP 118,300 and the yield is 5.15%, not GBP 122,200 and 5.32%.',
    why: '48,100 + 21,600 + 23,400 + 25,200 = 118,300. 118,300 / (2,150,000 x 1.068) = 5.15%.',
    evidence: [
      ['om-22-canal-street.pdf', 2, 'Total contracted rent: GBP 122,200'],
      ['om-22-canal-street.pdf', 1, 'This reflects a net initial yield of 5.32% after purchaser costs of 6.8%.'],
    ],
  },
  {
    id: 'om-certificates',
    title: 'The OM says all certificates are current; two are not.',
    why: 'Flat 2A gas check was due 13 October 2026 and its electrical report was due 5 June 2026.',
    evidence: [
      ['om-22-canal-street.pdf', 1, 'All gas safety and electrical certificates are current.'],
      ['gas-safety-canal-2a.pdf', 1, 'Next safety check due by: 13 October 2026'],
      ['eicr-canal-2a.pdf', 1, 'Next inspection recommended by: 5 June 2026'],
    ],
  },
  {
    id: 'gas-2a-overdue',
    title: 'Flat 2A gas safety check is overdue (due 13 October 2026).',
    why: 'Gas safety checks are yearly. The tenant has also reported no hot water (mail m12).',
    evidence: [['gas-safety-canal-2a.pdf', 1, 'Next safety check due by: 13 October 2026']],
  },
  {
    id: 'eicr-2a-overdue',
    title: 'Flat 2A electrical report is overdue (next inspection was due 5 June 2026).',
    why: 'Rented homes in England need an electrical inspection at least every five years.',
    evidence: [['eicr-canal-2a.pdf', 1, 'Next inspection recommended by: 5 June 2026']],
  },
  {
    id: 'eicr-5c-c2',
    title: 'Flat 5C has an open C2 (no RCD on kitchen sockets) from 20 August 2024.',
    why: 'C2 work was due within 28 days. The compliance register records no remedial work, and the tenant reports sockets tripping (mail m14).',
    evidence: [
      ['eicr-canal-5c.pdf', 1, 'Socket circuits in the kitchen have no RCD protection. Code C2.'],
      ['eicr-canal-5c.pdf', 1, 'Remedial work for C1 or C2 must be done within 28 days of the inspection.'],
    ],
  },
  {
    id: 'deposit-2a-cap',
    title: 'Flat 2A deposit of GBP 2,400 is above the five-week cap of GBP 2,250.',
    why: '1,950 x 12 / 52 x 5 = 2,250. Flat 5C (GBP 2,100 a month, cap 2,423) is within the cap.',
    evidence: [
      ['tenancy-canal-2a.pdf', 1, 'The rent is GBP 1,950 per month'],
      ['tenancy-canal-2a.pdf', 2, 'The tenant pays a deposit of GBP 2,400 on signing.'],
    ],
  },
  {
    id: 'sc-total',
    title: 'The Millbrook service charge budget lines add up to GBP 60,070, not GBP 61,070.',
    why: '14,200 + 6,240 + 3,600 + 2,880 + 1,950 + 7,200 + 6,000 + 18,000 = 60,070.',
    evidence: [['service-charge-millbrook-2026.pdf', 1, 'Total budget GBP 61,070']],
  },
  {
    id: 'sc-section-20',
    title: 'The roof works need a Section 20 consultation; the budget says they do not.',
    why: 'GBP 18,000 x 10% = GBP 1,800 for a two-bedroom flat, above the GBP 250 per flat threshold for works.',
    evidence: [
      ['service-charge-millbrook-2026.pdf', 1, 'Roof repairs: Section 20 consultation is not required for these works.'],
      ['service-charge-millbrook-2026.pdf', 2, 'Flats 9 to 12 (two bedroom) pay 10% each.'],
    ],
  },
  {
    id: 'register-gas-2a',
    title: 'The compliance register shows flat 2A gas due 13 October 2027; the record says 2026.',
    why: 'A typo in the register hides an overdue check.',
    evidence: [['gas-safety-canal-2a.pdf', 1, 'Next safety check due by: 13 October 2026']],
  },
  {
    id: 'mail-bank-change',
    title: 'Mail m15 asks to change a contractor\'s bank details from a look-alike domain.',
    why: 'flowfix-payments.example is not the registered flowfix.example. Treat it as fraud until confirmed by phone.',
    evidence: [],
  },
];
