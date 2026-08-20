export type TrainStatus = "flow" | "warn" | "critical";

export interface TrainNode {
  id: string;
  name: string;
  type: "Express" | "Freight" | "Passenger";
  speed: number;
  delay: number;
  status: TrainStatus;
  position: number; // 0-100 within its section
  section: string;
}

export interface SectionInfo {
  id: string;
  label: string;
  line: "Single" | "Double";
  signal: "Green" | "Red";
  occupancy: number;
  utilisation: number;
  conflict?: boolean;
}

export const SECTIONS: SectionInfo[] = [
  { id: "SEC-A1", label: "Kharagpur Jn — A", line: "Double", signal: "Green", occupancy: 1, utilisation: 62 },
  { id: "SEC-B2", label: "Balichak Loop — B", line: "Double", signal: "Green", occupancy: 2, utilisation: 74 },
  { id: "SEC-C3", label: "Panskura Ghat — C", line: "Single", signal: "Red", occupancy: 2, utilisation: 96, conflict: true },
  { id: "SEC-D4", label: "Mecheda Yard — D", line: "Double", signal: "Green", occupancy: 1, utilisation: 48 },
  { id: "SEC-E5", label: "Uluberia — E", line: "Single", signal: "Green", occupancy: 1, utilisation: 57 },
  { id: "SEC-F6", label: "Santragachi Jn — F", line: "Double", signal: "Green", occupancy: 2, utilisation: 81 },
];

export const TRAINS: TrainNode[] = [
  { id: "EXP-1205", name: "Express 1205", type: "Express", speed: 112, delay: 0, status: "flow", position: 38, section: "SEC-A1" },
  { id: "PSG-6023", name: "Passenger 6023", type: "Passenger", speed: 64, delay: 3, status: "warn", position: 22, section: "SEC-B2" },
  { id: "FRT-EX402", name: "Freight EX-402", type: "Freight", speed: 42, delay: 9, status: "warn", position: 71, section: "SEC-B2" },
  { id: "EXP-101", name: "Express 101", type: "Express", speed: 98, delay: 2, status: "critical", position: 30, section: "SEC-C3" },
  { id: "FRT-802", name: "Freight 802", type: "Freight", speed: 0, delay: 15, status: "critical", position: 78, section: "SEC-C3" },
  { id: "PSG-2211", name: "Passenger 2211", type: "Passenger", speed: 85, delay: 0, status: "flow", position: 55, section: "SEC-D4" },
  { id: "EXP-704", name: "Express 704", type: "Express", speed: 104, delay: 1, status: "flow", position: 44, section: "SEC-E5" },
  { id: "FRT-915", name: "Freight 915", type: "Freight", speed: 51, delay: 6, status: "warn", position: 18, section: "SEC-F6" },
  { id: "EXP-330", name: "Express 330", type: "Express", speed: 92, delay: 0, status: "flow", position: 66, section: "SEC-F6" },
];
