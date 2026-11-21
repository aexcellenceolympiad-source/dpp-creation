import React, { useMemo } from 'react';
import { DiagramData } from '../types/dpp';
import { ChemistryReactionView, MoleculeSvg } from './ChemistryDiagram';
import { GeometrySvg, MathPlotSvg, PhysicsSchematicSvg } from './DiagramEngine';
import { MathText } from './MathText';

interface ScientificFigureProps {
  diagram?: DiagramData;
  figureColor: string;
  figureStrokeWidth: number;
  figureScale: number;
}

function sanitizeSvg(rawSvg: string): string {
  let clean = rawSvg
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .trim();

  // Ensure SVG always has a viewBox so responsive scaling never clips or collapses
  if (clean.includes('<svg') && !/viewBox=/i.test(clean)) {
    clean = clean.replace(/<svg\b/i, '<svg viewBox="0 0 360 200"');
  }
  return clean;
}

export const ScientificFigure: React.FC<ScientificFigureProps> = ({
  diagram,
  figureColor,
  figureStrokeWidth,
  figureScale,
}) => {
  const sanitizedSvg = useMemo(() => {
    if (!diagram || diagram.kind !== 'svg' || typeof diagram.svgCode !== 'string') return '';
    return sanitizeSvg(diagram.svgCode);
  }, [diagram]);

  if (!diagram || diagram.kind === 'none') return null;

  const hasValidSvg = diagram.kind === 'svg' && sanitizedSvg.includes('<svg');
  const hasValidSmiles =
    diagram.kind === 'chemistry_smiles' &&
    typeof diagram.smiles === 'string' &&
    diagram.smiles.trim().length > 0;
  const hasValidReaction =
    diagram.kind === 'chemistry_reaction' &&
    Boolean(diagram.reaction) &&
    ((Array.isArray(diagram.reaction?.reactants) && diagram.reaction.reactants.length > 0) ||
      (Array.isArray(diagram.reaction?.products) && diagram.reaction.products.length > 0));
  const hasValidMathPlot = diagram.kind === 'math_plot' && Boolean(diagram.mathPlot);
  const hasValidGeometry = diagram.kind === 'geometry' && Boolean(diagram.geometry);
  const hasValidPhysics = diagram.kind === 'physics_diagram' && Boolean(diagram.physics?.preset);

  if (
    !hasValidSvg &&
    !hasValidSmiles &&
    !hasValidReaction &&
    !hasValidMathPlot &&
    !hasValidGeometry &&
    !hasValidPhysics
  ) {
    return null;
  }

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
        {hasValidMathPlot && diagram.mathPlot && (
          <MathPlotSvg
            plot={diagram.mathPlot}
            color={figureColor}
            strokeWidth={figureStrokeWidth}
          />
        )}

        {hasValidGeometry && diagram.geometry && (
          <GeometrySvg
            geometry={diagram.geometry}
            color={figureColor}
            strokeWidth={figureStrokeWidth}
          />
        )}

        {hasValidPhysics && diagram.physics && (
          <PhysicsSchematicSvg
            physics={diagram.physics}
            color={figureColor}
            strokeWidth={figureStrokeWidth}
          />
        )}

        {hasValidSvg && (
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

        {hasValidSmiles && diagram.smiles && (
          <MoleculeSvg
            smiles={diagram.smiles}
            color={figureColor}
            strokeWidth={figureStrokeWidth}
            maxWidth={210}
            maxHeight={135}
          />
        )}

        {hasValidReaction && diagram.reaction && (
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
