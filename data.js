window.appData = {
  truck: {
    name: '1984 Chevy C10',
    buildGoal: 'Street/strip weekend truck',
    currentPhase: 'Front Suspension / Steering',
    totalSpent: 5569.00,
    truckFundLeft: 826.23,
  },
  progress: [
    { area: 'Front end', title: 'Front coilover conversion + lower control arms installed', status: 'done', updated: '2025-11-22' },
    { area: 'Steering', title: 'Idler arm, center link, pitman arm installed', status: 'done', updated: '2026-03-15' },
    { area: 'Steering', title: 'Borgeson steering box installed', status: 'done', updated: '2026-03-16' },
    { area: 'Front end', title: 'Front end mocked up, final ride height later', status: 'in_progress', updated: '2026-03-16' },
    { area: 'Rear suspension', title: 'Rear suspension parts bought, shocks not confirmed', status: 'in_progress', updated: '2026-03-28' },
    { area: 'Steering', title: 'Install tie rods', status: 'next', updated: '2026-04-05' },
    { area: 'Front end', title: 'Install front sway bar', status: 'next', updated: '2026-04-05' },
    { area: 'Rear end', title: 'Plan rear-end internals', status: 'next', updated: '2026-04-05' }
  ],
  parts: [
    { name: 'Aldan coilovers', category: 'Front suspension', status: 'Installed', vendor: 'Aldan', price: 916.72 },
    { name: 'POL lower control arms', category: 'Front suspension', status: 'Installed', vendor: 'POL', price: 796.96 },
    { name: 'POL upper control arms', category: 'Front suspension', status: 'Installed', vendor: 'POL', price: 462.24 },
    { name: 'RideTech steering kit', category: 'Steering', status: 'Bought', vendor: 'RideTech', price: 290.00 },
    { name: 'Borgeson steering box', category: 'Steering', status: 'Installed', vendor: 'Borgeson', price: 498.17 },
    { name: 'Rear springs / hardware', category: 'Rear suspension', status: 'Bought', vendor: 'LMC', price: 832.06 }
  ],
  timeline: [
    { date: '2026-03-28', type: 'Bought', title: 'Rear suspension hardware and springs', details: 'Waiting on Aldan reply for shock quantity and hardware.' },
    { date: '2026-03-16', type: 'Installed', title: 'Borgeson steering box', details: 'Tie rods and sway bar still not installed.' },
    { date: '2026-03-15', type: 'Installed', title: 'Idler arm, center link, pitman arm', details: 'Part of steering linkage install.' },
    { date: '2025-04-29', type: 'Bought', title: 'RideTech steering linkage kit', details: 'Early front-end steering purchase.' }
  ],
  decisions: [
    { status: 'open', title: '700R4 rebuild or replace?', note: 'Need to decide after inspection.' },
    { status: 'waiting', title: 'Aldan rear shocks confirmation', note: 'Need quantity and included hardware details.' }
  ],
  areas: [
    { label: 'Front End', state: 'Mostly mocked up' },
    { label: 'Rear End', state: 'Parts starting' },
    { label: 'Engine / Fuel', state: 'Planned' },
    { label: 'Transmission', state: 'Pending decision' }
  ]
};
