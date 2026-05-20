import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface GpoNavRow {
  bpNumber: string;
  shipToName: string;
  shipToAddress1: string;
  shipToCity: string;
  shipToState: string;
  shipToZip: string;
  gpoL1: string;
  subGpoL2: string;
  groupL3: string;
  subGroupL4: string;
  practiceL5: string;
  channel: string;
  communityAcademic: string;
  notes: string;
  fullAccountName: string;
}

@Component({
  selector: 'app-gpo-nav',
  imports: [CommonModule, FormsModule, NgClass],
  templateUrl: './gpo-nav.component.html',
  styleUrl: './gpo-nav.component.scss'
})
export class GpoNavComponent {

  editingRow: GpoNavRow | null = null;
  editForm: Partial<GpoNavRow> = {};

  detailsRow: GpoNavRow | null = null;
  openDetails(row: GpoNavRow): void  { this.detailsRow = row; }
  closeDetails(): void               { this.detailsRow = null; }

  readonly rows: GpoNavRow[] = [
    { bpNumber: '510182311',  shipToName: 'AARON JEREMY MILBANK MD',        shipToAddress1: '6025 LAKE RD',                  shipToCity: 'WOODBURY',     shipToState: 'MN', shipToZip: '55125', gpoL1: 'Cornerstone', subGpoL2: 'Urology Management Alliance (UMA)', groupL3: 'Minnesota Urology',               subGroupL4: '',                 practiceL5: '',                     channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: 'Aaron Jeremy Milbank Md'      },
    { bpNumber: '510180334',  shipToName: 'ACCREDO HEALTH GROUP INC',        shipToAddress1: '1620 CENTURY CENTER PARKWAY',   shipToCity: 'MEMPHIS',      shipToState: 'TN', shipToZip: '38134', gpoL1: '',            subGpoL2: '',                                 groupL3: '',                                subGroupL4: '',                 practiceL5: '',                     channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: 'Accredo Health Group Inc'      },
    { bpNumber: '510184432',  shipToName: 'ADENA REGIONAL MED CNTR ADENA',  shipToAddress1: '4435 SR 159',                   shipToCity: 'CHILLICOTHE',  shipToState: 'OH', shipToZip: '45601', gpoL1: '',            subGpoL2: '',                                 groupL3: '',                                subGroupL4: '',                 practiceL5: '',                     channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: ''                              },
    { bpNumber: '510181600',  shipToName: 'ADVANCED MGMT SOLUTIONS WARE',   shipToAddress1: '3435 BRECKINRIDGE BLVD',        shipToCity: 'DULUTH',       shipToState: 'GA', shipToZip: '30096', gpoL1: 'UroGPO',      subGpoL2: 'Urology Management Alliance (UMA)', groupL3: 'Georgia Urology',                 subGroupL4: '',                 practiceL5: '',                     channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: 'Advanced Mgmt Solutions Ware'  },
    { bpNumber: '510183414',  shipToName: 'ADVANCED UROLOGY ATRIUM HEALTH', shipToAddress1: '144 POOLE RD',                  shipToCity: 'LELAND',       shipToState: 'NC', shipToZip: '28451', gpoL1: '',            subGpoL2: '',                                 groupL3: '',                                subGroupL4: '',                 practiceL5: '',                     channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: 'Advanced Urology Atrium Health' },
    { bpNumber: '510182823',  shipToName: 'ADVANCED UROLOGY PLLC',          shipToAddress1: '10535 PARK MEADOWS BLVD',       shipToCity: 'LONE TREE',    shipToState: 'CO', shipToZip: '80124', gpoL1: 'Cencora GPO', subGpoL2: 'OneOncology',                      groupL3: 'United Urology Grp',              subGroupL4: 'Colorado Urology', practiceL5: 'Advanced Urology Pllc', channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: 'Advanced Urology Pllc'         },
    { bpNumber: '1669822136', shipToName: 'AFFAN ZAFAR',                    shipToAddress1: '3030 WATERVIEW PKWY',           shipToCity: 'RICHARDSON',   shipToState: 'TX', shipToZip: '75080', gpoL1: '',            subGpoL2: '',                                 groupL3: '',                                subGroupL4: '',                 practiceL5: '',                     channel: 'ACC', communityAcademic: '', notes: '', fullAccountName: ''                              },
    { bpNumber: '1295140747', shipToName: 'ALAN CARNES, JR',                shipToAddress1: '1150 GOLDEN WAY',               shipToCity: 'WATKINSVILLE', shipToState: 'GA', shipToZip: '30677', gpoL1: '',            subGpoL2: '',                                 groupL3: '',                                subGroupL4: '',                 practiceL5: '',                     channel: 'ACC', communityAcademic: '', notes: '', fullAccountName: 'Athens Area Urology'           },
    { bpNumber: '1124556972', shipToName: 'ALBERT GESKIN',                  shipToAddress1: '2790 MOSSIDE BLVD',             shipToCity: 'MONROEVILLE',  shipToState: 'PA', shipToZip: '15146', gpoL1: '',            subGpoL2: '',                                 groupL3: '',                                subGroupL4: '',                 practiceL5: '',                     channel: 'ACC', communityAcademic: '', notes: '', fullAccountName: ''                              },
    { bpNumber: '510184003',  shipToName: 'ALLEGHENY HLTH NETWORK CANCER',  shipToAddress1: '81 WAGNER RD',                  shipToCity: 'MONACA',       shipToState: 'PA', shipToZip: '15061', gpoL1: '',            subGpoL2: '',                                 groupL3: '',                                subGroupL4: '',                 practiceL5: '',                     channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: 'Allegheny Hlth Network Cancer'  },
    { bpNumber: '510183265',  shipToName: 'ALLINA HEALTH SYSTEM DBA',       shipToAddress1: '800 E 28TH ST',                 shipToCity: 'MINNEAPOLIS',  shipToState: 'MN', shipToZip: '55407', gpoL1: '',            subGpoL2: '',                                 groupL3: '',                                subGroupL4: '',                 practiceL5: '',                     channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: 'Allina Health System Dba'       },
    { bpNumber: '510184175',  shipToName: 'AMERICAN ONC ARHSH HARMONY',     shipToAddress1: '133 HARMONY PARK CIR',          shipToCity: 'HOT SPRINGS',  shipToState: 'AR', shipToZip: '71913', gpoL1: '',            subGpoL2: '',                                 groupL3: '',                                subGroupL4: '',                 practiceL5: '',                     channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: ''                              },
    { bpNumber: '510184667',  shipToName: 'AMERICAN ONC TXCCO TEXAS',       shipToAddress1: '2130 W HOLOCOMBE BLVD 10TH FL', shipToCity: 'HOUSTON',      shipToState: 'TX', shipToZip: '77030', gpoL1: '',            subGpoL2: '',                                 groupL3: '',                                subGroupL4: '',                 practiceL5: '',                     channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: ''                              },
    { bpNumber: '510183439',  shipToName: 'AMP UROLOGY NH DOWN',            shipToAddress1: '2 ELLINWOOD DRIVE',             shipToCity: 'HARTFORD',     shipToState: 'NY', shipToZip: '13413', gpoL1: 'UroGPO',      subGpoL2: 'US Urology Partners',              groupL3: 'Associated Medical Professionals', subGroupL4: '',                 practiceL5: '',                     channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: 'Amp Urology Nh Down'           },
    { bpNumber: '510181595',  shipToName: 'AMP UROLOGY SYRACUSE',           shipToAddress1: '1226 EAST WATER STREEET',       shipToCity: 'SYRACUSE',     shipToState: 'NY', shipToZip: '13210', gpoL1: 'UroGPO',      subGpoL2: 'US Urology Partners',              groupL3: 'Associated Medical Professionals', subGroupL4: '',                 practiceL5: '',                     channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: 'Amp Urology Syracuse'          },
    { bpNumber: '510183671',  shipToName: 'ANIL V TUMKUR MD',               shipToAddress1: '1301 SUNSET DR STE 3',          shipToCity: 'JOHNSON CITY', shipToState: 'TN', shipToZip: '37604', gpoL1: '',            subGpoL2: '',                                 groupL3: '',                                subGroupL4: '',                 practiceL5: '',                     channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: 'Anil V Tumkur Md'              },
    { bpNumber: '510183247',  shipToName: 'ANNE ARUNDEL UROLOGY PA',        shipToAddress1: '600 RIDGELY AVE',               shipToCity: 'ANNAPOLIS',    shipToState: 'MD', shipToZip: '21401', gpoL1: 'UroGPO',      subGpoL2: 'Urology Alliance',                 groupL3: 'Solaris',                         subGroupL4: 'Anne Arundel Urology', practiceL5: '',                  channel: 'ICS', communityAcademic: '', notes: '', fullAccountName: 'Anne Arundel Urology Pa'       }
  ];

  openEdit(row: GpoNavRow): void {
    this.editingRow = row;
    this.editForm = { ...row };
  }

  closeEdit(): void {
    this.editingRow = null;
    this.editForm = {};
  }

  saveEdit(): void {
    if (!this.editingRow) return;
    Object.assign(this.editingRow, this.editForm);
    this.closeEdit();
  }
}
