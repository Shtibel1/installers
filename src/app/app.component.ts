import { ProductsService } from 'src/app/core/services/products.service';
import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { AssignmentsService } from './core/services/assignments.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'installers';
  constructor(
    private accountsService: AuthService,
    private productsService: ProductsService,
    private assignmentService: AssignmentsService
  ) {
    this.accountsService.autoLogin();
    this.productsService.getProducts().subscribe();
    this.assignmentService.getAssignments().subscribe();
  }
}
