import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Calculation } from 'src/app/core/models/calculation.model';
import { CalculationsService } from 'src/app/core/services/calculations.service';

@Component({
  selector: 'app-calculations',
  standalone: true,
  imports: [DatePipe, DecimalPipe, CommonModule, FormsModule],
  templateUrl: './calculations.component.html',
  styleUrl: './calculations.component.scss',
})
export class CalculationsComponent implements OnInit {
  calculations: Calculation[] = [];
  filterText: string = '';

  get filteredCalculations(): Calculation[] {
    if (!this.filterText.trim()) return this.calculations;
    const q = this.filterText.trim().toLowerCase();
    return this.calculations.filter(c =>
      c.serviceProvider?.name?.toLowerCase().includes(q)
    );
  }

  constructor(
    private clacSerivce: CalculationsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clacSerivce.getCalcs().subscribe((calcs) => {
      this.calculations = calcs.sort((a, b) => {
        return a.createdDate > b.createdDate ? -1 : 1;
      });
    });
  }

  onCalc(calc: Calculation) {
    // this.router.navigate(['calculations', calc.id]);
  }
}
