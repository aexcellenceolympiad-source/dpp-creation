import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/contrib/mhchem';

interface MathTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

interface TextSegment {
  kind: 'text' | 'inline-math' | 'display-math';
  content: string;
}

const LATEX_CMD_LIST =
  'frac|dfrac|tfrac|cfrac|sqrt|cbrt|ce|pu|sin|cos|tan|cot|sec|csc|arcsin|arccos|arctan|sinh|cosh|tanh|log|ln|lg|exp|lim|sup|inf|max|min|arg|det|dim|gcd|deg|binom|tbinom|dbinom|theta|vartheta|alpha|beta|gamma|delta|epsilon|varepsilon|zeta|eta|iota|kappa|lambda|mu|nu|xi|pi|varpi|rho|varrho|sigma|varsigma|tau|upsilon|phi|varphi|chi|psi|omega|Delta|Gamma|Theta|Lambda|Xi|Pi|Sigma|Upsilon|Phi|Psi|Omega|int|iint|iiint|oint|sum|prod|coprod|partial|nabla|vec|overrightarrow|overline|underline|widehat|widetilde|hat|tilde|bar|dot|ddot|overset|underset|stackrel|overbrace|underbrace|left|right|big|Big|bigg|Bigg|times|cdot|cdots|ldots|vdots|ddots|div|pm|mp|approx|simeq|cong|equiv|sim|neq|ne|leq|le|geq|ge|ll|gg|propto|infty|hbar|ell|to|gets|rightarrow|leftarrow|leftrightarrow|Rightarrow|Leftarrow|Leftrightarrow|implies|iff|uparrow|downarrow|updownarrow|rightleftharpoons|mapsto|circ|degree|angle|measuredangle|triangle|square|perp|parallel|in|notin|ni|subset|subseteq|supset|supseteq|cup|cap|setminus|emptyset|varnothing|forall|exists|nexists|neg|lor|land|therefore|because|text|textbf|textit|mathrm|mathbf|mathbb|mathcal|mathsf|mbox|begin|end|pmatrix|bmatrix|vmatrix|cases|aligned';

const LATEX_CMD_REGEX = new RegExp(`\\\\(?:${LATEX_CMD_LIST})\\b`);
const DOUBLE_ESCAPE_REGEX = new RegExp(`\\\\\\\\(?=(?:${LATEX_CMD_LIST})\\b)`, 'g');

/**
 * Repairs common LLM JSON escaping corruptions (\t, \f, \r, \b turning into control chars
 * inside LaTeX commands like \theta, \times, \frac, \right, \beta, \circ) and unwraps
 * double-escaped command prefixes like \\frac -> \frac.
 */
export function repairLatexText(raw: string): string {
  let s = raw;
  // Restore control characters accidentally eaten by single-backslash JSON parsing
  s = s
    .replace(/\t(?=(?:heta|imes|ext|an|au|riangle|frac|binom|o\b|ilde))/g, '\\t')
    .replace(/\f(?=(?:rac|orall|lat))/g, '\\f')
    .replace(/\r(?=(?:ho|ight|eg|angle|ightarrow|ightleftharpoons))/g, '\\r')
    .replace(/\x08(?=(?:eta|ar|inom|egin|ig|ullet|ecause|matrix))/g, '\\b');

  // Unwrap double-backslashed LaTeX command names while leaving matrix row-breaks ("\\ ") intact
  s = s.replace(DOUBLE_ESCAPE_REGEX, '\\');

  return s;
}

function isBareMathString(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed || trimmed.includes('$')) return false;
  if (/[\u0900-\u097F]/.test(trimmed)) return false;

  // Immediate match for pure degree expressions like "30^\circ", "45^{\circ}", "90^\circ"
  if (/^-?\d+(?:\.\d+)?\s*\^\s*\{?\s*\\(?:circ|degree)\s*\}?$/.test(trimmed)) {
    return true;
  }

  const hasLatexCmd = LATEX_CMD_REGEX.test(trimmed);
  const hasMathExp = /(?:[a-zA-Z0-9)\]}]\s*\^\s*\{?[-+a-zA-Z0-9\\]+\}?|[a-zA-Z]\s*_\s*\{?[a-zA-Z0-9]+\}?)/.test(
    trimmed,
  );
  if (!hasLatexCmd && !hasMathExp) return false;

  const withoutCmds = trimmed
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/[{}\[\]()^_0-9+\-*/=.,<>|:\s]/g, '');

  const longEnglishWords = trimmed.match(/\b[a-zA-Z]{5,}\b/g) || [];
  const nonLatexLongWords = longEnglishWords.filter(
    (w) =>
      !trimmed.includes(`\\${w}`) &&
      !['const', 'constant', 'where', 'units', 'value'].includes(w.toLowerCase()),
  );

  if (hasLatexCmd && (nonLatexLongWords.length === 0 || withoutCmds.length < 18)) {
    return true;
  }
  if (hasMathExp && nonLatexLongWords.length === 0 && withoutCmds.length <= 12) {
    return true;
  }
  return false;
}

function splitMathSegments(input: string): TextSegment[] {
  if (!input) return [];

  if (isBareMathString(input)) {
    return [{ kind: 'inline-math', content: input.trim() }];
  }

  const segments: TextSegment[] = [];
  const regex =
    /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$(?=[^$]*?\\begin\{)[\s\S]+?\$|\$[^$\n]+?\$|\\\([\s\S]*?\\\)|\\(?:ce|pu)\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}|\\(?:d?frac|cfrac|t?binom|overset|underset)\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}|\\(?:sqrt|cbrt|vec|overrightarrow|overline|underline|widehat|widetilde|mathbb|mathrm|mathbf|text)\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}|-?\d+(?:\.\d+)?\s*\^\s*\{?\s*\\(?:circ|degree)\s*\}?|\\(?:alpha|beta|gamma|delta|epsilon|varepsilon|theta|vartheta|lambda|mu|nu|pi|rho|sigma|tau|phi|varphi|psi|omega|Delta|Gamma|Theta|Lambda|Xi|Pi|Sigma|Omega|infty|hbar|angle|measuredangle|triangle|perp|parallel|leq|le|geq|ge|neq|ne|approx|simeq|equiv|cong|propto|times|cdot|div|pm|mp|rightarrow|leftarrow|leftrightarrow|Rightarrow|Leftarrow|Leftrightarrow|implies|iff|rightleftharpoons|to|in|notin|subset|subseteq|supset|supseteq|cup|cap|emptyset|varnothing|forall|exists|therefore|because|circ)\b)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ kind: 'text', content: input.slice(lastIndex, match.index) });
    }
    const token = match[0];
    if (token.startsWith('$$') && token.endsWith('$$')) {
      segments.push({ kind: 'display-math', content: token.slice(2, -2) });
    } else if (token.startsWith('\\[') && token.endsWith('\\]')) {
      segments.push({ kind: 'display-math', content: token.slice(2, -2) });
    } else if (token.startsWith('\\(') && token.endsWith('\\)')) {
      segments.push({ kind: 'inline-math', content: token.slice(2, -2) });
    } else if (token.startsWith('$') && token.endsWith('$')) {
      segments.push({ kind: 'inline-math', content: token.slice(1, -1) });
    } else {
      segments.push({ kind: 'inline-math', content: token });
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < input.length) {
    segments.push({ kind: 'text', content: input.slice(lastIndex) });
  }
  return segments;
}

function renderInlineFormatting(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export const MathText: React.FC<MathTextProps> = ({ text, className = '', style }) => {
  const safeText = useMemo(() => repairLatexText(text == null ? '' : String(text)), [text]);

  const renderedNodes = useMemo(() => {
    const segments = splitMathSegments(safeText);
    const out: React.ReactNode[] = [];

    for (let index = 0; index < segments.length; index++) {
      const seg = segments[index];
      if (seg.kind === 'text') {
        const lines = seg.content.split('\n');
        out.push(
          <React.Fragment key={index}>
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {renderInlineFormatting(line)}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </React.Fragment>,
        );
        continue;
      }

      // Keep leading punctuation directly after inline math (e.g. ",", ".", ")", ":") glued to formula
      let gluedTail = '';
      if (seg.kind === 'inline-math' && index + 1 < segments.length && segments[index + 1].kind === 'text') {
        const nextText = segments[index + 1].content;
        const tailMatch = nextText.match(/^([.,;:!?)\]]+)/);
        if (tailMatch) {
          gluedTail = tailMatch[1];
          segments[index + 1] = {
            kind: 'text',
            content: nextText.slice(gluedTail.length),
          };
        }
      }

      const keepNoWrap = seg.kind === 'inline-math' && seg.content.length <= 75;

      try {
        const html = katex.renderToString(seg.content, {
          displayMode: seg.kind === 'display-math',
          throwOnError: false,
          strict: false,
          trust: true,
        });
        out.push(
          <span
            key={index}
            className={
              seg.kind === 'display-math'
                ? 'block my-1.5'
                : keepNoWrap
                  ? 'katex-inline-nowrap inline whitespace-nowrap align-baseline'
                  : 'inline align-baseline'
            }
          >
            <span dangerouslySetInnerHTML={{ __html: html }} />
            {gluedTail}
          </span>,
        );
      } catch {
        out.push(
          <code key={index} className="font-mono text-[0.9em]">
            {seg.content}
            {gluedTail}
          </code>,
        );
      }
    }

    return out;
  }, [safeText]);

  return (
    <span className={className} style={style}>
      {renderedNodes}
    </span>
  );
};
