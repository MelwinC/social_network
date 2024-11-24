import KySingleton from "@/lib/ky";
import { ErrorResponse, AuthSuccessResponse } from "@/types/apiResponse";

import { HTTPError } from "ky";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "auth_jwt_covoit";

interface DecodedToken {
  id: number;
  exp: number;
}

const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getUserIdFromToken = (): number | null => {
  const token = getToken();
  if (!token) {
    return null;
  }

  const decodedToken = jwtDecode<DecodedToken>(token);
  return decodedToken.id;
};

export const isLoggedIn = (): boolean => {
  const token = getToken();
  if (!token) {
    return false;
  }

  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ message: string; token: string } | { error: string }> {
  try {
    const api = KySingleton.getInstance();
    const response: AuthSuccessResponse = await api
      .post("login", {
        json: { mail: email, password },
      })
      .json();

    if ("token" in response) {
      setToken(response.token);
    }

    return response;
  } catch (error) {
    if (error instanceof HTTPError && error.response) {
      const errorResponse: ErrorResponse = await error.response.json();
      return { error: errorResponse.error };
    }
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred.",
    };
  }
}

export async function signUp({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ message: string; token: string } | { error: string }> {
  try {
    const api = KySingleton.getInstance();
    const response: AuthSuccessResponse = await api
      .post("register", {
        json: { mail: email, password },
      })
      .json();

    if ("token" in response) {
      setToken(response.token);
    }

    return response;
  } catch (error) {
    if (error instanceof HTTPError && error.response) {
      const errorResponse: ErrorResponse = await error.response.json();
      return { error: errorResponse.error };
    }
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred.",
    };
  }
}

export function signOut() {
  removeToken();
}
