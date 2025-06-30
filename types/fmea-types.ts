// FMEA data type definitions

// Risk levels
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

// Equipment Type
export interface EquipmentType {
  id: string;
  name: string;
  function: string;
  criticality: 'low' | 'medium' | 'high';
}

// Component
export interface Component {
  id: string;
  name: string;
  category: string;
  functions: string[];
  equipmentTypeId: string;
  riskRating?: RiskLevel;
}

// Failure Mechanism
export type MechanismCategory = 
  | 'Mechanical' 
  | 'Electrical' 
  | 'Safety & Control' 
  | 'Rotating' 
  | 'General';

export interface FailureMechanism {
  id: string;
  category: MechanismCategory;
  description: string;
}

// Failure Cause
export interface FailureCause {
  id: string;
  category: string;
  description: string;
  mechanismIds: string[];
}

// Failure Mode
export interface FailureMode {
  id: string;
  category: string;
  description: string;
  additionalDescription?: string;
  riskRating: RiskLevel;
  rpn: number; // Risk Priority Number
  severity: number; // 1-10
  probability: number; // 1-10
  detectability: number; // 1-10
  componentIds: string[];
  causeIds: string[];
  mechanismIds: string[];
}

// Spare Part
export interface SparePart {
  id: string;
  materialNo: string;
  description: string;
  proposedStock: number;
  currentStock: number;
  price: number;
  minStock: number;
  maxStock: number;
  status: 'approved' | 'rejected' | 'pending';
  equipmentTypeIds: string[];
}

// Task
export interface Task {
  id: string;
  taskType: string;
  frequency: string;
  workCenter: string;
  mitigationAction: string;
  shutdownRequired: boolean;
  failureModeId: string;
}

// Main Product
export interface MainProduct {
  id: string;
  name: string;
  equipmentTypeId: string;
  componentIds: string[];
  failureModeIds: string[];
  probability: number;
  riskRating: RiskLevel;
}

// Risk Matrix Cell for visualization
export interface RiskMatrixCell {
  severity: number;
  probability: number;
  level: RiskLevel;
  count: number;
}
