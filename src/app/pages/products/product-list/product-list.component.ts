import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'pm-product-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    CommonModule,
    MatMenuModule, // ✅ Menü-Modul für Produktaktionen
    MatButtonModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  products: any[] = []; // Hier werden die Produkte gespeichert
  isLoading = true;
  errorMessage = '';
  selectedProductId: number | null = null; // Speichert das aktuell gewählte Produkt für Aktionen
  private apiUrl = 'https://294.cyrotech.ch/products'; // ✅ API-URL für Produktlöschung

  constructor(private productService: ProductService, private router: Router, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Fehler beim Abrufen der Produkte:', error);
        this.errorMessage = 'Produkte konnten nicht geladen werden.';
        this.isLoading = false;
      }
    });
  }

  // ✅ Speichert die ID des Produkts für das Menü
  setProductId(productId: number) {
    this.selectedProductId = productId;
    console.log('✅ Produkt-ID für Menü gesetzt:', this.selectedProductId); // Debugging
  }

  // ✅ Navigation zur Bearbeitungsseite
  navigateToModify() {
    if (this.selectedProductId !== null) {
      console.log('🔄 Navigiere zu:', `/products/modify/${this.selectedProductId}`);
      this.router.navigate(['/products/modify', this.selectedProductId]);
    } else {
      alert('⚠️ Kein Produkt ausgewählt!');
    }
  }

  // ✅ Produkt löschen mit Bestätigung
  deleteProduct(productId: number | null): void {
    if (productId === null) {
      alert('❌ Kein Produkt zum Löschen ausgewählt!');
      return;
    }

    const token = localStorage.getItem('authToken'); // Token abrufen
    if (!token) {
      alert('❌ Nicht eingeloggt! Löschen nicht erlaubt.');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    if (confirm(`❗ Bist du sicher, dass du das Produkt mit ID ${productId} löschen möchtest?`)) {
      this.http.delete(`${this.apiUrl}/${productId}`, {headers}).subscribe({
        next: () => {
          alert('✅ Produkt erfolgreich gelöscht!');
          this.fetchProducts();
        },
        error: (error) => {
          console.error('❌ Fehler beim Löschen des Produkts:', error);
          alert('❌ Fehler: Produkt konnte nicht gelöscht werden.');
        }
      });
    }
  }
}
