import type { ZodError } from "zod";

export function formatZodError(error: ZodError) {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const key = issue.path.join(".") || "root";
    if (!fieldErrors[key]) {
      fieldErrors[key] = [];
    }
    fieldErrors[key].push(issue.message);
  }

  const firstIssue = error.issues[0]?.message ?? "Valideringsfeil";

  return {
    message: firstIssue,
    fieldErrors
  };
}
