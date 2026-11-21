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

const LATEX_CMD_REGEX =
  /\\(?:frac|dfrac|tfrac|sqrt|cbrt|ce|pu|sin|cos|tan|cot|sec|csc|arcsin|arccos|arctan|sinh|cosh|tanh|log|ln|exp|lim|sup|inf|max|min|det|dim|gcd|binom|tbinom|dbinom|theta|alpha|beta|gamma|delta|epsilon|varepsilon|zeta|eta|iota|kappa|lambda|mu|nu|xi|pi|rho|sigma|tau|upsilon|phi|varphi|chi|psi|omega|Delta|Gamma|Theta|Lambda|Xi|Pi|Sigma|Phi|Psi|Omega|int|iint|iiint|oint|sum|prod|partial|nabla|vec|overrightarrow|overline|underline|widehat|widetilde|hat|bar|dot|ddot|left|right|times|cdot|div|pm|mp|approx|simeq|cong|equiv|neq|ne|leq|le|geq|ge|ll|gg|propto|infty|to|rightarrow|leftarrow|leftrightarrow|Rightarrow|Leftarrow|Leftrightarrow|implies|iff|uparrow|downarrow|rightleftharpoons|mapsto|circ|degree|angle|triangle|perp|parallel|in|notin|subset|subseteq|supset|supseteq|cup|cap|setminus|emptyset|varnothing|forall|exists|neg|lor|land|therefore|because|text|textbf|textit|mathrm|mathbf|mathbb|mathcal|mathsf|mbox)\b/;

/**
 * Repairs common LLM JSON escaping corruptions (\t, \f, \r, \b turning into control chars
 * inside LaTeX commands like \theta, \times, \frac, \right, \beta, \circ) and unwraps
 * double-escaped command prefixes like \\frac -> \frac.
 */
export function repairLatexText(raw: string): string {
  let s = raw;
  // Restore control characters accidentally eaten by single-backslash JSON parsing
  s = s
    .replace(/\t(?=(?:heta|imes|ext|an|au|riangle|frac|binom|o\b))/g, '\\t')
    .replace(/\f(?=(?:rac|orall|lat))/g, '\\f')
    .replace(/\r(?=(?:ho|ight|eg|angle))/g, '\\r')
    .replace(/\x08(?=(?:eta|ar|inom|egin|ig|ullet|ecause))/g, '\\b');

  // Unwrap double-backslashed LaTeX command names (e.g., "\\frac" -> "\frac", "\\circ" -> "\circ")
  // while leaving matrix line-breaks ("\\ " or "\\\n") intact.
  s = s.replace(
    /\\\\(?=(?:frac|dfrac|tfrac|sqrt|cbrt|ce|pu|circ|degree|theta|alpha|beta|gamma|delta|epsilon|lambda|mu|nu|pi|rho|sigma|tau|phi|psi|omega|Delta|Omega|Sigma|sin|cos|tan|cot|sec|csc|log|ln|exp|lim|int|oint|sum|prod|vec|hat|bar|dot|left|right|times|cdot|div|pm|mp|approx|cong|equiv|neq|ne|leq|le|geq|ge|propto|infty|to|rightarrow|leftarrow|Rightarrow|implies|iff|angle|triangle|perp|parallel|in|notin|subset|cup|cap|forall|exists|text|mathrm|mathbf|mathbb|mathcal|binom)\b)/g,
    '\\',
  );

  // Convert malformed unicode/escaped degree patterns like 30° or 30^\circ consistently
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

  // If it has LaTeX commands and almost no prose words, render whole string as math
  if (hasLatexCmd && (nonLatexLongWords.length === 0 || withoutCmds.length < 18)) {
    return true;
  }
  // Short pure algebraic/exponential strings without prose (e.g. "x^2 + 3x - 4 = 0", "10^{-5}")
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
  // Match:
  // 1. $$...$$
  // 2. \[...\]
  // 3. $...$
  // 4. \(...\)
  // 5. Bare \ce{...}, \pu{...}, \frac{...}{...}, \sqrt{...}, \binom{...}{...}, \vec{...}, \overline{...}
  // 6. Bare degree notation like 30^\circ or 45^{\circ}
  // 7. Standalone LaTeX symbol tokens like \alpha, \theta, \pi, \infty, \angle, \triangle, \leq, \geq, \neq, \times, \pm
  const regex =
    /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[^$\n]+?\$|\\\([\s\S]*?\\\)|\\(?:ce|pu)\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}|\\(?:d?frac|t?binom)\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}|\\(?:sqrt|vec|overrightarrow|overline|widehat|mathbb|mathrm|mathbf)\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}|-?\d+(?:\.\d+)?\s*\^\s*\{?\s*\\(?:circ|degree)\s*\}?|\\(?:alpha|beta|gamma|delta|epsilon|theta|lambda|mu|nu|pi|rho|sigma|tau|phi|psi|omega|Delta|Omega|Sigma|infty|angle|triangle|perp|parallel|leq|le|geq|ge|neq|ne|approx|equiv|cong|times|cdot|div|pm|mp|rightarrow|leftarrow|leftrightarrow|Rightarrow|implies|iff|to|in|notin|subset|subseteq|cup|cap|emptyset|forall|exists|therefore|because|circ)\b)/g;
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
    return segments.map((seg, index) => {
      if (seg.kind === 'text') {
        const lines = seg.content.split('\n');
        return (
          <React.Fragment key={index}>
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {renderInlineFormatting(line)}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </React.Fragment>
        );
      }

      try {
        const html = katex.renderToString(seg.content, {
          displayMode: seg.kind === 'display-math',
          throwOnError: false,
          strict: false,
          trust: true,
        });
        return (
          <span
            key={index}
            className={seg.kind === 'display-math' ? 'block my-1.5' : 'inline-block align-baseline'}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        return (
          <code key={index} className="font-mono text-[0.9em]">
            {seg.content}
          </code>
        );
      }
    });
  }, [safeText]);

  return (
    <span className={className} style={style}>
      {renderedNodes}
    </span>
  );
};
