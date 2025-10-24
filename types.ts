export interface Item {
  id: string;
  name: string;
  odooRef: string;
  quantity: number;
  category: string;
  unitCost: number;
}

export type MovementType = 'entry' | 'exit';

export interface StockMovement {
  id: string;
  itemId: string;
  type: MovementType;
  quantity: number;
  operator: string;
  destinationOrSource: string; // e.g., 'Chantier A' or 'Fournisseur X'
  timestamp: number;
  status: 'pending' | 'synced';
}

export type RequisitionStatus = 'pending' | 'synced-waiting' | 'approved' | 'rejected';

export interface RequisitionItem {
  itemId: string;
  quantity: number;
}

export interface PurchaseRequisition {
  id: string;
  siteManager: string;
  items: RequisitionItem[];
  timestamp: number;
  status: RequisitionStatus;
  odooStatus?: 'En attente' | 'Approuvée' | 'Rejetée';
}

export interface Employee {
  id: string;
  name: string;
  odooRef: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  checkIn: number;
  checkOut: number;
  workedHours: number;
  status: 'pending' | 'validated' | 'synced';
  siteId: string;
  biometricDeviceId: string;
}

export type ToolStatus = 'available' | 'in_use' | 'in_maintenance' | 'lost';
export type ToolCondition = 'new' | 'good' | 'fair' | 'poor';

export interface Tool {
  id: string;
  name: string;
  assetTag: string; // Serial number or internal tag
  category: string;
  status: ToolStatus;
  assignedTo?: string; // Employee ID
  purchaseDate: number; // timestamp
  condition: ToolCondition;
  lastMaintenanceDate?: number; // timestamp
  syncStatus: 'synced' | 'pending_add' | 'pending_update';
}

export type ProjectStatus = 'draft' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';

export interface Project {
  id: string;
  name: string;
  reference: string;
  clientName: string;
  address: string;
  startDate: number; // timestamp
  endDate?: number; // timestamp
  status: ProjectStatus;
  budget?: number;
}