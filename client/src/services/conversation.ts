import KySingleton from "@/lib/ky";
import { HTTPError } from "ky";
import { ErrorResponse } from "@/types/apiResponse";
import { Conversation } from "@/types/conversation";

export async function getMyConversations(): Promise<
  Conversation[] | { error: string }
> {
  try {
    const api = KySingleton.getInstance();
    const response: Conversation[] = await api.get("conversations").json();
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

export async function createConversation(
  userIds: number[],
  name: string
): Promise<Conversation[] | { error: string }> {
  try {
    const api = KySingleton.getInstance();
    const response: Conversation[] = await api
      .post("conversations", {
        json: { userIds, name },
      })
      .json();
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

export async function leaveConversation(
  conversationId: number
): Promise<void | { error: string }> {
  try {
    const api = KySingleton.getInstance();
    await api.delete(`conversations/${conversationId}`);
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
