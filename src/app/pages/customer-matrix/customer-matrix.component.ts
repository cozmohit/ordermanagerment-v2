import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CustomerMatrixRecord {
  shipToName: string;
  shipToAddress1: string;
  shipToCity: string;
  shipToState: string;
  shipToZip: string;
  accountType: string;
  bpNumbersIcs: string[];
  npisAccredo: string[];
}

@Component({
  selector: 'app-customer-matrix',
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-matrix.component.html',
  styleUrl: './customer-matrix.component.scss'
})
export class CustomerMatrixComponent {

  editRecord: CustomerMatrixRecord | null = null;
  editForm: CustomerMatrixRecord | null = null;
  bpInput = '';
  npiInput = '';

  popover: { record: CustomerMatrixRecord; field: 'bp' | 'npi' } | null = null;

  openPopover(record: CustomerMatrixRecord, field: 'bp' | 'npi', event: MouseEvent): void {
    event.stopPropagation();
    this.popover = this.popover?.record === record && this.popover.field === field
      ? null
      : { record, field };
  }

  closePopover(): void {
    this.popover = null;
  }

  records: CustomerMatrixRecord[] = [
    { shipToName: 'AARON JEREMY MILBANK MD',        shipToAddress1: '6025 LAKE RD',                  shipToCity: 'WOODBURY',     shipToState: 'MN', shipToZip: '55125', accountType: 'ICS',     bpNumbersIcs: ['510182311', '510182312', '510182313'],                              npisAccredo: []                                              },
    { shipToName: 'ACCREDO HEALTH GROUP INC',        shipToAddress1: '1620 CENTURY CENTER PARKWAY',   shipToCity: 'MEMPHIS',      shipToState: 'TN', shipToZip: '38134', accountType: 'Accredo', bpNumbersIcs: [],                                                                   npisAccredo: ['1234567890', '1234567891', '1234567892']      },
    { shipToName: 'ADENA REGIONAL MED CNTR ADENA',  shipToAddress1: '4435 SR 159',                   shipToCity: 'CHILLICOTHE',  shipToState: 'OH', shipToZip: '45601', accountType: 'ICS',     bpNumbersIcs: ['510184432', '510184433', '510184434', '510184435'],                 npisAccredo: []                                              },
    { shipToName: 'ADVANCED MGMT SOLUTIONS WARE',   shipToAddress1: '3435 BRECKINRIDGE BLVD',        shipToCity: 'DULUTH',       shipToState: 'GA', shipToZip: '30096', accountType: 'ICS',     bpNumbersIcs: ['510181600'],                                                        npisAccredo: []                                              },
    { shipToName: 'ADVANCED UROLOGY ATRIUM HEALTH', shipToAddress1: '144 POOLE RD',                  shipToCity: 'LELAND',       shipToState: 'NC', shipToZip: '28451', accountType: 'ICS',     bpNumbersIcs: ['510183414', '510183415', '510183416', '510183417', '510183418'],    npisAccredo: []                                              },
    { shipToName: 'ADVANCED UROLOGY PLLC',          shipToAddress1: '10535 PARK MEADOWS BLVD',       shipToCity: 'LONE TREE',    shipToState: 'CO', shipToZip: '80124', accountType: 'ICS',     bpNumbersIcs: ['510182823', '510182824'],                                           npisAccredo: []                                              },
    { shipToName: 'AFFAN ZAFAR',                    shipToAddress1: '3030 WATERVIEW PKWY',           shipToCity: 'RICHARDSON',   shipToState: 'TX', shipToZip: '75080', accountType: 'Accredo', bpNumbersIcs: [],                                                                   npisAccredo: ['1669822136', '1669822137', '1669822138', '1669822139', '1669822140'] },
    { shipToName: 'ALAN CARNES, JR',                shipToAddress1: '1150 GOLDEN WAY',               shipToCity: 'WATKINSVILLE', shipToState: 'GA', shipToZip: '30677', accountType: 'Accredo', bpNumbersIcs: [],                                                                   npisAccredo: ['1295140747']                                  },
    { shipToName: 'ALBERT GESKIN',                  shipToAddress1: '2790 MOSSIDE BLVD',             shipToCity: 'MONROEVILLE',  shipToState: 'PA', shipToZip: '15146', accountType: 'Accredo', bpNumbersIcs: [],                                                                   npisAccredo: ['1124556972', '1124556973', '1124556974']      },
    { shipToName: 'ALLEGHENY HLTH NETWORK CANCER',  shipToAddress1: '81 WAGNER RD',                  shipToCity: 'MONACA',       shipToState: 'PA', shipToZip: '15061', accountType: 'ICS',     bpNumbersIcs: ['510184003', '510184004', '510184005', '510184006'],                 npisAccredo: []                                              },
    { shipToName: 'ALLINA HEALTH SYSTEM DBA',       shipToAddress1: '800 E 28TH ST',                 shipToCity: 'MINNEAPOLIS',  shipToState: 'MN', shipToZip: '55407', accountType: 'ICS',     bpNumbersIcs: ['510183265', '510183266', '510183267'],                              npisAccredo: []                                              },
    { shipToName: 'AMERICAN ONC ARHSH HARMONY',     shipToAddress1: '133 HARMONY PARK CIR',          shipToCity: 'HOT SPRINGS',  shipToState: 'AR', shipToZip: '71913', accountType: 'ICS',     bpNumbersIcs: ['510184175'],                                                        npisAccredo: []                                              },
    { shipToName: 'AMERICAN ONC TXCCO TEXAS',       shipToAddress1: '2130 W HOLOCOMBE BLVD 10TH FL', shipToCity: 'HOUSTON',      shipToState: 'TX', shipToZip: '77030', accountType: 'ICS',     bpNumbersIcs: ['510184667', '510184668', '510184669', '510184670', '510184671', '510184672'], npisAccredo: []                              },
    { shipToName: 'AMP UROLOGY NH DOWN',            shipToAddress1: '2 ELLINWOOD DRIVE',             shipToCity: 'HARTFORD',     shipToState: 'NY', shipToZip: '13413', accountType: 'ICS',     bpNumbersIcs: ['510183439', '510183440'],                                           npisAccredo: []                                              },
    { shipToName: 'AMP UROLOGY SYRACUSE',           shipToAddress1: '1226 EAST WATER STREEET',       shipToCity: 'SYRACUSE',     shipToState: 'NY', shipToZip: '13210', accountType: 'ICS',     bpNumbersIcs: ['510181595'],                                                        npisAccredo: []                                              },
    { shipToName: 'ANIL V TUMKUR MD',               shipToAddress1: '1301 SUNSET DR STE 3',          shipToCity: 'JOHNSON CITY', shipToState: 'TN', shipToZip: '37604', accountType: 'Accredo', bpNumbersIcs: [],                                                                   npisAccredo: ['510183671', '510183672', '510183673', '510183674'] },
    { shipToName: 'ANNE ARUNDEL UROLOGY PA',        shipToAddress1: '600 RIDGELY AVE',               shipToCity: 'ANNAPOLIS',    shipToState: 'MD', shipToZip: '21401', accountType: 'ICS',     bpNumbersIcs: ['510183247', '510183248', '510183249'],                              npisAccredo: []                                              },
  ];

  openEdit(record: CustomerMatrixRecord, event: MouseEvent): void {
    event.stopPropagation();
    this.editRecord = record;
    this.editForm = { ...record, bpNumbersIcs: [...record.bpNumbersIcs], npisAccredo: [...record.npisAccredo] };
    this.bpInput = '';
    this.npiInput = '';
  }

  saveEdit(): void {
    if (!this.editRecord || !this.editForm) return;
    Object.assign(this.editRecord, this.editForm);
    this.editRecord = null;
    this.editForm = null;
  }

  cancelEdit(): void {
    this.editRecord = null;
    this.editForm = null;
  }

  addBp(): void {
    const v = this.bpInput.trim();
    if (v && this.editForm) {
      this.editForm.bpNumbersIcs.push(v);
      this.bpInput = '';
    }
  }

  removeBp(index: number): void {
    this.editForm?.bpNumbersIcs.splice(index, 1);
  }

  addNpi(): void {
    const v = this.npiInput.trim();
    if (v && this.editForm) {
      this.editForm.npisAccredo.push(v);
      this.npiInput = '';
    }
  }

  removeNpi(index: number): void {
    this.editForm?.npisAccredo.splice(index, 1);
  }
}
