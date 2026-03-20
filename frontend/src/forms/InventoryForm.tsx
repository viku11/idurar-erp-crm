import React from 'react';
import { Form, Input, InputNumber } from 'antd';

export default function InventoryForm(): React.ReactElement {
  return (
    <>
      <Form.Item
        label="Product"
        name="product"
        rules={[
          {
            required: true,
            message: 'Please input Product name!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Quantity"
        name="quantity"
        rules={[
          {
            required: true,
            message: 'Please input Quantity!',
            type: 'number',
            min: 0,
          },
        ]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        label="Unit Price"
        name="unitPrice"
        rules={[
          {
            required: true,
            message: 'Please input Unit Price!',
            type: 'number',
            min: 0,
          },
        ]}
      >
        <InputNumber
          formatter={(value: number | undefined) => `$ ${value ?? ''}`}
          parser={(value: string | undefined) =>
            (value ?? '').replace(/\$\s?|(,*)/g, '') as unknown as number
          }
        />
      </Form.Item>
    </>
  );
}
