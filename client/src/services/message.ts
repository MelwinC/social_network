import KySingleton from "@/lib/ky";
import { HTTPError } from "ky";
import { ErrorResponse } from "@/types/apiResponse";
import { Message } from "@/types/message";

export async function createMessage(content: string, conversationId: number): Promise<Message | { error: string }> {
  try {
    const api = KySingleton.getInstance();
    const response: Message = await api.post("messages", {
      json: { content, conversationId },
    }).json();
    return response;
  } catch (error) {
    if (error instanceof HTTPError && error.response) {
      const errorResponse: ErrorResponse = await error.response.json();
      return { error: errorResponse.error };
    }
    return {
      error: error instanceof Error ? error.message : "An unknown error occurred.",
    };
  }
}