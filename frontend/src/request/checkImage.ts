import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from '@/config/serverApiConfig';

export default async function checkImage(path: string): Promise<boolean> {
  const result: boolean = await axios
    .get(path, {
      headers: {
        'Access-Control-Allow-Origin': BASE_URL,
      },
    })
    .then((response: AxiosResponse) => {
      if (response.status === 200) return true;
      else return false;
    })
    .catch(() => {
      return false;
    });

  return result;
}
