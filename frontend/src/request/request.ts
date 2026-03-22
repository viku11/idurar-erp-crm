import axios, { CancelTokenSource } from 'axios';
import { API_BASE_URL } from '@/config/serverApiConfig';

import errorHandler from './errorHandler';
import successHandler from './successHandler';
import storePersist from '@/redux/storePersist';

interface AuthData {
  current: {
    token: string;
  };
}

interface CreateParams {
  entity: string;
  jsonData: Record<string, unknown>;
}

interface CreateAndUploadParams {
  entity: string;
  jsonData: FormData;
}

interface ReadParams {
  entity: string;
  id: string;
}

interface UpdateParams {
  entity: string;
  id: string;
  jsonData: Record<string, unknown>;
}

interface UpdateAndUploadParams {
  entity: string;
  id: string;
  jsonData: FormData;
}

interface DeleteParams {
  entity: string;
  id: string;
}

interface FilterOptions {
  filter?: string;
  equal?: string;
}

interface FilterParams {
  entity: string;
  options?: FilterOptions;
}

interface SearchOptions {
  [key: string]: string;
}

interface SearchParams {
  entity: string;
  options?: SearchOptions;
}

interface ListParams {
  entity: string;
  options?: Record<string, string>;
}

interface PostParams {
  entity: string;
  jsonData: Record<string, unknown>;
}

interface GetParams {
  entity: string;
}

interface PatchParams {
  entity: string;
  jsonData: Record<string, unknown>;
}

interface UploadParams {
  entity: string;
  id: string;
  jsonData: FormData;
}

interface SummaryParams {
  entity: string;
  options?: Record<string, string>;
}

interface MailParams {
  entity: string;
  jsonData: Record<string, unknown>;
}

interface ConvertParams {
  entity: string;
  id: string;
}

function findKeyByPrefix(object: Record<string, unknown>, prefix: string): string | undefined {
  for (var property in object) {
    if (object.hasOwnProperty(property) && property.toString().startsWith(prefix)) {
      return property;
    }
  }
}

function includeToken(): void {
  axios.defaults.baseURL = API_BASE_URL;

  axios.defaults.withCredentials = true;
  const auth = storePersist.get('auth') as AuthData | false;

  if (auth) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${auth.current.token}`;
  }
}

const request = {
  create: async ({ entity, jsonData }: CreateParams) => {
    try {
      includeToken();
      const response = await axios.post(entity + '/create', jsonData);
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error as { response?: { status: number; data?: { message?: string; jwtExpired?: boolean; error?: { name?: string } } } });
    }
  },
  createAndUpload: async ({ entity, jsonData }: CreateAndUploadParams) => {
    try {
      includeToken();
      const response = await axios.post(entity + '/create', jsonData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error as { response?: { status: number; data?: { message?: string; jwtExpired?: boolean; error?: { name?: string } } } });
    }
  },
  read: async ({ entity, id }: ReadParams) => {
    try {
      includeToken();
      const response = await axios.get(entity + '/read/' + id);
      successHandler(response, {
        notifyOnSuccess: false,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error as { response?: { status: number; data?: { message?: string; jwtExpired?: boolean; error?: { name?: string } } } });
    }
  },
  update: async ({ entity, id, jsonData }: UpdateParams) => {
    try {
      includeToken();
      const response = await axios.patch(entity + '/update/' + id, jsonData);
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error as { response?: { status: number; data?: { message?: string; jwtExpired?: boolean; error?: { name?: string } } } });
    }
  },
  updateAndUpload: async ({ entity, id, jsonData }: UpdateAndUploadParams) => {
    try {
      includeToken();
      const response = await axios.patch(entity + '/update/' + id, jsonData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error as { response?: { status: number; data?: { message?: string; jwtExpired?: boolean; error?: { name?: string } } } });
    }
  },

  delete: async ({ entity, id }: DeleteParams) => {
    try {
      includeToken();
      const response = await axios.delete(entity + '/delete/' + id);
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error as { response?: { status: number; data?: { message?: string; jwtExpired?: boolean; error?: { name?: string } } } });
    }
  },

  filter: async ({ entity, options = {} }: FilterParams) => {
    try {
      includeToken();
      let filter: string = options.filter ? 'filter=' + options.filter : '';
      let equal: string = options.equal ? '&equal=' + options.equal : '';
      let query: string = `?${filter}${equal}`;

      const response = await axios.get(entity + '/filter' + query);
      successHandler(response, {
        notifyOnSuccess: false,
        notifyOnFailed: false,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error as { response?: { status: number; data?: { message?: string; jwtExpired?: boolean; error?: { name?: string } } } });
    }
  },

  search: async ({ entity, options = {} }: SearchParams) => {
    try {
      includeToken();
      let query: string = '?';
      for (var key in options) {
        query += key + '=' + options[key] + '&';
      }
      query = query.slice(0, -1);
      // headersInstance.cancelToken = source.token;
      const response = await axios.get(entity + '/search' + query);

      successHandler(response, {
        notifyOnSuccess: false,
        notifyOnFailed: false,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error as { response?: { status: number; data?: { message?: string; jwtExpired?: boolean; error?: { name?: string } } } });
    }
  },

  list: async ({ entity, options = {} }: ListParams) => {
    try {
      includeToken();
      let query: string = '?';
      for (var key in options) {
        query += key + '=' + options[key] + '&';
      }
      query = query.slice(0, -1);

      const response = await axios.get(entity + '/list' + query);

      successHandler(response, {
        notifyOnSuccess: false,
        notifyOnFailed: false,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error as { response?: { status: number; data?: { message?: string; jwtExpired?: boolean; error?: { name?: string } } } });
    }
  },
  listAll: async ({ entity, options = {} }: ListParams) => {
    try {
      includeToken();
      let query: string = '?';
      for (var key in options) {
        query += key + '=' + options[key] + '&';
      }
      query = query.slice(0, -1);

      const response = await axios.get(entity + '/listAll' + query);

      successHandler(response, {
        notifyOnSuccess: false,
        notifyOnFailed: false,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error as { response?: { status: number; data?: { message?: string; jwtExpired?: boolean; error?: { name?: string } } } });
    }
  },

  post: async ({ entity, jsonData }: PostParams) => {
    try {
      includeToken();
      const response = await axios.post(entity, jsonData);

      return response.data;
    } catch (error) {
      return errorHandler(error as { response?: { status: number; data?: { message?: string; jwtExpired?: boolean; error?: { name?: string } } } });
    }
  },
  get: async ({ entity }: GetParams) => {
    try {
      includeToken();
      const response = await axios.get(entity);
      return response.data;
    } catch (error) {
      return errorHandler(error as { response?: { status: number; data?: { message?: string; jwtExpired?: boolean; error?: { name?: string } } } });
    }
  },
  patch: async ({ entity, jsonData }: PatchParams) => {
    try {
      includeToken();
      const response = await axios.patch(entity, jsonData);
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error as { response?: { status: number; data?: { message?: string; jwtExpired?: boolean; error?: { name?: string } } } });
    }
  },

  upload: async ({ entity, id, jsonData }: UploadParams) => {
    try {
      includeToken();
      const response = await axios.patch(entity + '/upload/' + id, jsonData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error as { response?: { status: number; data?: { message?: string; jwtExpired?: boolean; error?: { name?: string } } } });
    }
  },

  source: (): CancelTokenSource => {
    const CancelToken = axios.CancelToken;
    const source: CancelTokenSource = CancelToken.source();
    return source;
  },

  summary: async ({ entity, options = {} }: SummaryParams) => {
    try {
      includeToken();
      let query: string = '?';
      for (var key in options) {
        query += key + '=' + options[key] + '&';
      }
      query = query.slice(0, -1);
      const response = await axios.get(entity + '/summary' + query);

      successHandler(response, {
        notifyOnSuccess: false,
        notifyOnFailed: false,
      });

      return response.data;
    } catch (error) {
      return errorHandler(error as { response?: { status: number; data?: { message?: string; jwtExpired?: boolean; error?: { name?: string } } } });
    }
  },

  mail: async ({ entity, jsonData }: MailParams) => {
    try {
      includeToken();
      const response = await axios.post(entity + '/mail/', jsonData);
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error as { response?: { status: number; data?: { message?: string; jwtExpired?: boolean; error?: { name?: string } } } });
    }
  },

  convert: async ({ entity, id }: ConvertParams) => {
    try {
      includeToken();
      const response = await axios.get(`${entity}/convert/${id}`);
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error as { response?: { status: number; data?: { message?: string; jwtExpired?: boolean; error?: { name?: string } } } });
    }
  },
};
export default request;
