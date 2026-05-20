import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CurrencyPipe, DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as echarts from 'echarts';

type SalesTab = 'daily-sales' | 'sales-report' | 'performance';
type PerformancePeriod = 'q1' | 'q2' | 'ytd';

interface DailySaleRecord {
  id: string;
  date: string;
  product: string;
  region: string;
  repName: string;
  icsUnits: number;
  icsSales: number;
  accredoUnits: number;
  accredoSales: number;
  units: number;
  revenue: number;
}

interface SalesTarget {
  name: string;
  territory: string;
  q1Target: number;
  q1Achieved: number;
  q2Target: number;
  q2Achieved: number;
  ytdTarget: number;
  ytdAchieved: number;
}

interface SalesFilters {
  region: string;
  product: string;
  repName: string;
  channel: string;
}

@Component({
  selector: 'app-sales-registry',
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './sales-registry.component.html',
  styleUrl: './sales-registry.component.scss'
})
export class SalesRegistryComponent implements OnInit, AfterViewInit, OnDestroy {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  activeTab: SalesTab = 'daily-sales';
  showForm = false;
  editingSalesId: string | null = null;

  salesFilters: SalesFilters = {
    region: 'All',
    product: 'All',
    repName: 'All',
    channel: 'All'
  };

  reportFilters: SalesFilters = {
    region: 'All',
    product: 'All',
    repName: 'All',
    channel: 'All'
  };

  performancePeriod: PerformancePeriod = 'q2';

  @ViewChild('dailySalesChart') dailySalesChartEl?: ElementRef<HTMLDivElement>;
  @ViewChild('salesReportChart') salesReportChartEl?: ElementRef<HTMLDivElement>;
  @ViewChild('performanceChart') performanceChartEl?: ElementRef<HTMLDivElement>;

  private charts: Partial<Record<SalesTab, echarts.ECharts>> = {};

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'] as SalesTab;
      }

      this.refreshActiveTabChart();
    });
  }

  ngAfterViewInit(): void {
    this.refreshActiveTabChart();
  }

  ngOnDestroy(): void {
    for (const tab of Object.keys(this.charts) as SalesTab[]) {
      this.charts[tab]?.dispose();
      delete this.charts[tab];
    }
  }

  newSale: DailySaleRecord = {
    id: '',
    date: new Date().toISOString().split('T')[0],
    product: 'Anktiva 400mcg/0.4mL',
    region: 'East',
    repName: '',
    icsUnits: 0,
    icsSales: 0,
    accredoUnits: 0,
    accredoSales: 0,
    units: 0,
    revenue: 0
  };

  get dailySales(): DailySaleRecord[] {
    return this.dataService.getDailySales();
  }

  get salesTargets(): SalesTarget[] {
    return this.dataService.getSalesTargets();
  }

  get sortedSales(): DailySaleRecord[] {
    return [...this.dailySales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  get regionOptions(): string[] {
    return ['All', ...new Set(this.dailySales.map((sale) => sale.region))];
  }

  get productOptions(): string[] {
    return ['All', ...new Set(this.dailySales.map((sale) => sale.product))];
  }

  get repOptions(): string[] {
    return ['All', ...new Set(this.dailySales.map((sale) => sale.repName))];
  }

  get filteredDailySales(): DailySaleRecord[] {
    return this.applyFilters(this.sortedSales, this.salesFilters);
  }

  get filteredReportSales(): DailySaleRecord[] {
    return this.applyFilters(this.sortedSales, this.reportFilters);
  }

  get dailySalesKpis() {
    const sales = this.filteredDailySales;
    const latest = sales[0];
    const patients = this.dataService.getPatients();
    const pendingOrders = this.dataService.getRecentOrders().filter((order) => order.status !== 'Shipped').length;

    return {
      yesterdayIcsSales: latest?.icsSales ?? 0,
      ibCareEnrollments: patients.filter((patient) => patient.facility && !patient.facility.includes('ACCREDO')).length,
      accredoEnrollments: patients.filter((patient) => patient.facility?.includes('ACCREDO')).length,
      pendingOrders,
      totalUnitsShipped: sales.reduce((sum, sale) => sum + sale.units, 0)
    };
  }

  get dailySalesSummary() {
    const sales = this.filteredDailySales;
    return {
      totalRevenue: sales.reduce((sum, sale) => sum + sale.revenue, 0),
      totalIcsRevenue: sales.reduce((sum, sale) => sum + sale.icsSales, 0),
      totalAccredoRevenue: sales.reduce((sum, sale) => sum + sale.accredoSales, 0),
      totalUnits: sales.reduce((sum, sale) => sum + sale.units, 0),
      recordCount: sales.length
    };
  }

  get reportKpis() {
    const sales = this.filteredReportSales;
    const territories = new Set(sales.map((sale) => sale.region)).size;
    const reps = new Set(sales.map((sale) => sale.repName)).size;
    return {
      totalRevenue: sales.reduce((sum, sale) => sum + sale.revenue, 0),
      totalUnits: sales.reduce((sum, sale) => sum + sale.units, 0),
      activeTerritories: territories,
      activeReps: reps
    };
  }

  get reportSummaryRows() {
    const grouped = new Map<string, { territory: string; product: string; channel: string; totalUnits: number; totalRevenue: number; salesCount: number }>();

    for (const sale of this.filteredReportSales) {
      const channel = this.channelLabel(sale);
      const key = `${sale.region}|${sale.product}|${channel}`;
      const existing = grouped.get(key) ?? {
        territory: sale.region,
        product: sale.product,
        channel,
        totalUnits: 0,
        totalRevenue: 0,
        salesCount: 0
      };

      existing.totalUnits += sale.units;
      existing.totalRevenue += sale.revenue;
      existing.salesCount += 1;
      grouped.set(key, existing);
    }

    return [...grouped.values()].sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  get performanceRows() {
    return this.salesTargets.map((target) => {
      const achieved = this.performancePeriod === 'q1'
        ? target.q1Achieved
        : this.performancePeriod === 'q2'
          ? target.q2Achieved
          : target.ytdAchieved;
      const goal = this.performancePeriod === 'q1'
        ? target.q1Target
        : this.performancePeriod === 'q2'
          ? target.q2Target
          : target.ytdTarget;
      const percentage = goal === 0 ? 0 : Math.round((achieved / goal) * 100);
      const status = percentage >= 100 ? 'Exceeded' : percentage >= 80 ? 'On Track' : 'Needs Attention';

      return {
        repName: target.name,
        territory: target.territory,
        target: goal,
        achieved,
        percentage,
        status
      };
    }).sort((a, b) => b.percentage - a.percentage);
  }

  get performanceKpis() {
    const rows = this.performanceRows;
    const emptyRow = {
      repName: 'N/A',
      territory: 'N/A',
      target: 0,
      achieved: 0,
      percentage: 0,
      status: 'Needs Attention'
    };
    const topRep = rows[0] ?? emptyRow;
    const lowestRep = rows[rows.length - 1] ?? emptyRow;
    const territoryRollup = new Map<string, { achieved: number; target: number }>();

    for (const row of rows) {
      const existing = territoryRollup.get(row.territory) ?? { achieved: 0, target: 0 };
      existing.achieved += row.achieved;
      existing.target += row.target;
      territoryRollup.set(row.territory, existing);
    }

    const territoryScores = [...territoryRollup.entries()].map(([territory, value]) => ({
      territory,
      percentage: value.target === 0 ? 0 : Math.round((value.achieved / value.target) * 100)
    })).sort((a, b) => b.percentage - a.percentage);

    const avgAttainment = rows.length === 0 ? 0 : Math.round(rows.reduce((sum, row) => sum + row.percentage, 0) / rows.length);

    return {
      topRep,
      lowestRep,
      topTerritory: territoryScores[0] ?? { territory: 'N/A', percentage: 0 },
      goalAchievement: avgAttainment
    };
  }

  addDailySale(): void {
    if (this.editingSalesId) {
      const sale = this.dailySales.find(s => s.id === this.editingSalesId);
      if (sale) {
        Object.assign(sale, this.newSale);
      }
    } else {
      const saleId = 'SLS-' + Math.floor(100 + Math.random() * 900);
      this.dataService.addDailySale({
        id: saleId,
        date: this.newSale.date,
        product: this.newSale.product,
        region: this.newSale.region,
        repName: this.newSale.repName,
        icsUnits: this.newSale.icsUnits,
        icsSales: this.newSale.icsUnits * 35800,
        accredoUnits: this.newSale.accredoUnits,
        accredoSales: this.newSale.accredoUnits * 35800,
        units: this.newSale.icsUnits + this.newSale.accredoUnits,
        revenue: (this.newSale.icsUnits + this.newSale.accredoUnits) * 35800
      });
    }
    this.closeForm();
    this.refreshAllCharts();
  }

  editDailySale(sale: DailySaleRecord): void {
    this.editingSalesId = sale.id;
    this.newSale = { ...sale };
    this.showForm = true;
  }

  deleteDailySale(id: string): void {
    this.dataService.deleteDailySale(id);
    this.refreshAllCharts();
  }

  closeForm(): void {
    this.showForm = false;
    this.editingSalesId = null;
    this.newSale = { id: '', date: new Date().toISOString().split('T')[0], product: 'Anktiva 400mcg/0.4mL', region: 'East', repName: '', icsUnits: 0, icsSales: 0, accredoUnits: 0, accredoSales: 0, units: 0, revenue: 0 };
  }

  updateRevenue(): void {
    this.newSale.icsSales = this.newSale.icsUnits * 35800;
    this.newSale.accredoSales = this.newSale.accredoUnits * 35800;
    this.newSale.units = this.newSale.icsUnits + this.newSale.accredoUnits;
    this.newSale.revenue = this.newSale.units * 35800;
  }

  onDailyFiltersChanged(): void {
    this.refreshChart('daily-sales');
  }

  onReportFiltersChanged(): void {
    this.refreshChart('sales-report');
  }

  onPerformancePeriodChanged(): void {
    this.refreshChart('performance');
  }

  private applyFilters(sales: DailySaleRecord[], filters: SalesFilters): DailySaleRecord[] {
    return sales.filter((sale) => {
      const channel = this.channelLabel(sale);
      return (filters.region === 'All' || sale.region === filters.region)
        && (filters.product === 'All' || sale.product === filters.product)
        && (filters.repName === 'All' || sale.repName === filters.repName)
        && (filters.channel === 'All' || channel === filters.channel);
    });
  }

  private channelLabel(sale: DailySaleRecord): string {
    if (sale.icsUnits > 0 && sale.accredoUnits > 0) return 'Mixed';
    if (sale.icsUnits > 0) return 'ICS';
    if (sale.accredoUnits > 0) return 'Accredo';
    return 'Unassigned';
  }

  private refreshAllCharts(): void {
    for (const tab of ['daily-sales', 'sales-report', 'performance'] as SalesTab[]) {
      this.refreshChart(tab);
    }
  }

  private refreshActiveTabChart(): void {
    for (const tab of ['daily-sales', 'sales-report', 'performance'] as SalesTab[]) {
      if (tab !== this.activeTab) {
        this.charts[tab]?.dispose();
        delete this.charts[tab];
      }
    }

    this.refreshChart(this.activeTab);
  }

  private refreshChart(tab: SalesTab): void {
    this.cdr.detectChanges();
    setTimeout(() => {
      const el = this.getChartElement(tab);
      if (!el) return;

      const existing = this.charts[tab];
      if (existing && existing.getDom() !== el) {
        existing.dispose();
        delete this.charts[tab];
      }

      const chart = this.charts[tab] ?? echarts.init(el);
      this.charts[tab] = chart;
      chart.setOption(this.getChartOption(tab), { notMerge: true, lazyUpdate: true });
      chart.resize();
    });
  }

  private getChartElement(tab: SalesTab): HTMLDivElement | null {
    const ref = tab === 'daily-sales'
      ? this.dailySalesChartEl
      : tab === 'sales-report'
        ? this.salesReportChartEl
        : this.performanceChartEl;
    return ref?.nativeElement ?? null;
  }

  private getChartOption(tab: SalesTab): echarts.EChartsOption {
    if (tab === 'daily-sales') {
      const rows = [...this.filteredDailySales].reverse();
      return {
        grid: { left: 48, right: 20, top: 36, bottom: 42 },
        tooltip: { trigger: 'axis' },
        legend: { top: 4 },
        xAxis: {
          type: 'category',
          data: rows.map((sale) => new Date(sale.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
        },
        yAxis: { type: 'value' },
        series: [
          { name: 'Revenue', type: 'line', smooth: true, data: rows.map((sale) => sale.revenue) },
          { name: 'Units', type: 'bar', data: rows.map((sale) => sale.units) }
        ]
      };
    }

    if (tab === 'sales-report') {
      const rows = this.reportSummaryRows;
      return {
        grid: { left: 56, right: 20, top: 36, bottom: 56 },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        xAxis: {
          type: 'category',
          data: rows.map((row) => row.territory),
          axisLabel: { interval: 0 }
        },
        yAxis: { type: 'value' },
        series: [
          { name: 'Revenue', type: 'bar', data: rows.map((row) => row.totalRevenue), itemStyle: { color: '#0A2463' } }
        ]
      };
    }

    const rows = this.performanceRows;
    return {
      grid: { left: 170, right: 24, top: 30, bottom: 24 },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      xAxis: { type: 'value' },
      yAxis: {
        type: 'category',
        data: rows.map((row) => row.repName),
        axisLabel: { width: 150, overflow: 'truncate' }
      },
      series: [
        { name: 'Attainment %', type: 'bar', data: rows.map((row) => row.percentage), itemStyle: { color: '#009FD4' } }
      ]
    };
  }
}
