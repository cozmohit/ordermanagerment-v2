import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { TopNavComponent } from './layout/top-nav/top-nav.component';
// import { FooterComponent } from './layout/footer/footer.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, TopNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Anktiva Portal';
  protected isSidebarCollapsed = false;

  protected toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.emitLayoutResize();
  }

  protected expandSidebar(): void {
    this.isSidebarCollapsed = false;
    this.emitLayoutResize();
  }

  private emitLayoutResize(): void {
    setTimeout(() => window.dispatchEvent(new Event('resize')), 220);
  }
}
