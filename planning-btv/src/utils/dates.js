export const MONTH_NAMES_SHORT = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
export const MONTH_NAMES_FULL  = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export const DEFAULT_CONFIG = { startYear: 2026, startMonth: 3, monthCount: 8 };

export function getMonthLabels({ startMonth, monthCount }) {
  return Array.from({ length: monthCount }, (_, i) =>
    MONTH_NAMES_SHORT[(startMonth + i) % 12]
  );
}

export function getSeasonBounds({ startYear, startMonth, monthCount }) {
  const sTotal = startYear * 12 + startMonth;
  const sY = Math.floor(sTotal / 12);
  const sM = sTotal % 12;
  const min = `${sY}-${p2(sM + 1)}-01`;

  const eTotal = startYear * 12 + startMonth + monthCount - 1;
  const eY = Math.floor(eTotal / 12);
  const eM = eTotal % 12;
  const lastDay = new Date(eY, eM + 1, 0).getDate();
  const max = `${eY}-${p2(eM + 1)}-${p2(lastDay)}`;

  return { min, max };
}

function p2(n) { return String(n).padStart(2, '0'); }
function daysIn(y, m) { return new Date(y, m + 1, 0).getDate(); }

export function dateStrToMonthPos(dateStr, config = DEFAULT_CONFIG) {
  const { startYear, startMonth } = config;
  const [y, m, d] = dateStr.split('-').map(Number);
  const calMonth = m - 1;
  const month = (y - startYear) * 12 + (calMonth - startMonth);
  const pos = parseFloat(((d - 1) / daysIn(y, calMonth)).toFixed(3));
  return { month: Math.max(0, month), pos: Math.max(0, Math.min(0.99, pos)) };
}

export function monthPosToDateStr(month, pos, config = DEFAULT_CONFIG) {
  const { startYear, startMonth } = config;
  const total = startYear * 12 + startMonth + month;
  const year = Math.floor(total / 12);
  const calMonth = total % 12;
  const days = daysIn(year, calMonth);
  const day = Math.max(1, Math.min(days, Math.round(pos * days) + 1));
  return `${year}-${p2(calMonth + 1)}-${p2(day)}`;
}

export function dateStrsToMonthPosDur(startStr, endStr, config = DEFAULT_CONFIG) {
  const { month, pos } = dateStrToMonthPos(startStr, config);
  const [sy, sm, sd] = startStr.split('-').map(Number);
  const [ey, em, ed] = endStr.split('-').map(Number);
  const start = new Date(sy, sm - 1, sd);
  const end   = new Date(ey, em - 1, ed);
  const diffDays = Math.max(1, (end - start) / 86400000);
  const dur = parseFloat((diffDays / daysIn(sy, sm - 1)).toFixed(3));
  return { month, pos, dur: Math.max(0.03, dur) };
}

export function monthPosDurToEndDateStr(month, pos, dur, config = DEFAULT_CONFIG) {
  const { startYear, startMonth } = config;
  const total = startYear * 12 + startMonth + month;
  const year = Math.floor(total / 12);
  const calMonth = total % 12;
  const days = daysIn(year, calMonth);
  const startDay = Math.max(1, Math.round(pos * days) + 1);
  const end = new Date(year, calMonth, startDay + Math.round(dur * days));
  return `${end.getFullYear()}-${p2(end.getMonth() + 1)}-${p2(end.getDate())}`;
}
