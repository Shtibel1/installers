import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { AuthGuard } from './core/guards/auth.guard';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'assignments',
    pathMatch: 'full',
  },
  {
    path: 'assignments',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/assignments/assignments.module').then(
        (m) => m.AssignmentsModule
      ),
  },
  {
    path: 'installers',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/installers/installers.module').then(
        (m) => m.InstallersModule
      ),
  },

  {
    path: 'products',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/products/products.module').then(
        (m) => m.ProductsModule
      ),
  },

  {
    path: 'marketers',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/marketers/marketers.module').then(
        (m) => m.MarketersModule
      ),
  },
  {
    path: 'categories',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/categories/categories.module').then(
        (m) => m.CategoriesModule
      ),
  },
  {
    path: 'calculations',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/calculations/calculations.component').then(
        (m) => m.CalculationsComponent
      ),
  },
  {
    path: 'history',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/history/history.component').then(
        (m) => m.HistoryComponent
      ),
  },

  { path: 'auth', component: AuthComponent },
  {
    path: '**',
    redirectTo: 'assignments',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
