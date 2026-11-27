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
  c6h5ch3: 'Cc1ccccc1',
  phch3: 'Cc1ccccc1',
  phenol: 'Oc1ccccc1',
  c6h5oh: 'Oc1ccccc1',
  phoh: 'Oc1ccccc1',
  aniline: 'Nc1ccccc1',
  benzenamine: 'Nc1ccccc1',
  c6h5nh2: 'Nc1ccccc1',
  phnh2: 'Nc1ccccc1',
  nitrobenzene: 'O=[N+]([O-])c1ccccc1',
  c6h5no2: 'O=[N+]([O-])c1ccccc1',
  phno2: 'O=[N+]([O-])c1ccccc1',
  chlorobenzene: 'Clc1ccccc1',
  c6h5cl: 'Clc1ccccc1',
  phcl: 'Clc1ccccc1',
  bromobenzene: 'Brc1ccccc1',
  c6h5br: 'Brc1ccccc1',
  phbr: 'Brc1ccccc1',
  fluorobenzene: 'Fc1ccccc1',
  c6h5f: 'Fc1ccccc1',
  iodobenzene: 'Ic1ccccc1',
  c6h5i: 'Ic1ccccc1',
  benzaldehyde: 'O=Cc1ccccc1',
  c6h5cho: 'O=Cc1ccccc1',
  phcho: 'O=Cc1ccccc1',
  'benzoic acid': 'O=C(O)c1ccccc1',
  c6h5cooh: 'O=C(O)c1ccccc1',
  phcooh: 'O=C(O)c1ccccc1',
  acetophenone: 'CC(=O)c1ccccc1',
  c6h5coch3: 'CC(=O)c1ccccc1',
  benzophenone: 'O=C(c1ccccc1)c1ccccc1',
  anisole: 'COc1ccccc1',
  methoxybenzene: 'COc1ccccc1',
  c6h5och3: 'COc1ccccc1',
  phenetole: 'CCOc1ccccc1',
  styrene: 'C=Cc1ccccc1',
  c6h5chch2: 'C=Cc1ccccc1',
  cumene: 'CC(C)c1ccccc1',
  isopropylbenzene: 'CC(C)c1ccccc1',
  benzonitrile: 'N#Cc1ccccc1',
  c6h5cn: 'N#Cc1ccccc1',
  benzamide: 'NC(=O)c1ccccc1',
  c6h5conh2: 'NC(=O)c1ccccc1',
  'benzoyl chloride': 'O=C(Cl)c1ccccc1',
  c6h5cocl: 'O=C(Cl)c1ccccc1',
  acetanilide: 'CC(=O)Nc1ccccc1',
  'benzyl alcohol': 'OCc1ccccc1',
  c6h5ch2oh: 'OCc1ccccc1',
  'benzyl chloride': 'ClCc1ccccc1',
  c6h5ch2cl: 'ClCc1ccccc1',
  'benzenesulfonic acid': 'O=S(=O)(O)c1ccccc1',
  c6h5so3h: 'O=S(=O)(O)c1ccccc1',
  phenylhydrazine: 'NNc1ccccc1',
  'o-xylene': 'Cc1ccccc1C',
  'm-xylene': 'Cc1cccc(C)c1',
  'p-xylene': 'Cc1ccc(C)cc1',
  mesitylene: 'Cc1cc(C)cc(C)c1',
  'o-cresol': 'Cc1ccccc1O',
  'm-cresol': 'Cc1cccc(O)c1',
  'p-cresol': 'Cc1ccc(O)cc1',
  'o-nitrophenol': 'Oc1ccccc1[N+](=O)[O-]',
  'm-nitrophenol': 'Oc1cccc([N+](=O)[O-])c1',
  'p-nitrophenol': 'Oc1ccc([N+](=O)[O-])cc1',
  'o-nitroaniline': 'Nc1ccccc1[N+](=O)[O-]',
  'm-nitroaniline': 'Nc1cccc([N+](=O)[O-])c1',
  'p-nitroaniline': 'Nc1ccc([N+](=O)[O-])cc1',
  'picric acid': 'Oc1c([N+](=O)[O-])cc([N+](=O)[O-])cc1[N+](=O)[O-]',
  '2,4,6-trinitrophenol': 'Oc1c([N+](=O)[O-])cc([N+](=O)[O-])cc1[N+](=O)[O-]',
  '2,4,6-tribromophenol': 'Oc1c(Br)cc(Br)cc1Br',
  catechol: 'Oc1ccccc1O',
  resorcinol: 'Oc1cccc(O)c1',
  hydroquinone: 'Oc1ccc(O)cc1',
  quinol: 'Oc1ccc(O)cc1',
  'phthalic acid': 'O=C(O)c1ccccc1C(=O)O',
  'terephthalic acid': 'O=C(O)c1ccc(C(=O)O)cc1',
  salicylicacid: 'O=C(O)c1ccccc1O',
  'salicylic acid': 'O=C(O)c1ccccc1O',
  aspirin: 'CC(=O)Oc1ccccc1C(=O)O',
  cinnamaldehyde: 'O=C/C=C/c1ccccc1',
  'cinnamic acid': 'O=C(O)/C=C/c1ccccc1',
  biphenyl: 'c1ccc(-c2ccccc2)cc1',
  naphthalene: 'c1ccc2ccccc2c1',
  anthracene: 'c1ccc2cc3ccccc3cc2c1',
  phenanthrene: 'c1ccc2c(c1)ccc1ccccc21',
  pyridine: 'c1ccncc1',
  furan: 'c1ccoc1',
  thiophene: 'c1ccsc1',
  pyrrole: 'c1cc[nH]c1',
  indole: 'c1ccc2[nH]ccc2c1',
  quinoline: 'c1ccc2ncccc2c1',
  cyclohexane: 'C1CCCCC1',
  cyclohexene: 'C1=CCCCC1',
  cyclohexanol: 'OC1CCCCC1',
  cyclohexanone: 'O=C1CCCCC1',
  cyclopentane: 'C1CCCC1',
  acetone: 'CC(=O)C',
  propanone: 'CC(=O)C',
  ch3coch3: 'CC(=O)C',
  ethanol: 'CCO',
  c2h5oh: 'CCO',
  ch3ch2oh: 'CCO',
  methanol: 'CO',
  ch3oh: 'CO',
  'acetic acid': 'CC(=O)O',
  ch3cooh: 'CC(=O)O',
  'formic acid': 'O=CO',
  hcooh: 'O=CO',
  'oxalic acid': 'O=C(O)C(=O)O',
  formaldehyde: 'C=O',
  hcho: 'C=O',
  acetaldehyde: 'CC=O',
  ch3cho: 'CC=O',
  urea: 'NC(N)=O',
  nh2conh2: 'NC(N)=O',
  chloroform: 'ClC(Cl)Cl',
  chcl3: 'ClC(Cl)Cl',
  'diethyl ether': 'CCOCC',
  'ethyl acetate': 'CCOC(C)=O',
  ethene: 'C=C',
  ethylene: 'C=C',
  c2h4: 'C=C',
  propene: 'CC=C',
  ethyne: 'C#C',
  acetylene: 'C#C',
  c2h2: 'C#C',
  methane: 'C',
  ethane: 'CC',
  propane: 'CCC',
  butane: 'CCCC',
};

function stripMathWrapper(raw: string): string {
  return raw
    .trim()
    .replace(/^\$+|\$+$/g, '')
    .replace(/^\\ce\{([\s\S]*)\}$/i, '$1')
    .trim();
}

function resolveSmiles(raw: string): string {
  const cleaned = stripMathWrapper(raw);
  const compactKey = cleaned.toLowerCase().replace(/[\s\-=]+/g, '');
  const spacedKey = cleaned.toLowerCase().trim();
  if (COMMON_SMILES_MAP[spacedKey]) return COMMON_SMILES_MAP[spacedKey];
  if (COMMON_SMILES_MAP[compactKey]) return COMMON_SMILES_MAP[compactKey];
  return cleaned;
}

function formatFormulaForMhchem(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.includes('$') || /\\ce\{/i.test(trimmed)) return trimmed;
  return `$\\ce{${trimmed}}$`;
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
    // Reject obvious inorganic formulas/equations that Molecule.fromSmiles shouldn't misinterpret
    if (/^[0-9]*\s*(?:H2O|H2SO4|HNO3|HCl|HBr|HI|NaOH|KOH|NH3|CO2|SO2|KMnO4|K2Cr2O7|Cl2|Br2|I2|H2|O2|N2|FeCl3|AlCl3)$/i.test(cleanSmiles)) {
      return null;
    }
    try {
      const mol = Molecule.fromSmiles(cleanSmiles);
      mol.inventCoordinates();
      let svg = mol.toSVG(maxWidth, maxHeight, uniqueId, {
        autoCrop: true,
        autoCropMargin: 10,
        strokeWidth: Math.max(1.3, strokeWidth),
        fontWeight: '600',
        suppressChiralText: true,
        suppressCIPParity: true,
        suppressESR: true,
        noStereoProblem: true,
      });

      // Remove invisible interactive hit-target lines & circles for crisp static vector/PDF print
      svg = svg
        .replace(/<(?:line|circle)[^>]*class="event"[^>]*\/>/g, '')
        .replace(/font-family:\s*sans-serif/gi, "font-family: 'Plus Jakarta Sans', Arial, sans-serif")
        .replace(/stroke="rgb\([^)]+\)"/g, `stroke="${color}"`)
        .replace(/stroke="#000000"/gi, `stroke="${color}"`)
        .replace(/stroke="black"/gi, `stroke="${color}"`)
        .replace(/fill="rgb\([^)]+\)"/g, `fill="${color}"`)
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
        className="inline-flex items-center px-2 py-1 text-sm font-medium"
        style={{ color }}
      >
        <MathText text={formatFormulaForMhchem(smiles)} />
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

  const aboveLen = (reaction.reagentsAbove || '').replace(/[$\\{}]/g, '').length;
  const belowLen = (reaction.reagentsBelow || '').replace(/[$\\{}]/g, '').length;
  const arrowWidth = Math.max(96, Math.min(185, Math.max(aboveLen, belowLen) * 6.5 + 32));

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-2 px-2">
      {/* Reactants */}
      <div className="flex flex-wrap items-center justify-center gap-2">
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

      {/* Auto-width Arrow with reagents above and below */}
      <div className="flex flex-col items-center justify-center px-1" style={{ minWidth: `${arrowWidth}px` }}>
        {reaction.reagentsAbove && (
          <div className="text-[11px] font-medium text-center leading-tight mb-0.5 whitespace-nowrap" style={{ color }}>
            <MathText text={reaction.reagentsAbove} />
          </div>
        )}
        <svg width={arrowWidth} height="16" viewBox={`0 0 ${arrowWidth} 16`} className="overflow-visible">
          <line
            x1="2"
            y1="8"
            x2={arrowWidth - 10}
            y2="8"
            stroke={color}
            strokeWidth={Math.max(1.4, strokeWidth)}
          />
          <polygon points={`${arrowWidth - 12},3 ${arrowWidth - 2},8 ${arrowWidth - 12},13`} fill={color} />
        </svg>
        {reaction.reagentsBelow && (
          <div className="text-[11px] font-medium text-center leading-tight mt-0.5 whitespace-nowrap" style={{ color }}>
            <MathText text={reaction.reagentsBelow} />
          </div>
        )}
      </div>

      {/* Products */}
      <div className="flex flex-wrap items-center justify-center gap-2">
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
