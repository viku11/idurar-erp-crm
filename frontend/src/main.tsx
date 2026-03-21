// @ts-ignore - type declarations unavailable without node_modules
import { createRoot } from 'react-dom/client';

import RootApp from './RootApp';

const rootElement: HTMLElement | null = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);
// @ts-ignore - JSX runtime type declarations unavailable without node_modules
root.render(<RootApp />);
