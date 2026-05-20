import { Component, ElementRef, OnDestroy, ViewChild, inject, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as echarts from 'echarts';

type TerritoryTab = 'territories' | 'assignment' | 'performance';

interface TerritoryRecord {
  id: string;
  name: string;
  director: string;
  revenue: number;
  product: string;
  status?: 'Active' | 'Inactive';
}

interface SalesRepRecord {
  name: string;
  position: string;
  areaId: string;
  area: string;
  product: string;
  allTeamMark: string;
  glbNcl: string;
  leadershipTeam: string;
  ariTeam: string;
}

interface TerritoryFilters {
  search: string;
  director: string;
  product: string;
  status: string;
}

@Component({
  selector: 'app-territory-manager',
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './territory-manager.component.html',
  styleUrl: './territory-manager.component.scss'
})
export class TerritoryManagerComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);
  private performanceChart?: echarts.ECharts;
  private territoryPerformanceChartEl?: ElementRef<HTMLDivElement>;
  private readonly handleWindowResize = () => this.refreshPerformanceChart();

  @ViewChild('territoryPerformanceChart')
  set territoryPerformanceChartRef(ref: ElementRef<HTMLDivElement> | undefined) {
    this.territoryPerformanceChartEl = ref;

    if (ref && this.activeTab === 'performance') {
      this.refreshPerformanceChart();
    }
  }

  activeTab: TerritoryTab = 'territories';
  showForm = false;
  editingTerritoryId: string | null = null;
  showAssignmentModal = false;
  showHistoryModal = false;
  selectedAssignment: { territoryId: string; territoryName: string; currentRep: string } | null = null;
  assignmentHistoryTerritory: string | null = null;

  territoryFilters: TerritoryFilters = {
    search: '',
    director: 'All',
    product: 'All',
    status: 'All'
  };

  performanceFilters = {
    director: 'All',
    product: 'All',
    period: 'ytd'
  };

  ngOnInit() {
    window.addEventListener('resize', this.handleWindowResize);

    this.route.queryParams.subscribe(params => {
      const previousTab = this.activeTab;

      if (params['tab']) {
        this.activeTab = params['tab'] as TerritoryTab;
      } else {
        this.activeTab = 'territories';
      }

      if (previousTab === 'performance' && this.activeTab !== 'performance') {
        this.disposePerformanceChart();
      }

      if (this.activeTab === 'performance') {
        this.refreshPerformanceChart();
      }
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleWindowResize);
    this.disposePerformanceChart();
  }

  newTerritory: TerritoryRecord = {
    id: '',
    name: '',
    director: '',
    revenue: 0,
    product: 'Anktiva 400mcg/0.4mL',
    status: 'Active'
  };

  assignmentForm = {
    territoryId: '',
    repName: ''
  };

  get territories(): TerritoryRecord[] {
    return this.dataService.getTerritories();
  }

  get salesTeam(): SalesRepRecord[] {
    return this.dataService.getSalesTeam();
  }

  getRepsByTerritory(territoryName: string): SalesRepRecord[] {
    return this.salesTeam.filter((member) => member.area === territoryName && member.position !== 'Area Business Director');
  }

  get filteredTerritories(): TerritoryRecord[] {
    const query = this.territoryFilters.search.trim().toLowerCase();

    return [...this.territories].filter((territory) => {
      const status = territory.status ?? 'Active';
      return (!query
        || territory.id.toLowerCase().includes(query)
        || territory.name.toLowerCase().includes(query)
        || territory.director.toLowerCase().includes(query))
        && (this.territoryFilters.director === 'All' || territory.director === this.territoryFilters.director)
        && (this.territoryFilters.product === 'All' || territory.product === this.territoryFilters.product)
        && (this.territoryFilters.status === 'All' || status === this.territoryFilters.status);
    });
  }

  get directorOptions(): string[] {
    return ['All', ...new Set(this.territories.map((territory) => territory.director))];
  }

  get productOptions(): string[] {
    return ['All', ...new Set(this.territories.map((territory) => territory.product))];
  }

  get territoryKpis() {
    const territories = this.filteredTerritories;
    const activeCount = territories.filter((territory) => (territory.status ?? 'Active') === 'Active').length;
    const unassignedCount = territories.filter((territory) => !this.getAssignedRep(territory)).length;

    return {
      totalTerritories: territories.length,
      activeTerritories: activeCount,
      inactiveTerritories: territories.length - activeCount,
      unassignedTerritories: unassignedCount,
      coveredPatients: this.dataService.getPatients().length,
      coveredPhysicians: this.dataService.getPhysicians().length
    };
  }

  get assignmentRows() {
    return this.territories.map((territory) => {
      const rep = this.getAssignedRep(territory);
      return {
        territoryId: territory.id,
        territoryName: territory.name,
        region: territory.name,
        director: territory.director,
        status: territory.status ?? 'Active',
        repName: rep?.name ?? 'Unassigned',
        repPosition: rep?.position ?? 'No rep assigned',
        assignedDate: rep ? 'Apr 2026' : 'Pending',
        hasConflict: !rep || (territory.status ?? 'Active') === 'Inactive'
      };
    });
  }

  get assignmentSummary() {
    const reps = this.salesTeam.filter((rep) => rep.position !== 'Area Business Director');
    const assignedTerritories = this.assignmentRows.filter((row) => row.repName !== 'Unassigned').length;
    const assignedRepNames = new Set(this.assignmentRows.filter((row) => row.repName !== 'Unassigned').map((row) => row.repName));

    return {
      totalReps: reps.length,
      assignedReps: assignedRepNames.size,
      unassignedReps: reps.length - assignedRepNames.size,
      territoriesWithoutRep: this.assignmentRows.filter((row) => row.repName === 'Unassigned').length,
      repLoadDistribution: assignedRepNames.size === 0 ? '0 territories / rep' : `${(assignedTerritories / assignedRepNames.size).toFixed(1)} territories / rep`
    };
  }

  get assignmentAlerts(): string[] {
    const alerts: string[] = [];
    const duplicateRepMap = new Map<string, number>();

    for (const row of this.assignmentRows) {
      if (row.repName !== 'Unassigned') {
        duplicateRepMap.set(row.repName, (duplicateRepMap.get(row.repName) ?? 0) + 1);
      }

      if (row.repName === 'Unassigned') {
        alerts.push(`${row.territoryName} does not have an assigned rep.`);
      }

      if (row.status === 'Inactive' && row.repName !== 'Unassigned') {
        alerts.push(`${row.territoryName} is inactive but still assigned to ${row.repName}.`);
      }
    }

    for (const [repName, count] of duplicateRepMap.entries()) {
      if (count > 1) {
        alerts.push(`${repName} is mapped to multiple territories in a one-to-one model.`);
      }
    }

    return alerts;
  }

  get performanceRows() {
    const territories = this.territories.filter((territory) => {
      return (this.performanceFilters.director === 'All' || territory.director === this.performanceFilters.director)
        && (this.performanceFilters.product === 'All' || territory.product === this.performanceFilters.product);
    });

    return territories.map((territory) => {
      const relatedOrders = this.dataService.getRecentOrders().filter((order) =>
        order.facility.toLowerCase().includes(territory.name.toLowerCase().split(' ')[0])
        || order.impTypeName.toLowerCase().includes(territory.name.toLowerCase().split(' ')[0])
      );
      const relatedSales = this.dataService.getDailySales().filter((sale) => sale.region === territory.name);
      const relatedPatients = this.dataService.getPatients().filter((patient) => patient.physicianState === this.getTerritoryStateHint(territory.name));

      const units = relatedSales.reduce((sum, sale) => sum + sale.units, 0);
      const orders = relatedOrders.length;
      const enrollments = relatedPatients.length;
      const target = 20000000;
      const goalPercent = Math.round((territory.revenue / target) * 100);

      return {
        territory,
        revenue: territory.revenue,
        units,
        orders,
        enrollments,
        goalPercent
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }

  get performanceKpis() {
    const rows = this.performanceRows;
    const revenue = rows.reduce((sum, row) => sum + row.revenue, 0);
    const units = rows.reduce((sum, row) => sum + row.units, 0);
    const orders = rows.reduce((sum, row) => sum + row.orders, 0);
    const enrollments = rows.reduce((sum, row) => sum + row.enrollments, 0);
    const goalPercent = rows.length === 0 ? 0 : Math.round(rows.reduce((sum, row) => sum + row.goalPercent, 0) / rows.length);

    return { revenue, units, orders, enrollments, goalPercent };
  }

  addTerritory() {
    if (this.editingTerritoryId) {
      const terr = this.territories.find(t => t.id === this.editingTerritoryId);
      if (terr) {
        Object.assign(terr, this.newTerritory);
      }
    } else {
      this.dataService.addTerritory({ ...this.newTerritory });
    }
    this.closeForm();
  }

  editTerritory(terr: any) {
    this.editingTerritoryId = terr.id;
    this.newTerritory = { ...terr };
    this.showForm = true;
  }

  deleteTerritory(id: string) {
    this.dataService.deleteTerritory(id);
  }

  closeForm() {
    this.showForm = false;
    this.editingTerritoryId = null;
    this.newTerritory = { id: '', name: '', director: '', revenue: 0, product: 'Anktiva 400mcg/0.4mL', status: 'Active' };
  }

  getAssignedRep(territory: TerritoryRecord): SalesRepRecord | undefined {
    return this.salesTeam.find((member) => member.area === territory.name && member.position !== 'Area Business Director');
  }

  openAssignmentModal(row: { territoryId: string; territoryName: string; repName: string }): void {
    this.selectedAssignment = {
      territoryId: row.territoryId,
      territoryName: row.territoryName,
      currentRep: row.repName
    };
    this.assignmentForm = {
      territoryId: row.territoryId,
      repName: row.repName === 'Unassigned' ? '' : row.repName
    };
    this.showAssignmentModal = true;
  }

  closeAssignmentModal(): void {
    this.showAssignmentModal = false;
    this.selectedAssignment = null;
    this.assignmentForm = { territoryId: '', repName: '' };
  }

  saveAssignment(): void {
    const territory = this.territories.find((item) => item.id === this.assignmentForm.territoryId);
    if (!territory) return;

    const currentRep = this.getAssignedRep(territory);
    if (currentRep) {
      currentRep.area = 'Unassigned';
    }

    const selectedRep = this.salesTeam.find((member) => member.name === this.assignmentForm.repName);
    if (selectedRep) {
      selectedRep.area = territory.name;
    }

    this.closeAssignmentModal();
    this.refreshPerformanceChart();
  }

  removeAssignment(territoryId: string): void {
    const territory = this.territories.find((item) => item.id === territoryId);
    if (!territory) return;

    const currentRep = this.getAssignedRep(territory);
    if (currentRep) {
      currentRep.area = 'Unassigned';
    }
  }

  openHistoryModal(territoryName: string): void {
    this.assignmentHistoryTerritory = territoryName;
    this.showHistoryModal = true;
  }

  closeHistoryModal(): void {
    this.assignmentHistoryTerritory = null;
    this.showHistoryModal = false;
  }

  getCurrentAssignmentHistoryRep(): string {
    if (!this.assignmentHistoryTerritory) {
      return 'Unassigned';
    }

    return this.assignmentRows.find((row) => row.territoryName === this.assignmentHistoryTerritory)?.repName ?? 'Unassigned';
  }

  exportTerritories(): void {
    const headers = ['Territory ID', 'Territory Name', 'Director', 'Product', 'Assigned Rep', 'Status', 'Revenue'];
    const rows = this.filteredTerritories.map((territory) => [
      territory.id,
      territory.name,
      territory.director,
      territory.product,
      this.getAssignedRep(territory)?.name ?? 'Unassigned',
      territory.status ?? 'Active',
      String(territory.revenue)
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'territories-report.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  refreshPerformanceChart(attempt = 0): void {
    requestAnimationFrame(() => {
      const el = this.territoryPerformanceChartEl?.nativeElement;
      if (!el || this.activeTab !== 'performance') return;

      if (el.clientWidth === 0 || el.clientHeight === 0) {
        if (attempt >= 6) {
          return;
        }

        setTimeout(() => this.refreshPerformanceChart(attempt + 1), 80);
        return;
      }

      const existingDom = this.performanceChart?.getDom() as HTMLDivElement | undefined;
      if (this.performanceChart && existingDom !== el) {
        this.disposePerformanceChart();
      }

      this.performanceChart = this.performanceChart ?? echarts.init(el);
      this.performanceChart.setOption({
        grid: { left: 56, right: 24, top: 36, bottom: 40 },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        xAxis: {
          type: 'category',
          data: this.performanceRows.map((row) => row.territory.name),
          axisLabel: { interval: 0 }
        },
        yAxis: { type: 'value' },
        series: [
          {
            name: 'Revenue',
            type: 'bar',
            data: this.performanceRows.map((row) => row.revenue),
            itemStyle: { color: '#0A2463' }
          }
        ]
      });
      this.performanceChart.resize();
    });
  }

  private disposePerformanceChart(): void {
    this.performanceChart?.dispose();
    this.performanceChart = undefined;
  }

  private getTerritoryStateHint(territoryName: string): string {
    if (territoryName === 'East') return 'NY';
    if (territoryName === 'North Central') return 'TN';
    if (territoryName === 'South Central') return 'TX';
    return 'CA';
  }
}
