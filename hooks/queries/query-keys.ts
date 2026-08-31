export const queryKeys = {
  catalog: ["catalog"] as const,
  itemDetail: (itemId: string) => ["catalog", itemId] as const,
  myLoans: (userId: string) => ["loans", "me", userId] as const,
  activeLoans: ["loans", "active"] as const,
  adminDashboard: ["admin", "dashboard"] as const,
  adminItems: ["admin", "items"] as const,
  adminLoans: ["admin", "loans"] as const,
  adminUsers: ["admin", "users"] as const,
  history: ["admin", "history"] as const,
  reports: ["admin", "reports"] as const
};
