import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'https://294.cyrotech.ch/products'; // API-URL

  constructor(private http: HttpClient) {}

  // Produkt erstellen (Nur für Admins)
  createProduct(productData: any): Observable<any> {
    const token = localStorage.getItem('authToken'); // Token abrufen

    if (!token) {
      console.error('Kein Token gefunden! Benutzer ist möglicherweise nicht eingeloggt.');
      alert('Authentifizierungsfehler! Bitte erneut einloggen.');
      return new Observable();
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // ✅ Produktdaten mit allen erforderlichen Feldern an die API senden
    const payload = {
      sku: productData.sku,
      active: productData.active || true, // Falls nichts gesetzt, true als Standard
      name: productData.name,
      image: productData.image,
      description: productData.description || 'Keine Beschreibung vorhanden',
      price: parseFloat(productData.price), // Preis als Float
      stock: parseInt(productData.stock, 10), // Lagerbestand als Integer
      category: {
        id: parseInt(productData.categoryId, 10) // `categoryId` muss innerhalb von `category` sein
      }
    };

    console.log('Sende Produkt an API:', payload); // Debugging

    return this.http.post(`https://294.cyrotech.ch/products`, payload, { headers });
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}`); // Kein Token nötig, da alle zugreifen dürfen
  }
  // ✅ Produkt anhand der ID abrufen
  getProductById(productId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${productId}`);
  }

  // ✅ Produkt aktualisieren (Nur für Admins)
  updateProduct(productId: number, productData: any): Observable<any> {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error('❌ Kein Token vorhanden! Bitte erneut einloggen.');
      return throwError(() => new Error('Authentifizierungsfehler!'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put(`${this.baseUrl}/${productId}`, productData, {headers}).pipe(
      catchError(error => {
        console.error(`❌ Fehler beim Aktualisieren des Produkts mit ID ${productId}:`, error);
        return throwError(() => new Error('Fehler beim Speichern des Produkts!'));
      })
    );
  }

}
