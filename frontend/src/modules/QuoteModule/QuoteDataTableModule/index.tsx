import { ErpLayout } from '@/layout';
import ErpPanel from '@/modules/ErpPanelModule';

import type { ReactNode } from 'react';

interface QuoteDataTableModuleProps {
  config: Record<string, unknown>;
  extra?: ReactNode[];
}

export default function QuoteDataTableModule({ config, extra = [] }: QuoteDataTableModuleProps) {
  return (
    <ErpLayout>
      <ErpPanel config={config as any} extra={extra as any}></ErpPanel>
    </ErpLayout>
  );
}
