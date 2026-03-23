import React from 'react';
import { Form, InputNumber } from 'antd';
import { useMoney } from '@/settings';

interface MoneyInputFormItemProps {
  updatePrice?: ((value: number | null) => void) | undefined;
  value?: number;
  readOnly?: boolean;
}

export default function MoneyInputFormItem({
  updatePrice,
  value = 0,
  readOnly = false,
}: MoneyInputFormItemProps): React.JSX.Element {
  const { amountFormatter, currency_symbol, currency_position, cent_precision, currency_code } =
    useMoney();

  return (
    <Form.Item>
      <InputNumber
        readOnly={readOnly}
        className="moneyInput"
        onChange={updatePrice}
        precision={cent_precision ? cent_precision : 2}
        value={amountFormatter({ amount: value, currency_code: currency_code }) as unknown as number}
        controls={false}
        addonAfter={currency_position === 'after' ? currency_symbol : undefined}
        addonBefore={currency_position === 'before' ? currency_symbol : undefined}
        formatter={(value) => amountFormatter({ amount: value ?? 0, currency_code })}
      />
    </Form.Item>
  );
}
