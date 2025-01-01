import { ProductsService } from 'src/app/core/services/products.service';
import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { AssignmentsService } from './core/services/assignments.service';
import { WebsocketService } from './core/services/websocket.service';
import { take } from 'rxjs';
import { ServiceProvidersService } from './core/services/service-providers.service';

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
    private assignmentService: AssignmentsService,
    private usersService: ServiceProvidersService,
    private socket: WebsocketService
  ) {
    this.accountsService.autoLogin();
    this.productsService.getProducts().pipe(take(1)).subscribe();
    this.assignmentService.getAssignments().pipe(take(1)).subscribe();
    this.usersService.getserviceProviders().pipe(take(1)).subscribe();
    console.log(CompanyNames);
  }
}
