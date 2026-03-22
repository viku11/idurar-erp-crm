type FieldType = 'string' | 'country' | 'phone' | 'email';

interface FieldConfig {
  type: FieldType;
}

interface Fields {
  name: FieldConfig;
  country: FieldConfig;
  address: FieldConfig;
  phone: FieldConfig;
  email: FieldConfig;
}

export const fields: Fields = {
  name: {
    type: 'string',
  },
  country: {
    type: 'country',
    // color: 'red',
  },
  address: {
    type: 'string',
  },
  phone: {
    type: 'phone',
  },
  email: {
    type: 'email',
  },
};
