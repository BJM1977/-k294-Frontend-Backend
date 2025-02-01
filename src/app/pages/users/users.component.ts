import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'pm-users',
  templateUrl: './users.component.html',
  imports: [
    CommonModule
  ],
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users: any[] = []; // Speichert die Benutzerliste
  isLoading = true;
  errorMessage = '';



  private apiUrl = 'https://294.cyrotech.ch/users';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsers();
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
        console.log('👥 Benutzer-Daten von API:', data); // ✅ Debugging
        this.users = data; // ✅ Direkt speichern, da `isAdmin` bereits existiert
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
        this.fetchUsers(); // Liste neu laden
      },
      error: (error) => {
        console.error('❌ Fehler beim Befördern des Benutzers:', error);
        alert('Fehler: Benutzer konnte nicht befördert werden.');
      }
    });
  }
}

