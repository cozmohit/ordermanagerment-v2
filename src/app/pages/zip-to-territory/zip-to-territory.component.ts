import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ZipRow {
  mdoZip: string;
  territoryId: string;
  city: string;
  state: string;
  currTerr: string;
  lgcyTerr: string;
  abd: string;
  tbm: string;
  effective: string;
  source: string;
}

@Component({
  selector: 'app-zip-to-territory',
  imports: [CommonModule, FormsModule],
  templateUrl: './zip-to-territory.component.html',
  styleUrl: './zip-to-territory.component.scss'
})
export class ZipToTerritoryComponent {

  filterZip = '';
  filterTerritory = '';
  pendingZip = '';
  pendingTerritory = '';

  editingRow: ZipRow | null = null;
  editForm: Partial<ZipRow> = {};

  readonly rows: ZipRow[] = [
    { mdoZip: '75082', territoryId: 'TX3829', city: 'Dallas',    state: 'TX', currTerr: 'NC1', lgcyTerr: 'NCA',     abd: 'C. Gaetano',    tbm: 'A. Rippy',        effective: '04/01/2026', source: 'Veeva'        },
    { mdoZip: '27701', territoryId: 'NC4721', city: 'Durham',    state: 'NC', currTerr: 'EA1', lgcyTerr: 'EAA',     abd: 'K. DeRuiter',   tbm: 'L. Volomino',     effective: '04/01/2026', source: 'Veeva'        },
    { mdoZip: '75201', territoryId: 'TX5614', city: 'Dallas',    state: 'TX', currTerr: 'SW1', lgcyTerr: 'SWA',     abd: 'A. Maddalozzo', tbm: 'K. Denor-Alcala', effective: '04/01/2026', source: 'Veeva'        },
    { mdoZip: '21201', territoryId: 'MD2983', city: 'Baltimore', state: 'MD', currTerr: 'NC1', lgcyTerr: 'SC1→NC1', abd: 'C. Gaetano',    tbm: 'A. Rippy',        effective: '04/01/2026', source: 'Realigned Q2' },
  ];

  get filteredRows(): ZipRow[] {
    const zip  = this.filterZip.trim().toLowerCase();
    const terr = this.filterTerritory.trim().toLowerCase();
    return this.rows.filter(r =>
      (!zip  || r.mdoZip.includes(zip) || r.city.toLowerCase().includes(zip) || r.state.toLowerCase().includes(zip)) &&
      (!terr || r.currTerr.toLowerCase().includes(terr) || r.lgcyTerr.toLowerCase().includes(terr))
    );
  }

  applyFilters(): void {
    this.filterZip       = this.pendingZip;
    this.filterTerritory = this.pendingTerritory;
  }

  openEdit(row: ZipRow): void {
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
