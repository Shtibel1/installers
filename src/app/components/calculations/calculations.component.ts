import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Calculation } from 'src/app/core/models/calculation.model';
import { CalculationsService } from 'src/app/core/services/calculations.service';

@Component({
  selector: 'app-calculations',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './calculations.component.html',
  styleUrl: './calculations.component.scss',
})
export class CalculationsComponent implements OnInit {
  calculations: Calculation[] = [];

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
