import { createRoot, Root } from 'react-dom/client';

import RootApp from './RootApp';

const rootElement: HTMLElement | null = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root: Root = createRoot(rootElement);
root.render(<RootApp />);
