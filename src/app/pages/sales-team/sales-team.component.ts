import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as echarts from 'echarts';
import { DataService } from '../../services/data.service';

type SalesTeamTab = 'representatives' | 'profile' | 'create-rep' | 'performance' | 'activities';
type RepProfileTab = 'overview' | 'territories' | 'physicians' | 'patients' | 'orders' | 'performance';

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

interface SalesRepFormModel {
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

interface RepDirectoryFilters {
  search: string;
  territory: string;
  status: string;
}

interface PerformanceFilters {
  rep: string;
  territory: string;
  period: 'q2' | 'ytd';
}

interface ActivityRecord {
  id: string;
  repName: string;
  activityType: string;
  physician: string;
  date: string;
  notes: string;
  nextFollowUp: string;
}

interface ActivityFilters {
  rep: string;
  activityType: string;
  physician: string;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-sales-team',
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './sales-team.component.html',
  styleUrl: './sales-team.component.scss'
})
export class SalesTeamComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private targetChart?: echarts.ECharts;
  private topPerformersChart?: echarts.ECharts;
  private growthChart?: echarts.ECharts;

  @ViewChild('targetChartEl') targetChartEl?: ElementRef<HTMLDivElement>;
  @ViewChild('topPerformersChartEl') topPerformersChartEl?: ElementRef<HTMLDivElement>;
  @ViewChild('growthChartEl') growthChartEl?: ElementRef<HTMLDivElement>;

  activeTab: SalesTeamTab = 'representatives';
  profileTab: RepProfileTab = 'overview';
  editingName: string | null = null;
  selectedRepName: string | null = null;

  repFilters: RepDirectoryFilters = {
    search: '',
    territory: 'All',
    status: 'All'
  };

  performanceFilters: PerformanceFilters = {
    rep: 'All',
    territory: 'All',
    period: 'ytd'
  };

  activityFilters: ActivityFilters = {
    rep: 'All',
    activityType: 'All',
    physician: 'All',
    startDate: '',
    endDate: ''
  };

  repForm: SalesRepFormModel = {
    name: '',
    position: '',
    areaId: '',
    area: 'East',
    product: 'Anktiva 400mcg/0.4mL',
    allTeamMark: 'Y',
    glbNcl: 'N',
    leadershipTeam: 'N',
    ariTeam: 'N'
  };

  private activities: ActivityRecord[] = [];

  ngOnInit(): void {
    this.seedActivities();

    this.route.queryParams.subscribe((params) => {
      const tab = params['tab'] as SalesTeamTab | undefined;
      this.activeTab = tab ?? 'representatives';

      if (params['rep']) {
        this.selectedRepName = params['rep'];
      }

      if (!this.selectedRepName && this.reps.length > 0) {
        this.selectedRepName = this.reps[0].name;
      }

      if (this.activeTab === 'performance') {
        this.refreshPerformanceCharts();
      }
    });
  }

  ngOnDestroy(): void {
    this.targetChart?.dispose();
    this.topPerformersChart?.dispose();
    this.growthChart?.dispose();
  }

  get reps(): SalesRepRecord[] {
    return this.dataService.getSalesTeam() as SalesRepRecord[];
  }

  get repOptions(): string[] {
    return ['All', ...new Set(this.reps.map((rep) => rep.name))];
  }

  get territoryOptions(): string[] {
    return ['All', ...new Set(this.reps.map((rep) => rep.area))];
  }

  get selectedRep(): SalesRepRecord | undefined {
    return this.reps.find((rep) => rep.name === this.selectedRepName) ?? this.reps[0];
  }

  get repDirectoryRows() {
    return this.filteredReps.map((rep) => {
      const physicians = this.getRepPhysicians(rep);
      const patients = this.getRepPatients(rep);
      const orders = this.getRepOrders(rep);
      const revenue = orders.reduce((sum, order) => sum + order.total, 0);
      const achievementPct = this.getRepAchievementPercent(rep.name);

      return {
        rep,
        territory: rep.area,
        region: rep.area,
        assignedPhysicians: physicians.length,
        activePatients: patients.filter((p: any) => (p.patientStatus ?? 'Active') === 'Active').length,
        orders: orders.length,
        revenue,
        achievementPct,
        status: rep.position === 'Area Business Director' ? 'Director' : 'Active'
      };
    });
  }

  get filteredReps(): SalesRepRecord[] {
    const query = this.repFilters.search.trim().toLowerCase();

    return this.reps.filter((rep) => {
      const matchesSearch = !query
        || rep.name.toLowerCase().includes(query)
        || rep.area.toLowerCase().includes(query)
        || rep.areaId.toLowerCase().includes(query)
        || rep.position.toLowerCase().includes(query);

      const status = rep.position === 'Area Business Director' ? 'Director' : 'Active';

      return matchesSearch
        && (this.repFilters.territory === 'All' || rep.area === this.repFilters.territory)
        && (this.repFilters.status === 'All' || status === this.repFilters.status);
    });
  }

  get repProfileSummary() {
    if (!this.selectedRep) {
      return null;
    }

    const rep = this.selectedRep;
    const physicians = this.getRepPhysicians(rep);
    const patients = this.getRepPatients(rep);
    const orders = this.getRepOrders(rep);
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    const achievementPct = this.getRepAchievementPercent(rep.name);

    return {
      rep,
      territory: rep.area,
      physicians,
      patients,
      orders,
      revenue,
      achievementPct
    };
  }

  get performanceKpis() {
    const targets = this.dataService.getSalesTargets() as any[];
    const rows = this.performanceRows;

    const totalTarget = rows.reduce((sum, row) => sum + row.target, 0);
    const totalAchieved = rows.reduce((sum, row) => sum + row.achieved, 0);
    const totalRevenue = rows.reduce((sum, row) => sum + row.revenue, 0);
    const totalUnits = rows.reduce((sum, row) => sum + row.units, 0);
    const achievement = totalTarget === 0 ? 0 : Math.round((totalAchieved / totalTarget) * 100);

    return {
      monthlyTarget: totalTarget,
      revenueAchieved: totalRevenue,
      unitsSold: totalUnits,
      achievementPct: achievement,
      repCount: targets.length
    };
  }

  get performanceRows() {
    const targets = this.dataService.getSalesTargets() as any[];

    return targets
      .filter((t) => this.performanceFilters.rep === 'All' || t.name === this.performanceFilters.rep)
      .filter((t) => this.performanceFilters.territory === 'All' || t.territory === this.performanceFilters.territory)
      .map((t) => {
        const periodKeyTarget = this.performanceFilters.period === 'q2' ? 'q2Target' : 'ytdTarget';
        const periodKeyAchieved = this.performanceFilters.period === 'q2' ? 'q2Achieved' : 'ytdAchieved';
        const target = Number(t[periodKeyTarget] ?? 0);
        const achieved = Number(t[periodKeyAchieved] ?? 0);
        const rep = this.reps.find((r) => r.name === t.name);
        const orders = rep ? this.getRepOrders(rep) : [];
        const revenue = orders.reduce((sum, order) => sum + order.total, 0);
        const units = orders.reduce((sum, order) => sum + order.units, 0);
        const achievementPct = target === 0 ? 0 : Math.round((achieved / target) * 100);

        return { name: t.name, territory: t.territory, target, achieved, achievementPct, revenue, units };
      })
      .sort((a, b) => b.achievementPct - a.achievementPct);
  }

  get topPerformers() {
    return this.performanceRows.slice(0, 5);
  }

  get activityTypeOptions(): string[] {
    return ['All', ...new Set(this.activities.map((a) => a.activityType))];
  }

  get activityPhysicianOptions(): string[] {
    return ['All', ...new Set(this.activities.map((a) => a.physician))];
  }

  get filteredActivities(): ActivityRecord[] {
    return this.activities.filter((activity) => {
      return (this.activityFilters.rep === 'All' || activity.repName === this.activityFilters.rep)
        && (this.activityFilters.activityType === 'All' || activity.activityType === this.activityFilters.activityType)
        && (this.activityFilters.physician === 'All' || activity.physician === this.activityFilters.physician)
        && (!this.activityFilters.startDate || activity.date >= this.activityFilters.startDate)
        && (!this.activityFilters.endDate || activity.date <= this.activityFilters.endDate);
    });
  }

  startCreateRep(): void {
    this.editingName = null;
    this.resetRepForm();
    this.setTab('create-rep');
  }

  editRep(rep: SalesRepRecord): void {
    this.editingName = rep.name;
    this.repForm = { ...rep };
    this.setTab('create-rep', rep.name);
  }

  saveRep(): void {
    if (this.editingName) {
      const rep = this.reps.find((r) => r.name === this.editingName);
      if (rep) {
        Object.assign(rep, this.repForm);
      }
    } else {
      this.dataService.addTeamMember({ ...this.repForm });
    }

    this.editingName = null;
    this.selectedRepName = this.repForm.name;
    this.setTab('representatives', this.selectedRepName);
  }

  deleteRep(name: string): void {
    this.dataService.deleteTeamMember(name);
    if (this.selectedRepName === name) {
      this.selectedRepName = this.reps[0]?.name ?? null;
    }
  }

  openRepProfile(name: string, tab: RepProfileTab = 'overview'): void {
    this.profileTab = tab;
    this.setTab('profile', name);
  }

  assignTerritory(name: string): void {
    const rep = this.reps.find((r) => r.name === name);
    if (!rep) return;

    const options = this.territoryOptions.filter((t) => t !== 'All');
    const idx = Math.max(0, options.indexOf(rep.area));
    rep.area = options[(idx + 1) % options.length];
  }

  setTab(tab: SalesTeamTab, repName?: string): void {
    this.activeTab = tab;
    if (repName) {
      this.selectedRepName = repName;
    }

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        tab,
        rep: repName ?? this.selectedRepName ?? undefined
      },
      queryParamsHandling: 'merge'
    });
  }

  refreshPerformanceCharts(): void {
    setTimeout(() => {
      if (this.activeTab !== 'performance') return;

      const targetEl = this.targetChartEl?.nativeElement;
      const topEl = this.topPerformersChartEl?.nativeElement;
      const growthEl = this.growthChartEl?.nativeElement;

      if (!targetEl || !topEl || !growthEl) return;

      const rows = this.performanceRows;
      const names = rows.map((r) => r.name);

      this.targetChart = this.targetChart ?? echarts.init(targetEl);
      this.targetChart.setOption({
        grid: { left: 48, right: 16, top: 24, bottom: 40 },
        tooltip: { trigger: 'axis' },
        legend: { data: ['Target', 'Achieved'] },
        xAxis: { type: 'category', data: names, axisLabel: { interval: 0, rotate: 30 } },
        yAxis: { type: 'value' },
        series: [
          { name: 'Target', type: 'bar', data: rows.map((r) => r.target), itemStyle: { color: '#0A2463' } },
          { name: 'Achieved', type: 'bar', data: rows.map((r) => r.achieved), itemStyle: { color: '#1F7A8C' } }
        ]
      });
      this.targetChart.resize();

      const top = this.topPerformers;
      this.topPerformersChart = this.topPerformersChart ?? echarts.init(topEl);
      this.topPerformersChart.setOption({
        grid: { left: 48, right: 16, top: 24, bottom: 36 },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        xAxis: { type: 'category', data: top.map((r) => r.name), axisLabel: { interval: 0, rotate: 20 } },
        yAxis: { type: 'value', max: 120 },
        series: [{ name: 'Achievement %', type: 'bar', data: top.map((r) => r.achievementPct), itemStyle: { color: '#1F7A8C' } }]
      });
      this.topPerformersChart.resize();

      this.growthChart = this.growthChart ?? echarts.init(growthEl);
      this.growthChart.setOption({
        grid: { left: 48, right: 16, top: 24, bottom: 36 },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr'] },
        yAxis: { type: 'value' },
        series: [{ name: 'Monthly Growth', type: 'line', smooth: true, data: [18, 22, 28, 31], itemStyle: { color: '#0A2463' } }]
      });
      this.growthChart.resize();
    });
  }

  private resetRepForm(): void {
    this.repForm = {
      name: '',
      position: '',
      areaId: '',
      area: 'East',
      product: 'Anktiva 400mcg/0.4mL',
      allTeamMark: 'Y',
      glbNcl: 'N',
      leadershipTeam: 'N',
      ariTeam: 'N'
    };
  }

  private getRepAchievementPercent(name: string): number {
    const targets = this.dataService.getSalesTargets() as any[];
    const row = targets.find((t) => t.name === name);
    if (!row) return 0;
    return row.ytdTarget === 0 ? 0 : Math.round((row.ytdAchieved / row.ytdTarget) * 100);
  }

  private getTerritoryFromState(state: string): string {
    const map: Record<string, string> = {
      NY: 'East',
      MD: 'East',
      NJ: 'East',
      PA: 'East',
      TX: 'South Central',
      TN: 'North Central',
      OH: 'North Central',
      NC: 'North Central',
      CA: 'Southwest'
    };
    return map[state] ?? 'East';
  }

  private getRepPhysicians(rep: SalesRepRecord): any[] {
    const physicians = this.dataService.getPhysicians() as any[];
    return physicians.filter((p) => this.getTerritoryFromState(p.state) === rep.area);
  }

  private getRepPatients(rep: SalesRepRecord): any[] {
    const patients = this.dataService.getPatients() as any[];
    return patients.filter((p) => {
      const territory = p.territory ?? this.getTerritoryFromState(p.physicianState);
      return territory === rep.area;
    });
  }

  private getRepOrders(rep: SalesRepRecord): any[] {
    const orders = this.dataService.getRecentOrders() as any[];
    const key = rep.area.toLowerCase().split(' ')[0];
    return orders.filter((o) =>
      o.facility.toLowerCase().includes(key) || o.impTypeName.toLowerCase().includes(key)
    );
  }

  private seedActivities(): void {
    if (this.activities.length > 0) {
      return;
    }

    const physicians = (this.dataService.getPhysicians() as any[]).map((p) => `${p.firstName} ${p.lastName}`);
    const reps = this.reps.filter((r) => r.position !== 'Area Business Director').map((r) => r.name);
    const repPick = (idx: number) => reps[idx % Math.max(1, reps.length)] ?? 'Unassigned';
    const docPick = (idx: number) => physicians[idx % Math.max(1, physicians.length)] ?? 'Physician';

    this.activities = [
      { id: 'ACT-101', repName: repPick(0), activityType: 'Doctor Visit', physician: docPick(0), date: '2026-04-22', notes: 'Discussed product dosing and patient eligibility.', nextFollowUp: '2026-04-29' },
      { id: 'ACT-102', repName: repPick(1), activityType: 'Follow-up', physician: docPick(1), date: '2026-04-23', notes: 'Sent updated brochure and reimbursement deck.', nextFollowUp: '2026-05-01' },
      { id: 'ACT-103', repName: repPick(2), activityType: 'Enrollment Support', physician: docPick(2), date: '2026-04-24', notes: 'Helped office submit missing documents.', nextFollowUp: '2026-04-30' },
      { id: 'ACT-104', repName: repPick(3), activityType: 'Product Discussion', physician: docPick(3), date: '2026-04-25', notes: 'Covered ordering workflow and distribution partners.', nextFollowUp: '2026-05-03' },
      { id: 'ACT-105', repName: repPick(4), activityType: 'Order Follow-up', physician: docPick(4), date: '2026-04-26', notes: 'Checked shipment status and invoice readiness.', nextFollowUp: '2026-05-02' }
    ];
  }

}
