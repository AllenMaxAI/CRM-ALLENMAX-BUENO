export type UserRole = "admin" | "manager" | "assistant";

export type Status = "activo" | "pendiente" | "cancelado" | "completado" | "en_proceso" | "pausado";

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string | number;
}

export interface Client {
  id: string;
  name: string; // Empresa
  contactName: string; // Nombre del cliente
  industry: string;
  status: Status;
  email: string;
  phone: string;
  nif: string;
  website?: string;
  initialPayment: number;
  monthlyPayment: number;
  permanence: number;
  onlyInitial: boolean;
  avatar?: string;
  createdAt: string;
  invoice?: string;
  budget?: string;
  contract?: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  freelancerIds: string[];
  status: Status;
  deadline: string;
  budget: number;
  description: string;
  progress: number;
  phases?: {
    id: string;
    name: string;
    completed: boolean;
  }[];
  freelancerData?: {
    [freelancerId: string]: {
      role: string;
      payment: number;
      invoiceUrl?: string;
    };
  };
  imageUrl?: string;
}

export interface FreelancerProject {
  projectId: string;
  projectName: string;
  payment: number;
  status: Status;
  invoiceUrl?: string;
  date: string;
}

export interface Freelancer {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  skills: string[];
  status: Status;
  hourlyRate: number;
  rating: number;
  avatar?: string;
  projectHistory?: FreelancerProject[];
  invoice?: string;
  budget?: string;
  contract?: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  amount: number;
  date: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  items: { description: string; amount: number }[];
}

export interface Contract {
  id: string;
  clientId: string;
  title: string;
  signedDate: string;
  fileUrl: string;
  status: "active" | "expired" | "pending";
}

export interface FinanceRecord {
  id: string;
  date: string;
  amount: number;
  type: "ingreso" | "gasto";
  category: string;
  description: string;
  method: string;
  relatedId?: string;
  clientId?: string;
}
