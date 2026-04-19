export interface ZoneData {
  zone: string;
  number_of_people: number;
  capacity: number;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  sim_call_index: number;
}

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
