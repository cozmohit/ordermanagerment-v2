import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

interface OrderRow {
  id: string;
  accountNo: string;
  distribution: string;
  status: string;
  shipToName: string;
  shipToAddress: string;
  shipToCity: string;
  shipToState: string;
  shipToZip: string;
  deliveryQty: number;
  orderDate: string;
  deliveryDate: string;
  area: string;
  abd: string;
  businessManager: string;
  territory: string;
  unitsAssigned: number;
}

interface OrderFilters {
  search: string;
  status: string;
  distribution: string;
}

interface TimelineStep {
  label: string;
  date: string;
  detail: string;
  state: 'completed' | 'current' | 'upcoming' | 'issue';
}

interface SplitAssignment {
  abd: string;
  businessManager: string;
  territory: string;
  units: number;
}

@Component({
  selector: 'app-order-management',
  imports: [CommonModule, FormsModule, NgClass],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.scss'
})
export class OrderManagementComponent implements OnInit {
  private route = inject(ActivatedRoute);

  // active filters — only updated on Apply click
  orderFilters: OrderFilters = { search: '', status: 'All', distribution: 'All' };
  // staged filters — bound to the filter inputs
  pendingFilters: OrderFilters = { search: '', status: 'All', distribution: 'All' };

  private allOrders: OrderRow[] = [
    { id: 'ORD-001', accountNo: '8712783392326', distribution: 'ICS',    status: 'Shipped',      shipToName: 'JAMES C LIN MD',                 shipToAddress: '100 HIGHLAND ST',       shipToCity: 'MILTON',        shipToState: 'MA', shipToZip: '2186',  deliveryQty: 1, orderDate: '2026-04-30', deliveryDate: '2026-05-01', area: 'East',          abd: 'Keith DeRuiter', businessManager: 'OPEN',                territory: 'Boston, MA',          unitsAssigned: 2 },
    { id: 'ORD-002', accountNo: '8712783328627', distribution: 'ICS',    status: 'Pending',      shipToName: 'H LEE MOFFITT CANCER CENTER IV', shipToAddress: '12902 USF MAGNOLIA DR', shipToCity: 'TAMPA',         shipToState: 'FL', shipToZip: '33612', deliveryQty: 2, orderDate: '2026-04-30', deliveryDate: '2026-05-01', area: 'South Central', abd: 'Chuck Gaetano',  businessManager: 'Katrina Caronia',     territory: 'Tampa, FL',           unitsAssigned: 1 },
    { id: 'ORD-003', accountNo: '8712785588010', distribution: 'ICS',    status: 'Pending',      shipToName: 'TOWER OUTPATIENT SURGERY CTR',   shipToAddress: '8635 W 3RD ST',         shipToCity: 'LOS ANGELES',   shipToState: 'CA', shipToZip: '90048', deliveryQty: 3, orderDate: '2026-04-30', deliveryDate: '2026-05-01', area: 'Southwest',     abd: 'OPEN',           businessManager: 'Alexandra Maddalosso',territory: 'Los Angeles, CA',     unitsAssigned: 3 },
    { id: 'ORD-004', accountNo: '4471528182231', distribution: 'ICS',    status: 'Pending',      shipToName: 'PRAIRIE LAKES HEALTHCARE SYST',  shipToAddress: '401 9TH AVE NW',        shipToCity: 'WATERTOWN',     shipToState: 'SD', shipToZip: '57201', deliveryQty: 2, orderDate: '2026-04-30', deliveryDate: '2026-05-04', area: 'Southwest',     abd: 'OPEN',           businessManager: 'James Reiff',         territory: 'Boise, ID',           unitsAssigned: 2 },
    { id: 'ORD-005', accountNo: '4471528182220', distribution: 'ICS',    status: 'Pending',      shipToName: 'UROPARTNERS LLC',                shipToAddress: '17901 GOVERNORS HWY',   shipToCity: 'HOMEWOOD',      shipToState: 'IL', shipToZip: '60430', deliveryQty: 2, orderDate: '2026-04-30', deliveryDate: '2026-05-04', area: 'North Central', abd: 'OPEN',           businessManager: 'Robb Evans',          territory: 'Chicago, IL',         unitsAssigned: 1 },
    { id: 'ORD-006', accountNo: '4471528182140', distribution: 'ICS',    status: 'Credit Hold',  shipToName: 'STANFORD HEALTH CARE ONCOLOGY',  shipToAddress: '875 BLAKE WILBUR DR',   shipToCity: 'PALO ALTO',     shipToState: 'CA', shipToZip: '94304', deliveryQty: 2, orderDate: '2026-04-30', deliveryDate: '2026-05-04', area: 'Southwest',     abd: 'OPEN',           businessManager: 'Freddy Garzon',       territory: 'Northern California', unitsAssigned: 2 },
    { id: 'ORD-007', accountNo: '4471528181831', distribution: 'ICS',    status: 'Pending',      shipToName: 'UROLOGY OF INDIANA LLC',         shipToAddress: '679 E COUNTY LINE RD',  shipToCity: 'GREENWOOD',     shipToState: 'IN', shipToZip: '46143', deliveryQty: 1, orderDate: '2026-04-30', deliveryDate: '2026-05-04', area: 'North Central', abd: 'OPEN',           businessManager: 'Chris Moffitt',       territory: 'Indianapolis, IN',    unitsAssigned: 1 },
    { id: 'ORD-008', accountNo: '4471528182091', distribution: 'ICS',    status: 'Shipped',      shipToName: 'UCSF MEDICAL CENTER BENIOFF',    shipToAddress: '1975 4TH ST',           shipToCity: 'SAN FRANCISCO', shipToState: 'CA', shipToZip: '94143', deliveryQty: 1, orderDate: '2026-04-30', deliveryDate: '2026-05-04', area: 'Southwest',     abd: 'Freddy Garzon',  businessManager: 'OPEN',                territory: 'Northern California', unitsAssigned: 1 },
    { id: 'ORD-009', accountNo: '',             distribution: 'Accredo', status: 'Shipped',      shipToName: 'DANIEL CANTER',                 shipToAddress: '2170 COUNTRY CLUB DR',  shipToCity: 'LAWRENCEVILLE', shipToState: 'GA', shipToZip: '30043', deliveryQty: 3, orderDate: '2026-04-30', deliveryDate: '2026-05-01', area: 'South Central', abd: 'Chuck Gaetano',  businessManager: 'Michael Real',        territory: 'Atlanta, GA',         unitsAssigned: 1 }
  ];

  // ── Track modal ──────────────────────────────────────────
  trackingOrder: OrderRow | null = null;
  openTrackModal(order: OrderRow): void { this.trackingOrder = order; }
  closeTrackModal(): void               { this.trackingOrder = null;  }

  getTimelineSteps(order: OrderRow): TimelineStep[] {
    const base    = new Date(order.orderDate);
    const deliver = new Date(order.deliveryDate);
    const fmt     = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const add     = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

    if (order.status === 'Shipped') {
      return [
        { label: 'Order Placed',       date: fmt(base),        detail: 'Order received and logged into the system.',         state: 'completed' },
        { label: 'Documents Verified', date: fmt(add(base,1)), detail: 'Facility credentials and order details validated.',   state: 'completed' },
        { label: 'Packed & Ready',     date: fmt(add(base,1)), detail: 'Shipment prepared and handed to fulfillment team.',  state: 'completed' },
        { label: 'Dispatched',         date: fmt(add(base,2)), detail: 'Package picked up by courier and in transit.',       state: 'completed' },
        { label: 'Shipped',            date: fmt(deliver),     detail: 'Order shipped successfully to facility.',            state: 'completed' }
      ];
    }
    if (order.status === 'Credit Hold') {
      return [
        { label: 'Order Placed',        date: fmt(base),            detail: 'Order received and logged into the system.',                  state: 'completed' },
        { label: 'Documents Verified',  date: fmt(add(base, 1)),    detail: 'Initial review completed before release to fulfillment.',      state: 'completed' },
        { label: 'Credit Hold Flagged', date: fmt(add(base, 2)),    detail: 'Order paused — account under credit review. Action required.', state: 'issue'     },
        { label: 'Dispatched',          date: 'Awaiting release',   detail: 'Will proceed once the credit hold is resolved.',               state: 'upcoming'  },
        { label: 'Delivered',           date: 'Pending',            detail: 'Delivery pending resolution of credit hold.',                  state: 'upcoming'  }
      ];
    }
    if (order.status === 'Cancelled') {
      return [
        { label: 'Order Placed',    date: fmt(base),         detail: 'Order received and logged into the system.',   state: 'completed' },
        { label: 'Review Started',  date: fmt(add(base, 1)), detail: 'Order entered the processing queue.',           state: 'completed' },
        { label: 'Cancelled',       date: fmt(add(base, 2)), detail: 'Order was cancelled before shipment.',          state: 'issue'     },
        { label: 'Dispatched',      date: 'Not applicable',  detail: 'Shipment was not initiated.',                   state: 'upcoming'  },
        { label: 'Delivered',       date: 'Not applicable',  detail: 'Order will not be delivered.',                  state: 'upcoming'  }
      ];
    }
    return [
      { label: 'Order Placed',       date: fmt(base),             detail: 'Order received and logged into the system.',              state: 'completed' },
      { label: 'Documents Verified', date: fmt(add(base, 1)),     detail: 'Facility credentials and order details validated.',        state: 'completed' },
      { label: 'Processing',         date: fmt(add(base, 1)),     detail: 'Order is being prepared for dispatch.',                    state: 'current'   },
      { label: 'Dispatched',         date: 'Awaiting dispatch',   detail: 'Shipment will update once it leaves the warehouse.',       state: 'upcoming'  },
      { label: 'Delivered',          date: 'Pending',             detail: 'Estimated on completion of dispatch.',                     state: 'upcoming'  }
    ];
  }

  // ── Details modal ────────────────────────────────────────
  detailsOrder: OrderRow | null = null;
  openDetailsModal(order: OrderRow): void { this.detailsOrder = order; }
  closeDetailsModal(): void               { this.detailsOrder = null;  }

  // ── Edit modal ───────────────────────────────────────────
  editingOrder: OrderRow | null = null;
  editForm: Partial<OrderRow> = {};

  openEditModal(order: OrderRow): void {
    this.editingOrder = order;
    this.editForm = { ...order };
  }
  closeEditModal(): void {
    this.editingOrder = null;
    this.editForm = {};
  }
  saveEdit(): void {
    if (!this.editingOrder) return;
    Object.assign(this.editingOrder, this.editForm);
    this.closeEditModal();
  }

  // ── Split modal ──────────────────────────────────────────
  splittingOrder: OrderRow | null = null;
  splitAssignments: SplitAssignment[] = [];

  readonly abdOptions       = ['Keith DeRuiter', 'Chuck Gaetano', 'OPEN', 'Freddy Garzon'];
  readonly managerOptions   = ['OPEN', 'Katrina Caronia', 'Alexandra Maddalosso', 'James Reiff', 'Michael Reol', 'Robb Evans', 'Chris Moffitt'];
  readonly territoryOptions = ['Boston, MA', 'Tampa, FL', 'Los Angeles, CA', 'Atlanta, GA', 'Boise, ID', 'Chicago, IL', 'Northern California', 'Indianapolis, IN'];

  openSplitModal(order: OrderRow): void {
    this.splittingOrder = order;
    this.splitAssignments = [{ abd: '', businessManager: '', territory: '', units: 0 }];
  }
  closeSplitModal(): void {
    this.splittingOrder = null;
    this.splitAssignments = [];
  }
  addSplitRow(): void    { this.splitAssignments.push({ abd: '', businessManager: '', territory: '', units: 0 }); }
  removeSplitRow(i: number): void { this.splitAssignments.splice(i, 1); }

  get splitTotal(): number {
    return this.splitAssignments.reduce((sum, a) => sum + (Number(a.units) || 0), 0);
  }
  get splitProgressPercent(): number {
    if (!this.splittingOrder || this.splittingOrder.unitsAssigned === 0) return 0;
    return Math.min((this.splitTotal / this.splittingOrder.unitsAssigned) * 100, 100);
  }
  get splitIsOver(): boolean {
    return !!this.splittingOrder && this.splitTotal > this.splittingOrder.unitsAssigned;
  }
  get splitIsValid(): boolean {
    return !this.splitIsOver && this.splitTotal > 0
      && this.splitAssignments.every(a => !!a.abd && !!a.businessManager && !!a.territory && a.units > 0);
  }
  saveSplit(): void {
    if (!this.splitIsValid) return;
    console.log('Split saved for', this.splittingOrder?.id, this.splitAssignments);
    this.closeSplitModal();
  }

  // ── Filters ──────────────────────────────────────────────
  readonly statusOptions       = ['All', 'Shipped', 'Pending', 'Credit Hold', 'Cancelled'];
  readonly distributionOptions = ['All', 'ICS', 'Accredo', 'IB Care'];
  readonly statusFormOptions   = ['', 'Shipped', 'Pending', 'Credit Hold', 'Cancelled'];

  get filteredOrders(): OrderRow[] {
    const q = this.orderFilters.search.trim().toLowerCase();
    return this.allOrders.filter(o => {
      const matchSearch = !q || [o.accountNo, o.distribution, o.shipToName, o.area, o.abd, o.businessManager, o.territory, o.status]
        .some(v => v.toLowerCase().includes(q));
      const matchStatus = this.orderFilters.status === 'All' || o.status === this.orderFilters.status;
      const matchDist   = this.orderFilters.distribution === 'All' || o.distribution === this.orderFilters.distribution;
      return matchSearch && matchStatus && matchDist;
    });
  }

  applyFilters(): void {
    this.orderFilters = { ...this.pendingFilters };
  }

  resetFilters(): void {
    this.orderFilters    = { search: '', status: 'All', distribution: 'All' };
    this.pendingFilters  = { search: '', status: 'All', distribution: 'All' };
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(() => {});
  }
}
