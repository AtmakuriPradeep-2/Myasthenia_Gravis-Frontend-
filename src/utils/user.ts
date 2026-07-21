import type { User } from "../types/auth";

/**
 * Formats user display name cleanly, ensuring raw account handles like "pradeep@123"
 * or email-like strings are sanitized so password-like handles are never rendered as user names.
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) return "Dr. Clinician";

  // 1. If explicit clean full_name exists (not containing raw @ handles)
  if (user.full_name && user.full_name.trim() !== "" && !user.full_name.includes("@")) {
    return user.full_name;
  }

  // 2. Derive clean display name from username or handle
  const raw = (user.username || user.full_name || "Clinician").trim();

  // Strip anything after '@' or trailing numbers/symbols
  let cleanName = raw.split("@")[0]; // "pradeep" from "pradeep@123"
  cleanName = cleanName.replace(/[^a-zA-Z\s]/g, ""); // remove numbers/special chars

  if (!cleanName) {
    cleanName = "Clinician";
  }

  // Capitalize first letter cleanly
  const formatted = cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();

  return `Dr. ${formatted}`;
}

/**
 * Returns single uppercase character for profile avatars.
 */
export function getUserInitial(user: User | null): string {
  const name = getUserDisplayName(user).replace(/^Dr\.\s*/i, "");
  return name.charAt(0).toUpperCase() || "C";
}
