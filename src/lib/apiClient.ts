function hasBody(method?: string): boolean {
  if (!method) {
    return false;
  }
  return !["GET", "HEAD"].includes(method.toUpperCase());
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const method = init?.method || "GET";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  let response: Response;
  try {
    response = await fetch(url, {
      credentials: "include",
      cache: "no-store",
      ...init,
      signal: controller.signal,
      headers: {
        ...(hasBody(method) ? { "Content-Type": "application/json" } : {}),
        ...(init?.headers || {}),
      },
    });
  } catch (error) {
    clearTimeout(timeout);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw error;
  }

  clearTimeout(timeout);

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json().catch(() => ({}))
      : {};
    const errorCode = typeof data.code === "string" ? data.code : "UNKNOWN";
    const message = typeof data.error === "string" ? data.error : `Request failed: ${response.status} (${errorCode})`;
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
