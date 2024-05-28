import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { ServiceProvider } from 'src/app/core/models/installer.model';
import { UsersService } from 'src/app/core/services/users.service';
import { CreateInstallerComponent } from './create-installer/create-installer.component';

@Component({
  selector: 'app-installers',
  templateUrl: './installers.component.html',
  styleUrls: ['./installers.component.scss'],
})
export class InstallersComponent implements OnInit {
  displayedColumns: string[] = ['#', 'name', 'categories'];
  dataSource;

  constructor(
    private workersService: UsersService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.workersService.installersChain.subscribe((installers) => {
      if (!installers) {
        this.workersService.getInstallers().subscribe();
      } else {
        this.dataSource = installers;
      }
    });
  }

  onInstaller(installer: ServiceProvider) {
    this.router.navigate(['installers', installer.id]);
  }

  onAddInstaller() {
    this.dialog.open(CreateInstallerComponent, {
      data: true,
    });
  }
}
