import React, { useId, useMemo } from 'react';
import { GeometrySpec, MathPlotSpec, PhysicsDiagramSpec } from '../types/dpp';

/* ============================================================================
 * 1. SAFE RECURSIVE-DESCENT MATH EXPRESSION EVALUATOR (Zero eval / Function)
 * ============================================================================ */
type Token =
  | { kind: 'num'; val: number }
  | { kind: 'id'; val: string }
  | { kind: 'op'; val: string }
  | { kind: 'lparen' }
  | { kind: 'rparen' };

function tokenizeMath(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const s = expr.replace(/\s+/g, '').replace(/−/g, '-').replace(/π/g, 'pi');

  while (i < s.length) {
    const ch = s[i];
    if (/[0-9.]/.test(ch)) {
      let numStr = ch;
      i++;
      while (i < s.length && /[0-9.]/.test(s[i])) {
        numStr += s[i++];
      }
      const val = parseFloat(numStr);
      if (!Number.isFinite(val)) return [];
      tokens.push({ kind: 'num', val });
      continue;
    }
    if (/[a-zA-Z]/.test(ch)) {
      let idStr = ch;
      i++;
      while (i < s.length && /[a-zA-Z]/.test(s[i])) {
        idStr += s[i++];
      }
      tokens.push({ kind: 'id', val: idStr.toLowerCase() });
      continue;
    }
    if (ch === '(') {
      tokens.push({ kind: 'lparen' });
      i++;
      continue;
    }
    if (ch === ')') {
      tokens.push({ kind: 'rparen' });
      i++;
      continue;
    }
    if ('+-*/^'.includes(ch)) {
      tokens.push({ kind: 'op', val: ch });
      i++;
      continue;
    }
    i++;
  }

  // Insert implicit '*' between: num|rparen|var followed by id|lparen|num
  const expanded: Token[] = [];
  const fnNames = new Set([
    'sin', 'cos', 'tan', 'csc', 'sec', 'cot', 'asin', 'acos', 'atan',
    'sinh', 'cosh', 'tanh', 'sqrt', 'abs', 'ln', 'log', 'exp', 'floor', 'ceil',
  ]);
  for (let k = 0; k < tokens.length; k++) {
    const curr = tokens[k];
    const prev = expanded[expanded.length - 1];
    if (prev) {
      const prevValueLike =
        prev.kind === 'num' ||
        prev.kind === 'rparen' ||
        (prev.kind === 'id' && !fnNames.has(prev.val));
      const currStartLike =
        curr.kind === 'id' || curr.kind === 'lparen' || curr.kind === 'num';
      if (prevValueLike && currStartLike) {
        expanded.push({ kind: 'op', val: '*' });
      }
    }
    expanded.push(curr);
  }
  return expanded;
}

function compileMathExpr(expr: string): ((x: number) => number) | null {
  const tokens = tokenizeMath(expr);
  if (tokens.length === 0) return null;

  return (x: number) => {
    let pos = 0;

    const peek = () => tokens[pos];
    const consume = () => tokens[pos++];

    const parseAddSub = (): number => {
      let left = parseMulDiv();
      while (peek()?.kind === 'op' && (peek() as { val: string }).val.match(/^[+-]$/)) {
        const op = (consume() as { val: string }).val;
        const right = parseMulDiv();
        left = op === '+' ? left + right : left - right;
      }
      return left;
    };

    const parseMulDiv = (): number => {
      let left = parseUnary();
      while (peek()?.kind === 'op' && (peek() as { val: string }).val.match(/^[*/]$/)) {
        const op = (consume() as { val: string }).val;
        const right = parseUnary();
        left = op === '*' ? left * right : left / right;
      }
      return left;
    };

    const parseUnary = (): number => {
      if (peek()?.kind === 'op' && ((peek() as { val: string }).val === '-' || (peek() as { val: string }).val === '+')) {
        const op = (consume() as { val: string }).val;
        const val = parseUnary();
        return op === '-' ? -val : val;
      }
      return parsePower();
    };

    const parsePower = (): number => {
      const base = parsePrimary();
      if (peek()?.kind === 'op' && (peek() as { val: string }).val === '^') {
        consume();
        const exp = parseUnary();
        return Math.pow(base, exp);
      }
      return base;
    };

    const applyFn = (name: string, arg: number): number => {
      switch (name) {
        case 'sin': return Math.sin(arg);
        case 'cos': return Math.cos(arg);
        case 'tan': return Math.tan(arg);
        case 'csc': return 1 / Math.sin(arg);
        case 'sec': return 1 / Math.cos(arg);
        case 'cot': return 1 / Math.tan(arg);
        case 'asin': return Math.asin(arg);
        case 'acos': return Math.acos(arg);
        case 'atan': return Math.atan(arg);
        case 'sinh': return Math.sinh(arg);
        case 'cosh': return Math.cosh(arg);
        case 'tanh': return Math.tanh(arg);
        case 'sqrt': return arg < 0 ? NaN : Math.sqrt(arg);
        case 'abs': return Math.abs(arg);
        case 'ln': return Math.log(arg);
        case 'log': return Math.log10(arg);
        case 'exp': return Math.exp(arg);
        case 'floor': return Math.floor(arg);
        case 'ceil': return Math.ceil(arg);
        default: return NaN;
      }
    };

    const parsePrimary = (): number => {
      const t = peek();
      if (!t) return NaN;
      if (t.kind === 'num') {
        consume();
        return t.val;
      }
      if (t.kind === 'lparen') {
        consume();
        const v = parseAddSub();
        if (peek()?.kind === 'rparen') consume();
        return v;
      }
      if (t.kind === 'id') {
        consume();
        if (t.val === 'x') return x;
        if (t.val === 'pi') return Math.PI;
        if (t.val === 'e') return Math.E;
        // Function call
        if (peek()?.kind === 'lparen') {
          consume();
          const arg = parseAddSub();
          if (peek()?.kind === 'rparen') consume();
          return applyFn(t.val, arg);
        }
        return applyFn(t.val, parsePrimary());
      }
      return NaN;
    };

    const res = parseAddSub();
    return Number.isFinite(res) ? res : NaN;
  };
}

function niceStep(range: number): number {
  const rough = range / 6;
  const pow10 = Math.pow(10, Math.floor(Math.log10(rough || 1)));
  const norm = rough / pow10;
  if (norm < 1.5) return 1 * pow10;
  if (norm < 3.5) return 2 * pow10;
  if (norm < 7.5) return 5 * pow10;
  return 10 * pow10;
}

/* ============================================================================
 * 2. DETERMINISTIC MATHEMATICAL PLOTTER (MathPlotSvg)
 * ============================================================================ */
export const MathPlotSvg: React.FC<{
  plot: MathPlotSpec;
  color: string;
  strokeWidth: number;
}> = ({ plot, color, strokeWidth }) => {
  const clipId = useId().replace(/:/g, '');
  const W = 360;
  const H = 210;
  const padL = 34;
  const padR = 18;
  const padT = 16;
  const padB = 26;
  const pw = W - padL - padR;
  const ph = H - padT - padB;

  const xMin = Number.isFinite(plot.xMin) ? (plot.xMin as number) : -5;
  const xMax = Number.isFinite(plot.xMax) && (plot.xMax as number) > xMin ? (plot.xMax as number) : xMin + 10;
  const yMin = Number.isFinite(plot.yMin) ? (plot.yMin as number) : -5;
  const yMax = Number.isFinite(plot.yMax) && (plot.yMax as number) > yMin ? (plot.yMax as number) : yMin + 10;

  const mapX = (x: number) => padL + ((x - xMin) / (xMax - xMin)) * pw;
  const mapY = (y: number) => padT + ph - ((y - yMin) / (yMax - yMin)) * ph;

  const xStep = niceStep(xMax - xMin);
  const yStep = niceStep(yMax - yMin);

  const xTicks = useMemo(() => {
    const arr: number[] = [];
    const start = Math.ceil(xMin / xStep) * xStep;
    for (let v = start; v <= xMax + 1e-9 && arr.length < 16; v += xStep) {
      arr.push(Number(v.toFixed(4)));
    }
    return arr;
  }, [xMin, xMax, xStep]);

  const yTicks = useMemo(() => {
    const arr: number[] = [];
    const start = Math.ceil(yMin / yStep) * yStep;
    for (let v = start; v <= yMax + 1e-9 && arr.length < 16; v += yStep) {
      arr.push(Number(v.toFixed(4)));
    }
    return arr;
  }, [yMin, yMax, yStep]);

  const axisY = yMin <= 0 && yMax >= 0 ? mapY(0) : mapY(yMin);
  const axisX = xMin <= 0 && xMax >= 0 ? mapX(0) : mapX(xMin);

  // Shade area between exprTop & exprBottom
  const shadePath = useMemo(() => {
    if (!plot.shade) return '';
    const fnTop = compileMathExpr(plot.shade.exprTop);
    const fnBot = plot.shade.exprBottom ? compileMathExpr(plot.shade.exprBottom) : () => 0;
    if (!fnTop || !fnBot) return '';
    const a = Math.max(xMin, Math.min(plot.shade.from, plot.shade.to));
    const b = Math.min(xMax, Math.max(plot.shade.from, plot.shade.to));
    if (b <= a) return '';
    const steps = 80;
    const topPts: string[] = [];
    const botPts: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const x = a + ((b - a) * i) / steps;
      const yt = fnTop(x);
      const yb = fnBot(x);
      if (Number.isFinite(yt) && Number.isFinite(yb)) {
        topPts.push(`${mapX(x).toFixed(1)},${mapY(yt).toFixed(1)}`);
        botPts.unshift(`${mapX(x).toFixed(1)},${mapY(yb).toFixed(1)}`);
      }
    }
    if (topPts.length < 2) return '';
    return `M ${topPts.join(' L ')} L ${botPts.join(' L ')} Z`;
  }, [plot.shade, xMin, xMax, yMin, yMax]);

  // Function paths with discontinuity splitting
  const functionPaths = useMemo(() => {
    return (plot.functions || []).map((f) => {
      const fn = compileMathExpr(f.expr);
      if (!fn) return { d: '', label: f.label, dashed: f.dashed, lx: 0, ly: 0 };
      const samples = 180;
      const spanY = yMax - yMin;
      let d = '';
      let penDown = false;
      let prevY = NaN;
      let labelPos = { lx: mapX((xMin + xMax) / 2), ly: padT + 14 };
      let placedLabel = false;

      for (let i = 0; i <= samples; i++) {
        const x = xMin + ((xMax - xMin) * i) / samples;
        const y = fn(x);
        if (!Number.isFinite(y) || y < yMin - spanY * 0.5 || y > yMax + spanY * 0.5) {
          penDown = false;
          prevY = NaN;
          continue;
        }
        if (penDown && Number.isFinite(prevY) && Math.abs(y - prevY) > spanY * 0.85) {
          penDown = false;
        }
        const sx = mapX(x);
        const sy = mapY(y);
        d += `${penDown ? 'L' : 'M'}${sx.toFixed(1)},${sy.toFixed(1)} `;
        penDown = true;
        prevY = y;
        if (!placedLabel && i > samples * 0.62 && y > yMin + spanY * 0.15 && y < yMax - spanY * 0.15) {
          labelPos = { lx: Math.min(W - padR - 45, sx + 4), ly: Math.max(padT + 12, sy - 6) };
          placedLabel = true;
        }
      }
      return { d: d.trim(), label: f.label, dashed: f.dashed, ...labelPos };
    });
  }, [plot.functions, xMin, xMax, yMin, yMax]);

  // Straight lines (ax + by + c = 0 or segment)
  const lineGeoms = useMemo(() => {
    return (plot.lines || []).map((ln) => {
      let x1 = ln.x1;
      let y1 = ln.y1;
      let x2 = ln.x2;
      let y2 = ln.y2;
      if (x1 == null && ln.a != null && ln.b != null) {
        const a = ln.a;
        const b = ln.b;
        const c = ln.c ?? 0;
        if (Math.abs(b) > 1e-6) {
          x1 = xMin;
          y1 = (-a * xMin - c) / b;
          x2 = xMax;
          y2 = (-a * xMax - c) / b;
        } else if (Math.abs(a) > 1e-6) {
          x1 = -c / a;
          y1 = yMin;
          x2 = -c / a;
          y2 = yMax;
        }
      }
      if (x1 == null || y1 == null || x2 == null || y2 == null) return null;
      const sx1 = mapX(x1);
      const sy1 = mapY(y1);
      const sx2 = mapX(x2);
      const sy2 = mapY(y2);
      return {
        sx1,
        sy1,
        sx2,
        sy2,
        mx: (sx1 + sx2) / 2,
        my: (sy1 + sy2) / 2,
        label: ln.label,
        dashed: ln.dashed,
      };
    });
  }, [plot.lines, xMin, xMax, yMin, yMax]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[350px] h-auto" style={{ color }}>
      <defs>
        <clipPath id={clipId}>
          <rect x={padL} y={padT} width={pw} height={ph} />
        </clipPath>
      </defs>

      {/* Grid */}
      {plot.showGrid !== false && (
        <g stroke={color} strokeOpacity="0.12" strokeWidth="0.75">
          {xTicks.map((xv) => (
            <line key={`gx-${xv}`} x1={mapX(xv)} y1={padT} x2={mapX(xv)} y2={padT + ph} />
          ))}
          {yTicks.map((yv) => (
            <line key={`gy-${yv}`} x1={padL} y1={mapY(yv)} x2={padL + pw} y2={mapY(yv)} />
          ))}
        </g>
      )}

      {/* Axes */}
      <g stroke={color} strokeWidth="1.2">
        <line x1={padL} y1={axisY} x2={padL + pw + 6} y2={axisY} />
        <polygon points={`${padL + pw + 8},${axisY} ${padL + pw + 2},${axisY - 3} ${padL + pw + 2},${axisY + 3}`} fill={color} />
        <line x1={axisX} y1={padT + ph} x2={axisX} y2={padT - 6} />
        <polygon points={`${axisX},${padT - 8} ${axisX - 3},${padT - 2} ${axisX + 3},${padT - 2}`} fill={color} />
      </g>

      {/* Axis labels & ticks */}
      <g
        fill={color}
        fontSize="9.5"
        fontFamily="serif"
        paintOrder="stroke"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinejoin="round"
      >
        <text x={padL + pw + 8} y={axisY + 11} fontWeight="bold" fontStyle="italic">x</text>
        <text x={axisX + 6} y={padT - 2} fontWeight="bold" fontStyle="italic">y</text>
        {xTicks.filter((v) => Math.abs(v) > 1e-6).map((xv) => (
          <text key={`tx-${xv}`} x={mapX(xv)} y={Math.min(H - 6, axisY + 12)} textAnchor="middle" opacity="0.88">
            {xv}
          </text>
        ))}
        {yTicks.filter((v) => Math.abs(v) > 1e-6).map((yv) => (
          <text key={`ty-${yv}`} x={Math.max(12, axisX - 6)} y={mapY(yv) + 3} textAnchor="end" opacity="0.88">
            {yv}
          </text>
        ))}
      </g>

      {/* Clipped geometry & curves */}
      <g clipPath={`url(#${clipId})`}>
        {shadePath && <path d={shadePath} fill={color} fillOpacity="0.14" stroke="none" />}

        {functionPaths.map((fp, idx) =>
          fp.d ? (
            <path
              key={`fn-${idx}`}
              d={fp.d}
              fill="none"
              stroke={color}
              strokeWidth={Math.max(1.6, strokeWidth)}
              strokeDasharray={fp.dashed ? '4 3' : undefined}
              strokeLinecap="round"
            />
          ) : null,
        )}

        {lineGeoms.map((lg, idx) =>
          lg ? (
            <line
              key={`ln-${idx}`}
              x1={lg.sx1}
              y1={lg.sy1}
              x2={lg.sx2}
              y2={lg.sy2}
              stroke={color}
              strokeWidth={Math.max(1.5, strokeWidth)}
              strokeDasharray={lg.dashed ? '4 3' : undefined}
            />
          ) : null,
        )}

        {(plot.circles || []).map((c, idx) => {
          const rx = (c.r / (xMax - xMin)) * pw;
          const ry = (c.r / (yMax - yMin)) * ph;
          return (
            <ellipse
              key={`cir-${idx}`}
              cx={mapX(c.cx)}
              cy={mapY(c.cy)}
              rx={Math.abs(rx)}
              ry={Math.abs(ry)}
              fill="none"
              stroke={color}
              strokeWidth={Math.max(1.5, strokeWidth)}
              strokeDasharray={c.dashed ? '4 3' : undefined}
            />
          );
        })}
      </g>

      {/* Labels & Points (unclipped with crisp white halo for clarity) */}
      <g
        paintOrder="stroke"
        stroke="#FFFFFF"
        strokeWidth="3.2"
        strokeLinejoin="round"
      >
        {functionPaths.map((fp, idx) =>
          fp.label ? (
            <text key={`fl-${idx}`} x={fp.lx} y={fp.ly} fontSize="10.5" fontFamily="serif" fontStyle="italic" fill={color}>
              {fp.label}
            </text>
          ) : null,
        )}
        {lineGeoms.map((lg, idx) =>
          lg?.label ? (
            <text key={`ll-${idx}`} x={Math.min(W - 40, Math.max(padL + 10, lg.mx + 8))} y={Math.max(padT + 12, lg.my - 7)} fontSize="10.5" fontFamily="serif" fill={color}>
              {lg.label}
            </text>
          ) : null,
        )}
        {(plot.points || []).map((pt, idx) => {
          const px = mapX(pt.x);
          const py = mapY(pt.y);
          return (
            <g key={`pt-${idx}`}>
              <circle
                cx={px}
                cy={py}
                r={3.2}
                fill={pt.open ? '#FFFFFF' : color}
                stroke={color}
                strokeWidth="1.4"
              />
              {pt.label && (
                <text x={px + 6} y={py - 5} fontSize="10.5" fontFamily="serif" fill={color} fontWeight="600">
                  {pt.label}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
};

/* ============================================================================
 * 3. DETERMINISTIC GEOMETRY COMPILER (GeometrySvg)
 * ============================================================================ */
export const GeometrySvg: React.FC<{
  geometry: GeometrySpec;
  color: string;
  strokeWidth: number;
}> = ({ geometry, color, strokeWidth }) => {
  const vertices = Array.isArray(geometry.vertices) ? geometry.vertices : [];
  if (vertices.length === 0 && (!geometry.circles || geometry.circles.length === 0)) {
    return null;
  }

  const W = 340;
  const H = 200;
  const pad = 34;

  const xs: number[] = vertices.map((v) => v.x);
  const ys: number[] = vertices.map((v) => v.y);
  for (const c of geometry.circles || []) {
    xs.push(c.cx - c.r, c.cx + c.r);
    ys.push(c.cy - c.r, c.cy + c.r);
  }
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const scale = Math.min((W - 2 * pad) / spanX, (H - 2 * pad) / spanY);

  const offsetX = (W - spanX * scale) / 2;
  const offsetY = (H - spanY * scale) / 2;

  const mapX = (x: number) => offsetX + (x - minX) * scale;
  const mapY = (y: number) => H - (offsetY + (y - minY) * scale);

  const vMap = new Map(vertices.map((v) => [v.id, v]));
  const cxAll = vertices.length ? vertices.reduce((s, v) => s + mapX(v.x), 0) / vertices.length : W / 2;
  const cyAll = vertices.length ? vertices.reduce((s, v) => s + mapY(v.y), 0) / vertices.length : H / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[330px] h-auto" style={{ color }}>
      {(geometry.circles || []).map((c, idx) => (
        <g key={`gc-${idx}`}>
          <circle
            cx={mapX(c.cx)}
            cy={mapY(c.cy)}
            r={c.r * scale}
            fill="none"
            stroke={color}
            strokeWidth={Math.max(1.5, strokeWidth)}
          />
          {c.label && (
            <text x={mapX(c.cx)} y={mapY(c.cy) - c.r * scale - 6} textAnchor="middle" fontSize="11" fontFamily="serif" fill={color}>
              {c.label}
            </text>
          )}
        </g>
      ))}

      {(geometry.segments || []).map((seg, idx) => {
        const a = vMap.get(seg.from);
        const b = vMap.get(seg.to);
        if (!a || !b) return null;
        const x1 = mapX(a.x);
        const y1 = mapY(a.y);
        const x2 = mapX(b.x);
        const y2 = mapY(b.y);
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        return (
          <g key={`gs-${idx}`}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth={Math.max(1.5, strokeWidth)}
              strokeDasharray={seg.dashed ? '4 3' : undefined}
              strokeLinecap="round"
            />
            {seg.label && (
              <text
                x={(x1 + x2) / 2 + nx * 11}
                y={(y1 + y2) / 2 + ny * 11 + 3}
                textAnchor="middle"
                fontSize="11"
                fontFamily="serif"
                fill={color}
              >
                {seg.label}
              </text>
            )}
          </g>
        );
      })}

      {(geometry.angleArcs || []).map((arc, idx) => {
        const v = vMap.get(arc.vertex);
        const p1 = vMap.get(arc.p1);
        const p2 = vMap.get(arc.p2);
        if (!v || !p1 || !p2) return null;
        const vx = mapX(v.x);
        const vy = mapY(v.y);
        const u1x = mapX(p1.x) - vx;
        const u1y = mapY(p1.y) - vy;
        const u2x = mapX(p2.x) - vx;
        const u2y = mapY(p2.y) - vy;
        const l1 = Math.hypot(u1x, u1y) || 1;
        const l2 = Math.hypot(u2x, u2y) || 1;
        const r = 16;

        if (arc.rightAngle) {
          const ax = vx + (u1x / l1) * 11;
          const ay = vy + (u1y / l1) * 11;
          const bx = vx + (u2x / l2) * 11;
          const by = vy + (u2y / l2) * 11;
          const cx = ax + (u2x / l2) * 11;
          const cy = ay + (u2y / l2) * 11;
          return (
            <polyline
              key={`ga-${idx}`}
              points={`${ax},${ay} ${cx},${cy} ${bx},${by}`}
              fill="none"
              stroke={color}
              strokeWidth="1.2"
            />
          );
        }

        const ax = vx + (u1x / l1) * r;
        const ay = vy + (u1y / l1) * r;
        const bx = vx + (u2x / l2) * r;
        const by = vy + (u2y / l2) * r;
        const cross = (u1x * u2y - u1y * u2x) > 0 ? 1 : 0;
        const midX = vx + ((u1x / l1 + u2x / l2) * 0.5) * (r + 12);
        const midY = vy + ((u1y / l1 + u2y / l2) * 0.5) * (r + 12);

        return (
          <g key={`ga-${idx}`}>
            <path d={`M ${ax} ${ay} A ${r} ${r} 0 0 ${cross} ${bx} ${by}`} fill="none" stroke={color} strokeWidth="1.2" />
            {arc.label && (
              <text x={midX} y={midY + 3} textAnchor="middle" fontSize="10.5" fontFamily="serif" fill={color}>
                {arc.label}
              </text>
            )}
          </g>
        );
      })}

      {vertices.map((v) => {
        const px = mapX(v.x);
        const py = mapY(v.y);
        const dx = px - cxAll;
        const dy = py - cyAll;
        const dist = Math.hypot(dx, dy) || 1;
        const lx = px + (dx / dist) * 14;
        const ly = py + (dy / dist) * 14 + 4;
        return (
          <g key={`gv-${v.id}`}>
            <circle cx={px} cy={py} r={2.4} fill={color} />
            {v.label && (
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                fontSize="11.5"
                fontWeight="bold"
                fontFamily="serif"
                fill={color}
                paintOrder="stroke"
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeLinejoin="round"
              >
                {v.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

/* ============================================================================
 * 4. TEXTBOOK-GRADE PHYSICS SCHEMATIC ENGINE (PhysicsSchematicSvg)
 * ============================================================================ */
export const PhysicsSchematicSvg: React.FC<{
  physics: PhysicsDiagramSpec;
  color: string;
  strokeWidth: number;
}> = ({ physics, color, strokeWidth }) => {
  const sw = Math.max(1.5, strokeWidth);

  if (physics.preset === 'incline_block') {
    const theta = Math.max(15, Math.min(55, physics.angleDeg ?? 30));
    const rad = (theta * Math.PI) / 180;
    const x0 = 55;
    const y0 = 165;
    const base = 210;
    const h = Math.min(115, base * Math.tan(rad));
    const xApex = x0 + base;
    const yApex = y0 - h;
    const slopeLen = Math.hypot(base, h);
    const ux = base / slopeLen;
    const uy = -h / slopeLen;
    const nx = -uy;
    const ny = ux;

    const midDist = slopeLen * 0.48;
    const bx = x0 + ux * midDist;
    const by = y0 + uy * midDist;
    const bw = 40;
    const bh = 26;

    return (
      <svg viewBox="0 0 360 195" className="w-full max-w-[340px] h-auto" style={{ color }}>
        {/* Ground */}
        <line x1="25" y1={y0} x2="335" y2={y0} stroke={color} strokeWidth={sw} />
        {/* Wedge */}
        <polygon points={`${x0},${y0} ${xApex},${y0} ${xApex},${yApex}`} fill={color} fillOpacity="0.06" stroke={color} strokeWidth={sw} />
        {/* Angle arc */}
        <path d={`M ${x0 + 36} ${y0} A 36 36 0 0 0 ${x0 + 36 * Math.cos(rad)} ${y0 - 36 * Math.sin(rad)}`} fill="none" stroke={color} strokeWidth="1.2" />
        <text x={x0 + 44} y={y0 - 8} fontSize="11.5" fontFamily="serif" fill={color}>{theta}°</text>

        {/* Block */}
        <polygon
          points={`${bx - ux * (bw / 2)},${by - uy * (bw / 2)} ${bx + ux * (bw / 2)},${by + uy * (bw / 2)} ${bx + ux * (bw / 2) + nx * bh},${by + uy * (bw / 2) + ny * bh} ${bx - ux * (bw / 2) + nx * bh},${by - uy * (bw / 2) + ny * bh}`}
          fill="#FFFFFF"
          fillOpacity="0.9"
          stroke={color}
          strokeWidth={sw}
        />
        <text
          x={bx + nx * (bh / 2)}
          y={by + ny * (bh / 2) + 4}
          textAnchor="middle"
          fontSize="11.5"
          fontWeight="bold"
          fontFamily="serif"
          fill={color}
        >
          {physics.mass1 || 'm'}
        </text>

        {/* Optional pulley & hanging mass */}
        {physics.hasPulley && (
          <g>
            <circle cx={xApex + 8} cy={yApex - 8} r="9" fill="#FFFFFF" stroke={color} strokeWidth="1.5" />
            <line x1={xApex} y1={yApex} x2={xApex + 8} y2={yApex - 8} stroke={color} strokeWidth="1.4" />
            <line
              x1={bx + ux * (bw / 2) + nx * (bh / 2)}
              y1={by + uy * (bw / 2) + ny * (bh / 2)}
              x2={xApex + 3}
              y2={yApex - 15}
              stroke={color}
              strokeWidth="1.3"
            />
            <line x1={xApex + 17} y1={yApex - 8} x2={xApex + 17} y2={yApex + 48} stroke={color} strokeWidth="1.3" />
            <rect x={xApex + 4} y={yApex + 48} width="26" height="24" fill="#FFFFFF" stroke={color} strokeWidth={sw} />
            <text x={xApex + 17} y={yApex + 64} textAnchor="middle" fontSize="11" fontWeight="bold" fontFamily="serif" fill={color}>
              {physics.mass2 || 'm₂'}
            </text>
          </g>
        )}
      </svg>
    );
  }

  if (physics.preset === 'pulley_two_mass') {
    return (
      <svg viewBox="0 0 360 195" className="w-full max-w-[320px] h-auto" style={{ color }}>
        {/* Ceiling */}
        <line x1="115" y1="20" x2="245" y2="20" stroke={color} strokeWidth={sw + 0.5} />
        <line x1="180" y1="20" x2="180" y2="54" stroke={color} strokeWidth={sw} />
        {/* Pulley */}
        <circle cx="180" cy="54" r="22" fill="#FFFFFF" stroke={color} strokeWidth={sw} />
        <circle cx="180" cy="54" r="3" fill={color} />
        {/* Ropes */}
        <line x1="158" y1="54" x2="158" y2="120" stroke={color} strokeWidth="1.4" />
        <line x1="202" y1="54" x2="202" y2="145" stroke={color} strokeWidth="1.4" />
        {/* Masses */}
        <rect x="142" y="120" width="32" height="28" fill={color} fillOpacity="0.06" stroke={color} strokeWidth={sw} />
        <text x="158" y="138" textAnchor="middle" fontSize="12" fontWeight="bold" fontFamily="serif" fill={color}>
          {physics.mass1 || 'm₁'}
        </text>
        <rect x="186" y="145" width="32" height="28" fill={color} fillOpacity="0.06" stroke={color} strokeWidth={sw} />
        <text x="202" y="163" textAnchor="middle" fontSize="12" fontWeight="bold" fontFamily="serif" fill={color}>
          {physics.mass2 || 'm₂'}
        </text>
      </svg>
    );
  }

  if (physics.preset === 'circuit_loop') {
    const zigH = (cx: number, cy: number) =>
      `M ${cx - 24} ${cy} L ${cx - 18} ${cy - 7} L ${cx - 10} ${cy + 7} L ${cx - 2} ${cy - 7} L ${cx + 6} ${cy + 7} L ${cx + 14} ${cy - 7} L ${cx + 20} ${cy + 7} L ${cx + 24} ${cy}`;

    return (
      <svg viewBox="0 0 360 190" className="w-full max-w-[330px] h-auto" style={{ color }}>
        {/* Main Loop Wires */}
        <line x1="75" y1="45" x2="156" y2="45" stroke={color} strokeWidth={sw} />
        <path d={zigH(180, 45)} fill="none" stroke={color} strokeWidth={sw} />
        <line x1="204" y1="45" x2="285" y2="45" stroke={color} strokeWidth={sw} />
        <line x1="75" y1="45" x2="75" y2="148" stroke={color} strokeWidth={sw} />
        <line x1="285" y1="45" x2="285" y2="148" stroke={color} strokeWidth={sw} />

        {/* Bottom Battery + optional resistor */}
        <line x1="75" y1="148" x2="170" y2="148" stroke={color} strokeWidth={sw} />
        <line x1="170" y1="134" x2="170" y2="162" stroke={color} strokeWidth={sw + 0.4} />
        <line x1="180" y1="140" x2="180" y2="156" stroke={color} strokeWidth={sw + 1.2} />
        <line x1="180" y1="148" x2="285" y2="148" stroke={color} strokeWidth={sw} />

        {/* Labels */}
        <text x="180" y="30" textAnchor="middle" fontSize="12" fontFamily="serif" fontWeight="bold" fill={color}>
          {physics.topComponent || 'R'}
        </text>
        {physics.leftComponent && (
          <text x="62" y="100" textAnchor="end" fontSize="11.5" fontFamily="serif" fill={color}>
            {physics.leftComponent}
          </text>
        )}
        {physics.rightComponent && (
          <text x="298" y="100" textAnchor="start" fontSize="11.5" fontFamily="serif" fill={color}>
            {physics.rightComponent}
          </text>
        )}
        <text x="175" y="177" textAnchor="middle" fontSize="12" fontFamily="serif" fontWeight="bold" fill={color}>
          {physics.emfLabel || physics.bottomComponent || 'E, r'}
        </text>
        {physics.currentLabel && (
          <g>
            <line x1="105" y1="38" x2="130" y2="38" stroke={color} strokeWidth="1.2" />
            <polygon points="134,38 127,35 127,41" fill={color} />
            <text x="118" y="32" textAnchor="middle" fontSize="11" fontFamily="serif" fontStyle="italic" fill={color}>
              {physics.currentLabel}
            </text>
          </g>
        )}
      </svg>
    );
  }

  if (physics.preset === 'ray_optics') {
    const isMirror = physics.opticsType === 'concave_mirror' || physics.opticsType === 'convex_mirror';
    const isConvexLens = !isMirror && physics.opticsType !== 'concave_lens';
    const axisY = 105;
    const cx = 180;
    const objX = physics.objectBeyond2F === false ? 128 : 88;
    const objTop = 62;

    return (
      <svg viewBox="0 0 360 190" className="w-full max-w-[340px] h-auto" style={{ color }}>
        {/* Principal Axis */}
        <line x1="20" y1={axisY} x2="340" y2={axisY} stroke={color} strokeWidth="1.2" strokeDasharray="4 2" />

        {/* Lens or Mirror */}
        {isMirror ? (
          <path d={`M ${cx - 6} 40 Q ${cx + 12} ${axisY} ${cx - 6} 170`} fill="none" stroke={color} strokeWidth={sw + 0.5} />
        ) : isConvexLens ? (
          <g stroke={color} strokeWidth={sw}>
            <path d={`M ${cx} 36 Q ${cx + 16} ${axisY} ${cx} 174 Q ${cx - 16} ${axisY} ${cx} 36 Z`} fill={color} fillOpacity="0.06" />
          </g>
        ) : (
          <path d={`M ${cx - 10} 36 Q ${cx} ${axisY} ${cx - 10} 174 L ${cx + 10} 174 Q ${cx} ${axisY} ${cx + 10} 36 Z`} fill={color} fillOpacity="0.06" stroke={color} strokeWidth={sw} />
        )}

        {/* Focal Markers */}
        {[cx - 48, cx + 48, cx - 96, cx + 96].map((fx, i) => (
          <g key={i}>
            <circle cx={fx} cy={axisY} r="2" fill={color} />
            <text x={fx} y={axisY + 14} textAnchor="middle" fontSize="10.5" fontFamily="serif" fill={color}>
              {i < 2 ? (physics.focalLabel || 'F') : '2F'}
            </text>
          </g>
        ))}

        {/* Object Arrow */}
        <line x1={objX} y1={axisY} x2={objX} y2={objTop} stroke={color} strokeWidth={sw} />
        <polygon points={`${objX},${objTop - 4} ${objX - 4},${objTop + 5} ${objX + 4},${objTop + 5}`} fill={color} />
        <text x={objX} y={objTop - 9} textAnchor="middle" fontSize="10.5" fontFamily="serif" fill={color}>Object</text>

        {/* Principal Rays */}
        <line x1={objX} y1={objTop} x2={cx} y2={objTop} stroke={color} strokeWidth="1.15" />
        <line x1={cx} y1={objTop} x2={cx + 96} y2={axisY + 43} stroke={color} strokeWidth="1.15" />
        <line x1={objX} y1={objTop} x2={cx + 96} y2={axisY + 43} stroke={color} strokeWidth="1.15" />

        {physics.objectDistLabel && (
          <text x={(objX + cx) / 2} y={axisY + 28} textAnchor="middle" fontSize="10.5" fontFamily="serif" fill={color}>
            {physics.objectDistLabel}
          </text>
        )}
      </svg>
    );
  }

  if (physics.preset === 'projectile') {
    const theta = physics.angleDeg ?? 45;
    return (
      <svg viewBox="0 0 360 190" className="w-full max-w-[340px] h-auto" style={{ color }}>
        <line x1="35" y1="158" x2="325" y2="158" stroke={color} strokeWidth={sw} />
        <line x1="48" y1="158" x2="48" y2="28" stroke={color} strokeWidth="1.1" strokeDasharray="3 3" />
        {/* Parabolic Trajectory */}
        <path d="M 48 158 Q 175 20 302 158" fill="none" stroke={color} strokeWidth={sw} strokeDasharray="5 3" />
        {/* Launch Vector */}
        <line x1="48" y1="158" x2="98" y2="104" stroke={color} strokeWidth={sw + 0.3} />
        <polygon points="101,101 92,104 98,110" fill={color} />
        <text x="104" y="100" fontSize="11.5" fontFamily="serif" fontWeight="bold" fill={color}>
          {physics.velocityLabel || 'v₀'}
        </text>
        <text x="72" y="152" fontSize="11" fontFamily="serif" fill={color}>{theta}°</text>
        {physics.heightLabel && (
          <g>
            <line x1="175" y1="89" x2="175" y2="158" stroke={color} strokeWidth="1" strokeDasharray="3 2" />
            <text x="180" y="126" fontSize="11" fontFamily="serif" fill={color}>{physics.heightLabel}</text>
          </g>
        )}
        <text x="175" y="176" textAnchor="middle" fontSize="11" fontFamily="serif" fill={color}>
          {physics.rangeLabel || 'R'}
        </text>
      </svg>
    );
  }

  // fbd_block default
  return (
    <svg viewBox="0 0 340 190" className="w-full max-w-[310px] h-auto" style={{ color }}>
      <line x1="55" y1="135" x2="285" y2="135" stroke={color} strokeWidth="1.4" />
      <rect x="142" y="88" width="56" height="47" fill={color} fillOpacity="0.06" stroke={color} strokeWidth={sw} />
      <text x="170" y="116" textAnchor="middle" fontSize="13" fontWeight="bold" fontFamily="serif" fill={color}>
        {physics.mass1 || 'M'}
      </text>
      {(physics.forces || [
        { dir: 'up', label: 'N' },
        { dir: 'down', label: 'mg' },
        { dir: 'right', label: 'F' },
      ]).map((f, idx) => {
        if (f.dir === 'up' || f.dir === 'normal') {
          return (
            <g key={idx}>
              <line x1="170" y1="88" x2="170" y2="42" stroke={color} strokeWidth={sw} />
              <polygon points="170,37 166,46 174,46" fill={color} />
              <text x="178" y="54" fontSize="11.5" fontFamily="serif" fontWeight="bold" fill={color}>{f.label}</text>
            </g>
          );
        }
        if (f.dir === 'down') {
          return (
            <g key={idx}>
              <line x1="170" y1="135" x2="170" y2="175" stroke={color} strokeWidth={sw} />
              <polygon points="170,180 166,171 174,171" fill={color} />
              <text x="178" y="172" fontSize="11.5" fontFamily="serif" fontWeight="bold" fill={color}>{f.label}</text>
            </g>
          );
        }
        if (f.dir === 'left') {
          return (
            <g key={idx}>
              <line x1="142" y1="112" x2="88" y2="112" stroke={color} strokeWidth={sw} />
              <polygon points="83,112 92,108 92,116" fill={color} />
              <text x="86" y="102" fontSize="11.5" fontFamily="serif" fontWeight="bold" fill={color}>{f.label}</text>
            </g>
          );
        }
        return (
          <g key={idx}>
            <line x1="198" y1="112" x2="252" y2="112" stroke={color} strokeWidth={sw} />
            <polygon points="257,112 248,108 248,116" fill={color} />
            <text x="242" y="102" fontSize="11.5" fontFamily="serif" fontWeight="bold" fill={color}>{f.label}</text>
          </g>
        );
      })}
    </svg>
  );
};
