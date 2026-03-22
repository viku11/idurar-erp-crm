// @ts-ignore - currency.js types not available in this project
import currency from 'currency.js';

type CurrencyInput = number | string;

interface Calculate {
  add: (firstValue: CurrencyInput, secondValue: CurrencyInput) => number;
  sub: (firstValue: CurrencyInput, secondValue: CurrencyInput) => number;
  multiply: (firstValue: CurrencyInput, secondValue: CurrencyInput) => number;
  divide: (firstValue: CurrencyInput, secondValue: CurrencyInput) => number;
}

const calculate: Calculate = {
  add: (firstValue: CurrencyInput, secondValue: CurrencyInput): number => {
    return currency(firstValue).add(secondValue).value;
  },
  sub: (firstValue: CurrencyInput, secondValue: CurrencyInput): number => {
    return currency(firstValue).subtract(secondValue).value;
  },
  multiply: (firstValue: CurrencyInput, secondValue: CurrencyInput): number => {
    return currency(firstValue).multiply(secondValue).value;
  },
  divide: (firstValue: CurrencyInput, secondValue: CurrencyInput): number => {
    return currency(firstValue).divide(secondValue).value;
  },
};

export default calculate;
