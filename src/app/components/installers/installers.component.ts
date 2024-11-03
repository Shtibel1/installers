import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceProvider } from 'src/app/core/models/serviceProvider.model';
import { CreateInstallerComponent } from './create-installer/create-installer.component';
import { MatDialog } from '@angular/material/dialog';
import { ColumnsConfig } from './installersConfig';
import { FiltersService } from '../filters-bar/filters-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { ServiceProvidersService } from 'src/app/core/services/service-providers.service';

@Component({
  selector: 'app-installers',
  templateUrl: './installers.component.html',
  styleUrls: ['./installers.component.scss'],
  providers: [FiltersService],
})
export class InstallersComponent implements OnInit {
  displayedColumns: string[] = ['#', 'name', 'categories'];
  dataSource: MatTableDataSource<ServiceProvider>;
  columns = ColumnsConfig;

  constructor(
    private workersService: ServiceProvidersService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.workersService.installers$.subscribe((installers) => {
      if (!installers) {
        this.workersService.getserviceProviders().subscribe();
      } else {
        this.dataSource = new MatTableDataSource(installers);
      }
    });
  }

  onInstaller(installer: ServiceProvider) {
    this.router.navigate(['installers', 'details', installer.id]);
  }

  onAddInstaller() {
    this.dialog.open(CreateInstallerComponent);
  }
}
