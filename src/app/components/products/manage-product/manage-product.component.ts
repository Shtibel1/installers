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
import { ServiceSuppliesService, ServiceProductVm, ProductRequirementVm } from 'src/app/core/services/service-products.service';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss'],
})
export class ManageProductComponent implements OnInit {
  form: FormGroup;
  categories: Option<Category>[];
  serviceProducts: ServiceProductVm[] = [];
  productRequirements: ProductRequirementVm[] = [];
  availableServiceProducts: Option<ServiceProductVm>[] = [];
  
  name: FormControl;
  category: FormControl<Option<Category> | null>;
  customerInstallationPrice: FormControl;

  @Input('selectedCategory') selectedCategory: any = 'asd';
  errMessage: string = null;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public editProduct: Product = null,
    public categoriesService: CategoriesService,
    public productsService: ProductsService,
    private serviceSuppliesService: ServiceSuppliesService,
    public _snackBar: MatSnackBar,
    public router: Router,
    public dialogRef: MatDialogRef<ManageProductComponent>
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
    this.loadServiceProducts();
    if (this.editProduct?.id) {
      this.loadProductRequirements();
    }
  }

  loadCategories() {
    this.categoriesService.getCategories().subscribe((res) => {
      this.categories = res.map((cat) => {
        return { label: cat.name, value: cat };
      });
    });
  }

  loadServiceProducts() {
    this.serviceSuppliesService.getServiceProducts().subscribe((serviceProducts) => {
      this.serviceProducts = serviceProducts;
      this.availableServiceProducts = serviceProducts.map(sp => ({
        label: sp.name,
        value: sp
      }));
    });
  }

  loadProductRequirements() {
    if (this.editProduct?.id) {
      this.serviceSuppliesService.getRequirements(this.editProduct.id).subscribe((requirements) => {
        this.productRequirements = requirements.map(req => ({
          ...req,
          serviceProductName: this.serviceProducts.find(sp => sp.id === req.serviceProductId)?.name || req.serviceProductName
        }));
      });
    }
  }

  initForm() {
    const name = this.editProduct?.name || null;
    const category: Option<Category> | null = this.editProduct?.category 
      ? {
          label: this.editProduct.category.name,
          value: this.editProduct.category,
        }
      : null;
    const customerInstallationPrice =
      this.editProduct?.customerInstallationPrice || null;

    this.name = new FormControl(name, Validators.required);
    this.category = new FormControl(category, Validators.required);
    this.customerInstallationPrice = new FormControl(customerInstallationPrice);

    this.form = new FormGroup({
      name: this.name,
      category: this.category,
      customerInstallationPrice: this.customerInstallationPrice,
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.categories.forEach((cat) => {
      if (this.form.value.category == cat.value.name) {
        this.form.value.category = cat;
      }
    });

    let product: Product = {
      id: null,
      name: this.name.value,
      category: this.category.value.value,
      customerInstallationPrice: this.customerInstallationPrice.value,
    };
    if (!this.editProduct) {
      this.productsService.addProduct(product).subscribe({
        next: (createdProduct) => {
          // Save requirements for new product
          if (this.productRequirements.length > 0) {
            this.saveProductRequirements(createdProduct.id);
          }
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
          // Save requirements for edited product
          this.saveProductRequirements(product.id);
          this.openSnackbar('המוצר עודכן בהצלחה!');
          this.dialogRef.close();
        },
        error: (msg) => {
          this.errMessage = msg;
        },
      });
    }
  }

  saveProductRequirements(productId: string) {
    // Always call setAllRequirements, even for empty array to clear all requirements
    this.serviceSuppliesService.setAllRequirements(productId, this.productRequirements).subscribe({
      next: () => {
        console.log('Product requirements saved successfully');
      },
      error: (error) => {
        console.error('Failed to save product requirements:', error);
      }
    });
  }

  addRequirement() {
    this.productRequirements.push({
      serviceProductId: '',
      serviceProductName: '',
      quantity: 1
    });
  }

  removeRequirement(index: number) {
    this.productRequirements.splice(index, 1);
  }

  onServiceProductChange(index: number, serviceProductId: string) {
    if (serviceProductId) {
      const serviceProduct = this.serviceProducts.find(sp => sp.id === serviceProductId);
      if (serviceProduct) {
        this.productRequirements[index].serviceProductId = serviceProduct.id;
        this.productRequirements[index].serviceProductName = serviceProduct.name;
      }
    }
  }

  updateQuantity(index: number, quantity: number) {
    if (quantity > 0) {
      this.productRequirements[index].quantity = quantity;
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
