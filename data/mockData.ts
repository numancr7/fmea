import { 
  EquipmentType, 
  Component, 
  FailureMechanism,
  FailureCause,
  FailureMode,
  SparePart,
  Task,
  MainProduct,
  RiskMatrixCell
} from '../types/fmea-types';

// Mock Equipment Types
export const equipmentTypes: EquipmentType[] = [
  { 
    id: 'eq1', 
    name: 'Centrifugal Pump', 
    function: 'Fluid transfer', 
    criticality: 'high' 
  },
  { 
    id: 'eq2', 
    name: 'Electric Motor', 
    function: 'Power transmission', 
    criticality: 'high' 
  },
  { 
    id: 'eq3', 
    name: 'Heat Exchanger', 
    function: 'Temperature control', 
    criticality: 'medium' 
  },
  { 
    id: 'eq4', 
    name: 'Control Valve', 
    function: 'Flow regulation', 
    criticality: 'medium' 
  },
  { 
    id: 'eq5', 
    name: 'Pressure Vessel', 
    function: 'Material containment', 
    criticality: 'high' 
  },
];

// Mock Components
export const components: Component[] = [
  {
    id: 'comp1',
    name: 'Impeller',
    category: 'Rotating',
    functions: ['Transfer energy to fluid'],
    equipmentTypeId: 'eq1',
    riskRating: 'high'
  },
  {
    id: 'comp2',
    name: 'Mechanical Seal',
    category: 'Sealing',
    functions: ['Prevent leakage'],
    equipmentTypeId: 'eq1',
    riskRating: 'medium'
  },
  {
    id: 'comp3',
    name: 'Bearing Assembly',
    category: 'Rotating',
    functions: ['Support rotor', 'Reduce friction'],
    equipmentTypeId: 'eq2',
    riskRating: 'high'
  },
  {
    id: 'comp4',
    name: 'Stator Winding',
    category: 'Electrical',
    functions: ['Generate magnetic field'],
    equipmentTypeId: 'eq2',
    riskRating: 'critical'
  },
  {
    id: 'comp5',
    name: 'Tube Bundle',
    category: 'Heat Transfer',
    functions: ['Transfer heat between fluids'],
    equipmentTypeId: 'eq3',
    riskRating: 'low'
  },
  {
    id: 'comp6',
    name: 'Valve Actuator',
    category: 'Control',
    functions: ['Provide motive force'],
    equipmentTypeId: 'eq4',
    riskRating: 'medium'
  },
];

// Mock Failure Mechanisms
export const failureMechanisms: FailureMechanism[] = [
  {
    id: 'mech1',
    category: 'Mechanical',
    description: 'Fatigue'
  },
  {
    id: 'mech2',
    category: 'Mechanical',
    description: 'Corrosion'
  },
  {
    id: 'mech3',
    category: 'Electrical',
    description: 'Short Circuit'
  },
  {
    id: 'mech4',
    category: 'Rotating',
    description: 'Imbalance'
  },
  {
    id: 'mech5',
    category: 'Safety & Control',
    description: 'Signal Failure'
  },
];

// Mock Failure Causes
export const failureCauses: FailureCause[] = [
  {
    id: 'cause1',
    category: 'Installation Failure',
    description: 'Improper alignment during installation',
    mechanismIds: ['mech1', 'mech4']
  },
  {
    id: 'cause2',
    category: 'Improper Capacity',
    description: 'Operating beyond design capacity',
    mechanismIds: ['mech1', 'mech2']
  },
  {
    id: 'cause3',
    category: 'Environmental',
    description: 'Corrosive environment',
    mechanismIds: ['mech2']
  },
  {
    id: 'cause4',
    category: 'Electrical',
    description: 'Power surge',
    mechanismIds: ['mech3', 'mech5']
  },
  {
    id: 'cause5',
    category: 'Maintenance',
    description: 'Inadequate lubrication',
    mechanismIds: ['mech1', 'mech4']
  },
];

// Mock Failure Modes
export const failureModes: FailureMode[] = [
  {
    id: 'mode1',
    category: 'Mechanical Failure',
    description: 'Impeller Failure',
    additionalDescription: 'Impeller blade fracture due to fatigue',
    riskRating: 'high',
    rpn: 125,
    severity: 8,
    probability: 5,
    detectability: 3,
    componentIds: ['comp1'],
    causeIds: ['cause1', 'cause2'],
    mechanismIds: ['mech1', 'mech4']
  },
  {
    id: 'mode2',
    category: 'Sealing Failure',
    description: 'Mechanical Seal Leakage',
    riskRating: 'medium',
    rpn: 80,
    severity: 5,
    probability: 4,
    detectability: 4,
    componentIds: ['comp2'],
    causeIds: ['cause3', 'cause5'],
    mechanismIds: ['mech2']
  },
  {
    id: 'mode3',
    category: 'Electrical Failure',
    description: 'Stator Winding Failure',
    additionalDescription: 'Insulation breakdown due to overheating',
    riskRating: 'critical',
    rpn: 200,
    severity: 10,
    probability: 4,
    detectability: 5,
    componentIds: ['comp4'],
    causeIds: ['cause4'],
    mechanismIds: ['mech3']
  },
  {
    id: 'mode4',
    category: 'Mechanical Failure',
    description: 'Bearing Failure',
    riskRating: 'high',
    rpn: 168,
    severity: 7,
    probability: 6,
    detectability: 4,
    componentIds: ['comp3'],
    causeIds: ['cause5'],
    mechanismIds: ['mech1', 'mech4']
  },
  {
    id: 'mode5',
    category: 'Control Failure',
    description: 'Actuator Failure',
    riskRating: 'medium',
    rpn: 60,
    severity: 6,
    probability: 2,
    detectability: 5,
    componentIds: ['comp6'],
    causeIds: ['cause4', 'cause5'],
    mechanismIds: ['mech3', 'mech5']
  },
];

// Mock Spare Parts
export const spareParts: SparePart[] = [
  {
    id: 'spare1',
    materialNo: 'SP-001',
    description: 'Impeller Assembly',
    proposedStock: 5,
    currentStock: 2,
    price: 1200,
    minStock: 2,
    maxStock: 8,
    status: 'approved',
    equipmentTypeIds: ['eq1']
  },
  {
    id: 'spare2',
    materialNo: 'SP-002',
    description: 'Mechanical Seal Kit',
    proposedStock: 10,
    currentStock: 8,
    price: 450,
    minStock: 5,
    maxStock: 15,
    status: 'approved',
    equipmentTypeIds: ['eq1']
  },
  {
    id: 'spare3',
    materialNo: 'SP-003',
    description: 'Bearing Set',
    proposedStock: 12,
    currentStock: 3,
    price: 350,
    minStock: 5,
    maxStock: 20,
    status: 'pending',
    equipmentTypeIds: ['eq1', 'eq2']
  },
  {
    id: 'spare4',
    materialNo: 'SP-004',
    description: 'Stator Winding Assembly',
    proposedStock: 2,
    currentStock: 1,
    price: 3500,
    minStock: 1,
    maxStock: 4,
    status: 'approved',
    equipmentTypeIds: ['eq2']
  },
  {
    id: 'spare5',
    materialNo: 'SP-005',
    description: 'Valve Actuator',
    proposedStock: 3,
    currentStock: 0,
    price: 950,
    minStock: 2,
    maxStock: 5,
    status: 'approved',
    equipmentTypeIds: ['eq4']
  },
];

// Mock Tasks
export const tasks: Task[] = [
  {
    id: 'task1',
    taskType: 'Inspection',
    frequency: 'Monthly',
    workCenter: 'Maintenance',
    mitigationAction: 'Visual inspection of impeller for signs of wear or damage',
    shutdownRequired: false,
    failureModeId: 'mode1'
  },
  {
    id: 'task2',
    taskType: 'Replacement',
    frequency: 'Annually',
    workCenter: 'Mechanical',
    mitigationAction: 'Replace mechanical seal according to manufacturer specs',
    shutdownRequired: true,
    failureModeId: 'mode2'
  },
  {
    id: 'task3',
    taskType: 'Testing',
    frequency: 'Quarterly',
    workCenter: 'Electrical',
    mitigationAction: 'Perform insulation resistance test on stator windings',
    shutdownRequired: true,
    failureModeId: 'mode3'
  },
  {
    id: 'task4',
    taskType: 'Lubrication',
    frequency: 'Weekly',
    workCenter: 'Maintenance',
    mitigationAction: 'Grease bearings according to lubrication schedule',
    shutdownRequired: false,
    failureModeId: 'mode4'
  },
  {
    id: 'task5',
    taskType: 'Calibration',
    frequency: 'Semi-annually',
    workCenter: 'Instrumentation',
    mitigationAction: 'Calibrate valve actuator and check operation',
    shutdownRequired: true,
    failureModeId: 'mode5'
  },
];

// Mock Main Products
export const mainProducts: MainProduct[] = [
  {
    id: 'prod1',
    name: 'Boiler Feed Water Pump',
    equipmentTypeId: 'eq1',
    componentIds: ['comp1', 'comp2', 'comp3'],
    failureModeIds: ['mode1', 'mode2', 'mode4'],
    probability: 6,
    riskRating: 'high'
  },
  {
    id: 'prod2',
    name: 'Cooling Water Pump Motor',
    equipmentTypeId: 'eq2',
    componentIds: ['comp3', 'comp4'],
    failureModeIds: ['mode3', 'mode4'],
    probability: 4,
    riskRating: 'critical'
  },
  {
    id: 'prod3',
    name: 'Process Fluid Heat Exchanger',
    equipmentTypeId: 'eq3',
    componentIds: ['comp5'],
    failureModeIds: [],
    probability: 2,
    riskRating: 'low'
  },
  {
    id: 'prod4',
    name: 'Main Steam Control Valve',
    equipmentTypeId: 'eq4',
    componentIds: ['comp6'],
    failureModeIds: ['mode5'],
    probability: 3,
    riskRating: 'medium'
  },
];

// Risk Matrix Data
export const riskMatrixData: RiskMatrixCell[] = [
  // Severity 1
  { severity: 1, probability: 1, level: 'low', count: 0 },
  { severity: 1, probability: 2, level: 'low', count: 1 },
  { severity: 1, probability: 3, level: 'low', count: 0 },
  { severity: 1, probability: 4, level: 'low', count: 0 },
  { severity: 1, probability: 5, level: 'medium', count: 0 },
  
  // Severity 2
  { severity: 2, probability: 1, level: 'low', count: 0 },
  { severity: 2, probability: 2, level: 'low', count: 2 },
  { severity: 2, probability: 3, level: 'medium', count: 0 },
  { severity: 2, probability: 4, level: 'medium', count: 0 },
  { severity: 2, probability: 5, level: 'medium', count: 0 },
  
  // Severity 3
  { severity: 3, probability: 1, level: 'low', count: 1 },
  { severity: 3, probability: 2, level: 'medium', count: 0 },
  { severity: 3, probability: 3, level: 'medium', count: 0 },
  { severity: 3, probability: 4, level: 'medium', count: 2 },
  { severity: 3, probability: 5, level: 'high', count: 1 },
  
  // Severity 4
  { severity: 4, probability: 1, level: 'low', count: 0 },
  { severity: 4, probability: 2, level: 'medium', count: 1 },
  { severity: 4, probability: 3, level: 'medium', count: 0 },
  { severity: 4, probability: 4, level: 'high', count: 1 },
  { severity: 4, probability: 5, level: 'high', count: 3 },
  
  // Severity 5
  { severity: 5, probability: 1, level: 'medium', count: 0 },
  { severity: 5, probability: 2, level: 'high', count: 0 },
  { severity: 5, probability: 3, level: 'high', count: 2 },
  { severity: 5, probability: 4, level: 'critical', count: 1 },
  { severity: 5, probability: 5, level: 'critical', count: 4 }
];
