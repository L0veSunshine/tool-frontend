import { useEffect, useRef, useState } from 'react';
import workerSrc from 'pdfjs-dist/build/pdf.worker?worker&url';
import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

type Range = {
  start: number
  end: number
}

function createInputElement() {
  const ele = document.createElement('input');
  ele.setAttribute('type', 'file');
  ele.setAttribute('accept', 'application/pdf');
  ele.multiple = true;
  return ele;
}

function App() {
  const inputRef = useRef<HTMLInputElement>(createInputElement());
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    inputRef.current.addEventListener('change', ev => {
      const target = ev.target as HTMLInputElement;
      const fs: File[] = [];
      for (let i = 0; i < target.files.length; i++) {
        const file = target.files.item(i);
        if (file instanceof File && pdfjs.isPdfFile(file.name)) {
          fs.push(file);
        }
      }
      setFiles(fs);
    });
  }, []);

  async function getPdfCanvas(file: File, pageRange: number): Promise<HTMLCanvasElement>
  async function getPdfCanvas(file: File, pageRange: [number, number]): Promise<HTMLCanvasElement[]>
  async function getPdfCanvas(file: File, pageRange: number | [number, number]): Promise<HTMLCanvasElement | HTMLCanvasElement[]> {
    const content = await file.arrayBuffer();
    const pdfDocument = await pdfjs.getDocument(content).promise;
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

  function showInPage(files: File[]) {
    const page = document.getElementById('pages');
    for (const f of files) {
      getPdfCanvas(f, 0).then(cv => {
        page.append(cv);
      });
    }
  }

  useEffect(() => {
    showInPage(files);
  }, [files]);

  return (
    <>
      <button onClick={() => inputRef.current.click()}>add</button>
      <div id="pages"></div>
    </>
  );
}

export default App;
