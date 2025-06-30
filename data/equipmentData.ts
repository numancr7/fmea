import { Equipment, EquipmentType, Manufacturer, EquipmentFunction, EquipmentClass, Task, FailureMechanism, FailureCause, FailureMode } from "@/types/equipment-types";

export const equipmentClasses: EquipmentClass[] = [
  { id: "1", name: "Moisture Analyzer", description: "Devices used to measure moisture content" },
  { id: "2", name: "Temperature Sensor", description: "Devices used to measure temperature" },
  { id: "3", name: "Pressure Gauge", description: "Devices used to measure pressure" },
  { id: "4", name: "Level Meter", description: "Devices used to measure levels" },
  { id: "5", name: "Flow Meter", description: "Devices used to measure flow rates" },
];

export const equipmentTypes: EquipmentType[] = [
  { 
    id: "1", 
    name: "Moisture Analyzer",
    equipmentClassId: "1",
    systems: []
  },
  { 
    id: "2", 
    name: "Temperature Meter",
    equipmentClassId: "2", 
    systems: []
  },
  { 
    id: "3", 
    name: "Pressure Sensor",
    equipmentClassId: "3",
    systems: []
  },
  { 
    id: "4", 
    name: "Flow Meter",
    equipmentClassId: "5",
    systems: []
  },
  { 
    id: "5", 
    name: "Level Indicator",
    equipmentClassId: "4",
    systems: []
  },
];

export const manufacturers: Manufacturer[] = [
  { id: "1", name: "Endress+Hauser", website: "https://www.endress.com" },
  { id: "2", name: "Emerson", website: "https://www.emerson.com" },
  { id: "3", name: "Yokogawa", website: "https://www.yokogawa.com" },
  { id: "4", name: "ABB", website: "https://www.abb.com" },
  { id: "5", name: "Siemens", website: "https://www.siemens.com" },
];

export const equipmentFunctions: EquipmentFunction[] = [
  { id: "1", description: "Moisture Analysis" },
  { id: "2", description: "Temperature Monitoring" },
  { id: "3", description: "Pressure Monitoring" },
  { id: "4", description: "Flow Measurement" },
  { id: "5", description: "Level Measurement" },
];

export const equipmentData: Equipment[] = [
  {
    id: "1",
    area: "PFLNG_X",
    unit: "54",
    functionalLocation: "54QT-502",
    functionalLocationFromSAP: "54QT-502",
    functionalLocationDescriptionFromSAP: "xxx",
    techIdentNoFromSAP: "54QT-502",
    equipmentNoFromSAP: "10882056",
    equipmentDescriptionFromSAP: "MOISTURE ANALY",
    sce: "Yes",
    equipmentDescription: "MOISTURE ANALY",
    equipmentType: "1",
    manufacturer: "3",
    model: "AW500",
    criticality: "high",
    equipmentClass: "1",
    equipmentFunctions: [{ id: "1", description: "Moisture Analysis" }],
    numberOfUnits: 1
  },
  {
    id: "2",
    area: "PFLNG_X",
    unit: "54",
    functionalLocation: "54QT-503",
    functionalLocationFromSAP: "54QT-503",
    functionalLocationDescriptionFromSAP: "xxx",
    techIdentNoFromSAP: "54QT-503",
    equipmentNoFromSAP: "10882057",
    equipmentDescriptionFromSAP: "MOISTURE ANALY",
    sce: "Yes",
    equipmentDescription: "MOISTURE ANALY",
    equipmentType: "1",
    manufacturer: "3",
    model: "AW500",
    criticality: "high",
    equipmentClass: "1",
    equipmentFunctions: [{ id: "1", description: "Moisture Analysis" }],
    numberOfUnits: 1
  },
  {
    id: "3",
    area: "PFLNG_X",
    unit: "18",
    functionalLocation: "18QT-007",
    functionalLocationFromSAP: "18QT-007",
    functionalLocationDescriptionFromSAP: "xxx",
    techIdentNoFromSAP: "18QT-007",
    equipmentNoFromSAP: "10718172",
    equipmentDescriptionFromSAP: "ANLZ TX MSTR DRY GS DRIER C18-101A OUT",
    sce: "No",
    equipmentDescription: "ANLZ TX MSTR DRY GS DRIER C18-101A OUT",
    equipmentType: "1",
    manufacturer: "2",
    model: "DM100",
    criticality: "medium",
    equipmentClass: "1",
    equipmentFunctions: [{ id: "1", description: "Moisture Analysis" }],
    numberOfUnits: 1
  }
];

export const tasks: Task[] = [
  {
    id: "1",
    taskList: "TL-001",
    sapGTL: "GTL001",
    mainWorkCenter: "WC001",
    interval: "Monthly",
    taskType: "PM",
    taskDescription: "Calibrate moisture analyzer sensor",
    numberOfPerson: 2,
    manHour: 4,
    equipmentClassId: "1"
  },
  {
    id: "2",
    taskList: "TL-002",
    sapGTL: "GTL002",
    mainWorkCenter: "WC001",
    interval: "Quarterly",
    taskType: "PPM",
    taskDescription: "Replace moisture analyzer filter",
    numberOfPerson: 1,
    manHour: 2,
    equipmentClassId: "1"
  },
  {
    id: "3",
    taskList: "TL-003",
    sapGTL: "GTL003",
    mainWorkCenter: "WC002",
    interval: "Weekly",
    taskType: "PM",
    taskDescription: "Check temperature sensor readings",
    numberOfPerson: 1,
    manHour: 1,
    equipmentClassId: "2"
  },
  {
    id: "4",
    taskList: "TL-004",
    sapGTL: "GTL004",
    mainWorkCenter: "WC003",
    interval: "Monthly",
    taskType: "PM",
    taskDescription: "Pressure gauge calibration",
    numberOfPerson: 2,
    manHour: 3,
    equipmentClassId: "3"
  }
];

export const failureMechanisms: FailureMechanism[] = [
  { id: "1", name: "Corrosion" },
  { id: "2", name: "Erosion" },
  { id: "3", name: "Fatigue" },
  { id: "4", name: "Wear" },
  { id: "5", name: "Vibration" },
  { id: "6", name: "Overheating" },
  { id: "7", name: "Fouling" },
  { id: "8", name: "Blockage" },
];

export const failureCauses: FailureCause[] = [
  { id: "1", causeName: "High Temperature", causeCode: "HT001", causeDescription: "Operating temperature exceeds design limits" },
  { id: "2", causeName: "Chemical Attack", causeCode: "CA001", causeDescription: "Corrosive chemicals affecting material integrity" },
  { id: "3", causeName: "Poor Maintenance", causeCode: "PM001", causeDescription: "Inadequate or delayed maintenance activities" },
  { id: "4", causeName: "Design Flaw", causeCode: "DF001", causeDescription: "Inherent design deficiency" },
  { id: "5", causeName: "Material Defect", causeCode: "MD001", causeDescription: "Manufacturing or material quality issues" },
];

export const failureModes: FailureMode[] = [
  { id: "1", category: "Mechanical", subCategory: "Structural", description: "Crack initiation and propagation" },
  { id: "2", category: "Mechanical", subCategory: "Structural", description: "Deformation beyond elastic limit" },
  { id: "3", category: "Mechanical", subCategory: "Wear", description: "Surface material loss due to friction" },
  { id: "4", category: "Electrical", subCategory: "Insulation", description: "Insulation breakdown" },
  { id: "5", category: "Electrical", subCategory: "Connection", description: "Loose electrical connections" },
  { id: "6", category: "Process", subCategory: "Flow", description: "Reduced flow capacity" },
  { id: "7", category: "Process", subCategory: "Pressure", description: "Pressure loss or gain beyond limits" },
  { id: "8", category: "Instrumentation", subCategory: "Calibration", description: "Measurement drift or inaccuracy" },
];
