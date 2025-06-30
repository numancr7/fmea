
import { FMEA, FailureMechanismSimple, FailureCauseSimple } from '@/types/fmea-analysis-types';

// Mock Equipment Data
export const mockEquipment = [
  { id: 'eq-001', name: 'Centrifugal Pump CP-101', tag: 'CP-101' },
  { id: 'eq-002', name: 'Electric Motor EM-201', tag: 'EM-201' },
  { id: 'eq-003', name: 'Heat Exchanger HE-301', tag: 'HE-301' },
  { id: 'eq-004', name: 'Compressor C-401', tag: 'C-401' },
  { id: 'eq-005', name: 'Control Valve CV-501', tag: 'CV-501' }
];

// Mock Components Data
export const mockComponents = [
  { id: 'comp-001', name: 'Impeller', category: 'Rotating' },
  { id: 'comp-002', name: 'Bearing', category: 'Mechanical' },
  { id: 'comp-003', name: 'Seal', category: 'Sealing' },
  { id: 'comp-004', name: 'Motor Windings', category: 'Electrical' },
  { id: 'comp-005', name: 'Valve Body', category: 'Pressure Boundary' },
  { id: 'comp-006', name: 'Actuator', category: 'Control' }
];

// Mock Failure Mechanisms
export const mockFailureMechanisms: FailureMechanismSimple[] = [
  { id: 'mech-001', name: 'Wear' },
  { id: 'mech-002', name: 'Corrosion' },
  { id: 'mech-003', name: 'Fatigue' },
  { id: 'mech-004', name: 'Erosion' },
  { id: 'mech-005', name: 'Overheating' },
  { id: 'mech-006', name: 'Vibration' },
  { id: 'mech-007', name: 'Electrical Breakdown' },
  { id: 'mech-008', name: 'Fouling' }
];

// Mock Failure Causes
export const mockFailureCauses: FailureCauseSimple[] = [
  { id: 'cause-001', name: 'Poor Maintenance' },
  { id: 'cause-002', name: 'Age/End of Life' },
  { id: 'cause-003', name: 'Environmental Conditions' },
  { id: 'cause-004', name: 'Operating Beyond Design' },
  { id: 'cause-005', name: 'Material Defect' },
  { id: 'cause-006', name: 'Installation Error' },
  { id: 'cause-007', name: 'Human Error' },
  { id: 'cause-008', name: 'External Impact' }
];

// Mock Work Centers
export const mockWorkCenters = [
  { id: 'wc-001', name: 'Mechanical Workshop', code: 'MECH' },
  { id: 'wc-002', name: 'Electrical Workshop', code: 'ELEC' },
  { id: 'wc-003', name: 'Instrumentation', code: 'INST' },
  { id: 'wc-004', name: 'Process Operations', code: 'PROC' },
  { id: 'wc-005', name: 'External Contractor', code: 'EXT' }
];

// Mock Task Types
export const mockTaskTypes = [
  { id: 'tt-001', name: 'Preventive Maintenance', code: 'PM' },
  { id: 'tt-002', name: 'Predictive Maintenance', code: 'PdM' },
  { id: 'tt-003', name: 'Corrective Maintenance', code: 'CM' },
  { id: 'tt-004', name: 'Planned Preventive Maintenance', code: 'PPM' },
  { id: 'tt-005', name: 'Inspection', code: 'INS' },
  { id: 'tt-006', name: 'Testing', code: 'TEST' }
];

// Mock Failure Consequences
export const mockFailureConsequences = [
  'Production Loss',
  'Safety Risk to Personnel',
  'Environmental Impact',
  'Equipment Damage',
  'Quality Issues',
  'Reputation Damage',
  'Regulatory Non-compliance',
  'Economic Loss',
  'Schedule Delay',
  'Secondary Equipment Failure'
];

// Mock Mitigation Actions
export const mockMitigationActions = [
  'Improve maintenance schedule',
  'Install backup equipment',
  'Upgrade material specifications',
  'Enhance operator training',
  'Install condition monitoring',
  'Implement preventive inspections',
  'Improve operating procedures',
  'Install protective devices',
  'Enhance spare parts inventory',
  'Implement shutdown procedures'
];

// Mock FMEA Data
export const mockFMEAData: FMEA[] = [
  {
    id: 'fmea-001',
    components: ['Impeller', 'Bearing'],
    mainEquipment: 'CP-101',
    operatingCondition: 'Normal Operation - 24/7',
    availabilityTarget: 95.5,
    redundancy: 'None - Single Point of Failure',
    fmeaNumber: 'FMEA-2024-001',
    preparedBy: 'John Smith',
    lastUpdatedBy: 'John Smith',
    fmeaDate: '2024-01-15',
    revision: 'Rev 1.0',
    failureModeCategory: 'Mechanical Failure',
    additionalDescription: 'Primary centrifugal pump failure analysis for critical process',
    failureMechanism: 'Wear',
    failureCause: 'Poor Maintenance',
    failureCauseDescription: 'Inadequate lubrication schedule and bearing monitoring',
    failureEffect: 'Complete pump failure leading to immediate production shutdown',
    failureConsequences: ['Production Loss', 'Safety Risk to Personnel', 'Economic Loss'],
    consequencePeople: 'A2',
    consequenceEnvironment: 'B1',
    consequenceAsset: 'C3',
    consequenceReputation: 'B2',
    probability: 'Possible(P)',
    mitigatedRisk: 'B2',
    mitigationActions: ['Improve maintenance schedule', 'Install backup equipment', 'Install condition monitoring'],
    spareParts: 'Y',
    taskType: 'PM',
    frequency: 'Monthly',
    mainWorkCenter: 'MECH',
    isShutdownRequired: true,
    mitigatedRiskRating: 'B1',
    taskOriginReferences: 'Maintenance Manual Section 5.2, OEM Recommendations',
    remarks: 'Critical equipment requiring immediate attention and backup installation',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'fmea-002',
    components: ['Motor Windings'],
    mainEquipment: 'EM-201',
    operatingCondition: 'High Load Operation',
    availabilityTarget: 98.0,
    redundancy: 'Standby Motor Available',
    fmeaNumber: 'FMEA-2024-002',
    preparedBy: 'Sarah Johnson',
    lastUpdatedBy: 'Sarah Johnson',
    fmeaDate: '2024-01-20',
    revision: 'Rev 1.0',
    failureModeCategory: 'Electrical Failure',
    additionalDescription: 'Electric motor failure analysis',
    failureMechanism: 'Electrical Breakdown',
    failureCause: 'Operating Beyond Design',
    failureCauseDescription: 'Motor operating at higher loads than design specifications',
    failureEffect: 'Motor failure with automatic switchover to standby',
    failureConsequences: ['Equipment Damage', 'Schedule Delay'],
    consequencePeople: 'A1',
    consequenceEnvironment: 'A1',
    consequenceAsset: 'B3',
    consequenceReputation: 'A2',
    probability: 'Unlikely(U)',
    mitigatedRisk: 'A2',
    mitigationActions: ['Enhance operator training', 'Install protective devices'],
    spareParts: 'Y',
    taskType: 'PdM',
    frequency: 'Quarterly',
    mainWorkCenter: 'ELEC',
    isShutdownRequired: false,
    mitigatedRiskRating: 'A1',
    taskOriginReferences: 'IEEE Standards, Manufacturer Guidelines',
    remarks: 'Monitor load conditions continuously',
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  }
];

// Service functions for CRUD operations
export const getEquipmentList = () => mockEquipment;
export const getComponentsList = () => mockComponents;
export const getFailureMechanisms = () => mockFailureMechanisms;
export const getFailureCauses = () => mockFailureCauses;
export const getWorkCenters = () => mockWorkCenters;
export const getTaskTypes = () => mockTaskTypes;
export const getFailureConsequences = () => mockFailureConsequences;
export const getMitigationActions = () => mockMitigationActions;
export const getFMEAList = () => mockFMEAData;

// Get single items by ID
export const getFMEAById = (id: string) => mockFMEAData.find(fmea => fmea.id === id);
export const getFailureMechanismById = (id: string) => mockFailureMechanisms.find(mech => mech.id === id);
export const getFailureCauseById = (id: string) => mockFailureCauses.find(cause => cause.id === id);

// Get display names
export const getEquipmentName = (id: string) => mockEquipment.find(eq => eq.tag === id)?.name || id;
export const getComponentName = (name: string) => mockComponents.find(comp => comp.name === name)?.name || name;
export const getWorkCenterName = (code: string) => mockWorkCenters.find(wc => wc.code === code)?.name || code;
export const getTaskTypeName = (code: string) => mockTaskTypes.find(tt => tt.code === code)?.name || code;
