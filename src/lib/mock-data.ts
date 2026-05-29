import { Client, Freelancer, Project, Invoice, Contract } from "@/types";

export const MOCK_CLIENTS: Client[] = [
  {
    id: "1",
    name: "Acme Dynamics",
    contactName: "John Doe",
    industry: "Tech Solutions",
    status: "activo",
    email: "contact@acme.com",
    phone: "+34 600 000 001",
    nif: "B84123456",
    initialPayment: 2500,
    monthlyPayment: 850,
    permanence: 12,
    onlyInitial: false,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Globex Corp",
    contactName: "Jane Smith",
    industry: "E-commerce",
    status: "activo",
    email: "info@globex.com",
    phone: "+34 600 000 002",
    nif: "A84654321",
    initialPayment: 5000,
    monthlyPayment: 1200,
    permanence: 24,
    onlyInitial: false,
    createdAt: "2024-02-10",
  },
  {
    id: "3",
    name: "Cyberdyne Systems",
    contactName: "Sarah Connor",
    industry: "AI & Robotics",
    status: "pendiente",
    email: "sarah@cyberdyne.io",
    phone: "+34 600 000 003",
    nif: "B99888777",
    initialPayment: 1500,
    monthlyPayment: 0,
    permanence: 0,
    onlyInitial: true,
    createdAt: "2024-03-05",
  }
];

export const MOCK_FREELANCERS: Freelancer[] = [
  {
    id: "f1",
    name: "Alex Rivera",
    role: "Fullstack Developer",
    email: "alex@rivera.dev",
    phone: "+34 655 111 222",
    skills: ["React", "Node.js", "TypeScript"],
    status: "activo",
    hourlyRate: 45,
    rating: 4.9,
    projectHistory: [
      { projectId: "old-1", projectName: "Portal E-commerce", payment: 2500, status: "completado", date: "2023-12-10", invoiceUrl: "/docs/inv-f1-1.pdf" },
      { projectId: "old-2", projectName: "SaaS Dashboard", payment: 1800, status: "completado", date: "2023-11-05", invoiceUrl: "/docs/inv-f1-2.pdf" }
    ]
  },
  {
    id: "f2",
    name: "Elena Gómez",
    role: "UI/UX Designer",
    email: "elena@design.es",
    phone: "+34 655 333 444",
    skills: ["Figma", "Branding", "Web Design"],
    status: "activo",
    hourlyRate: 40,
    rating: 4.8,
    projectHistory: [
      { projectId: "old-3", projectName: "Branding Agency", payment: 1200, status: "completado", date: "2023-10-15", invoiceUrl: "/docs/inv-f2-1.pdf" }
    ]
  },
  {
    id: "f3",
    name: "Marco Rossi",
    role: "DevOps Engineer",
    email: "marco@cloud.it",
    phone: "+34 655 555 666",
    skills: ["AWS", "Docker", "Kubernetes"],
    status: "pausado",
    hourlyRate: 55,
    rating: 5.0,
    projectHistory: [
      { projectId: "old-4", projectName: "Infra Migration", payment: 4500, status: "completado", date: "2023-09-20", invoiceUrl: "/docs/inv-f3-1.pdf" }
    ]
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Rediseño Web Acme",
    clientId: "1",
    freelancerIds: ["f1", "f2"],
    status: "en_proceso",
    deadline: "2024-05-20",
    budget: 3500,
    description: "Modernización integral del portal corporativo con enfoque en conversión y SEO.",
    progress: 40,
    phases: [
      { id: "ph1", name: "Briefing Inicial", completed: true },
      { id: "ph2", name: "Arquitectura de Información", completed: true },
      { id: "ph3", name: "Diseño UI/UX", completed: false },
      { id: "ph4", name: "Maquetación Frontend", completed: false },
      { id: "ph5", name: "Lanzamiento y QA", completed: false }
    ],
    freelancerData: {
      f1: { role: "Frontend Dev", payment: 1200, invoiceUrl: "/docs/f1-p1.pdf" },
      f2: { role: "UI Designer", payment: 800, invoiceUrl: "/docs/f2-p1.pdf" }
    }
  },
  {
    id: "p2",
    name: "Campaña Growth Globex",
    clientId: "2",
    freelancerIds: ["f1"],
    status: "pendiente",
    deadline: "2024-06-15",
    budget: 1200,
    description: "Estrategia de adquisición de usuarios mediante Paid Media y Contenido.",
    progress: 25,
    phases: [
      { id: "ph6", name: "Estudio de Mercado", completed: true },
      { id: "ph7", name: "Configuración de Ads", completed: false },
      { id: "ph8", name: "Copywriting", completed: false },
      { id: "ph9", name: "Reporting inicial", completed: false }
    ],
    freelancerData: {
      f1: { role: "Mobile Lead", payment: 4500, invoiceUrl: "/docs/f1-p2.pdf" }
    }
  },
  {
    id: "p3",
    name: "Infraestructura AI Cyber",
    clientId: "3",
    freelancerIds: ["f3"],
    status: "completado",
    deadline: "2024-04-01",
    budget: 1500,
    description: "Auditoría de sistemas y propuesta de implementación de LLMs.",
    progress: 100,
    freelancerData: {
      f3: { role: "AI Strategist", payment: 1500, invoiceUrl: "/docs/f3-p3.pdf" }
    }
  }
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: "INV-001",
    clientId: "1",
    amount: 2500,
    date: "2024-01-16",
    dueDate: "2024-01-30",
    status: "paid",
    items: [{ description: "Setup inicial y consultora", amount: 2500 }],
  },
  {
    id: "INV-002",
    clientId: "1",
    amount: 850,
    date: "2024-02-01",
    dueDate: "2024-02-15",
    status: "paid",
    items: [{ description: "Mantenimiento mensual Feb", amount: 850 }],
  }
];

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: "CTR-001",
    clientId: "1",
    title: "Contrato de Servicios IT - Acme",
    signedDate: "2024-01-15",
    fileUrl: "#",
    status: "active",
  }
];
