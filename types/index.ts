export type UserRole = "admin" | "client";
export type LoanStatus = "pending" | "approved" | "rejected" | "returned" | "overdue" | "returning";

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type SessionCookie = {
  secret: string;
  userId: string;
  role: UserRole;
  email: string;
  name: string;
};

export type Profile = {
  $id?: string;
  userId: string;
  full_name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar_url?: string;
  created_at: string;
  is_active?: boolean;
};

export type Item = {
  $id: string;
  name: string;
  description?: string;
  category: string;
  quantity_total: number;
  quantity_available: number;
  image_id?: string;
  image_url?: string;
  is_available: boolean;
  created_at: string;
};

export type Loan = {
  $id: string;
  item_id: string;
  borrower_id: string;
  quantity: number;
  purpose: string;
  borrow_date: string;
  return_date: string;
  actual_return_date?: string;
  status: LoanStatus;
  admin_id?: string;
  admin_note?: string;
  return_image_id?: string;
  return_image_url?: string;
  user_note?: string;
  created_at: string;
  item?: Item;
  borrower?: Profile;
  admin?: Profile;
};

export type DashboardStat = {
  label: string;
  value: number | string;
  helper: string;
};

export type DashboardChartPoint = {
  label: string;
  value: number;
};

export type DashboardData = {
  stats: DashboardStat[];
  monthlyLoans: DashboardChartPoint[];
  statusDistribution: DashboardChartPoint[];
  returnTrend: DashboardChartPoint[];
  recentLoans: Loan[];
  topBorrowers: DashboardChartPoint[];
  frequentLateReturns: DashboardChartPoint[];
};

export type HistoryFilters = {
  status?: LoanStatus;
  borrowerId?: string;
  itemId?: string;
  search?: string;
  from?: string;
  to?: string;
};

export type ReportRow = {
  loanId: string;
  itemName: string;
  borrowerName: string;
  status: LoanStatus;
  quantity: number;
  borrowDate: string;
  returnDate: string;
  actualReturnDate?: string;
};
