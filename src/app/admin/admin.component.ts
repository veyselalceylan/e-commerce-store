import { Component, ViewChild } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { CategoryService } from '../services/category.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { mainCategory, kidsCategory, menCategory, womenCategory, otherCategory } from './category-data';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  providers: [MessageService, ConfirmationService]
})
export class AdminComponent {
  files!: TreeNode[];
  sizes: any[] = [];
  productDialog: boolean = false;
  product!: any;
  products: any[] = [];
  selectedProducts!: any[] | null;
  submitted: boolean = false;
  statuses!: any[];
  @ViewChild('dt') dt!: Table | undefined;
  datamainCategory = mainCategory;
  kidsCategory = kidsCategory;
  menCategory = menCategory;
  womenCategory = womenCategory;
  otherCategory = otherCategory;
  subOptions: any[] = [];
  mainCategory: any;
  selectedSubOption: any;
  constructor(private productService: CategoryService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.statuses = [
      { label: 'INSTOCK', value: 'INSTOCK' },
      { label: 'LOWSTOCK', value: 'LOWSTOCK' },
      { label: 'OUTOFSTOCK', value: 'OUTOFSTOCK' }
    ];
    this.productService.getFiles().then((data) => (this.files = data));
    this.getProducts();
    this.product = {}; 
  }
  openNew() {
    this.product = {};  
    this.submitted = false;
    this.productDialog = true;
    this.updateSubOptions(); 
  }
  updateSubOptions() {
    if (this.product.mainCategory) {
        this.mainCategory = this.product.mainCategory; 
        switch (this.mainCategory) {
            case 'kids':
                this.subOptions = kidsCategory;
                break;
            case 'men':
                this.subOptions = menCategory;
                break;
            case 'women':
                this.subOptions = womenCategory;
                break;
            case 'other':
                this.subOptions = otherCategory;
                break;
            default:
                this.subOptions = [];
        }
    }
}
  applyFilterGlobal($event: any, stringVal: string) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
 
  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products = this.products.filter((val) => !this.selectedProducts?.includes(val));
        this.selectedProducts = null;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
      }
    });
  }
  deleteProduct(product: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products = this.products.filter((val) => val.id !== product.id);
        this.product = {};
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
      }
    });
  }
  editProduct(product: any) {
    this.product = { ...product };
    this.productDialog = true;
    this.updateSubOptions(); 
  }
  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
   
  }
  getProducts() {
    this.productService.getproductsObservable().subscribe((products) => {
      if (products == null) {
        console.log('products is null or undefined');
        this.products = [];
      } else {
        this.products = Object.entries(products).map(([id, product]) => {
          if (typeof product === 'object' && product !== null) {
            return { id, ...product };
          } else {
            console.error('product is not a valid object:', product);
            return { id, productRow: '0' };
          }
        });
        console.log(this.products)
      }
    })
  }

  saveProduct() {
    this.submitted = true;

    if (this.product.name?.trim()) {
      if (this.product.id) {
        this.products[this.findIndexById(this.product.id)] = this.product;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
      } else {
        this.product.image = 'product-placeholder.svg';
        this.products.push(this.product);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
      }

      this.products = [...this.products];
      this.productDialog = false;
      this.product = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  getSeverity(status: string): "success" | "warning" | "danger" | undefined {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return undefined; 
    }
  }

}