import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SalesRegistryComponent } from './pages/sales-registry/sales-registry.component';
import { PatientEnrollmentComponent } from './pages/patient-enrollment/patient-enrollment.component';
import { OrderManagementComponent } from './pages/order-management/order-management.component';
import { ProviderNetworkComponent } from './pages/provider-network/provider-network.component';
import { TerritoryManagerComponent } from './pages/territory-manager/territory-manager.component';
import { SalesTeamComponent } from './pages/sales-team/sales-team.component';
import { GpoComponent } from './pages/gpo/gpo.component';
import { GpoMasterAccountComponent } from './pages/gpo-master-account/gpo-master-account.component';
import { ZipToTerritoryComponent } from './pages/zip-to-territory/zip-to-territory.component';
import { UsersComponent } from './pages/users/users.component';
import { CustomerMatrixComponent } from './pages/customer-matrix/customer-matrix.component';

export const routes: Routes = [
  { path: '', redirectTo: 'order-management', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'sales-registry', component: SalesRegistryComponent },
  { path: 'order-management', component: OrderManagementComponent },
  { path: 'patient-enrollment', component: PatientEnrollmentComponent },
  { path: 'provider-network', component: ProviderNetworkComponent },
  { path: 'territory-manager', component: TerritoryManagerComponent },
  { path: 'sales-team', component: SalesTeamComponent },
  { path: 'gpo', component: GpoMasterAccountComponent },
  { path: 'customer-matrix', component: CustomerMatrixComponent },
  { path: 'admin/gpo', component: GpoComponent },
  { path: 'zip-to-territory', component: ZipToTerritoryComponent },
  { path: 'users', component: UsersComponent },
];
