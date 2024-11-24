import ky from 'ky';
import { getToken } from '../services/auth';

const API_URL = import.meta.env.VITE_API_URL;

class KySingleton {
  private static instance: typeof ky;

  private constructor() {}

  public static getInstance(): typeof ky {
    if (!KySingleton.instance) {
      KySingleton.instance = ky.create({
        prefixUrl: API_URL + '/api/',
        headers: {
          'Content-Type': 'application/json',
        },
        hooks: {
          beforeRequest: [
            (request) => {
              const token = getToken();
              if (token) {
                request.headers.set('Authorization', `${token}`);
              }
            },
          ],
        },
      });
    }
    return KySingleton.instance;
  }
}

export default KySingleton;