This Markdown file is designed to be the "Master Specification" for an AI developer. It provides the business logic, UI structure, design language, and sample data needed to build a professional-grade prototype.

***

# Project Specification: Anktiva Commercial & Patient Access Portal (V1)

## 1. Project Vision
**Anktiva** is a high-stakes specialty pharmaceutical platform. It manages the sales, distribution, and patient onboarding for a $35,800/unit oncology drug. The application must move away from complex spreadsheets into a streamlined, "command-center" style web experience that balances high-level financial oversight with granular patient-level tracking.

---

## 2. Technical Stack & UI Guidelines
* **Framework:** React or Next.js (Preferred)
* **Styling:** Tailwind CSS (Modern, clean, utility-first)
* **Icons:** Lucide-React (Professional, thin-stroke)
* **Design System:**
    * **Primary Brand Color:** `#6A0DAD` (Deep Purple)
    * **Surface Colors:** Slate-50 (Background), White (Cards)
    * **Typography:** 'Inter' or 'Public Sans' (Clean, high-readability)
    * **Components:** Use "Shadcn/UI" style components (Card-based layout, subtle shadows, rounded corners `0.5rem`).

---

## 3. Information Architecture (Navigation)
The UI should feature a **Fixed Sidebar** navigation with the following hierarchy:

| Level 1 | Level 2 | Feature Set |
| :--- | :--- | :--- |
| **🏠 Dashboard** | National, Regional | KPI cards, Daily sales trend, Enrollment funnel. |
| **📦 Sales Management** | Daily Sales, Sales Report | Table views of $ metrics, filterable by Region/Product. |
| **🚀 Performance** | Rep Wise, Territory Wise | Leaderboards, Target vs. Actual progress bars. |
| **🛒 Order Management** | All Orders, Tracking | Transaction registry, EDI order status, FedEx/UPS links. |
| **🧬 Patient Hub** | Enrollments, Patient List | Specialty Pharmacy (Accredo/IB Care) status tracking. |
| **🩺 Provider Network** | Physicians, Facilities | Master database of HCPs and NPI numbers. |
| **🗺️ Territory Manager** | Assignments, Territories | Mapping Sales Reps to specific geographic Area IDs. |
| **👥 Sales Team** | Profiles, Targets | HR-style view of the field force. |

---

## 4. Key Page Specifications (V1 Scope)

### **A. Executive Dashboard (The "Command Center")**
* **Top Row KPIs:** * Yesterday's Sales ($823,400)
    * Units Ordered (Weekly: 63)
    * YTD Revenue ($64.4M)
    * Active Enrollments (255)
* **Main Chart:** Weekly Sales Trend (Bar chart showing Friday-Thursday units).
* **Territory Heatmap:** Simple list or map showing "East" vs "North Central" performance.

### **B. Sales & Order Registry (The "Data Table")**
* **Requirements:** A professional, dense (but clean) data table.
* **Columns:** Order ID, Date, Facility Name, BP Type (e.g., Hospital), Units, Total Amount ($), Status Badge.
* **Status Badges:** `Shipped` (Success/Green), `Pending` (Warning/Amber), `Credit Hold` (Destructive/Red).

### **C. Patient Enrollment View**
* **Focus:** A "Funnel" view showing patients moving from **Referral -> Insurance Auth -> First Dose**.
* **Data Points:** Patient ID (Anonymized), Physician Name, Specialty Pharmacy (Accredo), Enrollment Date.

---

## 5. Demo Static Data (JSON Schema)
Use this data to populate the prototype:

```json
{
  "kpis": {
    "daily_revenue": 823400,
    "weekly_units": 63,
    "ytd_revenue": 64404200,
    "total_enrollments": 289
  },
  "territories": [
    {"id": "EA1", "name": "East", "director": "Keith DeRuiter", "units": 75, "revenue": 12207800},
    {"id": "NC1", "name": "North Central", "director": "Chuck Gaetano", "units": 92, "revenue": 15400500}
  ],
  "recent_orders": [
    {
      "id": "ORD-100201",
      "facility": "Memorial Oncology Center",
      "units": 2,
      "total": 71600.00,
      "status": "Shipped",
      "date": "2026-04-20"
    },
    {
      "id": "ORD-100205",
      "facility": "City Health Clinics",
      "units": 1,
      "total": 35800.00,
      "status": "Pending",
      "date": "2026-04-22"
    }
  ]
}
```

---

## 6. Implementation Instructions for Gemini
1.  **Layout:** Create a responsive `Sidebar` and `TopNav` layout.
2.  **Dashboard:** Build the `Dashboard` page first using the KPI data above. Use a clean card-based layout.
3.  **Data Tables:** Use a library like `@tanstack/react-table` for the Order and Patient views. Ensure columns are sortable.
4.  **Forms:** Create a "Slide-over" (Drawer) component for "Add New Order" and "Add New Patient" to keep the UI feeling fast.
5.  **Interactivity:** Ensure all Level 1 and Level 2 menu items are clickable and navigate to a placeholder or functional page.

***

**End of File**