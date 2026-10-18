export const ROLE_HOME: Record<string, string> = {
  USER: "/",
  ORGANIZER: "/dashboard/organizer",
  ADMIN: "/dashboard/admin",
  SUPER_ADMIN: "/dashboard/super-admin",
};

export function roleHome(role?: string | null) {
  return ROLE_HOME[role ?? "USER"] ?? "/";
}
