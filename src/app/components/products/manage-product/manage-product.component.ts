import { Option } from './../../../core/models/option.model';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { Category } from 'src/app/core/models/category.model';
import { Product } from 'src/app/core/models/product.model';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { ProductsService } from 'src/app/core/services/products.service';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss'],
})
export class ManageProductComponent implements OnInit {
  form: FormGroup;
  categories: Option<Category>[];
  name: FormControl;
  category: FormControl<Option<Category> | null>;
  customerInstallationPrice: FormControl;

  @Input('selectedCategory') selectedCategory: any = 'asd';
  errMessage: string = null;
  constructor(
    @Inject(MAT_DIALOG_DATA) public editProduct: Product = null,
    public categoriesService: CategoriesService,
    public productsService: ProductsService,
    public _snackBar: MatSnackBar,
    public router: Router,
    public dialogRef: MatDialogRef<ManageProductComponent>
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.categoriesService.categoriesChain.subscribe((res) => {
      if (!res) {
        this.categoriesService.getCategories().subscribe();
      } else {
        this.categories = res.map((cat) => {
          return { label: cat.name, value: cat };
        });
      }
    });
  }

  initForm() {
    const name = this.editProduct?.name || null;
    const category: Option<Category | null> =
      {
        label: this.editProduct?.category?.name,
        value: this.editProduct?.category,
      } || null;
    const customerInstallationPrice =
      this.editProduct?.customerInstallationPrice || null;

    this.name = new FormControl(name, Validators.required);
    this.category = new FormControl(category);
    this.customerInstallationPrice = new FormControl(customerInstallationPrice);

    this.form = new FormGroup({
      name: this.name,
      category: this.category,
      customerInstallationPrice: this.customerInstallationPrice,
    });
  }

  onSubmit() {
    this.categories.forEach((cat) => {
      if (this.form.value.category == cat.value.name) {
        this.form.value.category = cat;
      }
    });

    let product: Product = { ...this.form.value };
    if (!this.editProduct) {
      this.productsService.addProduct(product).subscribe({
        next: () => {
          this.openSnackbar('המוצר נוסף בהצלחה!');
          this.router.navigate(['/products']);
          this.dialogRef.close();
        },
        error: (msg) => {
          this.errMessage = msg;
        },
      });
    } else {
      product.id = this.editProduct.id;
      this.productsService.updateProduct(product).subscribe({
        next: (res) => {
          this.openSnackbar('המוצר עודכן בהצלחה!');
          this.dialogRef.close();
        },
        error: (msg) => {
          this.errMessage = msg;
        },
      });
    }
  }

  onDelete() {
    if (this.editProduct) {
      this.productsService.deleteProduct(this.editProduct.id).subscribe({
        next: (res) => {
          this.openSnackbar('המוצר נמחק בהצלחה!');
          this.router.navigate(['/products']);
          this.dialogRef.close();
        },
        error: (msg) => {
          this.errMessage = msg;
        },
      });
    }
  }

  openSnackbar(msg: string) {
    this._snackBar.open(msg, 'Ok', { duration: 4000 });
  }
}
