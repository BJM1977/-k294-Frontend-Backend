import {Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {JsonPipe} from '@angular/common';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {CategoryControllerService, CategoryShowDto} from '../../../openapi-client';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import {MatSlideToggle} from '@angular/material/slide-toggle';

@Component({
  selector: 'pm-product-modify',
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    JsonPipe,
    ReactiveFormsModule,
    MatError,
    MatSelect,
    MatOption,
    MatButton,
    CommonModule,
    FormsModule,
    MatSlideToggle
  ],
  templateUrl: './product-modify.component.html',
  styleUrl: './product-modify.component.scss'
})
export class ProductModifyComponent implements OnInit {
  productFormGroup!: FormGroup;
  isAdmin = false; // Standardmäßig kein Admin

  constructor(
    private authService: AuthService,
    private productService: ProductService, // <--- ProductService hier einfügen
    private router: Router,
    private fb: FormBuilder
  ) {}


  ngOnInit(): void {
    this.checkAdminAccess();
    this.initForm(); // Formular initialisieren
  }

  initForm() {
    this.productFormGroup = this.fb.group({
      sku: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      stock: new FormControl(0, [Validators.required, Validators.min(0)]),
      active: new FormControl(true), // Standardmäßig aktiv setzen
      categoryId: new FormControl('', Validators.required)

    });
  }

  get skuControl(): FormControl {
    return this.productFormGroup.get('sku') as FormControl;
  }
  get nameControl(): FormControl {
    return this.productFormGroup.get('name') as FormControl;
  }
  get imageControl(): FormControl {
    return this.productFormGroup.get('image') as FormControl;
  }
  get priceControl(): FormControl {
    return this.productFormGroup.get('price') as FormControl;
  }
  get stockControl(): FormControl {
    return this.productFormGroup.get('stock') as FormControl;
  }
  get categoryIdControl(): FormControl {
    return this.productFormGroup.get('categoryId') as FormControl;
  }
  get descriptionControl(): FormControl {
    return this.productFormGroup.get('description') as FormControl;
  }
  get activeControl(): FormControl {
    return this.productFormGroup.get('active') as FormControl;
  }

  checkAdminAccess() {
    const user = this.authService.getCurrentUser(); // Benutzer abrufen
    if (!user || !user.roles.includes('admin')) {
      alert('Zugriff verweigert! Nur Admins dürfen Produkte erstellen.');
      this.router.navigate(['/']); // Weiterleitung zur Startseite
    } else {
      this.isAdmin = true; // Benutzer ist Admin, Zugriff gewährt
    }
  }

  // ✅ Methode zum Absenden der Produktdaten
  onSubmit() {
    if (this.productFormGroup.valid) {
      console.log('Sende Produkt an API:', this.productFormGroup.value);

      this.productService.createProduct(this.productFormGroup.value).subscribe({
        next: (response) => {
          console.log('Produkt erfolgreich erstellt:', response);
          alert('Produkt wurde erfolgreich erstellt!');
        },
        error: (error) => {
          console.error('Fehler beim Erstellen des Produkts:', error);
          alert('Fehler: Das Produkt konnte nicht erstellt werden.');
        }
      });
    } else {
      alert('Bitte alle Felder korrekt ausfüllen!');
    }
  }
}
