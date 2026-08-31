import type {
  DashboardData,
  Item,
  Loan,
  LoanStatus,
  Profile,
  ReportRow
} from "@/types";

const now = new Date().toISOString();

export const mockProfiles: Profile[] = [
  {
    userId: "user-admin",
    full_name: "Alya Admin",
    email: "alya@sims.internal",
    role: "admin",
    department: "General Affairs",
    created_at: now,
    is_active: true
  },
  {
    userId: "user-client",
    full_name: "Bima Client",
    email: "bima@sims.internal",
    role: "client",
    department: "Design",
    created_at: now,
    is_active: true
  }
];

export const mockItems: Item[] = [
  {
    $id: "item-1",
    name: "Projector Epson EB-X06",
    description: "Projector meeting room untuk presentasi internal.",
    category: "Elektronik",
    quantity_total: 8,
    quantity_available: 5,
    image_url: "",
    is_available: true,
    created_at: now
  },
  {
    $id: "item-2",
    name: "Kamera Sony ZV-E10",
    description: "Kamera konten untuk dokumentasi acara.",
    category: "Multimedia",
    quantity_total: 4,
    quantity_available: 2,
    image_url: "",
    is_available: true,
    created_at: now
  },
  {
    $id: "item-3",
    name: "Laptop Cadangan Dell Latitude",
    description: "Laptop pinjaman untuk kebutuhan operasional sementara.",
    category: "Komputasi",
    quantity_total: 6,
    quantity_available: 0,
    image_url: "",
    is_available: false,
    created_at: now
  }
];

export const mockLoans: Loan[] = [
  {
    $id: "loan-1",
    item_id: "item-1",
    borrower_id: "user-client",
    quantity: 1,
    purpose: "Presentasi Q2",
    borrow_date: now,
    return_date: new Date(Date.now() + 2 * 86400000).toISOString(),
    status: "pending",
    created_at: now,
    item: mockItems[0],
    borrower: mockProfiles[1]
  },
  {
    $id: "loan-2",
    item_id: "item-2",
    borrower_id: "user-client",
    quantity: 1,
    purpose: "Dokumentasi town hall",
    borrow_date: new Date(Date.now() - 7 * 86400000).toISOString(),
    return_date: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: "overdue",
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    item: mockItems[1],
    borrower: mockProfiles[1],
    admin_note: "Mohon dikembalikan ke GA."
  },
  {
    $id: "loan-3",
    item_id: "item-1",
    borrower_id: "user-client",
    quantity: 1,
    purpose: "Testing pengembalian foto",
    borrow_date: now,
    return_date: now,
    status: "returning",
    created_at: now,
    item: mockItems[0],
    borrower: mockProfiles[1],
    user_note: "Barang sudah diletakkan di meja GA.",
    return_image_id: "mock-id"
  }
];

export function buildDashboardData(): DashboardData {
  const countByStatus = (status: LoanStatus) => mockLoans.filter((loan) => loan.status === status).length;

  return {
    stats: [
      { label: "Total Barang", value: mockItems.length, helper: "Item aktif dalam inventaris" },
      { label: "Pinjaman Aktif", value: countByStatus("approved") + countByStatus("overdue"), helper: "Sedang berjalan" },
      { label: "Pengajuan Pending", value: countByStatus("pending"), helper: "Menunggu keputusan" },
      { label: "Pengguna", value: mockProfiles.length, helper: "Akun internal terdaftar" }
    ],
    monthlyLoans: [
      { label: "Jan", value: 5 },
      { label: "Feb", value: 7 },
      { label: "Mar", value: 4 },
      { label: "Apr", value: 9 }
    ],
    statusDistribution: [
      { label: "Pending", value: countByStatus("pending") },
      { label: "Approved", value: countByStatus("approved") },
      { label: "Rejected", value: countByStatus("rejected") },
      { label: "Returned", value: countByStatus("returned") },
      { label: "Overdue", value: countByStatus("overdue") }
    ],
    returnTrend: [
      { label: "Week 1", value: 2 },
      { label: "Week 2", value: 5 },
      { label: "Week 3", value: 4 },
      { label: "Week 4", value: 6 }
    ],
    recentLoans: mockLoans,
    topBorrowers: [
      { label: "Bima Client", value: 12 },
      { label: "Alya Admin", value: 8 },
      { label: "Deni User", value: 5 }
    ],
    frequentLateReturns: [
      { label: "Bima Client", value: 4 },
      { label: "Deni User", value: 2 }
    ]
  };
}

export function buildReportRows(): ReportRow[] {
  return mockLoans.map((loan) => ({
    loanId: loan.$id,
    itemName: loan.item?.name ?? "Unknown Item",
    borrowerName: loan.borrower?.full_name ?? "Unknown Borrower",
    status: loan.status,
    quantity: loan.quantity,
    borrowDate: loan.borrow_date,
    returnDate: loan.return_date,
    actualReturnDate: loan.actual_return_date
  }));
}
