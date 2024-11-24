import KySingleton from "@/lib/ky";
import { HTTPError } from "ky";
import { ErrorResponse } from "@/types/apiResponse";
import { User } from "@/types/user";

export async function getUserById(id: number): Promise<
  User | { error: string }
> {
  try {
    const api = KySingleton.getInstance();
    const response: User = await api.get(`/users/${id}`).json();
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
