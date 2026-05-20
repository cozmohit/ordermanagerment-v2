import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private kpis = {
    daily_revenue: 823400,
    weekly_units: 63,
    ytd_revenue: 64404200,
    total_enrollments: 289
  };

  private territories = [
    { id: 'EA1', name: 'East', director: 'Keith DeRuiter', revenue: 49726200, product: 'Anktiva 400mcg/0.4mL' },
    { id: 'NC1', name: 'North Central', director: 'Chuck Gaetano', revenue: 12207800, product: 'Anktiva 400mcg/0.4mL' },
    { id: 'SC1', name: 'South Central', director: 'CJ K.', revenue: 8500000, product: 'Anktiva 400mcg/0.4mL' },
    { id: 'SW1', name: 'Southwest', director: 'Alexandra Maddalozzo', revenue: 7200000, product: 'Anktiva 400mcg/0.4mL' }
  ];

  // Image 4 / Image 5: Direct Model Transaction - ICS Orders & Accredo Orders
  private recentOrders: any[] = [
    {
      id: 'ORD-100201',
      orderNo: '7602192221',
      licenseNo: '505324740',
      impType: 'F1',
      impTypeName: 'Physician',
      facility: 'GOLDFISH68 50 EASTVALE AVE',
      salesOrderTypeCode: '7036 8803-01',
      salesOrderTypeDesc: 'EDS Sales Order',
      itemCode: '7036 8803-01',
      product: 'Anktiva400 mg/0.4 mL',
      deliveryQty: 1,
      units: 1,
      total: 35800.00,
      unitPrice: 35800,
      invoiceNo: '10836192',
      invoiceDate: '04/16/2026',
      poNumber: '1014975384',
      status: 'Shipped',
      date: '2026-04-16'
    },
    {
      id: 'ORD-100202',
      orderNo: '7602192341',
      licenseNo: '505324740',
      impType: 'H1',
      impTypeName: 'Hospital - Inpatient',
      facility: 'Memorial Oncology Center',
      salesOrderTypeCode: '7036 8803-01',
      salesOrderTypeDesc: 'EDS Sales Order',
      itemCode: '7036 8803-01',
      product: 'Anktiva400 mg/0.4 mL',
      deliveryQty: 2,
      units: 2,
      total: 71600.00,
      unitPrice: 35800,
      invoiceNo: '10836251',
      invoiceDate: '04/17/2026',
      poNumber: '1015076201',
      status: 'Shipped',
      date: '2026-04-17'
    },
    {
      id: 'ORD-100205',
      orderNo: '7602193810',
      licenseNo: '75240',
      impType: 'F1',
      impTypeName: 'Physician',
      facility: 'City Health Clinics',
      salesOrderTypeCode: '7036 8803-01',
      salesOrderTypeDesc: 'EDS Sales Order',
      itemCode: '7036 8803-01',
      product: 'Anktiva400 mg/0.4 mL',
      deliveryQty: 1,
      units: 1,
      total: 35800.00,
      unitPrice: 35800,
      invoiceNo: '10836450',
      invoiceDate: '04/19/2026',
      poNumber: '',
      status: 'Pending',
      date: '2026-04-22'
    },
    {
      id: 'ORD-100210',
      orderNo: '7602194022',
      licenseNo: '13401',
      impType: 'Tcc',
      impTypeName: 'Clinics and Physicians Offices',
      facility: 'ADVANCED UROLOGY SOUTH',
      salesOrderTypeCode: '7036 8803-01',
      salesOrderTypeDesc: 'EDS Sales Order',
      itemCode: '7036 8803-01',
      product: 'Anktiva400 mg/0.4 mL',
      deliveryQty: 1,
      units: 1,
      total: 35800.00,
      unitPrice: 35800,
      invoiceNo: '',
      invoiceDate: '',
      poNumber: 'MF4P1FBQKISWB9494',
      status: 'Credit Hold',
      date: '2026-04-22'
    }
  ];

  // Image 3: Patient Enrollment Report
  private patients: any[] = [
    {
      id: 'PT-89201',
      reportNo: '53192026',
      hubAssigned: '32750468',
      name: 'John Doe',
      dateOfDx: '2026-02-10',
      doctor: 'GOLDFISH68 EVAN R',
      physicianAddress: '50 EASTVALE AVE',
      physicianCity: 'POUGHKEEPSIE',
      physicianState: 'NY',
      physicianZip: '12601',
      facility: 'ACCREDO HEALTH GROUP INC.',
      product: 'Anktiva 400mcg/0.4mL',
      ndc: '61640103001',
      shipDate: '2026-04-16',
      qty: 1,
      status: 'Referral',
      date: '2026-04-23'
    },
    {
      id: 'PT-89202',
      reportNo: '53192084',
      hubAssigned: '32750502',
      name: 'Jane Smith',
      dateOfDx: '2026-01-22',
      doctor: 'WINSTON S',
      physicianAddress: '3417 GASTON AVE',
      physicianCity: 'DALLAS',
      physicianState: 'TX',
      physicianZip: '75240',
      facility: 'City Oncology',
      product: 'Anktiva 400mcg/0.4mL',
      ndc: '61640103001',
      shipDate: '',
      qty: 1,
      status: 'Referral',
      date: '2026-04-24'
    },
    {
      id: 'PT-89190',
      reportNo: '53191920',
      hubAssigned: '32750389',
      name: 'Alice Johnson',
      dateOfDx: '2025-12-05',
      doctor: 'KEVIN S',
      physicianAddress: '50 EASTVALE VILLAGE',
      physicianCity: 'POUGHKEEPSIE',
      physicianState: 'NY',
      physicianZip: '12603',
      facility: 'ACCREDO HEALTH GROUP INC.',
      product: 'Anktiva 400mcg/0.4mL',
      ndc: '61640103001',
      shipDate: '2026-04-10',
      qty: 1,
      status: 'Insurance Auth',
      date: '2026-04-20'
    },
    {
      id: 'PT-89155',
      reportNo: '53191550',
      hubAssigned: '32750212',
      name: 'Bob Williams',
      dateOfDx: '2025-10-15',
      doctor: 'JAYARAMAN KRISHNA',
      physicianAddress: '28227 THREE NOTCH RD',
      physicianCity: 'MECHANICSVILLE',
      physicianState: 'MD',
      physicianZip: '20659',
      facility: 'ACCREDO HEALTH GROUP INC.',
      product: 'Anktiva 400mcg/0.4mL',
      ndc: '61640103001',
      shipDate: '2026-04-01',
      qty: 2,
      status: 'First Dose',
      date: '2026-04-10'
    }
  ];

  // Image 3: Physician Management
  private physicians: any[] = [
    { npi: '1346245881', firstName: 'KRISHNA', lastName: 'JAYARAMAN', address: '28227 THREE NOTCH RD', city: 'MECHANICSVILLE', state: 'MD', zip: '20659', product: 'Anktiva 400mcg/0.4mL', pharmacy: 'ACCREDO HEALTH GROUP INC.', pharmacyId: '61640101357' },
    { npi: '1730152186', firstName: 'CHRISTOPHER', lastName: 'ANDERSON', address: '161 FT WASHINGTON AVE', city: 'NEW YORK', state: 'NY', zip: '10032', product: 'Anktiva 400mcg/0.4mL', pharmacy: 'ACCREDO HEALTH GROUP INC.', pharmacyId: '61640101357' },
    { npi: '1205853210', firstName: 'SANDIP', lastName: 'PRASAD', address: '261 JAMES ST', city: 'MORRISTOWN', state: 'NJ', zip: '07960', product: 'Anktiva 400mcg/0.4mL', pharmacy: 'ACCREDO HEALTH GROUP INC.', pharmacyId: '61640101357' },
    { npi: '1790834455', firstName: 'EVAN', lastName: 'GOLDFISH68 R', address: '50 EASTVALE AVE', city: 'POUGHKEEPSIE', state: 'NY', zip: '12601', product: 'Anktiva 400mcg/0.4mL', pharmacy: 'ACCREDO HEALTH GROUP INC.', pharmacyId: '61640101357' },
    { npi: '1104834721', firstName: 'S', lastName: 'WINSTON', address: '3417 GASTON AVE', city: 'DALLAS', state: 'TX', zip: '75240', product: 'Anktiva 400mcg/0.4mL', pharmacy: 'ACCREDO HEALTH GROUP INC.', pharmacyId: '61640101357' },
    { npi: '1558472901', firstName: 'NANCY', lastName: 'MCCARTHY', address: '244 PAOCLE ROAD', city: 'ELLAND', state: 'NC', zip: '28452', product: 'Anktiva 400mcg/0.4mL', pharmacy: 'ACCREDO HEALTH GROUP INC.', pharmacyId: '61640101357' }
  ];

  // Image 6: Sales Team
  private salesTeam: any[] = [
    { name: 'Keith DeRuiter', position: 'Area Business Director', areaId: 'A01A00', area: 'East', product: 'Anktiva 400mcg/0.4mL', allTeamMark: 'Y', glbNcl: 'Y', leadershipTeam: 'Y', ariTeam: 'N' },
    { name: 'Lisa Volomino', position: 'Boston, MA', areaId: 'EA101', area: 'East', product: 'Anktiva 400mcg/0.4mL', allTeamMark: 'Y', glbNcl: 'N', leadershipTeam: 'N', ariTeam: 'N' },
    { name: 'Karen Martinez', position: 'New York, NY', areaId: 'EA102', area: 'East', product: 'Anktiva 400mcg/0.4mL', allTeamMark: 'Y', glbNcl: 'N', leadershipTeam: 'N', ariTeam: 'N' },
    { name: 'Timothy Kibel', position: 'Syracuse, NY', areaId: 'EA103', area: 'East', product: 'Anktiva 400mcg/0.4mL', allTeamMark: 'Y', glbNcl: 'N', leadershipTeam: 'N', ariTeam: 'N' },
    { name: 'Brian Girbes', position: 'Philadelphia, PA', areaId: 'EA104', area: 'East', product: 'Anktiva 400mcg/0.4mL', allTeamMark: 'Y', glbNcl: 'N', leadershipTeam: 'N', ariTeam: 'N' },
    { name: 'Linda Phillips', position: 'Pittsburgh, PA', areaId: 'EA105', area: 'East', product: 'Anktiva 400mcg/0.4mL', allTeamMark: 'Y', glbNcl: 'N', leadershipTeam: 'N', ariTeam: 'N' },
    { name: 'Catherine Urch', position: 'Baltimore, MD', areaId: 'EA106', area: 'East', product: 'Anktiva 400mcg/0.4mL', allTeamMark: 'Y', glbNcl: 'N', leadershipTeam: 'N', ariTeam: 'N' },
    { name: 'Heather Ritter', position: 'Richmond, VA', areaId: 'EA107', area: 'East', product: 'Anktiva 400mcg/0.4mL', allTeamMark: 'Y', glbNcl: 'N', leadershipTeam: 'N', ariTeam: 'N' },
    { name: 'Chuck Gaetano', position: 'Area Business Director', areaId: 'A01C00', area: 'North Central', product: 'Anktiva 400mcg/0.4mL', allTeamMark: 'Y', glbNcl: 'Y', leadershipTeam: 'Y', ariTeam: 'N' },
    { name: 'Amanda Rippy', position: 'Nashville, TN', areaId: 'NC301', area: 'North Central', product: 'Anktiva 400mcg/0.4mL', allTeamMark: 'Y', glbNcl: 'N', leadershipTeam: 'N', ariTeam: 'N' },
    { name: 'Debra Henderson', position: 'Columbus, OH', areaId: 'NC302', area: 'North Central', product: 'Anktiva 400mcg/0.4mL', allTeamMark: 'Y', glbNcl: 'N', leadershipTeam: 'N', ariTeam: 'N' },
    { name: 'Dylan Mazelton', position: 'Detroit, MI', areaId: 'NC303', area: 'North Central', product: 'Anktiva 400mcg/0.4mL', allTeamMark: 'Y', glbNcl: 'N', leadershipTeam: 'N', ariTeam: 'N' },
    { name: 'Chris Moffitt', position: 'Indianapolis, IN', areaId: 'NC304', area: 'North Central', product: 'Anktiva 400mcg/0.4mL', allTeamMark: 'Y', glbNcl: 'N', leadershipTeam: 'N', ariTeam: 'N' },
    { name: 'Alexandra Maddalozzo', position: 'Area Business Director', areaId: 'SW401', area: 'Southwest', product: 'Anktiva 400mcg/0.4mL', allTeamMark: 'Y', glbNcl: 'Y', leadershipTeam: 'Y', ariTeam: 'N' },
    { name: 'Kristina Denor-Alcala', position: 'San Diego, CA', areaId: 'SW402', area: 'Southwest', product: 'Anktiva 400mcg/0.4mL', allTeamMark: 'Y', glbNcl: 'N', leadershipTeam: 'N', ariTeam: 'N' }
  ];

  // Image 2: Daily Sales Report - ICS & Accredo
  private dailySales: any[] = [
    { id: 'SLS-101', date: '2026-04-20', product: 'Anktiva 400mcg/0.4mL', region: 'East', repName: 'Keith DeRuiter', icsUnits: 5, accredoUnits: 2, units: 7, icsSales: 179000, accredoSales: 71600, revenue: 250600 },
    { id: 'SLS-102', date: '2026-04-21', product: 'Anktiva 400mcg/0.4mL', region: 'North Central', repName: 'Chuck Gaetano', icsUnits: 3, accredoUnits: 1, units: 4, icsSales: 107400, accredoSales: 35800, revenue: 143200 },
    { id: 'SLS-103', date: '2026-04-22', product: 'Anktiva 400mcg/0.4mL', region: 'East', repName: 'Lisa Volomino', icsUnits: 8, accredoUnits: 0, units: 8, icsSales: 286400, accredoSales: 0, revenue: 286400 },
    { id: 'SLS-104', date: '2026-04-23', product: 'Anktiva 400mcg/0.4mL', region: 'Southwest', repName: 'Alexandra Maddalozzo', icsUnits: 2, accredoUnits: 3, units: 5, icsSales: 71600, accredoSales: 107400, revenue: 179000 }
  ];

  private salesTargets: any[] = [
    { name: 'Keith DeRuiter', territory: 'East', q1Target: 75, q1Achieved: 69, q2Target: 80, q2Achieved: 26, ytdTarget: 310, ytdAchieved: 95 },
    { name: 'Lisa Volomino', territory: 'East', q1Target: 50, q1Achieved: 61, q2Target: 55, q2Achieved: 8, ytdTarget: 210, ytdAchieved: 69 },
    { name: 'Chuck Gaetano', territory: 'North Central', q1Target: 80, q1Achieved: 60, q2Target: 85, q2Achieved: 12, ytdTarget: 330, ytdAchieved: 72 },
    { name: 'Amanda Rippy', territory: 'North Central', q1Target: 65, q1Achieved: 40, q2Target: 70, q2Achieved: 5, ytdTarget: 270, ytdAchieved: 45 },
    { name: 'Alexandra Maddalozzo', territory: 'Southwest', q1Target: 60, q1Achieved: 42, q2Target: 65, q2Achieved: 9, ytdTarget: 250, ytdAchieved: 51 }
  ];

  constructor() { }

  getKpis() { return this.kpis; }

  getTerritories() { return this.territories; }
  addTerritory(t: any) { this.territories.push(t); }
  updateTerritory(id: string, t: any) { const i = this.territories.findIndex(x => x.id === id); if (i > -1) this.territories[i] = t; }
  deleteTerritory(id: string) { this.territories = this.territories.filter(t => t.id !== id); }

  getRecentOrders() { return this.recentOrders; }
  deleteOrder(id: string) { this.recentOrders = this.recentOrders.filter(o => o.id !== id); }

  getDailySales() { return this.dailySales; }
  addDailySale(sale: any) { this.dailySales.unshift(sale); }
  deleteDailySale(id: string) { this.dailySales = this.dailySales.filter(s => s.id !== id); }

  getSalesTargets() { return this.salesTargets; }

  getPatients() { return this.patients; }
  addPatient(patient: any) { this.patients.push(patient); }
  deletePatient(id: string) { this.patients = this.patients.filter(p => p.id !== id); }

  getPhysicians() { return this.physicians; }
  addPhysician(physician: any) { this.physicians.unshift(physician); }
  deletePhysician(npi: string) { this.physicians = this.physicians.filter(p => p.npi !== npi); }

  getSalesTeam() { return this.salesTeam; }
  addTeamMember(member: any) { this.salesTeam.unshift(member); }
  deleteTeamMember(name: string) { this.salesTeam = this.salesTeam.filter(s => s.name !== name); }
}
