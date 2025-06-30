
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

export interface FailureMechanismSimple {
  id: string;
  name: string;
}

export interface FailureCauseSimple {
  id: string;
  name: string;
}

// Risk Matrix values for dropdowns
export const RISK_MATRIX_VALUES = [
  'A1', 'A2', 'A3', 'A4', 'A5',
  'B1', 'B2', 'B3', 'B4', 'B5',
  'C1', 'C2', 'C3', 'C4', 'C5',
  'D1', 'D2', 'D3', 'D4', 'D5',
  'E1', 'E2', 'E3', 'E4', 'E5'
];

export const PROBABILITY_VALUES = [
  'Possible(P)',
  'Unlikely(U)', 
  'Likely(L)',
  'Certain(C)'
];

export const TASK_TYPES = [
  'PM',
  'PPM',
  'CM',
  'Other'
];
