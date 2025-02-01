import {CategoryListComponent} from './category-list/category-list.component';
import {CategoryModifyComponent} from './category-modify/category-modify.component';
import {CategoryDetailComponent} from './category-detail/category-detail.component';
import {Routes} from '@angular/router';

export const routes:Routes=[
{
  path:"list",
    component:CategoryListComponent
},
{
  path:"create",
    component:CategoryModifyComponent
},
{
  path:"edit/:id",
    component:CategoryModifyComponent
},
{
  path:":id",
    component:CategoryDetailComponent
},

 ];
