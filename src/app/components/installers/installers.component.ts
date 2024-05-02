import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Installer } from 'src/app/core/models/installer.model';
import { WorkersService } from 'src/app/core/services/workers.service';
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
    private workersService: WorkersService,
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

  onInstaller(installer: Installer) {
    this.router.navigate(['installers', installer.id]);
  }

  onAddInstaller() {
    this.dialog.open(CreateInstallerComponent, {
      data: true,
    });
  }
}
