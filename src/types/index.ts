export type UserRole = 'super_admin' | 'admin_masjid' | 'panitia' | 'shohibul' | 'jagal';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  tenantId?: string;
}

export interface Tenant {
  id: string;
  name: string;
  location: string;
  logo: string;
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'pending';
  healthScore: number;
  joinedDate: string;
}

export interface GlobalStats {
  totalTenants: number;
  totalShohibul: number;
  totalAnimals: number;
  totalSuppliers: number;
  totalRevenue: string;
  mrr: string;
  arr: string;
  churnRate: string;
}

export interface MasjidAnimal {
  id: string;
  name: string; // e.g. Sapi A, Sapi B
  type: 'sapi' | 'kambing' | 'domba';
  breed: string;
  weight: string;
  status: QurbanStatus;
  photo: string;
  shohibulIds: string[]; // Linked shohibul
  maxCapacity: number; // e.g. 7 for sapi, 1 for kambing
  dailyUpdates?: any[];
  healthCert?: string;
  source?: string;
  age?: string;
}

export type AnimalGrade = 'ekonomi' | 'standar' | 'premium';
export type AnimalStatus = 'available' | 'booked' | 'sold' | 'delivered';

export interface SupplierAnimal {
  id: string;
  type: 'sapi' | 'kambing' | 'domba';
  breed: string;
  weight: number; // in kg
  age: number; // in years
  grade: AnimalGrade;
  price: number;
  status: AnimalStatus;
  healthCertUrl?: string;
  photos: string[];
  videoUrl?: string;
  ownerId: string; // Supplier ID
}

export interface SupplierOrder {
  id: string;
  buyerName: string; // Masjid name
  animalIds: string[];
  totalPrice: number;
  paidAmount: number;
  escrowStatus: 'held' | 'released' | 'disputed';
  deliveryStatus: 'preparing' | 'shipping' | 'arrived';
  orderDate: string;
}

export type ShohibulStatus = 'terdaftar' | 'dp' | 'cicilan' | 'lunas';

export interface Shohibul {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  qurbanType: 'sapi_1_7' | 'kambing' | 'domba';
  grade: 'ekonomi' | 'standar' | 'premium';
  niat: string;
  meatPreference: {
    delivery: 'ambil_sendiri' | 'antar';
    wantsOffal: boolean;
    wantsSkin: boolean;
  };
  status: ShohibulStatus;
  totalAmount: number;
  paidAmount: number;
  animalId?: string; // Linked to Animal
  registrationDate: string;
  payments: {
    id: string;
    amount: number;
    date: string;
    method: string;
    proofUrl?: string;
  }[];
}

export type QurbanStatus = 
  | 'terdaftar' 
  | 'dp' 
  | 'lunas' 
  | 'hewan_terkonfirmasi' 
  | 'di_kandang' 
  | 'estimasi_sembelih' 
  | 'sedang_disembelih' 
  | 'proses_daging' 
  | 'dikemas' 
  | 'siap_kirim' 
  | 'selesai';

export interface QurbanTracking {
  id: string;
  shohibulId: string;
  tenantId: string;
  animalType: 'sapi' | 'kambing' | 'domba';
  animalId: string;
  status: QurbanStatus;
  lastUpdated: string;
  photos: {
    stage: QurbanStatus;
    url: string;
    timestamp: string;
    location?: string;
  }[];
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  divisionId: string;
  assignedTo: string[]; // Can be individual IDs or Division IDs
  dueDate?: string;
  createdAt: string;
  subtasks: { id: string; title: string; completed: boolean }[];
  attachments?: string[];
}

export interface KanbanColumn {
  id: TaskStatus;
  label: string;
  color: string; // e.g. '#EF4444'
  bgLight: string; // e.g. 'bg-red-50'
  textDark: string; // e.g. 'text-red-700'
}

export type Permission = 
  | 'manage_tasks' 
  | 'manage_finance' 
  | 'manage_animals' 
  | 'manage_shohibul' 
  | 'view_reports' 
  | 'broadcast_wa'
  | 'manage_organization'
  | 'manage_sop'
  | 'manage_marketplace'
  | 'view_monitoring';

export type HierarchyLevel = 0 | 1 | 2 | 3 | 4; // 0: Penasehat, 1: Ketua Umum, 2: Pengurus Inti, 3: Ketua Divisi, 4: Anggota

export interface CommitteeMember {
  id: string;
  name: string;
  phone: string;
  role: string; // Job Title (e.g. Bendahara 1)
  level: HierarchyLevel;
  divisionId?: string;
  isCoordinator: boolean;
  avatar: string;
  hasReadSop: boolean;
  permissions: Permission[];
  parentId?: string; // Who is their supervisor
}

export interface FinancialRecord {
  id: string;
  type: 'income' | 'expense';
  category: 'shohibul_payment' | 'livestock_procurement' | 'operational' | 'professional_service' | 'other';
  amount: number;
  date: string;
  status: 'pending' | 'partially_paid' | 'completed';
  description: string;
  referenceId?: string; // Link to Shohibul or Animal or Supplier
}

export interface DistributionConfig {
  bagWeight: number; // e.g., 1.0 (kg)
  shohibulPortion: {
    meat: number; // kg
    offal: number; // bags
    bone: number; // kg
  };
}

export interface AnimalYield {
  animalId: string;
  meatWeight: number;
  offalWeight: number;
  boneWeight: number;
  totalBags: number;
  shohibulBags: number;
  mustahikBags: number;
  distributedBags: number;
  status: 'pending' | 'packed' | 'distributed';
  lastUpdatedBy?: string; // Panitia ID
}

export type MustahikStatus = 'registered' | 'verified' | 'queued' | 'shipped' | 'received';

export interface Mustahik {
  id: string;
  name: string;
  phone: string;
  nik: string; // Anti-duplication key
  address: string;
  zone: string; // RT/RW/Area
  category: 'fakir' | 'miskin' | 'yatim' | 'dhuafa' | 'janda' | 'lainnya';
  familyCount: number;
  allocation: number; // Number of bags
  status: MustahikStatus;
  deliveryMethod: 'pickup' | 'delivery';
  driverName?: string;
  deliveredAt?: string;
}

export interface GratitudeMessage {
  id: string;
  from: string; // Mustahik name
  toShohibulId?: string;
  toDonaturId?: string;
  message: string;
  timestamp: string;
  location?: string;
}

export type NotificationChannel = 'whatsapp' | 'push' | 'email' | 'sms';

export interface NotificationTemplate {
  id: string;
  trigger: string;
  channels: NotificationChannel[];
  message: string;
  isActive: boolean;
  variables: string[];
}

export interface NotificationLog {
  id: string;
  recipient: string;
  channel: NotificationChannel;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  message: string;
}

export interface Division {
  id: string;
  name: string;
  coordinatorId?: string;
  parentId?: string; // For tree structure/branches
  members: CommitteeMember[];
  color: string;
  description?: string;
  tasks?: Task[];
}

export interface SOP {
  id: string;
  divisionId: string;
  title: string;
  status: 'draft' | 'published';
  lastUpdated: string;
  content: {
    purpose: string;
    personnel: string[];
    equipment: string[];
    steps: {
      title: string;
      substeps: string[];
    }[];
  };
}
