import {
  SVG_WIDTH,
  PAD_L,
  PAD_R,
  getMW,
  TASK_ROW_HEIGHT,
  TOURNAGE_ROW_HEIGHT,
  UNCERTAIN_ROW_HEIGHT,
  UNCERTAIN_SPACING,
  calcX,
  computeAxisY,
  getRowCounts,
  calculateSVGHeight,
  getFixedLabelYPosition,
  getTournageY,
  getUncertainY,
  getTaskY,
} from '../utils/layout';
import { getMonthLabels, dateStrToMonthPos } from '../utils/dates';
import { usePlanning } from '../contexts/PlanningContext';

export function Timeline({ events, onEventClick, onEventDoubleClick }) {
  const { config } = usePlanning();
  const mw = getMW(config.monthCount);
  const months = getMonthLabels(config);

  const rowCounts = getRowCounts(events, mw);
  const axisY = computeAxisY(rowCounts.taskRowCount, rowCounts.tournageRowCount);
  const svgHeight = calculateSVGHeight(rowCounts, axisY);

  const todayStr = new Date().toISOString().split('T')[0];
  const { month: todayMonth, pos: todayPos } = dateStrToMonthPos(todayStr, config);
  const todayMonthX = calcX(todayMonth, todayPos, mw);

  const TRIANGLE_SIZE = 12;

  return (
    <div className="bg-white rounded-2xl px-5 pb-8 pt-6 shadow-md overflow-x-auto max-w-screen-xl mx-auto" id="planning-card">
      <svg
        width={SVG_WIDTH}
        height={svgHeight}
        viewBox={`0 0 ${SVG_WIDTH} ${svgHeight}`}
        xmlns="http://www.w3.org/2000/svg"
        className="block mx-auto"
      >
        <defs>
          <pattern id="monthGrid" x={mw} y="0" width={mw} height={svgHeight} patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2={svgHeight} stroke="#eee" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width={SVG_WIDTH} height={svgHeight} fill="white" />
        <rect x={PAD_L} y="0" width={SVG_WIDTH - PAD_L - PAD_R} height={svgHeight} fill="url(#monthGrid)" />

        {/* Month labels */}
        {months.map((month, i) => (
          <text key={`month-${i}`} x={PAD_L + i * mw + mw / 2} y="20" textAnchor="middle" fontSize="12" fontWeight="600" fill="#333">
            {month}
          </text>
        ))}

        {/* Today marker */}
        <line x1={todayMonthX} y1="0" x2={todayMonthX} y2={svgHeight} stroke="#e67e22" strokeWidth="2" strokeDasharray="4,4" />
        <polygon points={`${todayMonthX + 4},${28} ${todayMonthX + 4},${22} ${todayMonthX + 9},${25}`} fill="#e67e22" />
        <text x={todayMonthX + 13} y="30" fontSize="11" fontWeight="600" fill="#e67e22">Aujourd'hui</text>

        {/* Task bars — sorted by duration (longest = row 0 = closest to axis) */}
        {events.filter(e => e.type === 'task').map(e => {
          const row = rowCounts.taskRowMap.get(e.id);
          const x0 = calcX(e.month, e.pos, mw);
          const x1 = x0 + (e.dur || 0.3) * mw;
          const y = getTaskY(row, axisY, rowCounts.tournageRowCount);
          return (
            <g key={`task-${e.id}`} onClick={() => onEventClick(e)} onDoubleClick={() => onEventDoubleClick(e.id)} className="cursor-pointer">
              <rect x={x0} y={y} width={Math.max(x1 - x0, 5)} height={TASK_ROW_HEIGHT} fill="#1d7a45" rx="2" />
              <text x={(x0 + x1) / 2} y={y - 4} textAnchor="middle" fontSize="11" fontWeight="600" fill="#1d7a45" pointerEvents="none">
                {e.text}
              </text>
            </g>
          );
        })}

        {/* Tournage connector lines (axis dot → triangle bottom) — drawn under everything */}
        {events.filter(e => e.type === 'tournage').map(e => {
          const row = rowCounts.tournageRowMap.get(e.id);
          const x = calcX(e.month, e.pos, mw);
          const y = getTournageY(row, axisY);
          return (
            <line
              key={`tournage-line-${e.id}`}
              x1={x} y1={y + TRIANGLE_SIZE}
              x2={x} y2={axisY}
              stroke="#c0392b" strokeWidth="1" strokeDasharray="3,3" strokeOpacity="0.5"
            />
          );
        })}

        {/* Main axis — drawn before dots/triangles so they appear on top */}
        <line x1={PAD_L} y1={axisY} x2={SVG_WIDTH - PAD_R} y2={axisY} stroke="#333" strokeWidth="2" />

        {/* Tournage triangles */}
        {events.filter(e => e.type === 'tournage').map(e => {
          const row = rowCounts.tournageRowMap.get(e.id);
          const x = calcX(e.month, e.pos, mw);
          const y = getTournageY(row, axisY);
          return (
            <g key={`tournage-${e.id}`} onClick={() => onEventClick(e)} onDoubleClick={() => onEventDoubleClick(e.id)} className="cursor-pointer">
              <circle cx={x} cy={axisY} r="4" fill="#c0392b" />
              <polygon points={`${x},${y - TRIANGLE_SIZE} ${x - TRIANGLE_SIZE},${y + TRIANGLE_SIZE} ${x + TRIANGLE_SIZE},${y + TRIANGLE_SIZE}`} fill="#c0392b" />
              <text x={x} y={y - TRIANGLE_SIZE - 6} textAnchor="middle" fontSize="10" fontWeight="600" fill="#c0392b" pointerEvents="none">{e.text}</text>
            </g>
          );
        })}

        {/* Fixed date labels */}
        {events.filter(e => e.type === 'fixed').map(e => {
          const row = rowCounts.fixedRowMap.get(e.id);
          const x = calcX(e.month, e.pos, mw);
          const y = getFixedLabelYPosition(row, axisY);
          const isAbove = row % 2 === 0;
          return (
            <g key={`fixed-${e.id}`} onClick={() => onEventClick(e)} onDoubleClick={() => onEventDoubleClick(e.id)} className="cursor-pointer">
              <circle cx={x} cy={axisY} r="5" fill="#1d7a45" />
              <text x={x} y={y} textAnchor="middle" fontSize="11" fontWeight="600" fill="#1d7a45" pointerEvents="none" dominantBaseline={isAbove ? 'auto' : 'hanging'}>
                {e.text}
              </text>
            </g>
          );
        })}

        {/* Uncertain wavy bars */}
        {events.filter(e => e.type === 'uncertain').map(e => {
          const row = rowCounts.uncertainRowMap.get(e.id);
          const x0 = calcX(e.month, e.pos, mw);
          const x1 = x0 + (e.dur || 0.3) * mw;
          const y = getUncertainY(row, axisY);
          const waveAmplitude = 2;

          const pathPoints = [];
          const steps = Math.max(10, Math.floor((x1 - x0) / 10));
          for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const xp = x0 + t * (x1 - x0);
            const off = Math.sin(t * Math.PI * 4) * waveAmplitude;
            pathPoints.push(`${xp},${y + off}`);
          }

          const arrowSize = 8;
          const arrowX = x1 + 5;

          return (
            <g key={`uncertain-${e.id}`} onClick={() => onEventClick(e)} onDoubleClick={() => onEventDoubleClick(e.id)} className="cursor-pointer">
              <polyline points={pathPoints.join(' ')} fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" />
              <polygon points={`${arrowX},${y} ${arrowX - arrowSize},${y - arrowSize / 2} ${arrowX - arrowSize},${y + arrowSize / 2}`} fill="#c0392b" />
              <text x={(x0 + x1) / 2} y={y - 15} textAnchor="middle" fontSize="10" fontWeight="600" fill="#c0392b" pointerEvents="none">{e.text}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
