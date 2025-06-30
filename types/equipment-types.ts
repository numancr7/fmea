
export type EquipmentCriticality = 'low' | 'medium' | 'high';
export type EquipmentSCE = 'Yes' | 'No';

export interface EquipmentClass {
  id: string;
  name: string;
  description?: string;
  lastReviewed?: string;
  reviewerList?: string;
  classEngineeringDiscipline?: string;
}

export interface EquipmentFunction {
  id: string;
  description: string;
}

export interface Subcomponent {
  id: string;
  name: string;
  remarks?: string;
}

export interface Component {
  id: string;
  name: string;
  subcomponents: Subcomponent[];
  remarks?: string;
}

export interface System {
  id: string;
  name: string;
  components: Component[];
}

export interface EquipmentType {
  id: string;
  name: string;
  description?: string;
  equipmentClassId: string;
  systems: System[];
}

export interface Manufacturer {
  id: string;
  name: string;
  contactInfo?: string;
  website?: string;
}

export interface Equipment {
  id: string;
  area: string;
  unit: string;
  functionalLocation: string;
  functionalLocationFromSAP: string;
  functionalLocationDescriptionFromSAP: string;
  techIdentNoFromSAP: string;
  equipmentNoFromSAP: string;
  equipmentDescriptionFromSAP: string;
  sce: EquipmentSCE;
  equipmentDescription: string;
  equipmentType: string;
  manufacturer: string;
  model: string;
  criticality: EquipmentCriticality;
  equipmentClass: string;
  equipmentFunctions: EquipmentFunction[];
  numberOfUnits: number;
  taskListMapping?: TaskMapping[];
}

export interface Task {
  id: string;
  taskList: string;
  sapGTL: string;
  mainWorkCenter: string;
  interval: string;
  taskType: 'PM' | 'PPM' | 'CM' | 'Other';
  taskDescription: string;
  numberOfPerson: number;
  manHour: number;
  equipmentClassId: string;
}

export interface TaskMapping {
  taskId: string;
  isSelected: boolean;
}

export interface FailureMechanism {
  id: string;
  name: string;
}

export interface FailureCause {
  id: string;
  causeName: string;
  causeCode: string;
  causeDescription: string;
}

export interface FailureMode {
  id: string;
  category: string;
  subCategory: string;
  description: string;
}
