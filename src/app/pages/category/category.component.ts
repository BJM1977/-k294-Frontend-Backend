import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'pm-category',
  templateUrl: './category.component.html',
  imports: [ReactiveFormsModule],
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  categoryId!: number;
  isAdmin = false;
  isLoading = true;
  errorMessage = '';
  selectedCategoryId: number | null = null;

  private apiUrl = 'https://294.cyrotech.ch/categories';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    console.log('🔍 URL-Parameter (Kategorie-ID):', idParam); // Debugging

    if (!idParam || isNaN(Number(idParam))) {
      alert('❌ Fehler: Ungültige Kategorie-ID!');
      this.router.navigate(['/categories/list']);
      return;
    }

    this.categoryId = Number(idParam);
    this.checkAdminAccess();
    this.initForm();
    this.loadCategory();
  }

  checkAdminAccess() {
    const user = this.authService.getCurrentUser();
    if (user && user.roles.includes('admin')) {
      this.isAdmin = true;
    } else {
      alert('❌ Zugriff verweigert! Nur Admins dürfen Kategorien bearbeiten.');
      this.router.navigate(['/categories/list']);
    }
  }

  private initForm() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      active: [true]
    });
  }

  loadCategory() {
    this.http.get<any>(`${this.apiUrl}/${this.categoryId}`).subscribe({
      next: (category) => {
        if (category) {
          this.categoryForm.patchValue(category);
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('❌ Fehler beim Laden der Kategorie:', error);
        alert('❌ Kategorie konnte nicht geladen werden.');
        this.router.navigate(['/categories/list']);
      }
    });
  }

  updateCategory() {
    if (this.categoryForm.invalid) {
      alert('⚠️ Bitte alle Felder korrekt ausfüllen!');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('❌ Nicht eingeloggt! Bearbeitung nicht erlaubt.');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.put(`${this.apiUrl}/${this.categoryId}`, this.categoryForm.value, { headers }).subscribe({
      next: () => {
        alert('✅ Kategorie erfolgreich aktualisiert!');
        this.router.navigate(['/categories/list']);
      },
      error: (error) => {
        console.error('❌ Fehler beim Aktualisieren der Kategorie:', error);
        alert('❌ Fehler: Kategorie konnte nicht gespeichert werden.');
      }
    });
  }
}
