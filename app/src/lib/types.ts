export type ProjectStatus = "active" | "paused" | "completed" | "almost-done";

export type Project = {
  id: string;
  name: string;
  client: string;
  icon: string;
  status: ProjectStatus;
  startDate: string;
  budget: number;
  actualSpent: number;
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
