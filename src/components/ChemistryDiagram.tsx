import React, { useId, useMemo } from 'react';
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

const COMMON_SMILES_MAP: Record<string, string> = {
  benzene: 'c1ccccc1',
  c6h6: 'c1ccccc1',
  toluene: 'Cc1ccccc1',
  methylbenzene: 'Cc1ccccc1',
  phenol: 'Oc1ccccc1',
  c6h5oh: 'Oc1ccccc1',
  aniline: 'Nc1ccccc1',
  c6h5nh2: 'Nc1ccccc1',
  nitrobenzene: 'O=[N+]([O-])c1ccccc1',
  chlorobenzene: 'Clc1ccccc1',
  bromobenzene: 'Brc1ccccc1',
  fluorobenzene: 'Fc1ccccc1',
  iodobenzene: 'Ic1ccccc1',
  benzaldehyde: 'O=Cc1ccccc1',
  'benzoic acid': 'O=C(O)c1ccccc1',
  acetophenone: 'CC(=O)c1ccccc1',
  benzophenone: 'O=C(c1ccccc1)c1ccccc1',
  anisole: 'COc1ccccc1',
  styrene: 'C=Cc1ccccc1',
  salicylicacid: 'O=C(O)c1ccccc1O',
  'salicylic acid': 'O=C(O)c1ccccc1O',
  aspirin: 'CC(=O)Oc1ccccc1C(=O)O',
  naphthalene: 'c1ccc2ccccc2c1',
  anthracene: 'c1ccc2cc3ccccc3cc2c1',
  pyridine: 'c1ccncc1',
  furan: 'c1ccoc1',
  thiophene: 'c1ccsc1',
  pyrrole: 'c1cc[nH]c1',
  cyclohexane: 'C1CCCCC1',
  cyclohexene: 'C1=CCCCC1',
  cyclopentane: 'C1CCCC1',
  acetone: 'CC(=O)C',
  ethanol: 'CCO',
  methanol: 'CO',
  'acetic acid': 'CC(=O)O',
  formaldehyde: 'C=O',
  acetaldehyde: 'CC=O',
  ethene: 'C=C',
  ethylene: 'C=C',
  ethyne: 'C#C',
  acetylene: 'C#C',
  ethane: 'CC',
  propane: 'CCC',
  butane: 'CCCC',
};

function resolveSmiles(raw: string): string {
  const trimmed = raw.trim();
  const normalizedKey = trimmed.toLowerCase();
  if (COMMON_SMILES_MAP[normalizedKey]) {
    return COMMON_SMILES_MAP[normalizedKey];
  }
  return trimmed;
}

export const MoleculeSvg: React.FC<SingleMoleculeProps> = ({
  smiles,
  color,
  strokeWidth,
  maxWidth = 175,
  maxHeight = 125,
}) => {
  const cleanSmiles = typeof smiles === 'string' ? resolveSmiles(smiles) : '';
  const uniqueId = `mol_${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  const svgMarkup = useMemo(() => {
    if (!cleanSmiles) return null;
    try {
      const mol = Molecule.fromSmiles(cleanSmiles);
      mol.inventCoordinates();
      let svg = mol.toSVG(maxWidth, maxHeight, uniqueId, {
        autoCrop: true,
        autoCropMargin: 10,
        strokeWidth,
        fontWeight: '600',
        suppressChiralText: true,
        suppressCIPParity: true,
        suppressESR: true,
        noStereoProblem: true,
      });

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
  }, [cleanSmiles, uniqueId, color, strokeWidth, maxWidth, maxHeight]);

  if (!cleanSmiles) {
    return null;
  }

  if (!svgMarkup) {
    return (
      <div
        className="inline-flex items-center px-3 py-1.5 border border-dashed rounded text-xs font-mono"
        style={{ borderColor: color, color }}
      >
        {cleanSmiles}
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
  const reactants = Array.isArray(reaction?.reactants)
    ? reaction.reactants.filter((s) => typeof s === 'string' && s.trim().length > 0)
    : [];
  const products = Array.isArray(reaction?.products)
    ? reaction.products.filter((s) => typeof s === 'string' && s.trim().length > 0)
    : [];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-2 px-2">
      {/* Reactants */}
      <div className="flex items-center gap-2">
        {reactants.map((smiles, idx) => (
          <React.Fragment key={idx}>
            <MoleculeSvg smiles={smiles} color={color} strokeWidth={strokeWidth} maxWidth={145} maxHeight={110} />
            {idx < reactants.length - 1 && (
              <span className="font-semibold text-base" style={{ color }}>
                +
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Arrow with reagents above and below */}
      <div className="flex flex-col items-center justify-center min-w-[115px] px-1">
        {reaction.reagentsAbove && (
          <div className="text-[11px] font-medium text-center leading-tight mb-0.5" style={{ color }}>
            <MathText text={reaction.reagentsAbove} />
          </div>
        )}
        <svg width="112" height="16" viewBox="0 0 112 16" className="overflow-visible">
          <line
            x1="2"
            y1="8"
            x2="102"
            y2="8"
            stroke={color}
            strokeWidth={Math.max(1.4, strokeWidth)}
          />
          <polygon points="100,3 110,8 100,13" fill={color} />
        </svg>
        {reaction.reagentsBelow && (
          <div className="text-[11px] font-medium text-center leading-tight mt-0.5" style={{ color }}>
            <MathText text={reaction.reagentsBelow} />
          </div>
        )}
      </div>

      {/* Products */}
      <div className="flex items-center gap-2">
        {products.length > 0 ? (
          products.map((smiles, idx) => (
            <React.Fragment key={idx}>
              <MoleculeSvg
                smiles={smiles}
                color={color}
                strokeWidth={strokeWidth}
                maxWidth={145}
                maxHeight={110}
              />
              {idx < products.length - 1 && (
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
