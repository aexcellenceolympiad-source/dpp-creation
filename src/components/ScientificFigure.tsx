import React, { useMemo } from 'react';
import { DiagramData } from '../types/dpp';
import { ChemistryReactionView, MoleculeSvg } from './ChemistryDiagram';
import { MathText } from './MathText';

interface ScientificFigureProps {
  diagram?: DiagramData;
  figureColor: string;
  figureStrokeWidth: number;
  figureScale: number;
}

function sanitizeSvg(rawSvg: string): string {
  // Strip potentially unsafe script/event tags while preserving valid SVG vector graphics
  return rawSvg
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .trim();
}

export const ScientificFigure: React.FC<ScientificFigureProps> = ({
  diagram,
  figureColor,
  figureStrokeWidth,
  figureScale,
}) => {
  const sanitizedSvg = useMemo(() => {
    if (!diagram || diagram.kind !== 'svg' || !diagram.svgCode) return '';
    return sanitizeSvg(diagram.svgCode);
  }, [diagram]);

  if (!diagram || diagram.kind === 'none') return null;

  const scaleFactor = Math.max(0.7, Math.min(1.3, figureScale / 100));

  return (
    <div className="my-2.5 flex flex-col items-center justify-center">
      <div
        className="flex items-center justify-center max-w-full origin-center"
        style={{
          transform: `scale(${scaleFactor})`,
          marginTop: scaleFactor > 1 ? `${(scaleFactor - 1) * 35}px` : undefined,
          marginBottom: scaleFactor > 1 ? `${(scaleFactor - 1) * 35}px` : undefined,
        }}
      >
        {diagram.kind === 'svg' && sanitizedSvg && (
          <div
            className="scientific-figure-svg w-full max-w-[330px]"
            style={
              {
                '--fig-color': figureColor,
                '--fig-stroke': `${figureStrokeWidth}px`,
                color: figureColor,
              } as React.CSSProperties
            }
            dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
          />
        )}

        {diagram.kind === 'chemistry_smiles' && diagram.smiles && (
          <MoleculeSvg
            smiles={diagram.smiles}
            color={figureColor}
            strokeWidth={figureStrokeWidth}
            maxWidth={210}
            maxHeight={135}
          />
        )}

        {diagram.kind === 'chemistry_reaction' && diagram.reaction && (
          <ChemistryReactionView
            reaction={diagram.reaction}
            color={figureColor}
            strokeWidth={figureStrokeWidth}
          />
        )}
      </div>

      {diagram.caption && (
        <div
          className="mt-1 text-[11px] italic text-center opacity-80"
          style={{ color: figureColor }}
        >
          <MathText text={diagram.caption} />
        </div>
      )}
    </div>
  );
};
