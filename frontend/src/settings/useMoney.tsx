// @ts-ignore — currency.js has no bundled type declarations
import currency from 'currency.js';

import { useSelector } from 'react-redux';
import storePersist from '@/redux/storePersist';

import { selectMoneyFormat } from '@/redux/settings/selectors';

interface MoneyFormatSettings {
  currency_code: string;
  currency_symbol: string;
  currency_position: 'before' | 'after';
  decimal_sep: string;
  thousand_sep: string;
  cent_precision: number;
  zero_format: boolean;
}

interface CurrencyFormatParams {
  amount: number;
  currency_code?: string;
}

interface MoneyRowFormatterResult {
  props: {
    style: {
      textAlign: string;
      whiteSpace: string;
      direction: string;
    };
  };
  children: React.ReactNode;
}

interface UseMoneyReturn {
  moneyRowFormatter: (params: CurrencyFormatParams) => MoneyRowFormatterResult;
  moneyFormatter: (params: CurrencyFormatParams) => string;
  amountFormatter: (params: CurrencyFormatParams) => string;
  currency_symbol: string | undefined;
  currency_code: string | undefined;
  currency_position: string | undefined;
  decimal_sep: string | undefined;
  thousand_sep: string | undefined;
  cent_precision: number | undefined;
  zero_format: boolean | undefined;
}

const useMoney = (): UseMoneyReturn => {
  const money_format_settings = useSelector(selectMoneyFormat) as unknown as MoneyFormatSettings | undefined;

  const money_format_state: MoneyFormatSettings | undefined = money_format_settings
    ? money_format_settings
    : (storePersist.get('settings') as { money_format_settings?: MoneyFormatSettings } | undefined)
        ?.money_format_settings;

  function currencyFormat({ amount, currency_code = money_format_state?.currency_code }: CurrencyFormatParams): string | number {
    return currency(amount).dollars() > 0 || !money_format_state?.zero_format
      ? currency(amount, {
          separator: money_format_state?.thousand_sep,
          decimal: money_format_state?.decimal_sep,
          symbol: '',
          precision: money_format_state?.cent_precision,
        }).format()
      : 0 +
          currency(amount, {
            separator: money_format_state?.thousand_sep,
            decimal: money_format_state?.decimal_sep,
            symbol: '',
            precision: money_format_state?.cent_precision,
          }).format();
  }

  function moneyFormatter({ amount = 0, currency_code = money_format_state?.currency_code }: CurrencyFormatParams): string {
    return money_format_state?.currency_position === 'before'
      ? money_format_state?.currency_symbol + ' ' + currencyFormat({ amount, currency_code })
      : currencyFormat({ amount, currency_code }) + ' ' + money_format_state?.currency_symbol;
  }

  function amountFormatter({ amount = 0, currency_code = money_format_state?.currency_code }: CurrencyFormatParams): string {
    return currencyFormat({ amount: amount, currency_code }) as string;
  }

  function moneyRowFormatter({ amount = 0, currency_code = money_format_state?.currency_code }: CurrencyFormatParams): MoneyRowFormatterResult {
    return {
      props: {
        style: {
          textAlign: 'right',
          whiteSpace: 'nowrap',
          direction: 'ltr',
        },
      },
      children: (
        <>
          {money_format_state?.currency_position === 'before'
            ? money_format_state?.currency_symbol + ' ' + currencyFormat({ amount, currency_code })
            : currencyFormat({ amount, currency_code }) + ' ' + money_format_state?.currency_symbol}
        </>
      ),
    };
  }

  return {
    moneyRowFormatter,
    moneyFormatter,
    amountFormatter,
    currency_symbol: money_format_state?.currency_symbol,
    currency_code: money_format_state?.currency_code,
    currency_position: money_format_state?.currency_position,
    decimal_sep: money_format_state?.decimal_sep,
    thousand_sep: money_format_state?.thousand_sep,
    cent_precision: money_format_state?.cent_precision,
    zero_format: money_format_state?.zero_format,
  };
};

export default useMoney;
