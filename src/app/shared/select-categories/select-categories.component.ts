import { Option } from './../../core/models/option.model';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Category } from 'src/app/core/models/category.model';
import { CategoriesService } from 'src/app/core/services/categories.service';

@Component({
  selector: 'app-select-categories',
  templateUrl: './select-categories.component.html',
  styleUrl: './select-categories.component.scss',
})
export class SelectCategoriesComponent implements OnInit {
  @Input() control: FormControl<Option<Category>[] | null>;
  categories: Option<Category>[] = [];

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe((categories) => {
      this.categories = categories.map((cat) => {
        return { label: cat.name, value: cat };
      });
    });

    this.control.valueChanges.subscribe((value) => {});
  }
  compareFn(o1: any, o2: any) {
    return o1 && o2 ? JSON.stringify(o1) === JSON.stringify(o2) : o1 === o2;
  }
}
