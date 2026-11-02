import type { FullProfile, Profile, Project } from "@/types/curriculum";

export const API_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? "https://curriculo-back.vercel.app"
).replace(/\/$/, "");

const TIMEOUT_MS = 15000;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      throw new ApiError(
        body?.error ?? "Erro ao comunicar com o servidor.",
        response.status,
      );
    }

    return body as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError(
        "O servidor demorou para responder. Tente novamente.",
        408,
      );
    }

    throw new ApiError(
      "Sem conexão com o servidor. Verifique sua internet.",
      0,
    );
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  getProfiles: () => request<Profile[]>("/profiles"),
  getFullProfile: (profileId: string) =>
    request<FullProfile>(`/profiles/${profileId}/full`),
  getProject: (projectId: string) => request<Project>(`/projects/${projectId}`),
};
