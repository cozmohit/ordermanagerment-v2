import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface GpoMasterAccountRow {
  bpNumber: string;
  shipToName: string;
  shipToAddress1: string;
  shipToCity: string;
  shipToState: string;
  shipToZip: string;
  gpoL1: string;      gpoL1Start: string;      gpoL1End: string;
  subGpoL2: string;   subGpoL2Start: string;   subGpoL2End: string;
  groupL3: string;    groupL3Start: string;    groupL3End: string;
  subGroupL4: string; subGroupL4Start: string; subGroupL4End: string;
  practiceL5: string; practiceL5Start: string; practiceL5End: string;
  channel: string;
  communityAcademic: string;
  notes: string;
  fullAccountName: string;
}

interface HierarchyEditForm {
  bpNumber: string;
  shipToName: string;
  shipToAddress1: string;
  shipToCity: string;
  shipToState: string;
  shipToZip: string;
  channel: string;
  gpoL1: string;      gpoL1Start: string;      gpoL1End: string;
  subGpoL2: string;   subGpoL2Start: string;   subGpoL2End: string;
  groupL3: string;    groupL3Start: string;    groupL3End: string;
  subGroupL4: string; subGroupL4Start: string; subGroupL4End: string;
  practiceL5: string; practiceL5Start: string; practiceL5End: string;
}

// Date ranges used across rows
const A = { s: '2025-01-01', e: '2027-12-31' }; // active (spans today)
const B = { s: '2024-01-01', e: '2025-12-31' }; // inactive (expired)
const C = { s: '2026-07-01', e: '2027-12-31' }; // inactive (future)
const D = { s: '',           e: ''           }; // inactive (no dates)

@Component({
  selector: 'app-gpo-master-account',
  imports: [CommonModule, FormsModule, NgClass],
  templateUrl: './gpo-master-account.component.html',
  styleUrl: './gpo-master-account.component.scss'
})
export class GpoMasterAccountComponent {

  selectedRow: GpoMasterAccountRow | null = null;

  hierarchyEditRow: GpoMasterAccountRow | null = null;
  hierarchyEditForm: HierarchyEditForm = this.emptyForm();

  private emptyForm(): HierarchyEditForm {
    return { bpNumber: '', shipToName: '', shipToAddress1: '', shipToCity: '',
             shipToState: '', shipToZip: '', channel: '',
             gpoL1: '', gpoL1Start: '', gpoL1End: '',
             subGpoL2: '', subGpoL2Start: '', subGpoL2End: '',
             groupL3: '', groupL3Start: '', groupL3End: '',
             subGroupL4: '', subGroupL4Start: '', subGroupL4End: '',
             practiceL5: '', practiceL5Start: '', practiceL5End: '' };
  }

  getLevelStatus(start: string, end: string): 'active' | 'inactive' {
    if (!start || !end) return 'inactive';
    const now = new Date();
    return now >= new Date(start) && now <= new Date(end) ? 'active' : 'inactive';
  }

  onRowClick(row: GpoMasterAccountRow): void {
    this.selectedRow = this.selectedRow === row ? null : row;
  }

  openHierarchyEdit(row: GpoMasterAccountRow, event: MouseEvent): void {
    event.stopPropagation();
    this.hierarchyEditRow = row;
    this.hierarchyEditForm = {
      bpNumber: row.bpNumber, shipToName: row.shipToName, shipToAddress1: row.shipToAddress1,
      shipToCity: row.shipToCity, shipToState: row.shipToState, shipToZip: row.shipToZip,
      channel: row.channel,
      gpoL1: row.gpoL1,           gpoL1Start: row.gpoL1Start,           gpoL1End: row.gpoL1End,
      subGpoL2: row.subGpoL2,     subGpoL2Start: row.subGpoL2Start,     subGpoL2End: row.subGpoL2End,
      groupL3: row.groupL3,       groupL3Start: row.groupL3Start,       groupL3End: row.groupL3End,
      subGroupL4: row.subGroupL4, subGroupL4Start: row.subGroupL4Start, subGroupL4End: row.subGroupL4End,
      practiceL5: row.practiceL5, practiceL5Start: row.practiceL5Start, practiceL5End: row.practiceL5End,
    };
  }

  saveHierarchyEdit(): void {
    if (!this.hierarchyEditRow) return;
    Object.assign(this.hierarchyEditRow, this.hierarchyEditForm);
    this.hierarchyEditRow = null;
    this.hierarchyEditForm = this.emptyForm();
  }

  cancelHierarchyEdit(): void {
    this.hierarchyEditRow = null;
    this.hierarchyEditForm = this.emptyForm();
  }

  readonly rows: GpoMasterAccountRow[] = [
    { bpNumber: '510182311',  shipToName: 'AARON JEREMY MILBANK MD',        shipToAddress1: '6025 LAKE RD',                  shipToCity: 'WOODBURY',     shipToState: 'MN', shipToZip: '55125', gpoL1: 'Cornerstone',  gpoL1Start: A.s, gpoL1End: A.e, subGpoL2: 'Urology Management Alliance (UMA)', subGpoL2Start: A.s, subGpoL2End: A.e, groupL3: 'Minnesota Urology',                groupL3Start: B.s, groupL3End: B.e, subGroupL4: '',                     subGroupL4Start: D.s, subGroupL4End: D.e, practiceL5: '',                      practiceL5Start: D.s, practiceL5End: D.e, channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: 'Aaron Jeremy Milbank Md'      },
    { bpNumber: '510180334',  shipToName: 'ACCREDO HEALTH GROUP INC',        shipToAddress1: '1620 CENTURY CENTER PARKWAY',   shipToCity: 'MEMPHIS',      shipToState: 'TN', shipToZip: '38134', gpoL1: 'Cencora GPO',  gpoL1Start: B.s, gpoL1End: B.e, subGpoL2: '',                                  subGpoL2Start: D.s, subGpoL2End: D.e, groupL3: '',                                 groupL3Start: D.s, groupL3End: D.e, subGroupL4: '',                     subGroupL4Start: D.s, subGroupL4End: D.e, practiceL5: '',                      practiceL5Start: D.s, practiceL5End: D.e, channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: 'Accredo Health Group Inc'      },
    { bpNumber: '510184432',  shipToName: 'ADENA REGIONAL MED CNTR ADENA',  shipToAddress1: '4435 SR 159',                   shipToCity: 'CHILLICOTHE',  shipToState: 'OH', shipToZip: '45601', gpoL1: 'Vizient',      gpoL1Start: A.s, gpoL1End: A.e, subGpoL2: 'Vizient / Premier Network',         subGpoL2Start: C.s, subGpoL2End: C.e, groupL3: '',                                 groupL3Start: D.s, groupL3End: D.e, subGroupL4: '',                     subGroupL4Start: D.s, subGroupL4End: D.e, practiceL5: '',                      practiceL5Start: D.s, practiceL5End: D.e, channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: ''                              },
    { bpNumber: '510181600',  shipToName: 'ADVANCED MGMT SOLUTIONS WARE',   shipToAddress1: '3435 BRECKINRIDGE BLVD',        shipToCity: 'DULUTH',       shipToState: 'GA', shipToZip: '30096', gpoL1: 'UroGPO',       gpoL1Start: A.s, gpoL1End: A.e, subGpoL2: 'Urology Management Alliance (UMA)', subGpoL2Start: A.s, subGpoL2End: A.e, groupL3: 'Georgia Urology',                  groupL3Start: A.s, groupL3End: A.e, subGroupL4: '',                     subGroupL4Start: D.s, subGroupL4End: D.e, practiceL5: '',                      practiceL5Start: D.s, practiceL5End: D.e, channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: 'Advanced Mgmt Solutions Ware'  },
    { bpNumber: '510183414',  shipToName: 'ADVANCED UROLOGY ATRIUM HEALTH', shipToAddress1: '144 POOLE RD',                  shipToCity: 'LELAND',       shipToState: 'NC', shipToZip: '28451', gpoL1: 'UroGPO',       gpoL1Start: B.s, gpoL1End: B.e, subGpoL2: 'US Urology Partners',               subGpoL2Start: A.s, subGpoL2End: A.e, groupL3: 'Carolinas Urology Network',        groupL3Start: B.s, groupL3End: B.e, subGroupL4: '',                     subGroupL4Start: D.s, subGroupL4End: D.e, practiceL5: '',                      practiceL5Start: D.s, practiceL5End: D.e, channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: 'Advanced Urology Atrium Health' },
    { bpNumber: '510182823',  shipToName: 'ADVANCED UROLOGY PLLC',          shipToAddress1: '10535 PARK MEADOWS BLVD',       shipToCity: 'LONE TREE',    shipToState: 'CO', shipToZip: '80124', gpoL1: 'Cencora GPO',  gpoL1Start: A.s, gpoL1End: A.e, subGpoL2: 'OneOncology',                       subGpoL2Start: A.s, subGpoL2End: A.e, groupL3: 'United Urology Grp',               groupL3Start: A.s, groupL3End: A.e, subGroupL4: 'Colorado Urology',     subGroupL4Start: C.s, subGroupL4End: C.e, practiceL5: 'Advanced Urology Pllc',  practiceL5Start: A.s, practiceL5End: A.e, channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: 'Advanced Urology Pllc'         },
    { bpNumber: '1669822136', shipToName: 'AFFAN ZAFAR',                    shipToAddress1: '3030 WATERVIEW PKWY',           shipToCity: 'RICHARDSON',   shipToState: 'TX', shipToZip: '75080', gpoL1: 'Cencora GPO',  gpoL1Start: A.s, gpoL1End: A.e, subGpoL2: 'OneOncology',                       subGpoL2Start: B.s, subGpoL2End: B.e, groupL3: 'Texas Oncology Network',           groupL3Start: A.s, groupL3End: A.e, subGroupL4: 'North Texas Group',    subGroupL4Start: A.s, subGroupL4End: A.e, practiceL5: '',                      practiceL5Start: D.s, practiceL5End: D.e, channel: 'ACC', communityAcademic: '', notes: '', fullAccountName: ''                              },
    { bpNumber: '1295140747', shipToName: 'ALAN CARNES, JR',                shipToAddress1: '1150 GOLDEN WAY',               shipToCity: 'WATKINSVILLE', shipToState: 'GA', shipToZip: '30677', gpoL1: '',             gpoL1Start: D.s, gpoL1End: D.e, subGpoL2: '',                                  subGpoL2Start: D.s, subGpoL2End: D.e, groupL3: '',                                 groupL3Start: D.s, groupL3End: D.e, subGroupL4: '',                     subGroupL4Start: D.s, subGroupL4End: D.e, practiceL5: '',                      practiceL5Start: D.s, practiceL5End: D.e, channel: 'ACC', communityAcademic: '', notes: '', fullAccountName: 'Athens Area Urology'           },
    { bpNumber: '1124556972', shipToName: 'ALBERT GESKIN',                  shipToAddress1: '2790 MOSSIDE BLVD',             shipToCity: 'MONROEVILLE',  shipToState: 'PA', shipToZip: '15146', gpoL1: 'UroGPO',       gpoL1Start: A.s, gpoL1End: A.e, subGpoL2: 'Urology Alliance',                  subGpoL2Start: A.s, subGpoL2End: A.e, groupL3: 'PA Urology Partners',              groupL3Start: B.s, groupL3End: B.e, subGroupL4: 'Western PA',           subGroupL4Start: A.s, subGroupL4End: A.e, practiceL5: 'Albert Geskin MD Practice', practiceL5Start: B.s, practiceL5End: B.e, channel: 'ACC', communityAcademic: '', notes: '', fullAccountName: ''                              },
    { bpNumber: '510184003',  shipToName: 'ALLEGHENY HLTH NETWORK CANCER',  shipToAddress1: '81 WAGNER RD',                  shipToCity: 'MONACA',       shipToState: 'PA', shipToZip: '15061', gpoL1: 'Vizient',      gpoL1Start: B.s, gpoL1End: B.e, subGpoL2: '',                                  subGpoL2Start: D.s, subGpoL2End: D.e, groupL3: '',                                 groupL3Start: D.s, groupL3End: D.e, subGroupL4: '',                     subGroupL4Start: D.s, subGroupL4End: D.e, practiceL5: '',                      practiceL5Start: D.s, practiceL5End: D.e, channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: 'Allegheny Hlth Network Cancer'  },
    { bpNumber: '510183265',  shipToName: 'ALLINA HEALTH SYSTEM DBA',       shipToAddress1: '800 E 28TH ST',                 shipToCity: 'MINNEAPOLIS',  shipToState: 'MN', shipToZip: '55407', gpoL1: 'Cornerstone',  gpoL1Start: A.s, gpoL1End: A.e, subGpoL2: 'Urology Management Alliance (UMA)', subGpoL2Start: C.s, subGpoL2End: C.e, groupL3: '',                                 groupL3Start: D.s, groupL3End: D.e, subGroupL4: '',                     subGroupL4Start: D.s, subGroupL4End: D.e, practiceL5: '',                      practiceL5Start: D.s, practiceL5End: D.e, channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: 'Allina Health System Dba'       },
    { bpNumber: '510184175',  shipToName: 'AMERICAN ONC ARHSH HARMONY',     shipToAddress1: '133 HARMONY PARK CIR',          shipToCity: 'HOT SPRINGS',  shipToState: 'AR', shipToZip: '71913', gpoL1: '',             gpoL1Start: D.s, gpoL1End: D.e, subGpoL2: '',                                  subGpoL2Start: D.s, subGpoL2End: D.e, groupL3: '',                                 groupL3Start: D.s, groupL3End: D.e, subGroupL4: '',                     subGroupL4Start: D.s, subGroupL4End: D.e, practiceL5: '',                      practiceL5Start: D.s, practiceL5End: D.e, channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: ''                              },
    { bpNumber: '510184667',  shipToName: 'AMERICAN ONC TXCCO TEXAS',       shipToAddress1: '2130 W HOLOCOMBE BLVD 10TH FL', shipToCity: 'HOUSTON',      shipToState: 'TX', shipToZip: '77030', gpoL1: 'Cencora GPO',  gpoL1Start: A.s, gpoL1End: A.e, subGpoL2: 'OneOncology',                       subGpoL2Start: A.s, subGpoL2End: A.e, groupL3: 'Texas Oncology',                   groupL3Start: B.s, groupL3End: B.e, subGroupL4: '',                     subGroupL4Start: D.s, subGroupL4End: D.e, practiceL5: '',                      practiceL5Start: D.s, practiceL5End: D.e, channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: ''                              },
    { bpNumber: '510183439',  shipToName: 'AMP UROLOGY NH DOWN',            shipToAddress1: '2 ELLINWOOD DRIVE',             shipToCity: 'HARTFORD',     shipToState: 'NY', shipToZip: '13413', gpoL1: 'UroGPO',       gpoL1Start: B.s, gpoL1End: B.e, subGpoL2: 'US Urology Partners',               subGpoL2Start: A.s, subGpoL2End: A.e, groupL3: 'Associated Medical Professionals', groupL3Start: A.s, groupL3End: A.e, subGroupL4: '',                     subGroupL4Start: D.s, subGroupL4End: D.e, practiceL5: '',                      practiceL5Start: D.s, practiceL5End: D.e, channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: 'Amp Urology Nh Down'           },
    { bpNumber: '510181595',  shipToName: 'AMP UROLOGY SYRACUSE',           shipToAddress1: '1226 EAST WATER STREEET',       shipToCity: 'SYRACUSE',     shipToState: 'NY', shipToZip: '13210', gpoL1: 'UroGPO',       gpoL1Start: A.s, gpoL1End: A.e, subGpoL2: 'US Urology Partners',               subGpoL2Start: C.s, subGpoL2End: C.e, groupL3: 'Associated Medical Professionals', groupL3Start: A.s, groupL3End: A.e, subGroupL4: '',                     subGroupL4Start: D.s, subGroupL4End: D.e, practiceL5: '',                      practiceL5Start: D.s, practiceL5End: D.e, channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: 'Amp Urology Syracuse'          },
    { bpNumber: '510183671',  shipToName: 'ANIL V TUMKUR MD',               shipToAddress1: '1301 SUNSET DR STE 3',          shipToCity: 'JOHNSON CITY', shipToState: 'TN', shipToZip: '37604', gpoL1: '',             gpoL1Start: D.s, gpoL1End: D.e, subGpoL2: '',                                  subGpoL2Start: D.s, subGpoL2End: D.e, groupL3: '',                                 groupL3Start: D.s, groupL3End: D.e, subGroupL4: '',                     subGroupL4Start: D.s, subGroupL4End: D.e, practiceL5: '',                      practiceL5Start: D.s, practiceL5End: D.e, channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: 'Anil V Tumkur Md'              },
    { bpNumber: '510183247',  shipToName: 'ANNE ARUNDEL UROLOGY PA',        shipToAddress1: '600 RIDGELY AVE',               shipToCity: 'ANNAPOLIS',    shipToState: 'MD', shipToZip: '21401', gpoL1: 'UroGPO',       gpoL1Start: A.s, gpoL1End: A.e, subGpoL2: 'Urology Alliance',                  subGpoL2Start: A.s, subGpoL2End: A.e, groupL3: 'Solaris',                          groupL3Start: A.s, groupL3End: A.e, subGroupL4: 'Anne Arundel Urology', subGroupL4Start: C.s, subGroupL4End: C.e, practiceL5: '',                      practiceL5Start: D.s, practiceL5End: D.e, channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: 'Anne Arundel Urology Pa'       }
  ];
}
