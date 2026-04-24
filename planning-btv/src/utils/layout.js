export const SVG_WIDTH = 1060;
export const PAD_L = 10;
export const PAD_R = 10;

export function getMW(monthCount) {
  return (SVG_WIDTH - PAD_L - PAD_R) / monthCount;
}
export const MW = getMW(8); // default (backward compat)

export const TASK_ROW_HEIGHT   = 14;
export const TASK_SPACING      = 18;

// Tournage: each triangle sits in its own dedicated zone above the axis
export const TOURNAGE_ROW_HEIGHT = 30; // vertical slot per row (triangle 24px + clearance)
export const TOURNAGE_SPACING    = 10; // gap between rows
export const TOURNAGE_BASE       = 48; // axis → center of row-0 triangle

export const UNCERTAIN_ROW_HEIGHT = 12;
export const UNCERTAIN_SPACING    = 2;
export const LABEL_GAP = 4;

// Space from axis up to the bottom of the task zone
function tournageClearance(tournageRowCount) {
  return TOURNAGE_BASE
    + Math.max(0, tournageRowCount - 1) * (TOURNAGE_ROW_HEIGHT + TOURNAGE_SPACING)
    + 20; // gap between tournage zone top and task bars
}

export function computeAxisY(taskRowCount, tournageRowCount = 0) {
  const taskH     = Math.max(0, taskRowCount) * (TASK_ROW_HEIGHT + TASK_SPACING);
  const clearance = tournageClearance(tournageRowCount);
  return Math.max(200, 55 + taskH + clearance);
}

export function calcX(month, pos, mw = MW) {
  return PAD_L + month * mw + pos * mw;
}

export function assignRows(items, getInterval, presorted = false) {
  if (!items.length) return new Map();

  const sorted = presorted
    ? items
    : [...items].sort((a, b) => getInterval(a)[0] - getInterval(b)[0]);

  const rows = [];
  const result = new Map();

  for (const item of sorted) {
    const [start, end] = getInterval(item);
    let placed = false;

    for (let r = 0; r < rows.length; r++) {
      if (rows[r] <= start - LABEL_GAP) {
        rows[r] = end;
        result.set(item.id, r);
        placed = true;
        break;
      }
    }
    if (!placed) {
      result.set(item.id, rows.length);
      rows.push(end);
    }
  }
  return result;
}

export function getRowCounts(events, mw = MW) {
  const fixedEvents     = events.filter(e => e.type === 'fixed');
  const tournageEvents  = events.filter(e => e.type === 'tournage');
  const uncertainEvents = events.filter(e => e.type === 'uncertain');
  const taskEvents      = events.filter(e => e.type === 'task');

  const fixedRowMap = assignRows(fixedEvents, (e) => {
    const x = calcX(e.month, e.pos, mw);
    const lw = e.text.length * 3.5 + 8;
    return [x - lw / 2, x + lw / 2];
  });

  // Use label half-width so text labels don't overlap between tournage rows
  const tournageRowMap = assignRows(tournageEvents, (e) => {
    const x = calcX(e.month, e.pos, mw);
    const lhw = Math.max(14, (e.text.length * 6 + 8) / 2);
    return [x - lhw, x + lhw];
  });

  const uncertainRowMap = assignRows(uncertainEvents, (e) => {
    const x0 = calcX(e.month, e.pos, mw);
    const x1 = x0 + (e.dur || 0.3) * mw;
    return [x0, x1];
  });

  // Sort tasks by duration desc → longest bars get row 0 (closest to axis)
  const tasksSorted = [...taskEvents].sort((a, b) => (b.dur || 0.3) - (a.dur || 0.3));
  const taskRowMap = assignRows(tasksSorted, (e) => {
    const x0 = calcX(e.month, e.pos, mw);
    const x1 = x0 + (e.dur || 0.3) * mw;
    const lhw = (e.text.length * 6 + 8) / 2;
    const mid = (x0 + x1) / 2;
    return [Math.min(x0, mid - lhw), Math.max(x1, mid + lhw)];
  }, true);

  const maxRow = (map) => map.size > 0 ? Math.max(...map.values()) : -1;

  return {
    fixedRowMap, tournageRowMap, uncertainRowMap, taskRowMap,
    fixedRowCount:    maxRow(fixedRowMap)    + 1,
    tournageRowCount: maxRow(tournageRowMap) + 1,
    uncertainRowCount: maxRow(uncertainRowMap) + 1,
    taskRowCount:     maxRow(taskRowMap)     + 1,
  };
}

export function calculateSVGHeight(rowCounts, axisY) {
  const { fixedRowCount, uncertainRowCount } = rowCounts;

  const fixedBelow = Math.floor(fixedRowCount / 2);
  let below = fixedBelow > 0 ? fixedBelow * 50 + 30 : 50;

  if (uncertainRowCount > 0) {
    below = Math.max(below, 30 + uncertainRowCount * (UNCERTAIN_ROW_HEIGHT + UNCERTAIN_SPACING) + 40);
  }

  return axisY + below;
}

export function getFixedLabelYPosition(row, axisY) {
  if (row % 2 === 0) return axisY - 20 - Math.floor(row / 2) * 50;
  return axisY + 20 + Math.floor(row / 2) * 50;
}

export function getTournageY(row, axisY) {
  return axisY - TOURNAGE_BASE - row * (TOURNAGE_ROW_HEIGHT + TOURNAGE_SPACING);
}

export function getUncertainY(row, axisY) {
  return axisY + 30 + row * (UNCERTAIN_ROW_HEIGHT + UNCERTAIN_SPACING);
}

export function getTaskY(row, axisY, tournageRowCount = 0) {
  const clearance = tournageClearance(tournageRowCount);
  return axisY - clearance - (row + 1) * (TASK_ROW_HEIGHT + TASK_SPACING);
}
