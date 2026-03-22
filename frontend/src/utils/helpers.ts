declare global {
  interface ObjectConstructor {
    byString: (o: Record<string, unknown> | null, s: string) => unknown;
  }
}

export function get(obj: Record<string, unknown>, key: string): unknown {
  return key.split('.').reduce(function (o: unknown, x: string): unknown {
    return o === undefined || o === null ? o : (o as Record<string, unknown>)[x];
  }, obj);
}

Object.byString = function (o: Record<string, unknown> | null, s: string): unknown {
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, ''); // strip a leading dot
  const a: string[] = s.split('.');
  for (let i = 0, n = a.length; i < n; ++i) {
    const k: string = a[i];
    if (o !== null) {
      if (k in o) {
        o = o[k] as Record<string, unknown> | null;
      } else {
        return;
      }
    } else {
      return;
    }
  }
  return o;
};

/* 
 To check only if a property exists, without getting its value. It similar get function.
*/
export function has(obj: Record<string, unknown> | unknown, key: string): boolean {
  return key.split('.').every(function (x: string): boolean {
    if (typeof obj !== 'object' || obj === null || (x in (obj as Record<string, unknown>)) === false)
      /// !x in obj or  x in obj === true *** if you find any bug
      return false;
    obj = (obj as Record<string, unknown>)[x];
    return true;
  });
}

/* 
 convert indexes to properties
*/
export function valueByString(obj: Record<string, unknown>, string: string, devider?: string): string {
  if (devider === undefined) {
    devider = '|';
  }
  return string
    .split(devider)
    .map(function (key: string): unknown {
      return get(obj, key);
    })
    .join(' ');
}

/*
 Submit multi-part form using ajax.
*/
export function toFormData(form: HTMLFormElement): FormData {
  const formData: FormData = new FormData();
  const elements: NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> =
    form.querySelectorAll('input, select, textarea');
  for (let i = 0; i < elements.length; ++i) {
    const element = elements[i];
    const name: string = element.name;

    if (name && element.dataset.disabled !== 'true') {
      if (element instanceof HTMLInputElement && element.type === 'file') {
        const file: File | undefined = element.files?.[0];
        if (file) {
          formData.append(name, file);
        }
      } else {
        const value: string = element.value;
        if (value && value.trim()) {
          formData.append(name, value);
        }
      }
    }
  }

  return formData;
}

/*
 Format Date to display admin
*/
export function formatDate(param: string | number | Date): string {
  const date: Date = new Date(param);
  let day: string = date.getDate().toString();
  let month: string = (date.getMonth() + 1).toString();
  const year: number = date.getFullYear();
  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;
  const fullDate: string = `${day}/${month}/${year}`;
  return fullDate;
}

// @ts-ignore - dayjs is available at runtime but not imported in this file
export const isDate = function ({ date, format = 'YYYY-MM-DD' }: { date: unknown; format?: string }): boolean {
  if (typeof date == 'boolean') return false;
  if (typeof date == 'number') return false;
  // @ts-ignore - dayjs is available at runtime
  if (dayjs(date, format).isValid()) return true;
  return false;
};
/*
 Format Datetime to display admin
*/
export function formatDatetime(param: string | number | Date): string {
  const time: string = new Date(param).toLocaleTimeString();
  return formatDate(param) + ' ' + time;
}

/*
  Regex to validate phone number format
*/
export const validatePhoneNumber: RegExp = /^(?:[+\d()\-\s]+)$/;

/*
 Set object value in html
*/
