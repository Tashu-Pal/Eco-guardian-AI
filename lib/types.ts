export type IssueCategory =
  | "illegal_dumping"
  | "water_leakage"
  | "air_pollution"
  | "heat_hotspot"
  | "fallen_tree"
  | "overflowing_drain"
  | "smoke_fire"
  | "other";

export type ReportStatus =
  | "submitted"
  | "triaged"
  | "assigned"
  | "in_progress"
  | "resolved"
  | "rejected";

export type SeverityLevel = "low" | "medium" | "high" | "critical";

export type DepartmentId =
  | "solid_waste"
  | "water_sewerage"
  | "pollution_control"
  | "fire_disaster"
  | "parks"
  | "stormwater"
  | "public_health";

export interface Classification {
  category: IssueCategory;
  label: string;
  summary: string;
  severity: number;
  severityLevel: SeverityLevel;
  confidence: number;
  labels: string[];
  engine: "bedrock+rekognition" | "rekognition" | "heuristic";
}

export interface Report {
  id: string;
  trackingCode: string;
  createdAt: string;
  updatedAt: string;
  photoUrl: string;
  notes: string;
  lat: number;
  lng: number;
  address: string;
  reporterName: string;
  classification: Classification;
  departmentId: DepartmentId;
  departmentName: string;
  status: ReportStatus;
  priority: number;
  confirmations: number;
  timeline: { at: string; status: ReportStatus; note: string }[];
}

export interface DashboardStats {
  open: number;
  critical: number;
  resolvedToday: number;
  avgSeverity: number;
  byCategory: Record<IssueCategory, number>;
  byDepartment: Record<string, number>;
}
