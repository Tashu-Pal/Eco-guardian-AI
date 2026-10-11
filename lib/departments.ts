import type { DepartmentId, IssueCategory, SeverityLevel } from "./types";

export const CATEGORIES: Record<
  IssueCategory,
  { label: string; departmentId: DepartmentId; color: string }
> = {
  illegal_dumping: {
    label: "Illegal garbage dumping",
    departmentId: "solid_waste",
    color: "#b45309",
  },
  water_leakage: {
    label: "Water leakage",
    departmentId: "water_sewerage",
    color: "#0284c7",
  },
  air_pollution: {
    label: "Air pollution",
    departmentId: "pollution_control",
    color: "#64748b",
  },
  heat_hotspot: {
    label: "Heat hotspot",
    departmentId: "public_health",
    color: "#ea580c",
  },
  fallen_tree: {
    label: "Fallen tree",
    departmentId: "parks",
    color: "#15803d",
  },
  overflowing_drain: {
    label: "Overflowing drain",
    departmentId: "stormwater",
    color: "#0f766e",
  },
  smoke_fire: {
    label: "Smoke / fire",
    departmentId: "fire_disaster",
    color: "#dc2626",
  },
  other: {
    label: "Other civic issue",
    departmentId: "public_health",
    color: "#475569",
  },
};

export const DEPARTMENTS: Record<
  DepartmentId,
  { name: string; short: string }
> = {
  solid_waste: { name: "Municipal Solid Waste", short: "Waste" },
  water_sewerage: { name: "Water Supply & Sewerage", short: "Water" },
  pollution_control: { name: "Pollution Control Board", short: "Air" },
  fire_disaster: { name: "Fire & Disaster Response", short: "Fire" },
  parks: { name: "Parks & Horticulture", short: "Parks" },
  stormwater: { name: "Stormwater & Drainage", short: "Drains" },
  public_health: { name: "Public Health", short: "Health" },
};

export function routeDepartment(category: IssueCategory) {
  const dept = DEPARTMENTS[CATEGORIES[category].departmentId];
  return {
    departmentId: CATEGORIES[category].departmentId,
    departmentName: dept.name,
  };
}

export function severityLevel(score: number): SeverityLevel {
  if (score >= 8) return "critical";
  if (score >= 6) return "high";
  if (score >= 4) return "medium";
  return "low";
}

export function priorityScore(severity: number, createdAt: string, confirmations: number) {
  const ageHours = Math.max(0, (Date.now() - new Date(createdAt).getTime()) / 36e5);
  const freshness = Math.max(0, 24 - ageHours);
  return Math.round(severity * 12 + freshness + confirmations * 4);
}
