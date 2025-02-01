import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'pm-users',
  templateUrl: './users.component.html',
  imports: [
    CommonModule
  ],
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  isLoading = true;
  errorMessage = '';
  isAdmin = false;



  private apiUrl = 'https://294.cyrotech.ch/users';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.checkAdminAccess();
    this.fetchUsers();
  }

  checkAdminAccess() {
    const user = this.authService.getCurrentUser();
    if (user && user.roles.includes('admin')) {
      this.isAdmin = true; // ✅ Der Benutzer ist ein Admin
    }
  }

  fetchUsers(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Nicht eingeloggt!');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any[]>(this.apiUrl, { headers }).subscribe({
      next: (data) => {
        console.log('👥 Benutzer-Daten von API:', data);
        this.users = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Fehler beim Abrufen der Benutzer:', error);
        this.errorMessage = 'Benutzer konnten nicht geladen werden.';
        this.isLoading = false;
      }
    });
  }

  promoteUser(userId: number): void {
    if (!this.isAdmin) {
      alert('❌ Zugriff verweigert! Nur Admins dürfen Benutzer befördern.');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Nicht eingeloggt!');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.post(`${this.apiUrl}/${userId}/promote`, {}, { headers }).subscribe({
      next: () => {
        alert('✅ Benutzer wurde zum Admin befördert!');
        this.fetchUsers(); // Benutzerliste neu laden
      },
      error: (error) => {
        console.error('❌ Fehler beim Befördern des Benutzers:', error);
        alert('Fehler: Benutzer konnte nicht befördert werden.');
      }
    });
  }
}

