import { createRoot } from 'react-dom/client';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import App from './App.tsx';
import './index.less';

const root = createRoot(document.getElementById('root'));

function Entry() {
  return (
    <FluentProvider theme={webLightTheme}>
      <App />
    </FluentProvider>
  );
}

root.render(<Entry />);
