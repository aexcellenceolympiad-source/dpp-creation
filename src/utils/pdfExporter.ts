import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { DppStyleConfig } from '../types/dpp';

interface ExportPdfOptions {
  sheetElement: HTMLElement;
  styleConfig: DppStyleConfig;
  fileName: string;
  mode: 'questions' | 'answers';
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = (hex || '').replace('#', '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return [r || 0, g || 0, b || 0];
  }
  if (clean.length >= 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return [isNaN(r) ? 0 : r, isNaN(g) ? 0 : g, isNaN(b) ? 0 : b];
  }
  return [15, 23, 42];
}

function drawPageBorderVector(
  pdf: jsPDF,
  pageWidthMm: number,
  pageHeightMm: number,
  styleConfig: DppStyleConfig,
) {
  if (styleConfig.borderStyle === 'none') return;

  const [r, g, b] = hexToRgb(styleConfig.borderColor || '#1E293B');
  pdf.setDrawColor(r, g, b);

  const bwMm = Math.max(0.35, (styleConfig.borderWidth || 2) * 0.28);
  const inset = Math.max(1.2, bwMm / 2 + 0.8);

  if (styleConfig.borderStyle === 'dashed') {
    pdf.setLineWidth(bwMm);
    pdf.setLineDashPattern([3, 2], 0);
    pdf.rect(inset, inset, pageWidthMm - inset * 2, pageHeightMm - inset * 2);
    pdf.setLineDashPattern([], 0);
    return;
  }

  if (styleConfig.borderStyle === 'dotted') {
    pdf.setLineWidth(bwMm);
    pdf.setLineDashPattern([0.8, 1.4], 0);
    pdf.rect(inset, inset, pageWidthMm - inset * 2, pageHeightMm - inset * 2);
    pdf.setLineDashPattern([], 0);
    return;
  }

  if (styleConfig.borderStyle === 'double') {
    pdf.setLineWidth(bwMm * 0.65);
    pdf.rect(inset, inset, pageWidthMm - inset * 2, pageHeightMm - inset * 2);
    const inner = inset + 1.6;
    pdf.setLineWidth(bwMm * 0.45);
    pdf.rect(inner, inner, pageWidthMm - inner * 2, pageHeightMm - inner * 2);
    return;
  }

  if (styleConfig.borderStyle === 'ornate') {
    pdf.setLineWidth(Math.max(0.65, bwMm));
    pdf.rect(inset, inset, pageWidthMm - inset * 2, pageHeightMm - inset * 2);
    const inner = inset + 2.0;
    pdf.setLineWidth(0.3);
    pdf.rect(inner, inner, pageWidthMm - inner * 2, pageHeightMm - inner * 2);

    const cornerLen = 4.5;
    const cOff = inner + 1.2;
    pdf.setLineWidth(0.55);
    pdf.line(cOff, cOff + cornerLen, cOff, cOff);
    pdf.line(cOff, cOff, cOff + cornerLen, cOff);
    pdf.line(pageWidthMm - cOff - cornerLen, cOff, pageWidthMm - cOff, cOff);
    pdf.line(pageWidthMm - cOff, cOff, pageWidthMm - cOff, cOff + cornerLen);
    pdf.line(cOff, pageHeightMm - cOff - cornerLen, cOff, pageHeightMm - cOff);
    pdf.line(cOff, pageHeightMm - cOff, cOff + cornerLen, pageHeightMm - cOff);
    pdf.line(pageWidthMm - cOff - cornerLen, pageHeightMm - cOff, pageWidthMm - cOff, pageHeightMm - cOff);
    pdf.line(pageWidthMm - cOff, pageHeightMm - cOff - cornerLen, pageWidthMm - cOff, pageHeightMm - cOff);
    return;
  }

  pdf.setLineWidth(bwMm);
  pdf.rect(inset, inset, pageWidthMm - inset * 2, pageHeightMm - inset * 2);
}

function drawWatermarkVector(
  pdf: jsPDF,
  pageWidthMm: number,
  pageHeightMm: number,
  styleConfig: DppStyleConfig,
) {
  if (!styleConfig.showWatermark) return;
  const label = (styleConfig.brandName || 'SAFAL ACADEMY LIVE').toUpperCase();
  const [br, bg, bb] = hexToRgb(styleConfig.brandStyle?.color || '#0F172A');
  const [pr, pg, pb] = hexToRgb(styleConfig.pageColor || '#FFFFFF');
  const alpha = Math.min(0.22, Math.max(0.05, (styleConfig.watermarkOpacity ?? 8) / 100));

  const mr = Math.round(br * alpha + pr * (1 - alpha));
  const mg = Math.round(bg * alpha + pg * (1 - alpha));
  const mb = Math.round(bb * alpha + pb * (1 - alpha));

  pdf.setTextColor(mr, mg, mb);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(styleConfig.orientation === 'landscape' ? 32 : 26);
  pdf.text(label, pageWidthMm / 2, pageHeightMm / 2 + 12, {
    align: 'center',
    angle: 32,
  });
}

function findCleanRowCut(
  canvas: HTMLCanvasElement,
  targetCanvasY: number,
  minCanvasY: number,
  bgRgb: [number, number, number],
  hasAlphaBg: boolean,
): number {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return targetCanvasY;

  const w = canvas.width;
  const searchTop = Math.max(minCanvasY, Math.floor(targetCanvasY - 220));
  const searchBottom = Math.min(canvas.height - 1, Math.floor(targetCanvasY));
  if (searchBottom <= searchTop) return targetCanvasY;

  const bandHeight = searchBottom - searchTop + 1;
  const imgData = ctx.getImageData(0, searchTop, w, bandHeight).data;
  const [bgR, bgG, bgB] = bgRgb;

  for (let row = bandHeight - 1; row >= 0; row--) {
    let inkPixels = 0;
    const rowOffset = row * w * 4;
    for (let x = 8; x < w - 8; x += 2) {
      const idx = rowOffset + x * 4;
      const alpha = imgData[idx + 3];
      if (hasAlphaBg) {
        if (alpha > 18) {
          inkPixels++;
          if (inkPixels > 2) break;
        }
      } else {
        const dr = Math.abs(imgData[idx] - bgR);
        const dg = Math.abs(imgData[idx + 1] - bgG);
        const db = Math.abs(imgData[idx + 2] - bgB);
        if (alpha > 15 && dr + dg + db > 24) {
          inkPixels++;
          if (inkPixels > 2) break;
        }
      }
    }
    if (inkPixels <= 2) {
      return searchTop + row;
    }
  }

  return targetCanvasY;
}

function triggerPdfDownload(pdf: jsPDF, finalName: string) {
  try {
    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = finalName;
    link.rel = 'noopener';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      try {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
        URL.revokeObjectURL(url);
      } catch {
        // Ignore cleanup errors
      }
    }, 4000);
  } catch {
    pdf.save(finalName);
  }
}

export async function exportDppToPdf({
  sheetElement,
  styleConfig,
  fileName,
  mode,
}: ExportPdfOptions): Promise<void> {
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try {
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);
    } catch {
      // Ignore font readiness warnings
    }
  }

  const isLandscape = styleConfig.orientation === 'landscape';
  const pageWidthMm = isLandscape ? 297 : 210;
  const pageHeightMm = isLandscape ? 210 : 297;
  const targetWidthPx = isLandscape ? 1123 : 794;

  // Clamp capture scale so large 30+ question papers never exceed mobile/desktop canvas limits
  const estimatedHeightPx = Math.max(800, sheetElement.scrollHeight || 1123);
  const maxCanvasPixels = 14_000_000;
  const captureScale = Math.min(
    2,
    Math.max(1.15, Number(Math.sqrt(maxCanvasPixels / (targetWidthPx * estimatedHeightPx)).toFixed(2))),
  );

  const marginMm = Math.max(
    0,
    Math.min(12, Number.isFinite(styleConfig.pageMarginMm) ? styleConfig.pageMarginMm : 6),
  );
  const useTransparentBg = Boolean(styleConfig.showWatermark);
  const questionTopsCss: number[] = [];

  const canvas = await html2canvas(sheetElement, {
    scale: captureScale,
    useCORS: true,
    allowTaint: false,
    backgroundColor: useTransparentBg ? null : styleConfig.pageColor || '#FFFFFF',
    logging: false,
    width: targetWidthPx,
    windowWidth: targetWidthPx,
    x: 0,
    y: 0,
    scrollX: 0,
    scrollY: 0,
    ignoreElements: (el) =>
      el.classList?.contains('no-print') || el.classList?.contains('print-page-border-overlay'),
    onclone: (clonedDoc, clonedEl) => {
      // Unlock scroll containers in cloned document so nothing gets clipped
      let parent: HTMLElement | null = clonedEl.parentElement;
      while (parent) {
        parent.style.overflow = 'visible';
        parent.style.maxHeight = 'none';
        parent.style.height = 'auto';
        parent.style.transform = 'none';
        parent = parent.parentElement;
      }
      if (clonedDoc.documentElement) {
        clonedDoc.documentElement.style.overflow = 'visible';
      }
      if (clonedDoc.body) {
        clonedDoc.body.style.overflow = 'visible';
      }

      // Normalize the A4 sheet clone
      clonedEl.style.transform = 'none';
      clonedEl.style.marginBottom = '0';
      clonedEl.style.margin = '0';
      clonedEl.style.width = `${targetWidthPx}px`;
      clonedEl.style.minHeight = 'auto';
      clonedEl.style.boxShadow = 'none';
      clonedEl.style.backgroundColor = useTransparentBg
        ? 'transparent'
        : styleConfig.pageColor || '#FFFFFF';
      clonedEl.style.letterSpacing = `${styleConfig.letterSpacing ?? 0}px`;
      clonedEl.style.wordSpacing = `${styleConfig.wordSpacing ?? 0}px`;
      clonedEl.style.lineHeight = String(styleConfig.lineHeight ?? 1.5);

      // Remove screen border & padding (jsPDF draws vector borders + dynamic margins per page)
      const screenFrame = clonedEl.querySelector('.print-screen-frame') as HTMLElement | null;
      if (screenFrame) {
        screenFrame.style.border = 'none';
        screenFrame.style.outline = 'none';
        screenFrame.style.minHeight = 'auto';
        screenFrame.style.padding = '0px';
        screenFrame.style.overflow = 'visible';
      }

      const contentCell = clonedEl.querySelector('.print-content-cell') as HTMLElement | null;
      if (contentCell) {
        contentCell.style.paddingLeft = '0px';
        contentCell.style.paddingRight = '0px';
      }

      const sheetFooter = clonedEl.querySelector('.print-sheet-footer') as HTMLElement | null;
      if (sheetFooter) {
        sheetFooter.style.paddingLeft = '0px';
        sheetFooter.style.paddingRight = '0px';
        sheetFooter.style.paddingBottom = '0px';
      }

      // Enforce explicit 2-column layout in export even on narrow mobile screens
      if (styleConfig.columns === 2) {
        clonedEl.querySelectorAll('.print\\:columns-2').forEach((el) => {
          const colEl = el as HTMLElement;
          colEl.style.columnCount = '2';
          colEl.style.columnGap = '20px';
          colEl.style.columnRule = '1px solid rgba(148, 163, 184, 0.35)';
        });
      }

      // Enforce explicit 4-options-in-1-line grid when selected
      if (styleConfig.mcqOptionsLayout === 2) {
        clonedEl.querySelectorAll('.mcq-options-grid-4').forEach((el) => {
          const gridEl = el as HTMLElement;
          gridEl.style.display = 'grid';
          gridEl.style.gridTemplateColumns = 'repeat(4, minmax(0, 1fr))';
          gridEl.style.columnGap = '4px';
        });
      }

      // Bake explicit pixel dimensions and resolve currentColor for inline SVGs
      clonedEl.querySelectorAll('svg').forEach((svg) => {
        const rect = svg.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          if (!svg.getAttribute('width')) {
            svg.setAttribute('width', `${Math.round(rect.width)}`);
          }
          if (!svg.getAttribute('height')) {
            svg.setAttribute('height', `${Math.round(rect.height)}`);
          }
        }
        const computedColor =
          clonedDoc.defaultView?.getComputedStyle(svg).color ||
          styleConfig.figureColor ||
          '#0F172A';
        svg.style.color = computedColor;
        svg.querySelectorAll('[stroke="currentColor"]').forEach((node) => {
          node.setAttribute('stroke', computedColor);
        });
        svg.querySelectorAll('[fill="currentColor"]').forEach((node) => {
          node.setAttribute('fill', computedColor);
        });
      });

      // Force layout reflow and record safe break points in 1-column mode
      void clonedEl.offsetHeight;
      if (styleConfig.columns === 1) {
        const cloneRect = clonedEl.getBoundingClientRect();
        clonedEl.querySelectorAll('.question-block-avoid-break').forEach((el) => {
          const r = el.getBoundingClientRect();
          const topPx = r.top - cloneRect.top;
          if (topPx > 20) {
            questionTopsCss.push(topPx);
          }
        });
      }
    },
  });

  if (!canvas || canvas.width === 0 || canvas.height === 0) {
    throw new Error('Could not capture sheet canvas. Please try zooming to 100% or use Print.');
  }

  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const marginXMm = marginMm;
  const marginTopMm = marginMm;
  const marginBottomMm = marginMm === 0 ? 0 : Math.max(marginMm, 4);
  const usableWidthMm = Math.max(50, pageWidthMm - marginXMm * 2);
  const usableHeightMm = Math.max(50, pageHeightMm - marginTopMm - marginBottomMm);

  const canvasPxPerMm = canvas.width / usableWidthMm;
  const maxSliceHeightPx = Math.max(100, Math.floor(usableHeightMm * canvasPxPerMm));
  const bgRgb = hexToRgb(styleConfig.pageColor || '#FFFFFF');

  const slices: { startY: number; endY: number }[] = [];
  let currentY = 0;

  while (currentY < canvas.height - 4) {
    const idealEndY = currentY + maxSliceHeightPx;
    if (idealEndY >= canvas.height) {
      slices.push({ startY: currentY, endY: canvas.height });
      break;
    }

    let chosenEndY = idealEndY;

    if (styleConfig.columns === 1 && questionTopsCss.length > 0) {
      const candidateTops = questionTopsCss
        .map((t) => Math.floor(t * captureScale))
        .filter((t) => t > currentY + maxSliceHeightPx * 0.45 && t <= idealEndY);

      if (candidateTops.length > 0) {
        chosenEndY = Math.max(currentY + 50, candidateTops[candidateTops.length - 1] - 4);
      } else {
        chosenEndY = findCleanRowCut(
          canvas,
          idealEndY,
          Math.floor(currentY + maxSliceHeightPx * 0.6),
          bgRgb,
          useTransparentBg,
        );
      }
    } else {
      chosenEndY = findCleanRowCut(
        canvas,
        idealEndY,
        Math.floor(currentY + maxSliceHeightPx * 0.65),
        bgRgb,
        useTransparentBg,
      );
    }

    if (chosenEndY <= currentY + 40) {
      chosenEndY = idealEndY;
    }

    slices.push({ startY: currentY, endY: chosenEndY });
    currentY = chosenEndY;
  }

  const totalPages = Math.max(1, slices.length);
  const [pr, pg, pb] = hexToRgb(styleConfig.pageColor || '#FFFFFF');
  const [fr, fg, fb] = hexToRgb(styleConfig.footerStyle?.color || '#475569');

  slices.forEach((slice, idx) => {
    if (idx > 0) {
      pdf.addPage('a4', isLandscape ? 'landscape' : 'portrait');
    }

    pdf.setFillColor(pr, pg, pb);
    pdf.rect(0, 0, pageWidthMm, pageHeightMm, 'F');

    drawWatermarkVector(pdf, pageWidthMm, pageHeightMm, styleConfig);

    const sliceHeightPx = Math.max(1, slice.endY - slice.startY);
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeightPx;
    const pCtx = pageCanvas.getContext('2d');
    if (!pCtx) {
      throw new Error('Browser canvas context unavailable during PDF slicing.');
    }

    if (!useTransparentBg) {
      pCtx.fillStyle = styleConfig.pageColor || '#FFFFFF';
      pCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    }

    pCtx.drawImage(
      canvas,
      0,
      slice.startY,
      canvas.width,
      sliceHeightPx,
      0,
      0,
      canvas.width,
      sliceHeightPx,
    );

    const imgFormat = useTransparentBg ? 'PNG' : 'JPEG';
    const imgData = useTransparentBg
      ? pageCanvas.toDataURL('image/png')
      : pageCanvas.toDataURL('image/jpeg', 0.94);

    if (!imgData || imgData === 'data:,') {
      throw new Error('Generated PDF page image was empty.');
    }

    const drawnHeightMm = sliceHeightPx / canvasPxPerMm;
    pdf.addImage(
      imgData,
      imgFormat,
      marginXMm,
      marginTopMm,
      usableWidthMm,
      drawnHeightMm,
      undefined,
      'FAST',
    );

    drawPageBorderVector(pdf, pageWidthMm, pageHeightMm, styleConfig);

    if (totalPages > 1 && marginBottomMm >= 3) {
      pdf.setTextColor(fr, fg, fb);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text(
        `${mode === 'questions' ? 'Question Paper' : 'Answer Key'} · Page ${idx + 1} / ${totalPages}`,
        pageWidthMm / 2,
        pageHeightMm - Math.max(2.2, marginBottomMm * 0.45),
        { align: 'center' },
      );
    }
  });

  const finalName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
  triggerPdfDownload(pdf, finalName);
}
