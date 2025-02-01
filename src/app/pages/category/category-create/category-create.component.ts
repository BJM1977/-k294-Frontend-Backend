import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'pm-category-create',
  templateUrl: './category-create.component.html',
  imports: [
    ReactiveFormsModule
  ],
  styleUrl: './category-create.component.scss'
})
export class CategoryCreateComponent implements OnInit {
  categoryForm!: FormGroup;
  private apiUrl = 'https://294.cyrotech.ch/categories'; // ✅ API-URL

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      active: [true] // Standardmäßig aktiv
    });
  }

  createCategory() {
    if (this.categoryForm.invalid) {
      alert('Bitte alle Felder korrekt ausfüllen!');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('❌ Nicht eingeloggt! Erstellen nicht erlaubt.');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const categoryData = this.categoryForm.value;
    this.http.post(this.apiUrl, categoryData, { headers }).subscribe({
      next: () => {
        alert('✅ Kategorie erfolgreich erstellt!');
        this.router.navigate(['/categories']);
      },
      error: (error) => {
        console.error('❌ Fehler beim Erstellen der Kategorie:', error);
        alert('❌ Fehler: Kategorie konnte nicht erstellt werden.');
      }
    });
  }
}

