import { nanoid } from "nanoid";
import { CATEGORIES, DEPARTMENTS, priorityScore, severityLevel } from "./departments";
import type { IssueCategory, Report, ReportStatus } from "./types";

const samples: {
  category: IssueCategory;
  notes: string;
  address: string;
  lat: number;
  lng: number;
  severity: number;
  status: ReportStatus;
  hoursAgo: number;
  photo: string;
}[] = [
  {
    category: "smoke_fire",
    notes: "Thick smoke from the landfill slope, drifting over the highway.",
    address: "Ghazipur landfill, East Delhi",
    lat: 28.6236,
    lng: 77.3281,
    severity: 9,
    status: "assigned",
    hoursAgo: 1.2,
    photo:
      "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "illegal_dumping",
    notes: "Household waste piled on the footpath for three days.",
    address: "SV Road, Andheri West, Mumbai",
    lat: 19.1197,
    lng: 72.8464,
    severity: 6,
    status: "triaged",
    hoursAgo: 4,
    photo:
      "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "water_leakage",
    notes: "Main pipeline burst; water flooding Anna Salai.",
    address: "Anna Salai, Teynampet, Chennai",
    lat: 13.0446,
    lng: 80.2496,
    severity: 8,
    status: "in_progress",
    hoursAgo: 2.5,
    photo:
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "overflowing_drain",
    notes: "Nala overflowing after last night's rain; road waterlogged.",
    address: "Salt Lake Sector V, Kolkata",
    lat: 22.5769,
    lng: 88.4339,
    severity: 7,
    status: "submitted",
    hoursAgo: 0.6,
    photo:
      "https://images.unsplash.com/photo-1599692392256-2d084495fe15?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "fallen_tree",
    notes: "Large tree blocking one lane after high winds.",
    address: "Cubbon Park Road, Bengaluru",
    lat: 12.9763,
    lng: 77.5929,
    severity: 7,
    status: "assigned",
    hoursAgo: 5,
    photo:
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "air_pollution",
    notes: "Visible smog and burning plastic smell near the ISBT junction.",
    address: "Anand Vihar ISBT, Delhi",
    lat: 28.6469,
    lng: 77.316,
    severity: 6,
    status: "triaged",
    hoursAgo: 8,
    photo:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "heat_hotspot",
    notes: "No tree cover, tar melting on the playground.",
    address: "Law Garden, Ellisbridge, Ahmedabad",
    lat: 23.0225,
    lng: 72.5714,
    severity: 5,
    status: "submitted",
    hoursAgo: 10,
    photo:
      "https://images.unsplash.com/photo-1504370805625-d32c54b16100?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "illegal_dumping",
    notes: "Construction debris dumped on the lake edge.",
    address: "Hussain Sagar bund, Hyderabad",
    lat: 17.4239,
    lng: 78.4738,
    severity: 8,
    status: "in_progress",
    hoursAgo: 14,
    photo:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "water_leakage",
    notes: "Persistent leak under the flyover, algae forming.",
    address: "Shivajinagar, JM Road, Pune",
    lat: 18.5308,
    lng: 73.8475,
    severity: 4,
    status: "resolved",
    hoursAgo: 30,
    photo:
      "https://images.unsplash.com/photo-1521207418485-99c705420785?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "smoke_fire",
    notes: "Small fire in dry grass, contained but still smoking.",
    address: "Aarey Colony fringe, Goregaon East, Mumbai",
    lat: 19.155,
    lng: 72.87,
    severity: 5,
    status: "resolved",
    hoursAgo: 40,
    photo:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1200&q=80",
  },
];

export function seedReports(): Report[] {
  return samples.map((s) => {
    const createdAt = new Date(Date.now() - s.hoursAgo * 36e5).toISOString();
    const id = nanoid(10);
    const routing = CATEGORIES[s.category];
    const dept = DEPARTMENTS[routing.departmentId];
    return {
      id,
      trackingCode: `EG-${id.slice(0, 6).toUpperCase()}`,
      createdAt,
      updatedAt: createdAt,
      photoUrl: s.photo,
      notes: s.notes,
      lat: s.lat,
      lng: s.lng,
      address: s.address,
      reporterName: "Citizen",
      classification: {
        category: s.category,
        label: routing.label,
        summary: s.notes,
        severity: s.severity,
        severityLevel: severityLevel(s.severity),
        confidence: 0.86,
        labels: [routing.label],
        engine: "heuristic",
      },
      departmentId: routing.departmentId,
      departmentName: dept.name,
      status: s.status,
      priority: priorityScore(s.severity, createdAt, 1),
      confirmations: 1,
      timeline: [
        {
          at: createdAt,
          status: "submitted",
          note: "Citizen report received and classified.",
        },
        ...(s.status !== "submitted"
          ? [
              {
                at: new Date(new Date(createdAt).getTime() + 20 * 60e3).toISOString(),
                status: s.status,
                note: `Routed to ${dept.name}.`,
              },
            ]
          : []),
      ],
    };
  });
}
