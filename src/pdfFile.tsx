import { ReactNode, useEffect, useId, useRef, useState } from 'react';
import { getPdfCanvas } from './pdfUtils.ts';
import './pdfFile.less';

function CanvasContainer(props: { element: HTMLCanvasElement }) {
  const { element } = props;
  const divRef = useRef<HTMLDivElement>();

  element.style.width = '100%';
  element.style.height = '100%';

  useEffect(() => {
    if (divRef.current) {
      while (divRef.current.firstChild) {
        divRef.current.removeChild(divRef.current.firstChild);
      }
      divRef.current.append(element);
    }
  }, [element]);

  return (
    <div style={{ width: '100%', height: '100%' }} ref={divRef} />
  );
}

interface PdfFileProps {
  fileName: string,
  modifiedTime: number,
  data: Promise<ArrayBuffer>,
}


export function PdfFile(props: PdfFileProps) {
  const { fileName, data, modifiedTime } = props;
  const [canvasNode, setCanvasNode] = useState<ReactNode[]>([]);
  const [ready, setReady] = useState<boolean>(false);
  const id = useId();

  const fetchCover = async () => {
    const stream = await data;
    const cover = await getPdfCanvas(stream, 1);
    setCanvasNode([<CanvasContainer element={cover} />]);
    setReady(true);
  };

  const fetchAll = async () => {
    const stream = await data;
    const covers = await getPdfCanvas(stream, [1, Infinity]);
    setCanvasNode(covers.map(cover => <CanvasContainer element={cover} />));
    setReady(true);
  };

  useEffect(() => {
    setReady(false);
    void fetchCover();
  }, [modifiedTime, fileName]);

  return (
    <div className={`pdf-file-${id}`}>
      {ready ?
        <>
          <div className="pdf-file-album">{canvasNode.map(c => c)}</div>
          <div>{fileName}</div>
        </> :
        <>loading</>
      }
    </div>
  );
}