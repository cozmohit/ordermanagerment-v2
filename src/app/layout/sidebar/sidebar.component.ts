import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

interface SidebarMenuItem {
  label: string;
  icon?: string;
  route?: string;
  queryParams?: Record<string, string>;
  children?: SidebarMenuItem[];
  section?: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private readonly router = inject(Router);

  @Input() collapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();
  @Output() requestExpand = new EventEmitter<void>();

  protected expandedMenu: string | null = null;

  protected readonly menuItems: SidebarMenuItem[] = [
    { label: 'Dashboard', icon: 'bi bi-grid', route: '/dashboard' },
    { label: 'Customer Matrix', icon: 'bi bi-grid-3x3', route: '/customer-matrix' },
    { label: 'Order Management', icon: 'bi bi-cart3', route: '/order-management' },
    { label: 'Patient Enrollment', icon: 'bi bi-person-hearts', route: '/patient-enrollment' },
    { label: 'GPO Hierarchy', icon: 'bi bi-diagram-3', route: '/gpo' },
    { label: 'Zip to Territory', icon: 'bi bi-geo-alt', route: '/zip-to-territory' },
    {
      label: 'Admin',
      icon: 'bi bi-shield-lock',
      children: [
        // { label: 'GPO', route: '/admin/gpo' },
        { label: 'Users', route: '/users' }
      ]
    }
  ];

  protected toggleMenu(label: string): void {
    if (this.collapsed) {
      this.requestExpand.emit();
      this.expandedMenu = label;
      return;
    }

    this.expandedMenu = this.expandedMenu === label ? null : label;
  }

  protected onToggleCollapse(): void {
    if (!this.collapsed) {
      this.expandedMenu = null;
    }

    this.toggleCollapse.emit();
  }

  protected isLinkActive(item: SidebarMenuItem): boolean {
    if (!item.route) {
      return false;
    }

    const currentPath = this.router.url.split('?')[0];
    return currentPath === item.route || currentPath.startsWith(item.route + '/');
  }

  protected isChildActive(item: SidebarMenuItem): boolean {
    if (!item.route) {
      return false;
    }

    const urlTree = this.router.parseUrl(this.router.url);
    const currentPath = urlTree.root.children['primary']?.segments.map((segment) => segment.path).join('/') ?? '';
    const normalizedPath = `/${currentPath}`;

    if (normalizedPath !== item.route) {
      return false;
    }

    if (!item.queryParams) {
      return true;
    }

    return Object.entries(item.queryParams).every(([key, value]) => urlTree.queryParams[key] === value);
  }

  protected isMenuActive(item: SidebarMenuItem): boolean {
    return item.children?.some((child) => this.isChildActive(child)) ?? false;
  }
}
