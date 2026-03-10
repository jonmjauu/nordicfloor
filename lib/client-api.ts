export async function readApiError(response: Response, fallback: string) {
  try {
    const json = await response.json();
    if (typeof json?.error === "string") {
      return json.error;
    }
    if (typeof json?.message === "string") {
      return json.message;
    }
    return fallback;
  } catch {
    return fallback;
  }
}
