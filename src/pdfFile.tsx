import { ReactNode, useEffect, useId, useRef, useState } from 'react';
import { Skeleton, SkeletonItem } from '@fluentui/react-components';
import { getPdfCanvas } from './pdfUtils.ts';
import './pdfFile.less';

function PdfPage(props: { element: HTMLCanvasElement }) {
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
    <div ref={divRef} />
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
    const cover = await getPdfCanvas(await data, 1);
    setCanvasNode([<PdfPage key="1" element={cover} />]);
    setReady(true);
  };

  const fetchAll = async () => {
    const covers = await getPdfCanvas(await data);
    setCanvasNode(covers.map((cover, index) => <PdfPage key={index} element={cover} />));
    setReady(true);
  };

  useEffect(() => {
    setReady(false);
    void fetchAll();
  }, [modifiedTime, fileName]);

  return (
    <div className={`pdf-file-${id}`}>
      {ready ?
        <>
          <div className="pdf-album">{canvasNode.map(c => c)}</div>
          <div>{fileName}</div>
        </> :
        <Skeleton style={{ height: '100%' }}>
          <SkeletonItem shape={'rectangle'} style={{ height: '100%', marginBottom: '10px' }} />
          <SkeletonItem shape={'rectangle'} />
        </Skeleton>
      }
    </div>
  );
}