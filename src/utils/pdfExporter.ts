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

  const zoomFactor = Math.max(0.5, (sheetElement.getBoundingClientRect().width || targetWidthPx) / targetWidthPx);
  const estimatedHeightPx = Math.max(
    800,
    Math.ceil(sheetElement.scrollHeight || (sheetElement.getBoundingClientRect().height / zoomFactor) || 1123),
  );

  const marginMm = Math.max(
    0,
    Math.min(12, Number.isFinite(styleConfig.pageMarginMm) ? styleConfig.pageMarginMm : 6),
  );
  const useTransparentBg = Boolean(styleConfig.showWatermark);
  const bgRgb = hexToRgb(styleConfig.pageColor || '#FFFFFF');

  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const marginXMm = marginMm;
  const marginTopMm = marginMm;
  const marginBottomMm = marginMm === 0 ? 0 : Math.max(marginMm, styleConfig.compactPrintMode ? 3.5 : 4);
  const usableWidthMm = Math.max(50, pageWidthMm - marginXMm * 2);
  const usableHeightMm = Math.max(50, pageHeightMm - marginTopMm - marginBottomMm);
  const [pr, pg, pb] = hexToRgb(styleConfig.pageColor || '#FFFFFF');
  const [fr, fg, fb] = hexToRgb(styleConfig.footerStyle?.color || '#475569');

  const prepareClonedSheet = (clonedDoc: Document, clonedEl: HTMLElement) => {
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

    if (styleConfig.columns === 2) {
      clonedEl.querySelectorAll('.print\\:grid-cols-2').forEach((el) => {
        const gridEl = el as HTMLElement;
        gridEl.style.display = 'grid';
        gridEl.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
        gridEl.style.alignItems = 'start';
        gridEl.style.columnGap = styleConfig.compactPrintMode ? '14px' : '22px';
        gridEl.style.rowGap = '0px';
      });
      clonedEl.querySelectorAll('.print\\:col-span-2').forEach((el) => {
        (el as HTMLElement).style.gridColumn = '1 / -1';
      });
    }

    if (styleConfig.mcqOptionsLayout === 2) {
      clonedEl.querySelectorAll('.mcq-options-flex-4, .mcq-options-grid-4').forEach((el) => {
        const optEl = el as HTMLElement;
        optEl.style.display = 'flex';
        optEl.style.flexWrap = 'wrap';
        optEl.style.justifyContent = 'space-between';
        optEl.style.columnGap = styleConfig.compactPrintMode ? '10px' : '14px';
        optEl.style.rowGap = styleConfig.compactPrintMode ? '2px' : '6px';
      });
    }

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

    void clonedEl.offsetHeight;
    const rawTops: number[] = [];
    const cloneRect = clonedEl.getBoundingClientRect();
    clonedEl.querySelectorAll('.question-block-avoid-break').forEach((el) => {
      const r = el.getBoundingClientRect();
      const topPx = r.top - cloneRect.top;
      if (topPx > 20) {
        rawTops.push(topPx);
      }
    });
    rawTops.sort((a, b) => a - b);
    const questionTopsCss: number[] = [];
    for (const t of rawTops) {
      if (questionTopsCss.length === 0 || t - questionTopsCss[questionTopsCss.length - 1] > 4) {
        questionTopsCss.push(t);
      }
    }
    return {
      fullHeightCss: Math.max(800, clonedEl.scrollHeight || estimatedHeightPx),
      questionTopsCss,
    };
  };

  let totalAddedPages = 0;

  const appendCanvasSlicesToPdf = (
    canvas: HTMLCanvasElement,
    captureScale: number,
    localQuestionTopsCss: number[],
  ) => {
    const canvasPxPerMm = canvas.width / usableWidthMm;
    const maxSliceHeightPx = Math.max(100, Math.floor(usableHeightMm * canvasPxPerMm));
    const slices: { startY: number; endY: number }[] = [];
    let currentY = 0;

    while (currentY < canvas.height - 4) {
      const idealEndY = currentY + maxSliceHeightPx;
      if (idealEndY >= canvas.height) {
        slices.push({ startY: currentY, endY: canvas.height });
        break;
      }

      let chosenEndY = idealEndY;

      if (localQuestionTopsCss.length > 0) {
        const candidateTops = localQuestionTopsCss
          .map((t) => Math.floor(t * captureScale))
          .filter((t) => t > currentY + maxSliceHeightPx * 0.42 && t <= idealEndY);

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

    slices.forEach((slice) => {
      if (totalAddedPages > 0) {
        pdf.addPage('a4', isLandscape ? 'landscape' : 'portrait');
      }
      totalAddedPages++;

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
    });
  };

  if (estimatedHeightPx <= 8500) {
    // Fast single-canvas capture for standard DPP / Test sheets
    const maxCanvasPixels = 13_000_000;
    const captureScale = Math.min(
      2,
      Math.max(1.25, Number(Math.sqrt(maxCanvasPixels / (targetWidthPx * estimatedHeightPx)).toFixed(2))),
    );
    let questionTopsCss: number[] = [];

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
        questionTopsCss = prepareClonedSheet(clonedDoc, clonedEl).questionTopsCss;
      },
    });

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Could not capture sheet canvas. Try Print -> Save as PDF.');
    }
    appendCanvasSlicesToPdf(canvas, captureScale, questionTopsCss);
  } else {
    // Safe multi-band capture for large 60-180 question papers so browser canvas limits never fail
    const captureScale = 1.4;
    const maxBandHeightCss = 5400;
    let cursorCss = 0;
    let totalHeightCss = estimatedHeightPx;

    while (cursorCss < totalHeightCss - 4) {
      let bandQuestionTops: number[] = [];
      const requestedBandHeightCss = Math.min(
        maxBandHeightCss,
        Math.max(240, Math.ceil(totalHeightCss - cursorCss + 320)),
      );
      let bandEndCss = Math.min(totalHeightCss, cursorCss + requestedBandHeightCss);

      const bandCanvas = await html2canvas(sheetElement, {
        scale: captureScale,
        useCORS: true,
        allowTaint: false,
        backgroundColor: useTransparentBg ? null : styleConfig.pageColor || '#FFFFFF',
        logging: false,
        width: targetWidthPx,
        windowWidth: targetWidthPx,
        height: requestedBandHeightCss,
        x: 0,
        y: cursorCss,
        scrollX: 0,
        scrollY: 0,
        ignoreElements: (el) =>
          el.classList?.contains('no-print') || el.classList?.contains('print-page-border-overlay'),
        onclone: (clonedDoc, clonedEl) => {
          const info = prepareClonedSheet(clonedDoc, clonedEl);
          totalHeightCss = info.fullHeightCss;
          bandQuestionTops = info.questionTopsCss;

          const maxReachableCss = Math.min(totalHeightCss, cursorCss + requestedBandHeightCss);
          // Align band end cleanly before a question block so no question straddles two bands
          if (maxReachableCss < totalHeightCss) {
            const safeBreaks = info.questionTopsCss.filter(
              (t) => t > cursorCss + requestedBandHeightCss * 0.55 && t <= maxReachableCss,
            );
            bandEndCss =
              safeBreaks.length > 0
                ? Math.max(cursorCss + 40, safeBreaks[safeBreaks.length - 1] - 4)
                : maxReachableCss;
          } else {
            bandEndCss = totalHeightCss;
          }
        },
      });

      if (!bandCanvas || bandCanvas.width === 0 || bandCanvas.height === 0) {
        throw new Error('Could not capture large sheet band. Try Print -> Save as PDF.');
      }

      const cropPxH = Math.min(
        bandCanvas.height,
        Math.max(50, Math.floor((bandEndCss - cursorCss) * captureScale)),
      );
      let effectiveCanvas = bandCanvas;
      if (cropPxH < bandCanvas.height - 8) {
        const trimmed = document.createElement('canvas');
        trimmed.width = bandCanvas.width;
        trimmed.height = cropPxH;
        const tCtx = trimmed.getContext('2d');
        if (tCtx) {
          tCtx.drawImage(bandCanvas, 0, 0, bandCanvas.width, cropPxH, 0, 0, bandCanvas.width, cropPxH);
          effectiveCanvas = trimmed;
        }
      }

      const localTops = bandQuestionTops
        .filter((t) => t > cursorCss && t < bandEndCss)
        .map((t) => t - cursorCss);
      appendCanvasSlicesToPdf(effectiveCanvas, captureScale, localTops);
      cursorCss = Math.max(cursorCss + 40, bandEndCss);
    }
  }

  // Stamp consistent Page X / TotalPages footers across all generated pages
  const finalTotalPages = Math.max(1, totalAddedPages);
  if (finalTotalPages > 1 && marginBottomMm >= 3) {
    pdf.setTextColor(fr, fg, fb);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    for (let p = 1; p <= finalTotalPages; p++) {
      pdf.setPage(p);
      pdf.text(
        `${mode === 'questions' ? 'Question Paper' : 'Answer Key'} · Page ${p} / ${finalTotalPages}`,
        pageWidthMm / 2,
        pageHeightMm - Math.max(2.2, marginBottomMm * 0.45),
        { align: 'center' },
      );
    }
  }

  const finalName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
  triggerPdfDownload(pdf, finalName);
}
