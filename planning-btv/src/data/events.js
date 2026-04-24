export const INITIAL_EVENTS = [
  // Fixed dates
  { id: 1, type: 'fixed', text: '24 Avr', month: 0, pos: 0.75 },
  { id: 2, type: 'fixed', text: '28 Avr', month: 0, pos: 0.93 },
  { id: 3, type: 'fixed', text: '7 Mai', month: 1, pos: 0.23 },
  { id: 4, type: 'fixed', text: '5 Juin', month: 2, pos: 0.16 },
  { id: 5, type: 'fixed', text: '19 Juin', month: 2, pos: 0.62 },
  { id: 6, type: 'fixed', text: '10 Juil', month: 3, pos: 0.33 },
  { id: 7, type: 'fixed', text: '13 Juil', month: 3, pos: 0.43 },
  // Tournages
  { id: 8, type: 'tournage', text: 'APS', month: 2, pos: 0.16 },
  { id: 9, type: 'tournage', text: 'APS', month: 3, pos: 0.43 },
  { id: 10, type: 'tournage', text: 'APS', month: 5, pos: 0.65 },
  { id: 11, type: 'tournage', text: 'APS', month: 6, pos: 0.55 },
  { id: 12, type: 'tournage', text: 'DOP 7.0', month: 6, pos: 0.82 },
  // Uncertain
  { id: 13, type: 'uncertain', text: 'Présentation Moine', month: 1, pos: 0.30, dur: 0.55 },
  { id: 14, type: 'uncertain', text: 'EG Culture au 360 – Tours', month: 2, pos: 0.55, dur: 0.60 },
  { id: 15, type: 'uncertain', text: 'Soutenance', month: 3, pos: 0.55, dur: 0.30 },
  { id: 16, type: 'uncertain', text: 'AutoNobu', month: 4, pos: 0.20, dur: 0.65 },
  { id: 17, type: 'uncertain', text: 'Reni Espum', month: 5, pos: 0.10, dur: 0.55 },
  { id: 18, type: 'uncertain', text: 'Inauguration TLC', month: 6, pos: 0.15, dur: 0.55 },
  // Tasks
  { id: 19, type: 'task', text: 'Recrutement', month: 0, pos: 0.00, dur: 0.65 },
  { id: 20, type: 'task', text: 'Struct. achat', month: 0, pos: 0.10, dur: 0.55 },
  { id: 21, type: 'task', text: 'Prépa Set', month: 0, pos: 0.20, dur: 0.70 },
  { id: 22, type: 'task', text: 'EG antip.', month: 0, pos: 0.50, dur: 0.30 },
  { id: 23, type: 'task', text: 'Dev / Struct', month: 0, pos: 0.55, dur: 0.40 },
  { id: 24, type: 'task', text: 'Rep. Jscbr.', month: 0, pos: 0.65, dur: 0.30 },
  { id: 25, type: 'task', text: 'Fin Sep – Travaux', month: 5, pos: 0.80, dur: 0.40 },
];

export const MONTHS = ['Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov'];
