import {Routes} from '@angular/router';
import {ProductListComponent} from './product-list/product-list.component';

export const productRoutes: Routes = [
  {
    path: 'list',
    component: ProductListComponent
  },
  {
    path: 'create',
    loadComponent: () => import('./product-modify/product-modify.component').then(m => m.ProductModifyComponent)
  },
  {
    path: 'modify/:id',
    loadComponent: () => import('./product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  }

]
