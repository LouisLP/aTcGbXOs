import { ApiComment } from "../../server/types";

const API_BASE_URL = "http://localhost:3001/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(`API Error: ${response.statusText}`, response.status);
  }

  return response;
}

export const commentsApi = {
  async getAll(): Promise<ApiComment[]> {
    const response = await fetchApi("/comments");
    return response.json();
  },

  async add(text: string, parentId?: string): Promise<ApiComment> {
    const response = await fetchApi("/comments", {
      method: "POST",
      body: JSON.stringify({ text, parentId }),
    });
    return response.json();
  },

  async delete(id: string): Promise<void> {
    await fetchApi(`/comments/${id}`, {
      method: "DELETE",
    });
  },
};
