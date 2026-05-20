import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shared-table.component.html',
  styleUrl: './shared-table.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SharedTableComponent {
  @Input() title = '';
  @Input() headers: string[] = [];
  @Input() searchTerm = '';
  @Input() searchPlaceholder = 'Search...';
  @Input() addButtonLabel = 'Add';
  @Input() showHeader = true;
  @Input() showSearch = false;
  @Input() showAddButton = false;
  @Input() isLoading = false;
  @Input() loadingText = 'Loading...';
  @Input() isEmpty = false;
  @Input() emptyText = 'No data available';
  @Input() tableClass = 'table table-hover table-sm align-middle mb-0 ib-data-table';
  @Input() theadClass = 'ib-table-header';
  @Input() useProjectedHead = false;
  @Input() columnCount = 0;

  @Output() searchChange = new EventEmitter<string>();
  @Output() addClick = new EventEmitter<void>();

  onSearchTermChange(value: string): void {
    this.searchChange.emit(value);
  }

  onAddClick(): void {
    this.addClick.emit();
  }
}
