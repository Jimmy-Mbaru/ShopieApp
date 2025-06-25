import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(m => m.RegisterComponent)
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then(m => m.LoginComponent)
  },

  {
    path: 'reset-password',
    loadComponent: () =>
      import('./auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },

  {
    path: 'products',
    loadComponent: () =>
      import('./pages/product/product.component').then(m => m.ProductComponent)
  },

  {
  path: 'admin-dashboard',
  loadComponent: () => import('./admin/admin-product.component').then(m => m.AdminProductComponent)
},


  {
    path: 'admin/products',
    loadComponent: () =>
      import('./admin/admin-product.component').then(m => m.AdminProductComponent)
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
