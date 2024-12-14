import { createRoot } from 'react-dom/client';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import App from './app.tsx';

const root = createRoot(document.getElementById('root'));

function Entry() {
  return (
    <FluentProvider theme={webLightTheme}>
      <App />
    </FluentProvider>
  );
}

root.render(<Entry />);
