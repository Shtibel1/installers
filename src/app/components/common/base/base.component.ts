import { Component, OnInit } from '@angular/core';
import { Roles } from 'src/app/core/enums/roles.enum';
import { AppUser } from 'src/app/core/models/app-user.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
})
export class BaseComponent {
  roles = Roles;

  protected user: AppUser;

  constructor(private authService: AuthService) {
    this.authService.user$.subscribe((u) => {
      this.user = u;
    });
  }
}
