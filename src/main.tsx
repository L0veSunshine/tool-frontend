import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.less';

const root = createRoot(document.getElementById('root'));

function Entry() {
  return (
    <App />
  );
}

root.render(<Entry />);
