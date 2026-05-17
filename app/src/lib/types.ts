export type ProjectStatus = "active" | "paused" | "completed" | "almost-done";

export type Project = {
  id: string;
  name: string;
  client: string;
  icon: string;
  status: ProjectStatus;
  startDate: string;
  revenue: number;       // הכנסות מהחוזה (מצטבר עד היום)
  actualSpent: number;   // הוצאות בפועל
  progressPercent: number;
  urgentCount: number;
  tasksCount: number;
  accentColor: "blue" | "purple" | "emerald";
};

export type Contractor = {
  id: string;
  projectId: string;
  name: string;
  specialty: string;
  contractTotal: number;
  balance: number;
  urgency: "overdue" | "this-week" | "this-month";
};

export type Task = {
  id: string;
  projectId: string;
  title: string;
  dueDate: string;
  urgency: "today" | "tomorrow" | "this-week" | "later";
  done: boolean;
  note?: string;
};

export type Transaction = {
  id: string;
  projectId: string;
  date: string;
  description: string;
  source: string;
  amount: number;
};

export type InventoryItem = {
  id: string;
  projectId: string;
  name: string;
  current: number;
  required: number;
  unit: string;
};

export type Alert = {
  id: string;
  projectId?: string;
  type: "critical" | "warning" | "info" | "success";
  icon: string;
  title: string;
  detail: string;
};

export type ExpenseCategory = {
  label: string;
  amount: number;
};

export type ExpenseSubItem = {
  label: string;
  amount: number;
  rowCount?: number;     // כמה תנועות תרמו לסכום (אם זמין)
  note?: string;
};

export type ExpenseCategoryNode = {
  id: string;
  label: string;
  icon: string;
  color: string;        // לסטיילינג
  amount: number;
  children?: ExpenseSubItem[];
};

export type TopSupplier = {
  name: string;
  totalAmount: number;
  txCount: number;
  category: string;     // "חומרים" / "קבלני משנה" / וכו'
};

export type PoRamdorStatus =
  | "closed"
  | "partial"
  | "shipped"
  | "approved"
  | "draft"
  | "cancelled";

export type PoUserStatus =
  | "pending"
  | "verified_closed"
  | "awaiting_invoice"
  | "cancelled_unused"
  | "partial_complete"
  | "invoice_pending_approval"
  | "invoice_rejected"
  | "needs_review";

export type PartialBillStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "paid"
  | "rejected"
  | "overdue";

export type PartialBill = {
  id: string;
  projectId: string;
  billNumber: number;           // 1, 2, 3...
  periodLabel: string;          // "נובמבר 2024"
  invoiceNumber: string;        // "IV-191"
  invoiceDate: string;
  amountBeforeVat: number;
  vatRate: number;              // 0.18
  amountWithVat: number;
  cumulativeBeforeVat: number;
  paymentDueDate: string;       // שוטף + 45
  paidDate?: string;
  status: PartialBillStatus;
  daysOverdue?: number;
  notes?: string;
};

export type PurchaseOrder = {
  id: string;
  projectId: string;
  poNumber: string;
  supplierName: string;
  itemSummary: string;
  totalAmount: number;
  currency: "ILS" | "USD" | "EUR";
  outstandingValue: number;
  orderDate: string;
  expectedDeliveryDate: string;
  ramdorStatus: PoRamdorStatus;
  userStatus: PoUserStatus;
  userStatusReason?: string;
  isLongLeadItem?: boolean;
  daysOpen: number;
};
