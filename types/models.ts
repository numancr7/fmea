// Risk levels
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

// Equipment Criticality and SCE
export type EquipmentCriticality = 'low' | 'medium' | 'high';
export type EquipmentSCE = 'Yes' | 'No';

// Equipment Class
export interface EquipmentClass {
  id: string;
  name: string;
  description?: string;
  lastReviewed?: string;
  reviewerList?: string;
  classEngineeringDiscipline?: string;
}

// Equipment Function
export interface EquipmentFunction {
  id: string;
  description: string;
}

// Subcomponent
export interface Subcomponent {
  id: string;
  name: string;
  remarks?: string;
}

// Component (for EquipmentType)
export interface Component {
  id: string;
  name: string;
  subcomponents?: Subcomponent[];
  remarks?: string;
  category?: string;
  functions?: string[];
  equipmentTypeId?: string;
  riskRating?: RiskLevel;
}

// System (for EquipmentType)
export interface System {
  id: string;
  name: string;
  components: Component[];
}

// EquipmentType
export interface EquipmentType {
  id: string;
  name: string;
  description?: string;
  equipmentClassId?: string;
  systems?: System[];
  function?: string;
  criticality?: EquipmentCriticality;
}

// Manufacturer
export interface Manufacturer {
  id: string;
  name: string;
  contactInfo?: string;
  website?: string;
}

// Equipment
export interface Equipment {
  id: string;
  area?: string;
  unit?: string;
  functionalLocation?: string;
  functionalLocationFromSAP?: string;
  functionalLocationDescriptionFromSAP?: string;
  techIdentNoFromSAP?: string;
  equipmentNoFromSAP?: string;
  equipmentDescriptionFromSAP?: string;
  sce?: EquipmentSCE;
  equipmentDescription?: string;
  equipmentType?: string;
  manufacturer?: string;
  model?: string;
  criticality?: EquipmentCriticality;
  equipmentClass?: string;
  equipmentFunctions?: EquipmentFunction[];
  numberOfUnits?: number;
  taskListMapping?: TaskMapping[];
}

// Task
export interface Task {
  id: string;
  taskList?: string;
  sapGTL?: string;
  mainWorkCenter?: string;
  interval?: string;
  taskType: string; // 'PM' | 'PPM' | 'CM' | 'Other'
  taskDescription?: string;
  numberOfPerson?: number;
  manHour?: number;
  equipmentClassId?: string;
  frequency?: string;
  workCenter?: string;
  mitigationAction?: string;
  shutdownRequired?: boolean;
  failureModeId?: string;
}

export interface TaskMapping {
  taskId: string;
  isSelected: boolean;
}

// Failure Mechanism
export interface FailureMechanism {
  id: string;
  category?: string;
  description?: string;
  name?: string;
}

// Failure Cause
export interface FailureCause {
  id: string;
  category?: string;
  description?: string;
  mechanismIds?: string[];
  name?: string;
  causeName?: string;
  causeCode?: string;
  causeDescription?: string;
}

// Failure Mode
export interface FailureMode {
  id: string;
  category: string;
  subCategory?: string;
  description: string;
  additionalDescription?: string;
  riskRating?: RiskLevel;
  rpn?: number;
  severity?: number;
  probability?: number;
  detectability?: number;
  componentIds?: string[];
  causeIds?: string[];
  mechanismIds?: string[];
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

// Risk Matrix Cell
export interface RiskMatrixCell {
  severity: number;
  probability: number;
  level: RiskLevel;
  count: number;
}

// FMEA (detailed)
export interface FMEA {
  id: string;
  components: string[];
  mainEquipment: string;
  operatingCondition: string;
  availabilityTarget: number;
  redundancy: string;
  fmeaNumber: string;
  preparedBy: string;
  lastUpdatedBy: string;
  fmeaDate: string;
  revision: string;
  failureModeCategory: string;
  additionalDescription?: string;
  failureMechanism: string;
  failureCause: string;
  failureCauseDescription: string;
  failureEffect: string;
  failureConsequences: string[];
  consequencePeople: string;
  consequenceEnvironment: string;
  consequenceAsset: string;
  consequenceReputation: string;
  probability: string;
  mitigatedRisk: string;
  mitigationActions: string[];
  spareParts: 'Y' | 'N';
  taskType: string;
  frequency: string;
  mainWorkCenter: string;
  isShutdownRequired: boolean;
  mitigatedRiskRating: string;
  taskOriginReferences: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

// Work Center
export interface WorkCenter {
  id: string;
  name: string;
  code: string;
}

// Task Type
export interface TaskType {
  id: string;
  name: string;
  code: string;
} 