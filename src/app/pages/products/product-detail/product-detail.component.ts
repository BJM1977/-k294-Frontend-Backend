import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../services/product.service';
import {AuthService} from '../../../services/auth.service';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'pm-product-detail',
  imports: [
    MatLabel,
    MatFormField,
    ReactiveFormsModule,
    MatSlideToggle,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  productForm!: FormGroup;
  productId!: number;
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.checkAdminAccess();
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    console.log(this.route.snapshot.paramMap);
    console.log(this.productId);
    this.initForm();
    this.loadProduct();
  }

  checkAdminAccess() {
    const user = this.authService.getCurrentUser();
    if (!user || !user.roles.includes('admin')) {
      alert('Zugriff verweigert! Nur Admins dürfen Produkte bearbeiten.');
      this.router.navigate(['/']);
    } else {
      this.isAdmin = true;
    }
  }

  initForm() {
    this.productForm = this.fb.group({
      sku: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      stock: new FormControl(0, [Validators.required, Validators.min(0)]),
      active: new FormControl(true),
      categoryId: new FormControl('', Validators.required),

    });
  }

  loadProduct() {
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        console.log(product);
        if (!product) {
          console.error('❌ Fehler: Produkt ist null');
          alert('Produkt konnte nicht geladen werden.');
          return;
        }

        this.productForm.patchValue({
          sku: product.sku,
          name: product.name,
          image: product.image,
          description: product.description,
          price: product.price,
          stock: product.stock,
          active: product.active,
          categoryId: product.category?.id,
          categoryName: product.category?.name
        });
      },
      error: (error) => {
        console.error('❌ Fehler beim Laden des Produkts:', error);
        alert('Produkt konnte nicht geladen werden.');
      }
    });
  }

  onSubmit() {
    console.log(this.productForm.value);
    if (this.productForm.valid) {
      const updatedProduct = {
        ...this.productForm.value,
        //category: { id: this.productForm.value.categoryId, name: this.productForm.value.categoryName }
        categoryId: this.productForm.get('categoryId')?.value
      };

      this.productService.updateProduct(this.productId, updatedProduct).subscribe({
        next: () => {
          alert('✅ Produkt erfolgreich aktualisiert!');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('❌ Fehler beim Aktualisieren des Produkts:', error);
          alert('Fehler: Das Produkt konnte nicht gespeichert werden.');
        }
      });
    } else {
      alert('⚠️ Bitte alle Felder korrekt ausfüllen!');
    }
  }
}
