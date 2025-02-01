import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../../services/auth.service';
import {CommonModule} from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'pm-category-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
  categories: any[] = [];
  isLoading = true;
  errorMessage = '';
  isAdmin = false;
  selectedCategoryId: number | null = null;

  private apiUrl = 'https://294.cyrotech.ch/categories';

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkAdminAccess();
    this.fetchCategories();
  }

  checkAdminAccess() {
    const user = this.authService.getCurrentUser();
    if (user && user.roles.includes('admin')) {
      this.isAdmin = true; // ✅ Admin erkannt
    }
  }

  fetchCategories() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Fehler beim Laden der Kategorien:', error);
        this.errorMessage = 'Kategorien konnten nicht geladen werden.';
        this.isLoading = false;
      }
    });
  }

  selectCategory(categoryId: number): void {
    this.selectedCategoryId = categoryId;
    console.log('✅ Gewählte Kategorie-ID:', this.selectedCategoryId); // Debugging
  }

  // ✅ Navigiert zur Bearbeitungsseite der ausgewählten Kategorie
  navigateToModify(): void {
    if (this.selectedCategoryId !== null) {
      console.log('🔄 Navigiere zu:', `/categories/modify/${this.selectedCategoryId}`);
      this.router.navigate(['/categories/modify', this.selectedCategoryId]);
    } else {
      alert('⚠️ Keine Kategorie ausgewählt!');
    }
  }

  deleteCategory(categoryId: number) {
    if (!this.isAdmin) {
      alert('❌ Zugriff verweigert! Nur Admins dürfen Kategorien löschen.');
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

    if (confirm(`❗ Bist du sicher, dass du die Kategorie mit ID ${categoryId} löschen möchtest?`)) {
      this.http.delete(`${this.apiUrl}/${categoryId}`, { headers }).subscribe({
        next: () => {
          alert('✅ Kategorie erfolgreich gelöscht!');
          this.fetchCategories();
        },
        error: (error) => {
          console.error('❌ Fehler beim Löschen:', error);
          alert('❌ Fehler: Kategorie konnte nicht gelöscht werden.');
        }
      });
    }
  }
}
