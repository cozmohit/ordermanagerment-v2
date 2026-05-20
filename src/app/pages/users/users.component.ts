import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  department: string;
  territory: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  role: string;
}

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  readonly roleOptions = [
    'User',
    'Account Manager',
    'Project Manager',
    'Territory Business Manager',
    'Area Business Director',
    'Admin'
  ];

  users: UserRecord[] = [
    { id: 'USR-001', name: 'Keith DeRuiter',       email: 'k.deruiter@immunitybio.com',       department: 'Sales',      territory: 'Boston, MA',       status: 'Active',   lastLogin: '05/07/2026', role: 'Area Business Director'    },
    { id: 'USR-002', name: 'Chuck Gaetano',         email: 'c.gaetano@immunitybio.com',         department: 'Sales',      territory: 'Atlanta, GA',       status: 'Active',   lastLogin: '05/06/2026', role: 'Area Business Director'    },
    { id: 'USR-003', name: 'Katrina Caronia',       email: 'k.caronia@immunitybio.com',         department: 'Sales',      territory: 'Tampa, FL',         status: 'Active',   lastLogin: '05/07/2026', role: 'Territory Business Manager' },
    { id: 'USR-004', name: 'Alexandra Maddalosso',  email: 'a.maddalosso@immunitybio.com',      department: 'Sales',      territory: 'Los Angeles, CA',   status: 'Active',   lastLogin: '05/05/2026', role: 'Territory Business Manager' },
    { id: 'USR-005', name: 'Timothy Kittell',       email: 't.kittell@immunitybio.com',         department: 'Operations', territory: 'Northeast',         status: 'Active',   lastLogin: '05/04/2026', role: 'Account Manager'           },
    { id: 'USR-006', name: 'Debra Henderson',       email: 'd.henderson@immunitybio.com',        department: 'Operations', territory: 'Midwest',           status: 'Inactive', lastLogin: '04/21/2026', role: 'Project Manager'           },
    { id: 'USR-007', name: 'Kristen Cook',          email: 'k.cook@immunitybio.com',            department: 'Sales',      territory: 'Southwest',         status: 'Active',   lastLogin: '05/06/2026', role: 'User'                      }
  ];

  onRoleChange(user: UserRecord, newRole: string): void {
    user.role = newRole;
  }
}
