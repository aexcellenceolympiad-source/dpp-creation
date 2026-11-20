import React, { useMemo } from 'react';
import { Molecule } from 'openchemlib';
import { ReactionScheme } from '../types/dpp';
import { MathText } from './MathText';

interface SingleMoleculeProps {
  smiles: string;
  color: string;
  strokeWidth: number;
  maxWidth?: number;
  maxHeight?: number;
}

export const MoleculeSvg: React.FC<SingleMoleculeProps> = ({
  smiles,
  color,
  strokeWidth,
  maxWidth = 175,
  maxHeight = 125,
}) => {
  const svgMarkup = useMemo(() => {
    try {
      const mol = Molecule.fromSmiles(smiles.trim());
      mol.inventCoordinates();
      let svg = mol.toSVG(maxWidth, maxHeight, undefined, {
        autoCrop: true,
        autoCropMargin: 10,
        strokeWidth,
        fontWeight: '600',
        suppressChiralText: true,
        suppressCIPParity: true,
        suppressESR: true,
        noStereoProblem: true,
      });

      // Harmonize default black strokes/fills with user's chosen figureColor while preserving heteroatom tints if colored,
      // or recoloring standard black strokes cleanly
      svg = svg
        .replace(/stroke="rgb\(0,0,0\)"/g, `stroke="${color}"`)
        .replace(/stroke="#000000"/gi, `stroke="${color}"`)
        .replace(/stroke="black"/gi, `stroke="${color}"`)
        .replace(/fill="rgb\(0,0,0\)"/g, `fill="${color}"`)
        .replace(/fill="#000000"/gi, `fill="${color}"`);

      return svg;
    } catch {
      return null;
    }
  }, [smiles, color, strokeWidth, maxWidth, maxHeight]);

  if (!svgMarkup) {
    return (
      <div
        className="inline-flex items-center px-3 py-1.5 border border-dashed rounded text-xs font-mono"
        style={{ borderColor: color, color }}
      >
        {smiles}
      </div>
    );
  }

  return (
    <div
      className="chemistry-svg-wrap inline-flex items-center justify-center"
      style={{ '--fig-stroke': `${strokeWidth}px` } as React.CSSProperties}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  );
};

interface ReactionSchemeProps {
  reaction: ReactionScheme;
  color: string;
  strokeWidth: number;
}

export const ChemistryReactionView: React.FC<ReactionSchemeProps> = ({
  reaction,
  color,
  strokeWidth,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-2 px-2">
      {/* Reactants */}
      <div className="flex items-center gap-2">
        {(reaction.reactants || []).map((smiles, idx) => (
          <React.Fragment key={idx}>
            <MoleculeSvg smiles={smiles} color={color} strokeWidth={strokeWidth} maxWidth={140} maxHeight={110} />
            {idx < reaction.reactants.length - 1 && (
              <span className="font-semibold text-base" style={{ color }}>
                +
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Arrow with reagents above and below */}
      <div className="flex flex-col items-center justify-center min-w-[110px] px-1">
        {reaction.reagentsAbove && (
          <div className="text-[11px] font-medium text-center leading-tight mb-0.5" style={{ color }}>
            <MathText text={reaction.reagentsAbove} />
          </div>
        )}
        <svg width="108" height="16" viewBox="0 0 108 16" className="overflow-visible">
          <line
            x1="2"
            y1="8"
            x2="98"
            y2="8"
            stroke={color}
            strokeWidth={Math.max(1.4, strokeWidth)}
          />
          <polygon points="96,3 106,8 96,13" fill={color} />
        </svg>
        {reaction.reagentsBelow && (
          <div className="text-[11px] font-medium text-center leading-tight mt-0.5" style={{ color }}>
            <MathText text={reaction.reagentsBelow} />
          </div>
        )}
      </div>

      {/* Products */}
      <div className="flex items-center gap-2">
        {reaction.products && reaction.products.length > 0 ? (
          reaction.products.map((smiles, idx) => (
            <React.Fragment key={idx}>
              <MoleculeSvg
                smiles={smiles}
                color={color}
                strokeWidth={strokeWidth}
                maxWidth={145}
                maxHeight={110}
              />
              {idx < reaction.products.length - 1 && (
                <span className="font-semibold text-base" style={{ color }}>
                  +
                </span>
              )}
            </React.Fragment>
          ))
        ) : (
          <div
            className="w-12 h-10 flex items-center justify-center border border-dashed rounded text-sm font-bold"
            style={{ borderColor: color, color }}
          >
            ?
          </div>
        )}
      </div>
    </div>
  );
};
