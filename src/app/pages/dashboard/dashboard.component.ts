import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts';

type DashboardSection = 'weeklySales' | 'territoryPerformance' | 'yearlySalesBreakdown' | 'repPerformance';
type SectionView = 'table' | 'chart';
type WeekdayKey = 'fri' | 'mon' | 'tue' | 'wed' | 'thu';

interface WeeklyUnitsRow {
  label: string;
  fri: number;
  mon: number;
  tue: number;
  wed: number;
  thu: number;
  total: number;
}

interface WeeklySummaryRow {
  label: 'Sales $' | 'Enrollments';
  fri: number;
  mon: number;
  tue: number;
  wed: number;
  thu: number;
  total: number;
  isCurrency?: boolean;
}

interface QuarterlyBreakdownRow {
  quarter: string;
  period: string;
  shipped: number;
  pending: number;
  totalUnits: number;
  totalSales: number;
  icsUnits: number;
  icsSales: number;
  accredoSales: number;
  ibCare: number;
  accredo: number;
  isTotal?: boolean;
}

interface RepPerformanceRow {
  territory: string;
  director: string;
  rep: string;
  cwEnroll: number;
  cwUnits: number;
  cqEnroll: number;
  cqUnits: number;
  ytdEnroll: number;
  ytdUnits: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);
  private readonly handleWindowResize = () => this.resizeVisibleCharts();

  kpis = this.dataService.getKpis();
  territories = this.dataService.getTerritories();

  // Image 2: Weekly Sales table (Fri/Sat/Sun, Mon, Tue, Wed, Thu, Total)
  weeklySales: WeeklyUnitsRow[] = [
    { label: 'Shipped',   fri: 23, mon: 18, tue: 0, wed: 0, thu: 0, total: 41 },
    { label: 'Pending',   fri: 0,  mon: 22, tue: 0, wed: 0, thu: 0, total: 22 },
    { label: 'TOTAL',     fri: 23, mon: 40, tue: 0, wed: 0, thu: 0, total: 63 }
  ];

  weeklySummary: WeeklySummaryRow[] = [
    { label: 'Sales $', fri: 823400, mon: 1432000, tue: 0, wed: 0, thu: 0, total: 2255400, isCurrency: true },
    { label: 'Enrollments', fri: 1, mon: 1, tue: 0, wed: 0, thu: 0, total: 2 }
  ];

  // Image 2: Quarterly Breakdown
  quarterlyBreakdown: QuarterlyBreakdownRow[] = [
    { quarter: 'Q1', period: 'January',  shipped: 315, pending: 0, totalUnits: 315, totalSales: 11277000, icsUnits: 276, icsSales: 9880800, accredoSales: 1611000, ibCare: 100, accredo: 5 },
    { quarter: '',   period: 'February', shipped: 587, pending: 0, totalUnits: 587, totalSales: 21014800, icsUnits: 508, icsSales: 18186400, accredoSales: 2613400, ibCare: 63,  accredo: 13 },
    { quarter: '',   period: 'March',    shipped: 571, pending: 0, totalUnits: 571, totalSales: 20441800, icsUnits: 417, icsSales: 14928400, accredoSales: 2506000, ibCare: 54,  accredo: 8 },
    { quarter: 'Q1 TOTAL', period: '', shipped: 1473, pending: 0, totalUnits: 1473, totalSales: 52733400, icsUnits: 1201, icsSales: 42995800, accredoSales: 6730400, ibCare: 217, accredo: 26, isTotal: true },
    { quarter: 'Q2', period: 'April',   shipped: 304, pending: 22, totalUnits: 326, totalSales: 11678800, icsUnits: 304, icsSales: 10883200, accredoSales: 1324600, ibCare: 38, accredo: 8 },
  ];

  // Image 2: Territory/Rep table (Current Week, Current Quarter, YTD)
  repPerformance: RepPerformanceRow[] = [
    { territory: 'EAST', director: 'Keith DeRuiter', rep: 'Lisa Volomino (Boston, MA)', cwEnroll: 1, cwUnits: 0, cqEnroll: 11, cqUnits: 61, ytdEnroll: 11, ytdUnits: 61 },
    { territory: '', director: '', rep: 'Karen Martinez (New York, NY)', cwEnroll: 0, cwUnits: 3, cqEnroll: 4, cqUnits: 23, ytdEnroll: 4, ytdUnits: 23 },
    { territory: '', director: '', rep: 'Timothy Kibel (Syracuse, NY)', cwEnroll: 0, cwUnits: 0, cqEnroll: 27, cqUnits: 28, ytdEnroll: 27, ytdUnits: 139 },
    { territory: '', director: '', rep: 'Brian Girbes (Philadelphia, PA)', cwEnroll: 0, cwUnits: 0, cqEnroll: 9, cqUnits: 8, ytdEnroll: 9, ytdUnits: 51 },
    { territory: 'NORTH CENTRAL', director: 'Chuck Gaetano', rep: 'Amanda Rippy (Nashville, TN)', cwEnroll: 1, cwUnits: 0, cqEnroll: 27, cqUnits: 7, ytdEnroll: 27, ytdUnits: 97 },
    { territory: '', director: '', rep: 'Dylan Mazelton (Detroit, MI)', cwEnroll: 0, cwUnits: 1, cqEnroll: 1, cqUnits: 15, ytdEnroll: 1, ytdUnits: 68 },
  ];

  sectionView: Record<DashboardSection, SectionView> = {
    weeklySales: 'chart',
    territoryPerformance: 'chart',
    yearlySalesBreakdown: 'chart',
    repPerformance: 'chart'
  };

  @ViewChild('weeklySalesChart') weeklySalesChartEl?: ElementRef<HTMLDivElement>;
  @ViewChild('territoryPerformanceChart') territoryPerformanceChartEl?: ElementRef<HTMLDivElement>;
  @ViewChild('yearlySalesBreakdownChart') yearlySalesBreakdownChartEl?: ElementRef<HTMLDivElement>;
  @ViewChild('repPerformanceChart') repPerformanceChartEl?: ElementRef<HTMLDivElement>;

  private charts: Partial<Record<DashboardSection, echarts.ECharts>> = {};

  get ytdTotals(): QuarterlyBreakdownRow {
    const base: QuarterlyBreakdownRow = {
      quarter: 'YTD',
      period: 'TOTAL',
      shipped: 0,
      pending: 0,
      totalUnits: 0,
      totalSales: 0,
      icsUnits: 0,
      icsSales: 0,
      accredoSales: 0,
      ibCare: 0,
      accredo: 0,
      isTotal: true
    };

    const rows = this.quarterlyBreakdown.filter((r) => !r.isTotal && r.period);
    for (const r of rows) {
      base.shipped += r.shipped;
      base.pending += r.pending;
      base.totalUnits += r.totalUnits;
      base.totalSales += r.totalSales;
      base.icsUnits += r.icsUnits;
      base.icsSales += r.icsSales;
      base.accredoSales += r.accredoSales;
      base.ibCare += r.ibCare;
      base.accredo += r.accredo;
    }

    return base;
  }

  ngAfterViewInit(): void {
    for (const section of Object.keys(this.sectionView) as DashboardSection[]) {
      if (this.sectionView[section] === 'chart') {
        this.initOrUpdateChart(section);
      }
    }

    window.addEventListener('resize', this.handleWindowResize);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleWindowResize);

    for (const key of Object.keys(this.charts) as DashboardSection[]) {
      this.charts[key]?.dispose();
      delete this.charts[key];
    }
  }

  setSectionView(section: DashboardSection, view: SectionView): void {
    this.sectionView[section] = view;

    if (view === 'chart') {
      this.cdr.detectChanges();
      this.initOrUpdateChart(section);
    } else {
      // Chart DOM is removed under *ngIf; dispose to avoid holding detached DOM references.
      this.charts[section]?.dispose();
      delete this.charts[section];
    }
  }

  private initOrUpdateChart(section: DashboardSection, attempt = 0): void {
    // Wait for Angular to flush the conditional chart DOM before querying ViewChild refs.
    setTimeout(() => {
      const el = this.getChartElement(section);
      if (!el) return;

      if ((el.clientWidth === 0 || el.clientHeight === 0) && attempt < 6) {
        this.initOrUpdateChart(section, attempt + 1);
        return;
      }

      const existing = this.charts[section];
      let chart = existing;
      if (existing) {
        const existingDom = existing.getDom() as HTMLDivElement | undefined;
        if (existingDom !== el) {
          existing.dispose();
          delete this.charts[section];
          chart = undefined;
        }
      }

      chart = chart ?? echarts.init(el);
      this.charts[section] = chart;

      chart.setOption(this.getChartOption(section), { notMerge: true, lazyUpdate: true });
      chart.resize();
    });
  }

  private resizeVisibleCharts(): void {
    for (const section of Object.keys(this.sectionView) as DashboardSection[]) {
      if (this.sectionView[section] !== 'chart') {
        continue;
      }

      const chart = this.charts[section];
      const el = this.getChartElement(section);

      if (chart && el && el.clientWidth > 0 && el.clientHeight > 0) {
        chart.resize();
      } else if (el) {
        this.initOrUpdateChart(section);
      }
    }
  }

  private getChartElement(section: DashboardSection): HTMLDivElement | null {
    const ref =
      section === 'weeklySales' ? this.weeklySalesChartEl :
      section === 'territoryPerformance' ? this.territoryPerformanceChartEl :
      section === 'yearlySalesBreakdown' ? this.yearlySalesBreakdownChartEl :
      this.repPerformanceChartEl;

    return ref?.nativeElement ?? null;
  }

  private getChartOption(section: DashboardSection): echarts.EChartsOption {
    if (section === 'weeklySales') {
      const dayLabels: string[] = ['Fri/Sat/Sun', 'Mon', 'Tue', 'Wed', 'Thu'];
      const shipped = this.weeklySales.find((r) => r.label === 'Shipped');
      const pending = this.weeklySales.find((r) => r.label === 'Pending');

      const read = (row: WeeklyUnitsRow | undefined, key: WeekdayKey) => row?.[key] ?? 0;
      const shippedData = [read(shipped, 'fri'), read(shipped, 'mon'), read(shipped, 'tue'), read(shipped, 'wed'), read(shipped, 'thu')];
      const pendingData = [read(pending, 'fri'), read(pending, 'mon'), read(pending, 'tue'), read(pending, 'wed'), read(pending, 'thu')];

      return {
        grid: { left: 40, right: 20, top: 40, bottom: 40 },
        tooltip: { trigger: 'axis' },
        legend: { top: 8 },
        xAxis: { type: 'category', data: dayLabels, axisLabel: { interval: 0 } },
        yAxis: { type: 'value' },
        series: [
          { name: 'Shipped', type: 'bar', data: shippedData, emphasis: { focus: 'series' } },
          { name: 'Pending', type: 'bar', data: pendingData, emphasis: { focus: 'series' } }
        ]
      };
    }

    if (section === 'territoryPerformance') {
      const rows = [...this.territories].sort((a, b) => (b.revenue ?? 0) - (a.revenue ?? 0));
      return {
        grid: { left: 120, right: 24, top: 30, bottom: 60 },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        xAxis: {
          type: 'value',
          axisLabel: {
            formatter: (value: number) => {
              if (value >= 1_000_000) {
                return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
              }
              if (value >= 1_000) {
                return `${Math.round(value / 1_000)}K`;
              }
              return `${value}`;
            },
            hideOverlap: true
          }
        },
        yAxis: {
          type: 'category',
          data: rows.map((t) => t.name),
          axisLabel: { width: 110, overflow: 'truncate' }
        },
        series: [
          {
            name: 'YTD Revenue',
            type: 'bar',
            data: rows.map((t) => t.revenue),
            itemStyle: { color: '#0d6efd' }
          }
        ]
      };
    }

    if (section === 'yearlySalesBreakdown') {
      const rows = this.quarterlyBreakdown.filter((r) => !r.isTotal && r.period);
      return {
        grid: { left: 56, right: 20, top: 40, bottom: 56 },
        tooltip: { trigger: 'axis' },
        legend: { top: 8 },
        xAxis: { type: 'category', data: rows.map((r) => r.period), axisLabel: { interval: 0, rotate: 0 } },
        yAxis: { type: 'value' },
        series: [
          { name: 'ICS Sales $', type: 'bar', stack: 'sales', data: rows.map((r) => r.icsSales) },
          { name: 'Accredo Sales $', type: 'bar', stack: 'sales', data: rows.map((r) => r.accredoSales) }
        ]
      };
    }

    // repPerformance
    const reps = this.repPerformance.map((r) => r.rep);
    const values = this.repPerformance.map((r) => r.cqUnits);
    return {
      grid: { left: 220, right: 24, top: 30, bottom: 24 },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      xAxis: { type: 'value' },
      yAxis: { type: 'category', data: reps, axisLabel: { width: 200, overflow: 'truncate' } },
      series: [
        { name: 'Current Quarter Units', type: 'bar', data: values }
      ]
    };
  }
}
