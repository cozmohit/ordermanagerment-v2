import { Component, inject, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

type PatientTab = 'directory' | 'add-patient' | 'profile' | 'enrollment' | 'timeline';
type EnrollmentStatus = 'Cancelled' | 'Completed' | 'In Progress' | 'Missing Information' | 'On Hold';
type PatientStatus = 'Active' | 'Inactive';
type ProfileTab = 'overview' | 'orders' | 'enrollment' | 'timeline' | 'notes';
type TimelineFilter = 'All Events' | 'Enrollment' | 'Orders' | 'Shipments' | 'Notes';

interface PatientRecord {
  id: string;
  reportNo: string;
  hubAssigned: string;
  name: string;
  dateOfDx: string;
  doctor: string;
  physicianAddress: string;
  physicianCity: string;
  physicianState: string;
  physicianZip: string;
  facility: string;
  product: string;
  ndc: string;
  shipDate: string;
  qty: number;
  status: string;
  date: string;
  dateOfBirth?: string;
  gender?: string;
  patientStatus?: PatientStatus;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  territory?: string;
  salesRep?: string;
  enrollmentStatus?: EnrollmentStatus;
  enrollmentDate?: string;
  notes?: string;
}

interface PatientFormModel {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  patientStatus: PatientStatus;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  doctor: string;
  product: string;
  territory: string;
  salesRep: string;
  facility: string;
  enrollmentDate: string;
  enrollmentStatus: EnrollmentStatus;
  notes: string;
}

interface PatientRow {
  hub: string;
  status: string;
  patientId: string;
  referralReceivedDate: string;
  dateRxReadyToSchedule: string;
  payerInformation: string;
  prescriber: string;
  siteName: string;
  city: string;
  state: string;
  zip: string;
  qtyOrdered: string;
  abd: string;
  businessManager: string;
}

interface DirectoryFilters {
  search: string;
  enrollmentStatus: string;
  territory: string;
  physician: string;
  product: string;
  startDate: string;
  endDate: string;
}

interface EnrollmentFilters {
  status: string;
  physician: string;
  territory: string;
  salesRep: string;
  startDate: string;
  endDate: string;
}

interface TimelineEvent {
  id: string;
  patientId: string;
  title: string;
  category: TimelineFilter;
  description: string;
  date: string;
}

@Component({
  selector: 'app-patient-enrollment',
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-enrollment.component.html',
  styleUrl: './patient-enrollment.component.scss'
})
export class PatientEnrollmentComponent implements OnInit {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  activeTab: PatientTab = 'directory';
  profileTab: ProfileTab = 'overview';
  timelineFilter: TimelineFilter = 'All Events';
  editingPatientId: string | null = null;
  selectedPatientId: string | null = null;
  showNoteModal = false;
  notePatientId = '';
  noteText = '';

  directoryFilters: DirectoryFilters = {
    search: '',
    enrollmentStatus: 'All',
    territory: 'All',
    physician: 'All',
    product: 'All',
    startDate: '',
    endDate: ''
  };

  enrollmentFilters: EnrollmentFilters = {
    status: 'All',
    physician: 'All',
    territory: 'All',
    salesRep: 'All',
    startDate: '',
    endDate: ''
  };

  directoryStatusFilter = 'All';
  pendingStatusFilter   = 'All';

  applyDirectoryFilter(): void {
    this.directoryStatusFilter = this.pendingStatusFilter;
  }

  readonly patientRows: PatientRow[] = [
    { hub: 'IB Care', status: 'Completed', patientId: 'P-67027383', referralReceivedDate: '4/7/2026',   dateRxReadyToSchedule: '4/13/2026', payerInformation: 'MEDICARE NEW YORK (NY)',     prescriber: 'CHRISTOPHER MICHAEL PIECZONKA', siteName: 'ASSOCIATED MEDICAL PROFESSIONALS OF NY, PLLC', city: '(Blank)', state: 'NY', zip: '13210', qtyOrdered: '(Blank)', abd: 'Keith DeRuiter', businessManager: 'Timothy Kittell'  },
    { hub: 'IB Care', status: 'Completed', patientId: 'P-67027383', referralReceivedDate: '4/14/2026',  dateRxReadyToSchedule: '4/14/2026', payerInformation: 'MEDICARE NEW YORK (NY)',     prescriber: 'CHRISTOPHER MICHAEL PIECZONKA', siteName: 'ASSOCIATED MEDICAL PROFESSIONALS OF NY, PLLC', city: '(Blank)', state: 'NY', zip: '13210', qtyOrdered: '(Blank)', abd: 'Keith DeRuiter', businessManager: 'Timothy Kittell'  },
    { hub: 'IB Care', status: 'Completed', patientId: 'P-65914172', referralReceivedDate: '4/21/2025',  dateRxReadyToSchedule: '4/21/2025', payerInformation: 'HUMANA',                    prescriber: 'CARRIE ALINE STEWART',          siteName: 'CHRISTUS SAINT VINCENT UROLOGY ASSOCIATES',           city: '(Blank)', state: 'NM', zip: '87505', qtyOrdered: '(Blank)', abd: 'OPEN',           businessManager: 'Kristen Cook'    },
    { hub: 'IB Care', status: 'Cancelled', patientId: 'P-65914172', referralReceivedDate: '4/14/2026',  dateRxReadyToSchedule: '4/17/2026', payerInformation: '[No Details Available]',    prescriber: 'CARRIE ALINE STEWART',          siteName: 'CHRISTUS SAINT VINCENT UROLOGY ASSOCIATES',           city: '(Blank)', state: 'NM', zip: '87505', qtyOrdered: '(Blank)', abd: 'OPEN',           businessManager: 'Kristen Cook'    },
    { hub: 'IB Care', status: 'Completed', patientId: 'P-69579963', referralReceivedDate: '4/13/2026',  dateRxReadyToSchedule: '4/13/2026', payerInformation: 'AETNA INC',                 prescriber: 'LAURA BUKAVINA',                siteName: 'CLEVELAND CLINIC MAIN CAMPUS UROLOGY',                city: '(Blank)', state: 'OH', zip: '44195', qtyOrdered: '(Blank)', abd: 'OPEN',           businessManager: 'Debra Henderson' },
    { hub: 'Accredo', status: 'Completed', patientId: 'P-69579033', referralReceivedDate: '4/13/2026',  dateRxReadyToSchedule: '4/15/2026', payerInformation: 'HUMANA',                    prescriber: 'LAURA BUKAVINA',                siteName: 'CLEVELAND CLINIC MAIN CAMPUS UROLOGY',                city: '(Blank)', state: 'OH', zip: '44195', qtyOrdered: '(Blank)', abd: 'OPEN',           businessManager: 'Debra Henderson' },
    { hub: 'IB Care', status: 'Completed', patientId: 'P-69574358', referralReceivedDate: '4/13/2026',  dateRxReadyToSchedule: '4/13/2026', payerInformation: 'HUMANA',                    prescriber: 'BRYANT EMORY POOLE',            siteName: 'UROLOGY CENTERS OF ALABAMA',                          city: '(Blank)', state: 'AL', zip: '35209', qtyOrdered: '(Blank)', abd: 'Chuck Gaetano',  businessManager: 'OPEN'            },
    { hub: 'IB Care', status: 'Completed', patientId: 'P-67744371', referralReceivedDate: '10/10/2025', dateRxReadyToSchedule: '10/13/2025',payerInformation: 'MEDICARE NEW JERSEY (NJ)',  prescriber: 'SANDIP M PRASAD',              siteName: 'GARDEN STATE UROLOGY',                                city: '(Blank)', state: 'NJ', zip: '7960',  qtyOrdered: '(Blank)', abd: '(Blank)',         businessManager: '(Blank)'         },
    { hub: 'Accredo', status: 'Completed', patientId: 'P-67744371', referralReceivedDate: '4/13/2026',  dateRxReadyToSchedule: '4/13/2026', payerInformation: 'MEDICARE NEW JERSEY (NJ)',  prescriber: 'SANDIP M PRASAD',              siteName: 'GARDEN STATE UROLOGY',                                city: '(Blank)', state: 'NJ', zip: '7960',  qtyOrdered: '(Blank)', abd: '(Blank)',         businessManager: '(Blank)'         }
  ];

  // ── Patient row edit modal ──────────────────────────────
  editingPatientRow: PatientRow | null = null;
  editRowForm: Partial<PatientRow> = {};

  openEditRow(row: PatientRow): void {
    this.editingPatientRow = row;
    this.editRowForm = { ...row };
  }
  closeEditRow(): void { this.editingPatientRow = null; this.editRowForm = {}; }
  saveEditRow(): void {
    if (!this.editingPatientRow) return;
    Object.assign(this.editingPatientRow, this.editRowForm);
    this.closeEditRow();
  }

  // ── Patient row details modal ────────────────────────────
  detailsPatientRow: PatientRow | null = null;
  openDetailsRow(row: PatientRow): void  { this.detailsPatientRow = row; }
  closeDetailsRow(): void                { this.detailsPatientRow = null; }

  displayVal(val: string): string {
    return (!val || val === '(Blank)') ? '—' : val;
  }

  get filteredPatientRows(): PatientRow[] {
    return this.patientRows.filter(r =>
      this.directoryStatusFilter === 'All' || r.status === this.directoryStatusFilter
    );
  }

  patientForm: PatientFormModel = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    patientStatus: 'Active',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    doctor: '',
    product: 'Anktiva 400mcg/0.4mL',
    territory: 'East',
    salesRep: '',
    facility: 'ACCREDO HEALTH GROUP INC.',
    enrollmentDate: new Date().toISOString().split('T')[0],
    enrollmentStatus: 'In Progress',
    notes: ''
  };

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const tab = params['tab'] as PatientTab | undefined;
      this.activeTab = tab ?? 'directory';

      if (params['patientId']) {
        this.selectedPatientId = params['patientId'];
      }

      if (!this.selectedPatientId && this.patients.length > 0) {
        this.selectedPatientId = this.patients[0].id;
      }

      if (this.activeTab === 'add-patient' && !this.editingPatientId) {
        this.resetPatientForm();
      }
    });
  }

  get patients(): PatientRecord[] {
    return this.dataService.getPatients() as PatientRecord[];
  }

  get selectedPatient(): PatientRecord | undefined {
    return this.patients.find((patient) => patient.id === this.selectedPatientId) ?? this.patients[0];
  }

  get territoryOptions(): string[] {
    return ['All', ...new Set(this.dataService.getTerritories().map((territory: any) => territory.name))];
  }

  get physicianOptions(): string[] {
    return ['All', ...new Set(this.patients.map((patient) => patient.doctor).filter(Boolean))];
  }

  get productOptions(): string[] {
    return ['All', ...new Set(this.patients.map((patient) => patient.product).filter(Boolean))];
  }

  get salesRepOptions(): string[] {
    const reps = (this.dataService.getSalesTeam() as any[])
      .filter((member) => member.position !== 'Area Business Director')
      .map((member) => member.name);

    return ['All', ...new Set(reps)];
  }

  get directoryKpis() {
    const rows = this.filteredPatients;
    const activePatients = rows.filter((patient) => this.getPatientStatus(patient) === 'Active').length;
    const inProgressEnrollments = rows.filter((patient) => this.getEnrollmentStatus(patient) === 'In Progress').length;
    const completedEnrollments = rows.filter((patient) => this.getEnrollmentStatus(patient) === 'Completed').length;
    const totalOrders = rows.reduce((sum, patient) => sum + this.getPatientOrders(patient).length, 0);

    return {
      totalPatients: rows.length,
      activePatients,
      inProgressEnrollments,
      completedEnrollments,
      totalOrders
    };
  }

  get filteredPatients(): PatientRecord[] {
    const search = this.directoryFilters.search.trim().toLowerCase();

    return this.patients.filter((patient) => {
      const enrollmentStatus = this.getEnrollmentStatus(patient);
      const territory = this.getTerritory(patient);
      const patientDate = patient.date || patient.enrollmentDate || '';

      return (!search
        || patient.name.toLowerCase().includes(search)
        || patient.id.toLowerCase().includes(search)
        || (patient.phone ?? '').toLowerCase().includes(search)
        || patient.doctor.toLowerCase().includes(search))
        && (this.directoryFilters.enrollmentStatus === 'All' || enrollmentStatus === this.directoryFilters.enrollmentStatus)
        && (this.directoryFilters.territory === 'All' || territory === this.directoryFilters.territory)
        && (this.directoryFilters.physician === 'All' || patient.doctor === this.directoryFilters.physician)
        && (this.directoryFilters.product === 'All' || patient.product === this.directoryFilters.product)
        && (!this.directoryFilters.startDate || patientDate >= this.directoryFilters.startDate)
        && (!this.directoryFilters.endDate || patientDate <= this.directoryFilters.endDate);
    });
  }

  get enrollmentRows() {
    return this.patients
      .filter((patient) => {
        const enrollmentStatus = this.getEnrollmentStatus(patient);
        const territory = this.getTerritory(patient);
        const salesRep = this.getSalesRep(patient);
        const enrollmentDate = patient.enrollmentDate ?? patient.date ?? '';

        return (this.enrollmentFilters.status === 'All' || enrollmentStatus === this.enrollmentFilters.status)
          && (this.enrollmentFilters.physician === 'All' || patient.doctor === this.enrollmentFilters.physician)
          && (this.enrollmentFilters.territory === 'All' || territory === this.enrollmentFilters.territory)
          && (this.enrollmentFilters.salesRep === 'All' || salesRep === this.enrollmentFilters.salesRep)
          && (!this.enrollmentFilters.startDate || enrollmentDate >= this.enrollmentFilters.startDate)
          && (!this.enrollmentFilters.endDate || enrollmentDate <= this.enrollmentFilters.endDate);
      })
      .map((patient) => ({
        enrollmentId: `ENR-${patient.id.replace('PT-', '')}`,
        patient,
        physician: patient.doctor,
        territory: this.getTerritory(patient),
        salesRep: this.getSalesRep(patient),
        enrollmentDate: patient.enrollmentDate ?? patient.date,
        status: this.getEnrollmentStatus(patient),
        pendingSince: this.getPendingSince(patient),
        reason: patient.notes || this.getEnrollmentReason(patient)
      }));
  }

  get enrollmentKpis() {
    return {
      total: this.enrollmentRows.length,
      inProgress: this.enrollmentRows.filter((row) => row.status === 'In Progress').length,
      completed: this.enrollmentRows.filter((row) => row.status === 'Completed').length,
      missingInformation: this.enrollmentRows.filter((row) => row.status === 'Missing Information').length,
      onHold: this.enrollmentRows.filter((row) => row.status === 'On Hold').length,
      cancelled: this.enrollmentRows.filter((row) => row.status === 'Cancelled').length
    };
  }

  get selectedPatientTimeline(): TimelineEvent[] {
    if (!this.selectedPatient) {
      return [];
    }

    return this.getPatientTimeline(this.selectedPatient).filter((event) =>
      this.timelineFilter === 'All Events' || event.category === this.timelineFilter
    );
  }

  get profileSummary() {
    if (!this.selectedPatient) {
      return null;
    }

    const patient = this.selectedPatient;
    const orders = this.getPatientOrders(patient);

    return {
      patient,
      age: this.getPatientAge(patient),
      enrollmentStatus: this.getEnrollmentStatus(patient),
      territory: this.getTerritory(patient),
      salesRep: this.getSalesRep(patient),
      totalOrders: orders.length,
      lastOrderDate: this.getLastOrderDate(patient),
      distributor: patient.facility,
      revenue: orders.reduce((sum, order) => sum + order.total, 0),
      units: orders.reduce((sum, order) => sum + order.units, 0)
    };
  }

  get selectedPatientOrders() {
    return this.selectedPatient ? this.getPatientOrders(this.selectedPatient) : [];
  }

  savePatient() {
    if (this.editingPatientId) {
      const patient = this.patients.find((item) => item.id === this.editingPatientId);
      if (patient) {
        Object.assign(patient, this.mapFormToPatient(patient.id, patient.reportNo, patient.hubAssigned));
      }
    } else {
      const ptId = 'PT-' + Math.floor(10000 + Math.random() * 90000);
      const reportNo = String(53190000 + Math.floor(Math.random() * 9999));
      const hubAssigned = '32' + Math.floor(100000 + Math.random() * 900000);
      this.dataService.addPatient({
        ...this.mapFormToPatient(ptId, reportNo, hubAssigned),
        date: new Date().toISOString().split('T')[0]
      });
      this.selectedPatientId = ptId;
    }

    this.editingPatientId = null;
    this.setTab('directory', this.selectedPatientId ?? this.patients[0]?.id);
  }

  editPatient(patient: PatientRecord): void {
    this.editingPatientId = patient.id;
    this.selectedPatientId = patient.id;
    this.patientForm = this.mapPatientToForm(patient);
    this.setTab('add-patient', patient.id);
  }

  deletePatient(id: string): void {
    this.dataService.deletePatient(id);
    if (this.selectedPatientId === id) {
      this.selectedPatientId = this.patients[0]?.id ?? null;
    }
  }

  openAddNoteModal(patientId?: string): void {
    const fallbackPatientId = patientId ?? this.selectedPatientId ?? this.patients[0]?.id ?? '';
    this.notePatientId = fallbackPatientId;
    this.noteText = '';
    this.showNoteModal = true;
  }

  openPatientProfile(patientId: string, profileTab: ProfileTab = 'overview'): void {
    this.profileTab = profileTab;
    this.setTab('profile', patientId);
  }

  openPatientTimeline(patientId: string): void {
    this.timelineFilter = 'All Events';
    this.setTab('timeline', patientId);
  }

  addOrderForPatient(patientId: string): void {
    this.profileTab = 'orders';
    this.setTab('profile', patientId);
  }

  setTab(tab: PatientTab, patientId?: string): void {
    this.activeTab = tab;
    if (patientId) {
      this.selectedPatientId = patientId;
    }

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        tab,
        patientId: patientId ?? this.selectedPatientId ?? undefined
      },
      queryParamsHandling: 'merge'
    });
  }

  updateEnrollmentStatus(patientId: string, status: EnrollmentStatus): void {
    const patient = this.patients.find((item) => item.id === patientId);
    if (!patient) {
      return;
    }

    patient.enrollmentStatus = status;
    if (status === 'Completed') {
      patient.patientStatus = 'Active';
    } else if (status === 'Cancelled') {
      patient.patientStatus = 'Inactive';
    }
  }

  addEnrollmentNote(patientId: string): void {
    this.openAddNoteModal(patientId);
  }

  closeNoteModal(): void {
    this.showNoteModal = false;
    this.notePatientId = '';
    this.noteText = '';
  }

  saveNote(): void {
    const trimmedNote = this.noteText.trim();
    if (!this.notePatientId || !trimmedNote) {
      return;
    }

    const patient = this.patients.find((item) => item.id === this.notePatientId);
    if (!patient) {
      return;
    }

    patient.notes = patient.notes
      ? `${patient.notes} | ${trimmedNote}`
      : trimmedNote;

    this.selectedPatientId = patient.id;
    this.closeNoteModal();
  }

  getStatusBadgeClass(status: string): string {
    if (status === 'Completed' || status === 'First Dose') {
      return 'ib-status-badge--success';
    }

    if (status === 'In Progress' || status === 'Referral' || status === 'Insurance Auth') {
      return 'ib-status-badge--info';
    }

    if (status === 'On Hold' || status === 'Missing Information') {
      return 'ib-status-badge--warning';
    }

    if (status === 'Cancelled' || status === 'Rejected' || status === 'Inactive') {
      return 'ib-status-badge--danger';
    }

    return 'ib-status-badge--neutral';
  }

  private mapPatientToForm(patient: PatientRecord): PatientFormModel {
    const [firstName = '', ...rest] = patient.name.split(' ');

    return {
      firstName,
      lastName: rest.join(' '),
      dateOfBirth: patient.dateOfBirth ?? '',
      gender: patient.gender ?? 'Male',
      patientStatus: this.getPatientStatus(patient),
      phone: patient.phone ?? '',
      email: patient.email ?? '',
      address: patient.address ?? patient.physicianAddress ?? '',
      city: patient.city ?? patient.physicianCity ?? '',
      state: patient.state ?? patient.physicianState ?? '',
      zip: patient.zip ?? patient.physicianZip ?? '',
      doctor: patient.doctor,
      product: patient.product,
      territory: this.getTerritory(patient),
      salesRep: this.getSalesRep(patient),
      facility: patient.facility,
      enrollmentDate: patient.enrollmentDate ?? patient.date ?? new Date().toISOString().split('T')[0],
      enrollmentStatus: this.getEnrollmentStatus(patient),
      notes: patient.notes ?? ''
    };
  }

  private mapFormToPatient(id: string, reportNo: string, hubAssigned: string): PatientRecord {
    return {
      id,
      reportNo,
      hubAssigned,
      name: `${this.patientForm.firstName} ${this.patientForm.lastName}`.trim(),
      dateOfDx: this.patientForm.enrollmentDate,
      doctor: this.patientForm.doctor,
      physicianAddress: this.patientForm.address,
      physicianCity: this.patientForm.city,
      physicianState: this.patientForm.state,
      physicianZip: this.patientForm.zip,
      facility: this.patientForm.facility,
      product: this.patientForm.product,
      ndc: '61640103001',
      shipDate: '',
      qty: 0,
      status: this.patientForm.enrollmentStatus,
      date: this.patientForm.enrollmentDate,
      dateOfBirth: this.patientForm.dateOfBirth,
      gender: this.patientForm.gender,
      patientStatus: this.patientForm.patientStatus,
      phone: this.patientForm.phone,
      email: this.patientForm.email,
      address: this.patientForm.address,
      city: this.patientForm.city,
      state: this.patientForm.state,
      zip: this.patientForm.zip,
      territory: this.patientForm.territory,
      salesRep: this.patientForm.salesRep,
      enrollmentStatus: this.patientForm.enrollmentStatus,
      enrollmentDate: this.patientForm.enrollmentDate,
      notes: this.patientForm.notes
    };
  }

  private resetPatientForm(): void {
    this.patientForm = {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'Male',
      patientStatus: 'Active',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      doctor: '',
      product: 'Anktiva 400mcg/0.4mL',
      territory: 'East',
      salesRep: 'Lisa Volomino',
      facility: 'ACCREDO HEALTH GROUP INC.',
      enrollmentDate: new Date().toISOString().split('T')[0],
      enrollmentStatus: 'In Progress',
      notes: ''
    };
  }

  private getPatientAge(patient: PatientRecord): number | string {
    if (!patient.dateOfBirth) {
      return '--';
    }

    const birthDate = new Date(patient.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  private getPatientStatus(patient: PatientRecord): PatientStatus {
    return patient.patientStatus ?? (patient.status === 'Cancelled' || patient.status === 'Rejected' ? 'Inactive' : 'Active');
  }

  private getEnrollmentStatus(patient: PatientRecord): EnrollmentStatus {
    if (patient.enrollmentStatus) {
      return patient.enrollmentStatus;
    }

    if (patient.status === 'First Dose') {
      return 'Completed';
    }

    if (patient.status === 'Insurance Auth') {
      return 'In Progress';
    }

    if (patient.status === 'Rejected') {
      return 'Cancelled';
    }

    return 'In Progress';
  }

  private getTerritory(patient: PatientRecord): string {
    if (patient.territory) {
      return patient.territory;
    }

    const territoryMap: Record<string, string> = {
      NY: 'East',
      MD: 'East',
      PA: 'East',
      TX: 'South Central',
      TN: 'North Central',
      OH: 'North Central',
      CA: 'Southwest'
    };

    return territoryMap[patient.physicianState] ?? 'East';
  }

  private getSalesRep(patient: PatientRecord): string {
    if (patient.salesRep) {
      return patient.salesRep;
    }

    const territory = this.getTerritory(patient);
    const team = this.dataService.getSalesTeam() as any[];
    return team.find((member) => member.area === territory && member.position !== 'Area Business Director')?.name ?? 'Unassigned';
  }

  private getPatientOrders(patient: PatientRecord): any[] {
    const lastName = patient.name.split(' ').slice(-1)[0]?.toLowerCase() ?? '';
    const territory = this.getTerritory(patient).toLowerCase().split(' ')[0];

    return this.dataService.getRecentOrders().filter((order: any) =>
      order.facility.toLowerCase().includes(lastName)
      || order.facility.toLowerCase().includes(territory)
      || order.impTypeName.toLowerCase().includes('physician')
    ).slice(0, 3);
  }

  private getLastOrderDate(patient: PatientRecord): string {
    return patient.shipDate || this.getPatientOrders(patient)[0]?.date || '-';
  }

  private getPendingSince(patient: PatientRecord): string {
    const startDate = new Date(patient.enrollmentDate ?? patient.date);
    const today = new Date('2026-04-28');
    const diff = Math.max(0, Math.round((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    return `${diff} days`;
  }

  getEnrollmentStatusDetail(patient: PatientRecord): string {
    const status = this.getEnrollmentStatus(patient);

    if (status === 'In Progress') {
      return 'Under review';
    }

    if (status === 'Missing Information') {
      return 'Information requested';
    }

    if (status === 'On Hold') {
      return 'Paused for follow-up';
    }

    if (status === 'Cancelled') {
      return 'Closed';
    }

    return 'Completed';
  }

  private getEnrollmentReason(patient: PatientRecord): string {
    const status = this.getEnrollmentStatus(patient);

    if (status === 'Missing Information') {
      return 'Additional documentation is required to continue processing';
    }

    if (status === 'On Hold') {
      return 'Waiting for payer documentation';
    }

    if (status === 'Cancelled') {
      return 'Enrollment was cancelled and closed';
    }

    if (status === 'Completed') {
      return 'Ready for fulfillment and first shipment';
    }

    return 'Enrollment is currently in review';
  }

  private getPatientTimeline(patient: PatientRecord): TimelineEvent[] {
    const events: TimelineEvent[] = [
      {
        id: `${patient.id}-created`,
        patientId: patient.id,
        title: 'Patient Created',
        category: 'Enrollment',
        description: `Patient record created for ${patient.name}.`,
        date: patient.date
      },
      {
        id: `${patient.id}-submitted`,
        patientId: patient.id,
        title: 'Enrollment Submitted',
        category: 'Enrollment',
        description: `Enrollment submitted to ${patient.facility}.`,
        date: patient.enrollmentDate ?? patient.date
      },
      {
        id: `${patient.id}-status`,
        patientId: patient.id,
        title: `Status Changed to ${this.getEnrollmentStatus(patient)}`,
        category: 'Enrollment',
        description: this.getEnrollmentReason(patient),
        date: patient.shipDate || patient.date
      }
    ];

    if (patient.shipDate) {
      events.push(
        {
          id: `${patient.id}-shipped`,
          patientId: patient.id,
          title: 'Order Shipped',
          category: 'Shipments',
          description: `Shipment released from ${patient.facility}.`,
          date: patient.shipDate
        },
        {
          id: `${patient.id}-delivered`,
          patientId: patient.id,
          title: 'Order Delivered',
          category: 'Orders',
          description: 'Order delivery confirmed.',
          date: patient.shipDate
        }
      );
    }

    if (patient.notes) {
      events.push({
        id: `${patient.id}-notes`,
        patientId: patient.id,
        title: 'Notes Added',
        category: 'Notes',
        description: patient.notes,
        date: patient.enrollmentDate ?? patient.date
      });
    }

    return events.sort((a, b) => b.date.localeCompare(a.date));
  }
}
