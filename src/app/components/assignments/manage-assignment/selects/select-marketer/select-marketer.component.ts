import { MarketersService } from 'src/app/core/services/marketers.service';
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Marketer } from 'src/app/core/models/marketer.model';
import { Option } from 'src/app/core/models/option.model';

@Component({
  selector: 'app-select-marketer',
  templateUrl: './select-marketer.component.html',
  styleUrl: './select-marketer.component.scss',
})
export class SelectMarketerComponent {
  @Input() control: FormControl<Option<Marketer>>;
  marketersOptions: Option<Marketer>[];

  constructor(private marketersService: MarketersService) {}

  ngOnInit() {
    this.initMarketers();
  }

  initMarketers() {
    this.marketersService.getMarketers().subscribe((marketers) => {
      this.marketersOptions = marketers.map((marketer) => {
        return { label: marketer.name, value: marketer };
      });
    });
    this.control.valueChanges.subscribe((value) => {});
  }
}
