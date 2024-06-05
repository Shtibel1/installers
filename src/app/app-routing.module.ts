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
    loadChildren: () =>
      import('./components/assignments/assignments.module').then(
        (m) => m.AssignmentsModule
      ),
  },
  {
    path: 'installers',
    loadChildren: () =>
      import('./components/installers/installers.module').then(
        (m) => m.InstallersModule
      ),
  },

  {
    path: 'products',
    loadChildren: () =>
      import('./components/products/products.module').then(
        (m) => m.ProductsModule
      ),
  },

  {
    path: 'marketers',
    loadChildren: () =>
      import('./components/marketers/marketers.module').then(
        (m) => m.MarketersModule
      ),
  },
  {
    path: 'categories',
    loadChildren: () =>
      import('./components/categories/categories.module').then(
        (m) => m.CategoriesModule
      ),
  },
  { path: 'auth', component: AuthComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
