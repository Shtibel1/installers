import { MediaMatcher } from '@angular/cdk/layout';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ManageAssignmentComponent } from '../assignments/manage-assignment/manage-assignment.component';
import { CreateInstallerComponent } from '../installers/create-installer/create-installer.component';
import { ProductsService } from 'src/app/core/services/products.service';
import { ManageProductComponent } from '../products/manage-product/manage-product.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { AppUser } from 'src/app/core/models/app-user.model';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  user: AppUser;
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public dialog: MatDialog,
    private producsService: ProductsService,
    private accountsService: AuthService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.accountsService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  openManageDialog() {
    this.dialog.open(ManageAssignmentComponent);
  }

  onCreateManager() {
    this.dialog.open(CreateInstallerComponent, { data: false });
  }

  onGetProducts() {
    this.producsService.getProducts();
  }

  onLogout() {
    this.accountsService.logout();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
