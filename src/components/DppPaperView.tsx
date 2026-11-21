import React, { useState } from 'react';
import { RefreshCw, Trash2, Check, Edit3 } from 'lucide-react';
import { DppDocument, DppQuestion, DppStyleConfig, TextStyleConfig } from '../types/dpp';
import { MathText } from './MathText';
import { ScientificFigure } from './ScientificFigure';
import { MoleculeSvg } from './ChemistryDiagram';

interface DppPaperViewProps {
  dpp: DppDocument;
  styleConfig: DppStyleConfig;
  mode: 'questions' | 'answers';
  zoom: number;
  regeneratingId: string | null;
  onRegenerateQuestion: (q: DppQuestion, forceDiagram?: boolean) => void;
  onDeleteQuestion: (id: string) => void;
  onUpdateQuestion: (updated: DppQuestion) => void;
}

function toTextCss(cfg?: Partial<TextStyleConfig>, fallback?: TextStyleConfig): React.CSSProperties {
  const c: TextStyleConfig = {
    color: cfg?.color ?? fallback?.color ?? '#0F172A',
    fontSize: cfg?.fontSize ?? fallback?.fontSize ?? 13,
    bold: cfg?.bold ?? fallback?.bold ?? false,
    italic: cfg?.italic ?? fallback?.italic ?? false,
    underline: cfg?.underline ?? fallback?.underline ?? false,
  };
  return {
    color: c.color,
    fontSize: `${c.fontSize}px`,
    fontWeight: c.bold ? 700 : 400,
    fontStyle: c.italic ? 'italic' : 'normal',
    textDecoration: c.underline ? 'underline' : 'none',
    textUnderlineOffset: c.underline ? '4px' : undefined,
  };
}

function getBorderCss(styleConfig: DppStyleConfig): React.CSSProperties {
  if (styleConfig.borderStyle === 'none') {
    return { border: 'none' };
  }
  if (styleConfig.borderStyle === 'ornate') {
    return {
      border: `${Math.max(2, styleConfig.borderWidth)}px solid ${styleConfig.borderColor}`,
      outline: `1px solid ${styleConfig.borderColor}`,
      outlineOffset: '-7px',
    };
  }
  const actualWidth =
    styleConfig.borderStyle === 'double'
      ? Math.max(3, styleConfig.borderWidth + 2)
      : styleConfig.borderWidth;
  return {
    border: `${actualWidth}px ${styleConfig.borderStyle} ${styleConfig.borderColor}`,
  };
}

export const DppPaperView: React.FC<DppPaperViewProps> = ({
  dpp,
  styleConfig,
  mode,
  zoom,
  regeneratingId,
  onRegenerateQuestion,
  onDeleteQuestion,
  onUpdateQuestion,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftStem, setDraftStem] = useState('');
  const [draftAnswer, setDraftAnswer] = useState('');
  const [draftMarks, setDraftMarks] = useState(4);
  const [draftNegMarks, setDraftNegMarks] = useState(0);
  const [draftOptions, setDraftOptions] = useState<{ label: string; text: string; smiles?: string }[]>([]);

  const questions = Array.isArray(dpp?.questions) ? dpp.questions : [];
  const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);
  const isLandscape = styleConfig.orientation === 'landscape';
  const paperWidthMm = isLandscape ? 297 : 210;
  const paperMinHeightMm = isLandscape ? 210 : 297;
  const borderCss = getBorderCss(styleConfig);

  const startEdit = (q: DppQuestion) => {
    setEditingId(q.id);
    setDraftStem(q.stem);
    setDraftAnswer(q.correctAnswer);
    setDraftMarks(q.marks);
    setDraftNegMarks(q.negativeMarks || 0);
    setDraftOptions(q.options ? q.options.map((o) => ({ ...o })) : []);
  };

  const saveEdit = (q: DppQuestion) => {
    onUpdateQuestion({
      ...q,
      stem: draftStem,
      correctAnswer: draftAnswer,
      marks: draftMarks,
      negativeMarks: draftNegMarks,
      options: draftOptions.length > 0 ? draftOptions : q.options,
    });
    setEditingId(null);
  };

  const getTypeLabel = (type: DppQuestion['type']) => {
    switch (type) {
      case 'mcq':
        return 'MCQ';
      case 'multiple_correct':
        return 'Multi-Correct';
      case 'assertion_reason':
        return 'Assertion-Reason';
      case 'true_false':
        return 'True / False';
      case 'fill_blank':
        return 'Fill in Blank';
      case 'match_following':
        return 'Match Columns';
      case 'subjective':
        return 'Subjective';
      default:
        return type;
    }
  };

  return (
    <div className="print-container flex justify-center py-4 px-2">
      {/* Edge-to-edge fixed border overlay for every printed PDF page (0mm from paper edges) */}
      <div
        className="print-page-border-overlay hidden"
        style={borderCss}
        aria-hidden="true"
      >
        {styleConfig.showWatermark && (
          <div
            className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden"
            aria-hidden="true"
          >
            <div
              className="font-bold uppercase tracking-[0.22em] text-center whitespace-nowrap"
              style={{
                color: styleConfig.brandStyle.color,
                opacity: (styleConfig.watermarkOpacity ?? 8) / 100,
                fontSize: isLandscape ? '48px' : '40px',
                transform: 'rotate(-32deg)',
              }}
            >
              {styleConfig.brandName || 'SAFAL ACADEMY LIVE'}
            </div>
          </div>
        )}
        {styleConfig.borderStyle === 'ornate' && (
          <>
            <span
              className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2"
              style={{ borderColor: styleConfig.borderColor }}
            />
            <span
              className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2"
              style={{ borderColor: styleConfig.borderColor }}
            />
            <span
              className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2"
              style={{ borderColor: styleConfig.borderColor }}
            />
            <span
              className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2"
              style={{ borderColor: styleConfig.borderColor }}
            />
          </>
        )}
      </div>

      {/* Screen + Print A4 Sheet (0mm outer padding so border sits right on page edge) */}
      <div
        className="print-a4-sheet relative shadow-lg transition-transform duration-150 origin-top box-border"
        style={{
          width: `${paperWidthMm}mm`,
          minHeight: `${paperMinHeightMm}mm`,
          backgroundColor: styleConfig.pageColor,
          fontFamily: `'${styleConfig.paperFontFamily}', 'Noto Sans Devanagari', serif`,
          transform: `scale(${zoom / 100})`,
          marginBottom: zoom !== 100 ? `${((zoom - 100) / 100) * 650}px` : undefined,
          padding: 0,
        }}
      >
        {/* Screen Outer Edge-Flush Border Frame */}
        <div
          className="print-screen-frame relative w-full box-border flex flex-col justify-between p-6 sm:p-7 overflow-hidden"
          style={{
            minHeight: `${paperMinHeightMm}mm`,
            ...borderCss,
          }}
        >
          {/* Screen Watermark Layer */}
          {styleConfig.showWatermark && (
            <div
              className="no-print pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden z-0"
              aria-hidden="true"
            >
              <div
                className="font-bold uppercase tracking-[0.22em] text-center whitespace-nowrap"
                style={{
                  color: styleConfig.brandStyle.color,
                  opacity: (styleConfig.watermarkOpacity ?? 8) / 100,
                  fontSize: isLandscape ? '48px' : '40px',
                  transform: 'rotate(-32deg)',
                }}
              >
                {styleConfig.brandName || 'SAFAL ACADEMY LIVE'}
              </div>
            </div>
          )}

          {/* Ornate corner flourishes on screen */}
          {styleConfig.borderStyle === 'ornate' && (
            <>
              <span
                className="no-print pointer-events-none absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2"
                style={{ borderColor: styleConfig.borderColor }}
              />
              <span
                className="no-print pointer-events-none absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2"
                style={{ borderColor: styleConfig.borderColor }}
              />
              <span
                className="no-print pointer-events-none absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2"
                style={{ borderColor: styleConfig.borderColor }}
              />
              <span
                className="no-print pointer-events-none absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2"
                style={{ borderColor: styleConfig.borderColor }}
              />
            </>
          )}

          {/* Print Spacer Table ensures multi-page PDFs keep clean padding inside the 0mm fixed border */}
          <table className="print-spacer-table w-full border-collapse">
            <thead className="print-spacer-head hidden print:table-header-group">
              <tr>
                <td style={{ height: '7mm' }} />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-0 print:px-[8mm] align-top">
                  {/* Branding & Header */}
                  <header
                    className="pb-3 mb-4 text-center"
                    style={{ borderBottom: `1.5px solid ${styleConfig.borderColor}` }}
                  >
                    <div className="tracking-wide leading-tight" style={toTextCss(styleConfig.brandStyle)}>
                      {styleConfig.brandName || 'SAFAL ACADEMY LIVE'}
                    </div>
                    {styleConfig.brandSubtitle && (
                      <div className="mt-0.5 leading-snug" style={toTextCss(styleConfig.subtitleStyle)}>
                        {styleConfig.brandSubtitle}
                      </div>
                    )}

                    <div
                      className="mt-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-medium"
                      style={toTextCss(styleConfig.headerMetaStyle)}
                    >
                      <span>
                        {mode === 'questions'
                          ? 'DAILY PRACTICE PROBLEM (DPP)'
                          : 'ANSWER KEY & STEP-BY-STEP SOLUTIONS'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        Class {dpp.metadata.classLevel} ({dpp.metadata.boardOrExam})
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{dpp.metadata.subject}</span>
                      {dpp.metadata.tierOrLevel !== dpp.metadata.boardOrExam && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{dpp.metadata.tierOrLevel}</span>
                        </>
                      )}
                    </div>

                    <div
                      className="mt-1.5"
                      style={toTextCss(styleConfig.chapterLineStyle, {
                        ...styleConfig.headerMetaStyle,
                        fontSize: 12,
                        bold: true,
                      })}
                    >
                      Chapter: {dpp.metadata.chapter} — Topic: {dpp.metadata.topic}
                    </div>

                    {styleConfig.showHeaderMeta && (
                      <div
                        className="mt-2.5 pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] tabular-nums border-t"
                        style={{
                          borderColor: `${styleConfig.borderColor}30`,
                          ...toTextCss(styleConfig.headerMetaStyle),
                        }}
                      >
                        <span>Batch: {styleConfig.batchName}</span>
                        <span>Code: {styleConfig.testCode}</span>
                        <span>Questions: {dpp.questions.length}</span>
                        <span>Max Marks: {totalMarks}</span>
                        <span>Time: {styleConfig.duration}</span>
                        <span>Date: {styleConfig.dateText}</span>
                      </div>
                    )}
                  </header>

                  {/* QUESTION PAPER MODE */}
                  {mode === 'questions' && (
                    <div
                      className={
                        styleConfig.columns === 2
                          ? 'columns-1 md:columns-2 print:columns-2 gap-6 [column-rule:1px_solid_rgba(148,163,184,0.35)]'
                          : ''
                      }
                    >
                      {questions.map((q) => {
                        const isSubjective = q.type === 'subjective';
                        const stemStyle = isSubjective
                          ? toTextCss(styleConfig.subjectiveStyle)
                          : toTextCss(styleConfig.questionStyle);
                        const gapPx = styleConfig.questionSpacing ?? 14;

                        return (
                          <article
                            key={q.id}
                            className="question-block-avoid-break group relative break-inside-avoid min-w-0 max-w-full border-b border-slate-200/70 last:border-b-0"
                            style={{ marginBottom: `${gapPx}px`, paddingBottom: `${Math.max(8, gapPx - 2)}px` }}
                          >
                            {/* Inline Teacher Controls (hidden on PDF print) */}
                            <div className="no-print opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity absolute -top-1 right-0 flex items-center gap-1 bg-white/95 border border-slate-200 rounded px-1.5 py-0.5 shadow-xs z-10">
                              <button
                                type="button"
                                onClick={() => startEdit(q)}
                                title="Edit question text"
                                className="p-1 text-slate-600 hover:text-blue-700"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onRegenerateQuestion(q, q.diagram?.kind !== 'none')}
                                disabled={regeneratingId === q.id}
                                title="Regenerate this question"
                                className="p-1 text-slate-600 hover:text-blue-700 disabled:opacity-40"
                              >
                                <RefreshCw
                                  className={`w-3.5 h-3.5 ${
                                    regeneratingId === q.id ? 'animate-spin' : ''
                                  }`}
                                />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteQuestion(q.id)}
                                title="Remove question"
                                className="p-1 text-slate-600 hover:text-red-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Question Meta Header Line */}
                            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                              <div className="flex items-baseline gap-2">
                                <span
                                  className="font-bold tabular-nums"
                                  style={{ color: stemStyle.color, fontSize: stemStyle.fontSize }}
                                >
                                  Q{q.number}.
                                </span>
                                <span
                                  className="uppercase tracking-wider"
                                  style={toTextCss(styleConfig.metaTagStyle, {
                                    color: '#64748B',
                                    fontSize: 10.5,
                                    bold: true,
                                    italic: false,
                                    underline: false,
                                  })}
                                >
                                  {getTypeLabel(q.type)}
                                  {styleConfig.showPyqTags && q.pyqTag ? ` · ${q.pyqTag}` : ''}
                                </span>
                              </div>
                              {styleConfig.showMarksPerQuestion && (
                                <span
                                  className="font-mono tabular-nums"
                                  style={toTextCss(styleConfig.metaTagStyle, {
                                    color: '#475569',
                                    fontSize: 11,
                                    bold: false,
                                    italic: false,
                                    underline: false,
                                  })}
                                >
                                  [+{q.marks}
                                  {q.negativeMarks > 0 ? ` / -${q.negativeMarks}` : ''}]
                                </span>
                              )}
                            </div>

                            {/* Editing Mode */}
                            {editingId === q.id ? (
                              <div className="no-print space-y-2.5 my-2 p-3 bg-slate-50 border border-slate-300 rounded">
                                <label className="block text-[11px] font-semibold text-slate-700">
                                  Edit Question Stem (LaTeX & \ce{'{...}'} supported)
                                </label>
                                <textarea
                                  value={draftStem}
                                  onChange={(e) => setDraftStem(e.target.value)}
                                  rows={3}
                                  className="w-full text-xs p-2 border border-slate-300 rounded bg-white text-slate-900 font-mono"
                                />
                                {draftOptions.length > 0 && (
                                  <div className="space-y-1.5">
                                    <span className="block text-[11px] font-semibold text-slate-700">
                                      Edit Options
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                      {draftOptions.map((opt, oIdx) => (
                                        <div key={opt.label} className="flex items-center gap-1.5">
                                          <span className="text-xs font-bold text-slate-600 w-5">
                                            ({opt.label})
                                          </span>
                                          <input
                                            type="text"
                                            value={opt.text}
                                            onChange={(e) => {
                                              const next = [...draftOptions];
                                              next[oIdx] = { ...next[oIdx], text: e.target.value };
                                              setDraftOptions(next);
                                            }}
                                            className="flex-1 text-xs p-1 border border-slate-300 rounded bg-white text-slate-900 font-mono"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                <div className="grid grid-cols-3 gap-2">
                                  <div>
                                    <label className="block text-[11px] font-semibold text-slate-700">
                                      Answer Key
                                    </label>
                                    <input
                                      type="text"
                                      value={draftAnswer}
                                      onChange={(e) => setDraftAnswer(e.target.value)}
                                      className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white text-slate-900 font-mono"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[11px] font-semibold text-slate-700">
                                      Marks (+)
                                    </label>
                                    <input
                                      type="number"
                                      min={1}
                                      value={draftMarks}
                                      onChange={(e) => setDraftMarks(Math.max(1, Number(e.target.value) || 1))}
                                      className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white text-slate-900 font-mono tabular-nums"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[11px] font-semibold text-slate-700">
                                      Negative (-)
                                    </label>
                                    <input
                                      type="number"
                                      min={0}
                                      step={0.25}
                                      value={draftNegMarks}
                                      onChange={(e) => setDraftNegMarks(Math.max(0, Number(e.target.value) || 0))}
                                      className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white text-slate-900 font-mono tabular-nums"
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => setEditingId(null)}
                                    className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => saveEdit(q)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-700 text-white rounded"
                                  >
                                    <Check className="w-3 h-3" /> Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="leading-relaxed" style={stemStyle}>
                                <MathText text={q.stem} />
                              </div>
                            )}

                            {/* Assertion & Reason Block */}
                            {q.type === 'assertion_reason' && (q.assertion || q.reason) && (
                              <div className="mt-2 space-y-1.5 pl-3">
                                {q.assertion && (
                                  <div
                                    style={toTextCss(styleConfig.assertionStyle, {
                                      color: styleConfig.assertionColor || '#7C2D12',
                                      fontSize: styleConfig.questionStyle.fontSize,
                                      bold: false,
                                      italic: false,
                                      underline: false,
                                    })}
                                  >
                                    <span className="font-bold">Assertion (A): </span>
                                    <MathText text={q.assertion} />
                                  </div>
                                )}
                                {q.reason && (
                                  <div
                                    style={toTextCss(styleConfig.reasonStyle, {
                                      color: styleConfig.reasonColor || '#1E40AF',
                                      fontSize: styleConfig.questionStyle.fontSize,
                                      bold: false,
                                      italic: false,
                                      underline: false,
                                    })}
                                  >
                                    <span className="font-bold">Reason (R): </span>
                                    <MathText text={q.reason} />
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Vector SVG or Chemistry SMILES Diagram */}
                            {q.diagram && q.diagram.kind !== 'none' && (
                              <ScientificFigure
                                diagram={q.diagram}
                                figureColor={styleConfig.figureColor}
                                figureStrokeWidth={styleConfig.figureStrokeWidth}
                                figureScale={styleConfig.figureScale}
                              />
                            )}

                            {/* Match the Following Table */}
                            {q.type === 'match_following' && q.matchColumns && (
                              <div className="mt-2.5 overflow-x-auto">
                                <table className="w-full border-collapse text-left border border-slate-300/80">
                                  <thead>
                                    <tr className="border-b border-slate-300/80 bg-black/[0.025]">
                                      <th
                                        className="py-1.5 px-2.5 border-r border-slate-300/80 w-1/2"
                                        style={toTextCss(styleConfig.matchLeftStyle)}
                                      >
                                        {q.matchColumns.leftHeader || 'Column I'}
                                      </th>
                                      <th
                                        className="py-1.5 px-2.5 w-1/2"
                                        style={toTextCss(styleConfig.matchRightStyle)}
                                      >
                                        {q.matchColumns.rightHeader || 'Column II'}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {Array.from({
                                      length: Math.max(
                                        (q.matchColumns.leftItems || []).length,
                                        (q.matchColumns.rightItems || []).length,
                                      ),
                                    }).map((_, rIdx) => {
                                      const left = q.matchColumns!.leftItems?.[rIdx];
                                      const right = q.matchColumns!.rightItems?.[rIdx];
                                      return (
                                        <tr
                                          key={rIdx}
                                          className="border-b border-slate-200/70 last:border-b-0"
                                        >
                                          <td
                                            className="py-1.5 px-2.5 border-r border-slate-300/80 align-top"
                                            style={toTextCss(styleConfig.matchLeftStyle)}
                                          >
                                            {left ? (
                                              <span>
                                                ({left.key}) <MathText text={left.text} />
                                              </span>
                                            ) : null}
                                          </td>
                                          <td
                                            className="py-1.5 px-2.5 align-top"
                                            style={toTextCss(styleConfig.matchRightStyle)}
                                          >
                                            {right ? (
                                              <span>
                                                ({right.key}) <MathText text={right.text} />
                                              </span>
                                            ) : null}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}

                            {/* MCQ / Multi-MCQ / True-False / A&R Options */}
                            {q.options &&
                              q.options.length > 0 &&
                              q.type !== 'subjective' &&
                              q.type !== 'fill_blank' && (
                                <div
                                  className={`mt-2.5 grid gap-x-4 gap-y-1.5 ${
                                    q.options.some((o) => o.smiles || (o.text || '').length > 42)
                                      ? 'grid-cols-1 sm:grid-cols-2'
                                      : 'grid-cols-2 sm:grid-cols-4'
                                  }`}
                                >
                                  {q.options.map((opt) => (
                                    <div
                                      key={opt.label}
                                      className="flex items-start gap-1.5 leading-snug"
                                      style={toTextCss(styleConfig.optionStyle)}
                                    >
                                      <span className="font-semibold shrink-0">({opt.label})</span>
                                      <div className="flex flex-col gap-1">
                                        <MathText text={opt.text} />
                                        {opt.smiles && (
                                          <MoleculeSvg
                                            smiles={opt.smiles}
                                            color={styleConfig.figureColor}
                                            strokeWidth={styleConfig.figureStrokeWidth}
                                            maxWidth={130}
                                            maxHeight={90}
                                          />
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                            {/* Subjective writing note */}
                            {isSubjective && (
                              <div className="mt-2 pt-1 text-[10.5px] italic text-slate-400">
                                [Show complete step-by-step derivation / reasoning]
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  )}

                  {/* ANSWER KEY & SOLUTIONS SEPARATE PDF MODE */}
                  {mode === 'answers' && (
                    <div className="space-y-5">
                      <section>
                        <h2
                          className="text-sm font-bold uppercase tracking-wider mb-2"
                          style={{ color: styleConfig.brandStyle.color }}
                        >
                          Quick Answer Key Grid
                        </h2>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-slate-300 text-xs tabular-nums">
                            <thead>
                              <tr className="bg-black/[0.04] border-b border-slate-300">
                                <th className="py-1.5 px-2.5 text-left border-r border-slate-300 font-semibold">
                                  Q. No
                                </th>
                                <th className="py-1.5 px-2.5 text-left border-r border-slate-300 font-semibold">
                                  Type
                                </th>
                                <th className="py-1.5 px-2.5 text-left border-r border-slate-300 font-semibold">
                                  Correct Answer
                                </th>
                                <th className="py-1.5 px-2.5 text-right font-semibold">Marks</th>
                              </tr>
                            </thead>
                            <tbody>
                              {questions.map((q) => (
                                <tr key={q.id} className="border-b border-slate-200/80 last:border-b-0">
                                  <td className="py-1.5 px-2.5 border-r border-slate-300 font-semibold">
                                    Q{q.number}
                                  </td>
                                  <td className="py-1.5 px-2.5 border-r border-slate-300 text-slate-600">
                                    {getTypeLabel(q.type)}
                                  </td>
                                  <td
                                    className="py-1.5 px-2.5 border-r border-slate-300 font-semibold"
                                    style={{ color: styleConfig.matchRightStyle.color }}
                                  >
                                    <MathText text={q.correctAnswer} />
                                  </td>
                                  <td className="py-1.5 px-2.5 text-right">+{q.marks}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </section>

                      <section>
                        <h2
                          className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b"
                          style={{
                            color: styleConfig.brandStyle.color,
                            borderColor: `${styleConfig.borderColor}40`,
                          }}
                        >
                          Detailed Step-by-Step Solutions & Explanations
                        </h2>

                        <div
                          className={
                            styleConfig.columns === 2
                              ? 'columns-1 md:columns-2 print:columns-2 gap-6 [column-rule:1px_solid_rgba(148,163,184,0.35)]'
                              : 'space-y-4'
                          }
                        >
                          {questions.map((q) => (
                            <article
                              key={q.id}
                              className="question-block-avoid-break break-inside-avoid mb-4 pb-3 border-b border-slate-200/70 last:border-b-0"
                            >
                              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                                <span
                                  className="font-bold tabular-nums"
                                  style={toTextCss(styleConfig.questionStyle)}
                                >
                                  Sol {q.number}.{' '}
                                  <span style={{ color: styleConfig.matchRightStyle.color }}>
                                    Answer: <MathText text={q.correctAnswer} />
                                  </span>
                                </span>
                                <span className="text-[10.5px] text-slate-500">
                                  {getTypeLabel(q.type)}
                                </span>
                              </div>

                              {q.solutionDiagram && q.solutionDiagram.kind !== 'none' && (
                                <ScientificFigure
                                  diagram={q.solutionDiagram}
                                  figureColor={styleConfig.figureColor}
                                  figureStrokeWidth={styleConfig.figureStrokeWidth}
                                  figureScale={styleConfig.figureScale}
                                />
                              )}

                              <ol
                                className="list-decimal pl-5 space-y-1 leading-relaxed mt-1"
                                style={toTextCss(styleConfig.solutionStyle, {
                                  color: styleConfig.optionStyle.color,
                                  fontSize: Math.max(11.5, styleConfig.questionStyle.fontSize - 0.5),
                                  bold: false,
                                  italic: false,
                                  underline: false,
                                })}
                              >
                                {(Array.isArray(q.solutionSteps) ? q.solutionSteps : []).map((step, sIdx) => (
                                  <li key={sIdx}>
                                    <MathText text={step} />
                                  </li>
                                ))}
                              </ol>
                            </article>
                          ))}
                        </div>
                      </section>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
            <tfoot className="print-spacer-foot hidden print:table-footer-group">
              <tr>
                <td style={{ height: '7mm' }} />
              </tr>
            </tfoot>
          </table>

          {/* Footer */}
          <footer
            className="mt-6 pt-2 print:px-[8mm] print:pb-[5mm] flex items-center justify-between border-t"
            style={{
              borderColor: `${styleConfig.borderColor}40`,
              ...toTextCss(styleConfig.footerStyle, {
                color: styleConfig.headerMetaStyle.color,
                fontSize: 10.5,
                bold: false,
                italic: false,
                underline: false,
              }),
            }}
          >
            <span>{styleConfig.footerNote}</span>
            <span className="tabular-nums">
              {mode === 'questions' ? 'Question Sheet' : 'Answer Key & Solutions'} ·{' '}
              {styleConfig.brandName}
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
};
