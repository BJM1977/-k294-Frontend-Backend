import {Routes} from '@angular/router';
import {ProductListComponent} from './pages/products/product-list/product-list.component';
import {CategoryListComponent} from './pages/category/category-list/category-list.component';
import {CategoryModifyComponent} from './pages/category/category-modify/category-modify.component';
import {CategoryDetailComponent} from './pages/category/category-detail/category-detail.component';
import {RegisterComponent} from './pages/auth/register/register.component';
import {LoginComponent} from './pages/auth/login/login.component';
import {UsersComponent} from './pages/users/users.component';

export const routes: Routes = [
  {
    path: 'products',
    loadChildren: () =>
      import('./pages/products/product.routes')
        .then(val => val.productRoutes)
  },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'users', component: UsersComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path:"category",
    loadChildren:() =>import('./pages/category/category.routes').then(v =>v.routes)
  },

];

