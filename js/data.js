// Sample data for the UI-only demo. All of this is fictional.
window.CONFIG = {
  categories: ["Road works", "Noise", "Utilities", "Pedestrian access", "Traffic diversion"],
  statuses: ["Submitted", "In Progress", "Resolved"],
  priorities: ["Low", "Medium", "High"],
  teams: ["Unassigned", "Construction Team", "Safety Team", "Transport Authority"],
  roles: ["staff", "admin"],
  // Approximate centre of each area [lat, lng], used to place closure markers on the map.
  areas: {
    "George Town": [5.4180, 100.3330],
    "Komtar": [5.4147, 100.3287],
    "Jelutong": [5.3925, 100.3120],
    "Gelugor": [5.3640, 100.3050],
    "Bayan Baru": [5.3390, 100.2845],
    "Air Itam": [5.4020, 100.2770],
    "Bayan Lepas": [5.2970, 100.2650],
    "Tanjung Tokong": [5.4450, 100.3050]
  }
};

window.SAMPLE = {
  announcements: [
    {
      id: 1, title: "Night piling works at Jalan Penang", category: "Noise",
      date: "2026-11-08", startDate: "2026-11-15", endDate: "2026-11-30",
      location: "George Town",
      areas: "Jalan Penang, Lebuh Chulia junction",
      summary: "Piling works will run from 10 pm to 5 am. Expect some noise. Lane 1 will be closed during these hours."
    },
    {
      id: 2, title: "Utility relocation near Komtar", category: "Utilities",
      date: "2026-11-05", startDate: "2026-11-12", endDate: "2026-12-10",
      location: "Komtar",
      areas: "Jalan Magazine, Komtar bus hub",
      summary: "Water and cable lines are being moved. Pedestrian walkway on the east side will be shifted by 3 metres."
    },
    {
      id: 3, title: "Crane installation at Bayan Baru", category: "Road works",
      date: "2026-11-02", startDate: "2026-11-20", endDate: "2026-11-22",
      location: "Bayan Baru",
      areas: "Jalan Mahsuri, near Sunway Carnival",
      summary: "A tower crane will be installed over one weekend. The road will be fully closed from 11 pm to 6 am each night."
    },
    {
      id: 4, title: "Temporary bus stop relocation", category: "Traffic diversion",
      date: "2026-10-28", startDate: "2026-11-01", endDate: "2027-01-31",
      location: "Gelugor",
      areas: "Jalan Sultan Azlan Shah",
      summary: "Two bus stops have moved 150 metres south. Temporary signs and staff are on site."
    },
    {
      id: 5, title: "Drainage upgrade at Jelutong", category: "Pedestrian access",
      date: "2026-10-20", startDate: "2026-10-25", endDate: "2026-11-18",
      location: "Jelutong",
      areas: "Jalan Jelutong, Taman Free School",
      summary: "New drains are being laid. Some shops will have limited front access. Back-lane access stays open."
    }
  ],
  closures: [
    {
      id: 1, road: "Jalan Penang (Lane 1)", location: "George Town",
      from: "2026-11-15", to: "2026-11-30", status: "Upcoming",
      details: "Night closure, 10 pm to 5 am. Lane 2 stays open for emergency vehicles.",
      alternative: "Use Jalan Burma then turn into Jalan Macalister."
    },
    {
      id: 2, road: "Jalan Magazine (east side)", location: "Komtar",
      from: "2026-11-12", to: "2026-12-10", status: "Active",
      details: "East footpath and one lane closed. Pedestrians are guided to the west side.",
      alternative: "Use Jalan Dr Lim Chwee Leong, then Jalan Transfer."
    },
    {
      id: 3, road: "Jalan Mahsuri", location: "Bayan Baru",
      from: "2026-11-20", to: "2026-11-22", status: "Upcoming",
      details: "Full closure from 11 pm to 6 am for crane installation.",
      alternative: "Use Jalan Tun Dr Awang via the Bayan Baru interchange."
    },
    {
      id: 4, road: "Jalan Jelutong (service road)", location: "Jelutong",
      from: "2026-10-25", to: "2026-11-18", status: "Active",
      details: "Service road closed to cars. Motorcycles and pedestrians may pass slowly.",
      alternative: "Use the main Jalan Jelutong carriageway."
    }
  ],
  complaints: [
    {
      id: "CMP-0001", name: "Lim Wei Han", contact: "weihan@example.com",
      location: "George Town", category: "Noise",
      description: "Piling noise continues after midnight and my customers cannot sleep.",
      photo: "", status: "In Progress", priority: "Medium", team: "Construction Team", created: "2026-11-09",
      responses: [{ date: "2026-11-10", text: "Thank you. Our site team is checking the noise logs." }]
    },
    {
      id: "CMP-0002", name: "Nur Aisyah", contact: "012-3456789",
      location: "Komtar", category: "Pedestrian access",
      description: "The temporary walkway is too narrow for wheelchairs.",
      photo: "", status: "Submitted", priority: "High", team: "Unassigned", created: "2026-11-10",
      responses: []
    },
    {
      id: "CMP-0003", name: "Tan Mei Ling", contact: "meiling@example.com",
      location: "Jelutong", category: "Business access",
      description: "Delivery trucks cannot reach the front of my shop.",
      photo: "", status: "Resolved", priority: "Low", team: "Safety Team", created: "2026-11-01",
      responses: [
        { date: "2026-11-03", text: "We are arranging a loading bay." },
        { date: "2026-11-06", text: "A temporary loading bay is now open at the back lane." }
      ]
    }
  ],
  // Demo accounts only. Passwords are sample text, not real security.
  users: [
    { id: 1, userId: "staff", name: "Aisha Rahman", role: "staff", password: "staff123", active: true },
    { id: 2, userId: "admin", name: "System Administrator", role: "admin", password: "admin123", active: true },
    { id: 3, userId: "farid", name: "Farid Hassan", role: "staff", password: "staff123", active: true },
    { id: 4, userId: "kumar", name: "Kumar Raj", role: "staff", password: "staff123", active: false }
  ]
};
