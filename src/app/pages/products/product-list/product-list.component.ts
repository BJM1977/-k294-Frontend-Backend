import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../../services/product.service';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {MatMenu, MatMenuModule, MatMenuTrigger} from '@angular/material/menu';
import { Router } from '@angular/router';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'pm-product-list',
  imports: [
    CurrencyPipe,
    CommonModule,
    MatMenu,
    MatMenuTrigger,
    MatMenuModule,
    MatButton
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  products: any[] = []; // Hier werden die Produkte gespeichert
  isLoading = true;
  errorMessage = '';
  selectedProductId: number | null = null;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data; // Produkte aus der API speichern
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Fehler beim Abrufen der Produkte:', error);
        this.errorMessage = 'Produkte konnten nicht geladen werden.';
        this.isLoading = false;
      }
    });
  }

  // ✅ Setzt die ID des Produkts, das bearbeitet werden soll
  setProductId(productId: number) {
    this.selectedProductId = productId;
    console.log('✅ Produkt-ID gesetzt:', this.selectedProductId); // Debugging
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
}
