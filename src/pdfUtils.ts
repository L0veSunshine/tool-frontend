import { isPdfFile as isNamePdfFile } from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker?worker&url';
import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const PdfSignature = '255044462d';

export function isPdfFile(name: string): boolean {
  return isNamePdfFile(name);
}

export function isPdfStream(stream: ArrayBuffer): boolean {
  const len = stream.byteLength;
  if (len < 5) {
    return false;
  }
  const streamHeader = new Uint8Array(stream.slice(0, 5));
  const magicHeader = Array.from(streamHeader).map(s => s.toString(16)).join('');
  return magicHeader === PdfSignature;
}

interface Range {
  start: number;
  end: number;
}

async function getPdfCanvas(data: ArrayBuffer, pageRange: number): Promise<HTMLCanvasElement>
async function getPdfCanvas(data: ArrayBuffer, pageRange: [number, number]): Promise<HTMLCanvasElement[]>
async function getPdfCanvas(data: ArrayBuffer, pageRange: number | [number, number]): Promise<HTMLCanvasElement | HTMLCanvasElement[]> {
  const pdfDocument = await pdfjs.getDocument(data).promise;
  const maxPage = pdfDocument.numPages;

  let range: Range = { start: 0, end: 0 };
  if (Array.isArray(pageRange)) {
    range = { start: Math.max(1, range[0]), end: Math.min(maxPage, range[1]) };
  } else {
    const pageNo = Math.min(maxPage, Math.max(pageRange, 1));
    range = { start: pageNo, end: pageNo };
  }
  const elements = Array.from({ length: range.end - range.start + 1 }, () => {
    const canvasEle = document.createElement('canvas');
    const ctx = canvasEle.getContext('2d');
    return { element: canvasEle, ctx: ctx };
  });
  for (let i = range.start; i <= range.end; i++) {
    const page = await pdfDocument.getPage(i);
    const viewport = page.getViewport({ scale: 0.5 });
    const canvas = elements[i - range.start];
    canvas.element.width = viewport.width;
    canvas.element.height = viewport.height;
    page.render({ canvasContext: canvas.ctx, viewport: viewport });
  }
  return elements.length > 1 ? elements.map(e => e.element) : elements[0].element;
}

export { getPdfCanvas };
