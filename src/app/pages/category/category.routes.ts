import { Routes } from '@angular/router';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryCreateComponent } from './category-create/category-create.component';
import { CategoryComponent } from './category.component';

export const categoryRoutes: Routes = [
  { path: 'list', component: CategoryListComponent },
  { path: 'create', component: CategoryCreateComponent },
  { path: 'modify/:id', component: CategoryComponent }
];

