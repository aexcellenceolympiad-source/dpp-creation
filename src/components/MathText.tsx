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
  /\\(?:frac|dfrac|tfrac|sqrt|ce|pu|sin|cos|tan|cot|sec|csc|theta|alpha|beta|gamma|delta|omega|phi|psi|pi|mu|lambda|sigma|rho|tau|Delta|Omega|Sigma|int|oint|sum|prod|lim|vec|hat|bar|dot|ddot|left|right|times|cdot|div|pm|mp|approx|neq|le|ge|infty|to|rightarrow|leftarrow|Rightarrow|implies|text|mathrm|mathbf)\b/;

function isBareMathString(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed || trimmed.includes('$')) return false;
  if (!LATEX_CMD_REGEX.test(trimmed)) return false;

  // If it contains Devanagari characters, it is mixed Hindi prose, not a pure math expression
  if (/[\u0900-\u097F]/.test(trimmed)) return false;

  // Strip LaTeX commands and braces to see if there's a long natural-language sentence
  const withoutCmds = trimmed
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/[{}\[\]()^_0-9+\-*/=.,<>|:\s]/g, '');

  // Pure math expressions mostly have variable letters (short tokens); prose has many multi-letter English words
  const longEnglishWords = trimmed.match(/\b[a-zA-Z]{5,}\b/g) || [];
  const nonLatexLongWords = longEnglishWords.filter(
    (w) => !trimmed.includes(`\\${w}`) && !['const', 'constant'].includes(w.toLowerCase()),
  );
  return nonLatexLongWords.length === 0 || withoutCmds.length < 18;
}

function splitMathSegments(input: string): TextSegment[] {
  if (!input) return [];

  if (isBareMathString(input)) {
    return [{ kind: 'inline-math', content: input.trim() }];
  }

  const segments: TextSegment[] = [];
  // Match $$...$$, \[...\], $...$, \(...\), or bare \ce{...} / \frac{...}{...}
  const regex =
    /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[^$\n]+?\$|\\\([\s\S]*?\\\)|\\ce\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}|\\(?:d?frac|sqrt)\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}(?:\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\})?)/g;
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
      // Bare \ce{...}, \frac{...}{...}, or \sqrt{...}
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
  const safeText = text == null ? '' : String(text);
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
