export type ProjectStatus = "active" | "paused" | "completed" | "almost-done";

export type Project = {
  id: string;
  name: string;
  client: string;
  icon: string;
  status: ProjectStatus;
  startDate: string;
  contractAmount: number;   // היקף החוזה הכולל (סכום החוזה החתום)
  revenue: number;          // הכנסות מצטברות עד היום (מ-7 חשבונות חלקיים)
  actualSpent: number;      // הוצאות בפועל
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

export type ExceptionStatus =
  | "approved"            // אושר ע"י המפקח
  | "pending_inspector"   // ממתין לאישור מפקח
  | "in_review"           // בבדיקה
  | "rejected"            // נדחה
  | "needs_documentation"; // דורש תיעוד נוסף

export type BillException = {
  id: string;
  description: string;          // "תוספת פיר עפר נוסף בקטע צפוני"
  itemCode?: string;            // קוד סעיף בכתב הכמויות (אם רלוונטי)
  amount: number;               // בש"ח
  status: ExceptionStatus;
  inspectorName?: string;
  inspectorNote?: string;
  submittedDate?: string;
  approvedDate?: string;
};

// סעיף מתוך כתב הכמויות שנכלל בחשבון חלקי
// (snapshot — הכמויות הן ה-state בעת הגשת אותו חשבון)
export type BillBoqItem = {
  itemCode: string;
  description: string;
  unit: string;
  contractQuantity: number;
  unitPrice: number;
  previousCumulativeQty: number;
  currentBillQty: number;
  cumulativeQtyAfter: number;
  currentBillAmount: number;     // נטו בחשבון זה
  cumulativeAmount: number;      // נטו מצטבר
  cumulativeGrossAmount?: number; // ברוטו מצטבר (אם > net → סעיף מוחזק)
  isHeld?: boolean;               // gross > net בצורה משמעותית (>15%)
  heldAmount?: number;            // gross - net
  wasRemoved?: boolean;           // ברוטו ירד מהחשבון הקודם
  removedAmount?: number;         // כמה ירד הברוטו השבוע
};

export type PartialBill = {
  id: string;
  projectId: string;
  billNumber: number;           // 1, 2, 3...
  periodLabel: string;          // "נובמבר 2024"
  invoiceNumber: string;        // "IV250000191" (מלא)
  invoiceDate: string;
  amountBeforeVat: number;      // סכום החשבון הזה (נטו, אחרי עיכבונות)
  vatRate: number;              // 0.18
  amountWithVat: number;
  cumulativeBeforeVat: number;  // מצטבר נטו עד החשבון הזה
  paymentDueDate: string;       // שוטף + 45
  paidDate?: string;
  status: PartialBillStatus;
  daysOverdue?: number;

  // עיכבונות (חדש - גרסת אמיתי 2253):
  grossAmountThisBill?: number;            // סכום ברוטו של החשבון לפני עיכבונות
  cumulativeGrossAmount?: number;          // מצטבר ברוטו עד החשבון הזה
  iaiCurrentRetention?: number;            // עיכבון תע"א בחשבון הזה (10%)
  iaiCumulativeRetention?: number;         // עיכבון תע"א מצטבר עד החשבון הזה
  yrnCurrentRetention?: number;            // עיכבון י.ר.ן בחשבון הזה (5%)
  yrnCumulativeRetention?: number;         // עיכבון י.ר.ן מצטבר עד החשבון הזה
  netAfterRetentions?: number;             // נטו אחרי כל העיכבונות (= cumulative paid + balance)

  documentURL?: string;         // קישור להורדה (Drive / OneDrive / Firebase Storage)
  exceptions?: BillException[]; // חריגים בחשבון זה
  exceptionsTotal?: number;     // סכום מצטבר של חריגים בחשבון (מחושב)
  boqItems?: BillBoqItem[];     // סעיפי כתב כמויות שנכללו בחשבון
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
