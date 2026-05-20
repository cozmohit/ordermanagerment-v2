import { Component, inject, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

type ProviderTab = 'directory' | 'add-physician' | 'profile' | 'orders' | 'territory-mapping' | 'timeline';
type ProviderProfileTab = 'overview' | 'patients' | 'orders' | 'performance' | 'notes';
type PhysicianStatus = 'Active' | 'Inactive';
type TimelineCategory = 'All Events' | 'Patients' | 'Orders' | 'Sales Visits' | 'Mapping' | 'Notes';

interface PhysicianRecord {
  npi: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender?: string;
  specialty?: string;
  deaNumber?: string;
  licenseNumber?: string;
  hospitalAffiliation?: string;
  email?: string;
  phone?: string;
  fax?: string;
  clinicName?: string;
  address: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  territory?: string;
  salesRep?: string;
  distributor?: string;
  status?: PhysicianStatus;
  product: string;
  pharmacy: string;
  pharmacyId?: string;
  lastVisit?: string;
  notes?: string;
}

interface PhysicianFormModel {
  firstName: string;
  lastName: string;
  middleName: string;
  gender: string;
  specialty: string;
  npi: string;
  deaNumber: string;
  licenseNumber: string;
  hospitalAffiliation: string;
  email: string;
  phone: string;
  fax: string;
  clinicName: string;
  address: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  territory: string;
  salesRep: string;
  distributor: string;
  product: string;
  status: PhysicianStatus;
  notes: string;
}

interface DirectoryFilters {
  search: string;
  npi: string;
  deaNumber: string;
  state: string;
  territory: string;
  salesRep: string;
  product: string;
  status: string;
}

interface OrdersFilters {
  startDate: string;
  endDate: string;
  product: string;
  status: string;
}

interface TimelineFilters {
  startDate: string;
  eventType: TimelineCategory;
  salesRep: string;
}

interface PhysicianTimelineEvent {
  id: string;
  physicianNpi: string;
  category: Exclude<TimelineCategory, 'All Events'>;
  title: string;
  description: string;
  date: string;
  salesRep: string;
}

type MappingChangeType = 'territory' | 'salesRep';

@Component({
  selector: 'app-provider-network',
  imports: [CommonModule, FormsModule],
  templateUrl: './provider-network.component.html',
  styleUrl: './provider-network.component.scss'
})
export class ProviderNetworkComponent implements OnInit {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  activeTab: ProviderTab = 'directory';
  profileTab: ProviderProfileTab = 'overview';
  editingNpi: string | null = null;
  selectedPhysicianNpi: string | null = null;
  showMappingModal = false;
  mappingChangeType: MappingChangeType = 'territory';
  mappingPhysicianNpi = '';
  mappingSelection = '';

  directoryFilters: DirectoryFilters = {
    search: '',
    npi: '',
    deaNumber: '',
    state: 'All',
    territory: 'All',
    salesRep: 'All',
    product: 'All',
    status: 'All'
  };

  ordersFilters: OrdersFilters = {
    startDate: '',
    endDate: '',
    product: 'All',
    status: 'All'
  };

  timelineFilters: TimelineFilters = {
    startDate: '',
    eventType: 'All Events',
    salesRep: 'All'
  };

  physicianForm: PhysicianFormModel = {
    firstName: '',
    lastName: '',
    middleName: '',
    gender: 'Male',
    specialty: 'Urology',
    npi: '',
    deaNumber: '',
    licenseNumber: '',
    hospitalAffiliation: '',
    email: '',
    phone: '',
    fax: '',
    clinicName: '',
    address: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    territory: 'East',
    salesRep: '',
    distributor: 'ACCREDO HEALTH GROUP INC.',
    product: 'Anktiva 400mcg/0.4mL',
    status: 'Active',
    notes: ''
  };

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const tab = params['tab'] as ProviderTab | undefined;
      this.activeTab = tab ?? 'directory';

      if (params['npi']) {
        this.selectedPhysicianNpi = params['npi'];
      }

      if (!this.selectedPhysicianNpi && this.physicians.length > 0) {
        this.selectedPhysicianNpi = this.physicians[0].npi;
      }

      if (this.activeTab === 'add-physician' && !this.editingNpi) {
        this.resetForm();
      }
    });
  }

  get physicians(): PhysicianRecord[] {
    return this.dataService.getPhysicians() as PhysicianRecord[];
  }

  get selectedPhysician(): PhysicianRecord | undefined {
    return this.physicians.find((physician) => physician.npi === this.selectedPhysicianNpi) ?? this.physicians[0];
  }

  get territoryOptions(): string[] {
    return ['All', ...new Set(this.dataService.getTerritories().map((territory: any) => territory.name))];
  }

  get salesRepOptions(): string[] {
    const reps = (this.dataService.getSalesTeam() as any[])
      .filter((member) => member.position !== 'Area Business Director')
      .map((member) => member.name);

    return ['All', ...new Set(reps)];
  }

  get productOptions(): string[] {
    return ['All', ...new Set(this.physicians.map((physician) => physician.product).filter(Boolean))];
  }

  get statusOptions(): string[] {
    return ['All', 'Active', 'Inactive'];
  }

  get specialtyOptions(): string[] {
    return ['Urology', 'Oncology', 'Immunotherapy', 'Radiation Oncology'];
  }

  get filteredPhysicians(): PhysicianRecord[] {
    const query = this.directoryFilters.search.trim().toLowerCase();

    return this.physicians.filter((physician) => {
      const fullName = `${physician.firstName} ${physician.lastName}`.toLowerCase();
      const territory = this.getTerritory(physician);
      const salesRep = this.getSalesRep(physician);
      const status = physician.status ?? 'Active';

      return (!query
        || fullName.includes(query)
        || physician.npi.toLowerCase().includes(query))
        && (!this.directoryFilters.npi || physician.npi.includes(this.directoryFilters.npi))
        && (!this.directoryFilters.deaNumber || (physician.deaNumber ?? '').toLowerCase().includes(this.directoryFilters.deaNumber.toLowerCase()))
        && (this.directoryFilters.state === 'All' || physician.state === this.directoryFilters.state)
        && (this.directoryFilters.territory === 'All' || territory === this.directoryFilters.territory)
        && (this.directoryFilters.salesRep === 'All' || salesRep === this.directoryFilters.salesRep)
        && (this.directoryFilters.product === 'All' || physician.product === this.directoryFilters.product)
        && (this.directoryFilters.status === 'All' || status === this.directoryFilters.status);
    });
  }

  get directoryKpis() {
    const rows = this.filteredPhysicians;
    return {
      totalPhysicians: rows.length,
      activePhysicians: rows.filter((physician) => (physician.status ?? 'Active') === 'Active').length,
      totalPatients: rows.reduce((sum, physician) => sum + this.getLinkedPatients(physician).length, 0),
      totalOrders: rows.reduce((sum, physician) => sum + this.getLinkedOrders(physician).length, 0),
      totalRevenue: rows.reduce((sum, physician) => sum + this.getPhysicianRevenue(physician), 0)
    };
  }

  get profileSummary() {
    if (!this.selectedPhysician) {
      return null;
    }

    const patients = this.getLinkedPatients(this.selectedPhysician);
    const orders = this.getLinkedOrders(this.selectedPhysician);

    return {
      physician: this.selectedPhysician,
      territory: this.getTerritory(this.selectedPhysician),
      salesRep: this.getSalesRep(this.selectedPhysician),
      totalPatients: patients.length,
      activePatients: patients.filter((patient: any) => (patient.patientStatus ?? 'Active') === 'Active').length,
      pendingEnrollments: patients.filter((patient: any) => (patient.enrollmentStatus ?? patient.status) === 'Pending' || patient.status === 'Referral').length,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum: number, order: any) => sum + order.total, 0)
    };
  }

  get selectedPhysicianPatients(): any[] {
    return this.selectedPhysician ? this.getLinkedPatients(this.selectedPhysician) : [];
  }

  get selectedPhysicianOrders(): any[] {
    return this.selectedPhysician ? this.getFilteredLinkedOrders(this.selectedPhysician) : [];
  }

  get physicianOrderKpis() {
    const rows = this.selectedPhysicianOrders;
    return {
      totalOrders: rows.length,
      pendingOrders: rows.filter((row) => row.status === 'Pending' || row.status === 'Credit Hold').length,
      completedOrders: rows.filter((row) => row.status === 'Shipped').length,
      revenue: rows.reduce((sum, row) => sum + row.total, 0)
    };
  }

  get territoryMappingRows() {
    return this.physicians.map((physician) => ({
      physician,
      territory: this.getTerritory(physician),
      salesRep: this.getSalesRep(physician),
      productFocus: physician.product,
      lastVisit: physician.lastVisit ?? this.getLastActivity(physician)
    }));
  }

  get mappingKpis() {
    const rows = this.territoryMappingRows;
    return {
      totalMappings: rows.length,
      eastCoverage: rows.filter((row) => row.territory === 'East').length,
      remappedThisMonth: rows.filter((row) => row.lastVisit.startsWith('2026-04')).length,
      uniqueReps: new Set(rows.map((row) => row.salesRep)).size
    };
  }

  get selectedPhysicianTimeline(): PhysicianTimelineEvent[] {
    if (!this.selectedPhysician) {
      return [];
    }

    return this.buildTimeline(this.selectedPhysician).filter((event) => {
      return (this.timelineFilters.eventType === 'All Events' || event.category === this.timelineFilters.eventType)
        && (this.timelineFilters.salesRep === 'All' || event.salesRep === this.timelineFilters.salesRep)
        && (!this.timelineFilters.startDate || event.date >= this.timelineFilters.startDate);
    });
  }

  savePhysician(): void {
    if (this.editingNpi) {
      const physician = this.physicians.find((item) => item.npi === this.editingNpi);
      if (physician) {
        Object.assign(physician, this.mapFormToPhysician(this.editingNpi));
      }
    } else {
      this.dataService.addPhysician(this.mapFormToPhysician(this.physicianForm.npi));
      this.selectedPhysicianNpi = this.physicianForm.npi;
    }
    this.editingNpi = null;
    this.setTab('directory', this.selectedPhysicianNpi ?? this.physicians[0]?.npi);
  }

  editPhysician(physician: PhysicianRecord): void {
    this.editingNpi = physician.npi;
    this.selectedPhysicianNpi = physician.npi;
    this.physicianForm = this.mapPhysicianToForm(physician);
    this.setTab('add-physician', physician.npi);
  }

  deletePhysician(npi: string): void {
    this.dataService.deletePhysician(npi);
    if (this.selectedPhysicianNpi === npi) {
      this.selectedPhysicianNpi = this.physicians[0]?.npi ?? null;
    }
  }

  startAddPhysician(): void {
    this.editingNpi = null;
    this.resetForm();
    this.setTab('add-physician', this.selectedPhysician?.npi);
  }

  openPhysicianProfile(npi: string, profileTab: ProviderProfileTab = 'overview'): void {
    this.profileTab = profileTab;
    this.setTab('profile', npi);
  }

  openPhysicianOrders(npi: string): void {
    this.setTab('orders', npi);
  }

  openTimeline(npi: string): void {
    this.timelineFilters.eventType = 'All Events';
    this.setTab('timeline', npi);
  }

  setTab(tab: ProviderTab, npi?: string): void {
    this.activeTab = tab;
    if (npi) {
      this.selectedPhysicianNpi = npi;
    }

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        tab,
        npi: npi ?? this.selectedPhysicianNpi ?? undefined
      },
      queryParamsHandling: 'merge'
    });
  }

  openMappingModal(npi: string, changeType: MappingChangeType): void {
    const physician = this.physicians.find((item) => item.npi === npi);
    if (!physician) {
      return;
    }

    this.mappingPhysicianNpi = npi;
    this.mappingChangeType = changeType;
    this.mappingSelection = changeType === 'territory'
      ? this.getTerritory(physician)
      : this.getSalesRep(physician);
    this.showMappingModal = true;
  }

  closeMappingModal(): void {
    this.showMappingModal = false;
    this.mappingPhysicianNpi = '';
    this.mappingSelection = '';
    this.mappingChangeType = 'territory';
  }

  saveMappingChange(): void {
    const physician = this.physicians.find((item) => item.npi === this.mappingPhysicianNpi);
    if (!physician || !this.mappingSelection) {
      return;
    }

    if (this.mappingChangeType === 'territory') {
      physician.territory = this.mappingSelection;
    } else {
      physician.salesRep = this.mappingSelection;
    }

    if (this.selectedPhysicianNpi === physician.npi) {
      this.selectedPhysicianNpi = physician.npi;
    }

    this.closeMappingModal();
  }

  get mappingModalPhysician(): PhysicianRecord | undefined {
    return this.physicians.find((item) => item.npi === this.mappingPhysicianNpi);
  }

  get mappingModalTitle(): string {
    return this.mappingChangeType === 'territory' ? 'Change Territory' : 'Change Sales Rep';
  }

  get mappingModalFieldLabel(): string {
    return this.mappingChangeType === 'territory' ? 'Territory' : 'Sales Rep';
  }

  get mappingModalOptions(): string[] {
    return this.mappingChangeType === 'territory'
      ? this.territoryOptions.slice(1)
      : this.salesRepOptions.slice(1);
  }

  get mappingCurrentValue(): string {
    const physician = this.mappingModalPhysician;
    if (!physician) {
      return '--';
    }

    return this.mappingChangeType === 'territory'
      ? this.getTerritory(physician)
      : this.getSalesRep(physician);
  }

  getStatusBadgeClass(status: string): string {
    if (status === 'Active' || status === 'Shipped') {
      return 'ib-status-badge--success';
    }

    if (status === 'Pending' || status === 'Credit Hold') {
      return 'ib-status-badge--warning';
    }

    if (status === 'Inactive') {
      return 'ib-status-badge--danger';
    }

    return 'ib-status-badge--neutral';
  }

  private mapPhysicianToForm(physician: PhysicianRecord): PhysicianFormModel {
    return {
      firstName: physician.firstName,
      lastName: physician.lastName,
      middleName: physician.middleName ?? '',
      gender: physician.gender ?? 'Male',
      specialty: physician.specialty ?? 'Urology',
      npi: physician.npi,
      deaNumber: physician.deaNumber ?? '',
      licenseNumber: physician.licenseNumber ?? '',
      hospitalAffiliation: physician.hospitalAffiliation ?? '',
      email: physician.email ?? '',
      phone: physician.phone ?? '',
      fax: physician.fax ?? '',
      clinicName: physician.clinicName ?? '',
      address: physician.address,
      addressLine2: physician.addressLine2 ?? '',
      city: physician.city,
      state: physician.state,
      zip: physician.zip,
      territory: this.getTerritory(physician),
      salesRep: this.getSalesRep(physician),
      distributor: physician.distributor ?? physician.pharmacy,
      product: physician.product,
      status: physician.status ?? 'Active',
      notes: physician.notes ?? ''
    };
  }

  private mapFormToPhysician(npi: string): PhysicianRecord {
    return {
      npi,
      firstName: this.physicianForm.firstName,
      lastName: this.physicianForm.lastName,
      middleName: this.physicianForm.middleName,
      gender: this.physicianForm.gender,
      specialty: this.physicianForm.specialty,
      deaNumber: this.physicianForm.deaNumber,
      licenseNumber: this.physicianForm.licenseNumber,
      hospitalAffiliation: this.physicianForm.hospitalAffiliation,
      email: this.physicianForm.email,
      phone: this.physicianForm.phone,
      fax: this.physicianForm.fax,
      clinicName: this.physicianForm.clinicName,
      address: this.physicianForm.address,
      addressLine2: this.physicianForm.addressLine2,
      city: this.physicianForm.city,
      state: this.physicianForm.state,
      zip: this.physicianForm.zip,
      territory: this.physicianForm.territory,
      salesRep: this.physicianForm.salesRep,
      distributor: this.physicianForm.distributor,
      status: this.physicianForm.status,
      product: this.physicianForm.product,
      pharmacy: this.physicianForm.distributor,
      notes: this.physicianForm.notes,
      lastVisit: '2026-04-24'
    };
  }

  private resetForm(): void {
    this.physicianForm = {
      firstName: '',
      lastName: '',
      middleName: '',
      gender: 'Male',
      specialty: 'Urology',
      npi: '',
      deaNumber: '',
      licenseNumber: '',
      hospitalAffiliation: '',
      email: '',
      phone: '',
      fax: '',
      clinicName: '',
      address: '',
      addressLine2: '',
      city: '',
      state: '',
      zip: '',
      territory: 'East',
      salesRep: 'Lisa Volomino',
      distributor: 'ACCREDO HEALTH GROUP INC.',
      product: 'Anktiva 400mcg/0.4mL',
      status: 'Active',
      notes: ''
    };
  }

  getTerritory(physician: PhysicianRecord): string {
    if (physician.territory) {
      return physician.territory;
    }

    const territoryMap: Record<string, string> = {
      NY: 'East',
      MD: 'East',
      NJ: 'East',
      TX: 'South Central',
      NC: 'North Central',
      TN: 'North Central',
      CA: 'Southwest'
    };

    return territoryMap[physician.state] ?? 'East';
  }

  getSalesRep(physician: PhysicianRecord): string {
    if (physician.salesRep) {
      return physician.salesRep;
    }

    const territory = this.getTerritory(physician);
    const team = this.dataService.getSalesTeam() as any[];
    return team.find((member) => member.area === territory && member.position !== 'Area Business Director')?.name ?? 'Unassigned';
  }

  getLinkedPatients(physician: PhysicianRecord): any[] {
    return this.dataService.getPatients().filter((patient: any) => {
      const doctor = patient.doctor.toLowerCase();
      return doctor.includes(physician.lastName.toLowerCase()) || doctor.includes(physician.firstName.toLowerCase());
    });
  }

  getLinkedOrders(physician: PhysicianRecord): any[] {
    const city = physician.city.toLowerCase();
    const state = physician.state.toLowerCase();
    return this.dataService.getRecentOrders().filter((order: any) =>
      order.facility.toLowerCase().includes(city)
      || order.facility.toLowerCase().includes(state)
      || order.impTypeName.toLowerCase().includes('physician')
    ).slice(0, 5);
  }

  private getFilteredLinkedOrders(physician: PhysicianRecord): any[] {
    return this.getLinkedOrders(physician).filter((order: any) => {
      return (this.ordersFilters.product === 'All' || order.product.includes(this.ordersFilters.product.split(' ')[0]))
        && (this.ordersFilters.status === 'All' || order.status === this.ordersFilters.status)
        && (!this.ordersFilters.startDate || order.date >= this.ordersFilters.startDate)
        && (!this.ordersFilters.endDate || order.date <= this.ordersFilters.endDate);
    });
  }

  getPhysicianRevenue(physician: PhysicianRecord): number {
    return this.getLinkedOrders(physician).reduce((sum: number, order: any) => sum + order.total, 0);
  }

  getLastActivity(physician: PhysicianRecord): string {
    return this.getLinkedOrders(physician)[0]?.date ?? '2026-04-24';
  }

  private buildTimeline(physician: PhysicianRecord): PhysicianTimelineEvent[] {
    const salesRep = this.getSalesRep(physician);
    const patients = this.getLinkedPatients(physician);
    const orders = this.getLinkedOrders(physician);

    const events: PhysicianTimelineEvent[] = [
      {
        id: `${physician.npi}-created`,
        physicianNpi: physician.npi,
        category: 'Mapping',
        title: 'Physician created',
        description: `${physician.firstName} ${physician.lastName} was added to the provider registry.`,
        date: '2026-04-08',
        salesRep
      },
      {
        id: `${physician.npi}-territory`,
        physicianNpi: physician.npi,
        category: 'Mapping',
        title: 'Territory mapped',
        description: `Mapped to ${this.getTerritory(physician)} under ${salesRep}.`,
        date: '2026-04-10',
        salesRep
      },
      {
        id: `${physician.npi}-visit`,
        physicianNpi: physician.npi,
        category: 'Sales Visits',
        title: 'Sales rep visit',
        description: `${salesRep} logged a follow-up visit with the office.`,
        date: physician.lastVisit ?? '2026-04-24',
        salesRep
      }
    ];

    patients.forEach((patient: any, index: number) => {
      events.push({
        id: `${physician.npi}-patient-${index}`,
        physicianNpi: physician.npi,
        category: 'Patients',
        title: 'Patient enrolled',
        description: `${patient.name} linked to physician enrollment flow.`,
        date: patient.date,
        salesRep
      });
    });

    orders.forEach((order: any, index: number) => {
      events.push({
        id: `${physician.npi}-order-${index}`,
        physicianNpi: physician.npi,
        category: 'Orders',
        title: 'Order placed',
        description: `${order.id} for ${order.units} units with status ${order.status}.`,
        date: order.date,
        salesRep
      });
    });

    if (physician.notes) {
      events.push({
        id: `${physician.npi}-notes`,
        physicianNpi: physician.npi,
        category: 'Notes',
        title: 'Notes added',
        description: physician.notes,
        date: '2026-04-26',
        salesRep
      });
    }

    return events.sort((a, b) => b.date.localeCompare(a.date));
  }
}
