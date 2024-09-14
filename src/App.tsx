import { useEffect, useRef, useState } from 'react';
import { Button } from '@fluentui/react-components';
import { isPdfFile } from './pdfUtils.ts';
import { PdfFile } from './pdfFile.tsx';

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
        if (file instanceof File && isPdfFile(file.name)) {
          fs.push(file);
        }
      }
      setFiles(fs);
    });
  }, []);

  return (
    <div className="app-container">
      <Button onClick={() => inputRef.current.click()}>add</Button>
      {files.map(f => <PdfFile key={f.size} fileName={f.name} data={f.arrayBuffer()} modifiedTime={f.lastModified} />)}
    </div>
  );
}

export default App;
