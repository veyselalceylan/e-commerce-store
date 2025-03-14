import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  startValue: number = 0;
  endValue: number = 0;
  selectedTag: string = '';
  selectedType: string = '';
  constructor(private categoryService: CategoryService, private router: Router,
    private sharedDataService: SharedDataService) {
  }
  product: any = {};
  products: any[] = [];
  ngOnInit(): void {
    const fullPath = window.location.pathname;
    const pathSegments = fullPath.split('-').filter(segment => segment);
    const firstSegment = pathSegments[0] + '/' + pathSegments[1];
    const lastSegment = pathSegments[2];
    this.categoryService.getProductsByPathWithId(firstSegment, lastSegment).then((result) => {
      this.product = { countOfProduct: 1, ...result, oldPrice: null, price: null, selectedTag: "Smallest" };
    })
    this.categoryService.getPricing().then((result) => {
      this.preData(result);
      this.product.type = 'Biblo';
      this.selectedType = 'Biblo';
      if (this.product.countOfPhotos == 1) {
        this.selectedTag = 'Smallest';
        this.startValue = Number(this.products.find(p => p.name === "Smallest").prices[0].oldPrice);
        this.endValue = Number(this.products.find(p => p.name === "Smallest").prices[0].price);
      } else if (this.product.countOfPhotos == 2) {
        this.selectedTag = 'Smallest'
        this.startValue = Number(this.products.find(p => p.name === "Smallest").prices[1].oldPrice);
        this.endValue = Number(this.products.find(p => p.name === "Smallest").prices[1].price);
      } else if (this.product.countOfPhotos == 3) {
        this.selectedTag = 'Smallest'
        this.startValue = Number(this.products.find(p => p.name === "Smallest").prices[2].oldPrice);
        this.endValue = Number(this.products.find(p => p.name === "Smallest").prices[2].price);
      } else if (this.product.countOfPhotos == 4) {
        this.selectedTag = '15 CM'
        this.startValue = Number(this.products.find(p => p.name === "15 CM").prices[3].oldPrice);
        this.endValue = Number(this.products.find(p => p.name === "15 CM").prices[3].price);
      } else if (this.product.countOfPhotos == 5) {
        this.selectedTag = '15 CM'
        this.startValue = Number(this.products.find(p => p.name === "15 CM").prices[4].oldPrice);
        this.endValue = Number(this.products.find(p => p.name === "15 CM").prices[4].price);
      } else if (this.product.countOfPhotos == 6) {
        this.selectedTag = '15 CM'
        this.startValue = Number(this.products.find(p => p.name === "15 CM").prices[5].oldPrice);
        this.endValue = Number(this.products.find(p => p.name === "15 CM").prices[5].price);
      }
      this.product.price = this.endValue;
      this.product.oldPrice = this.startValue;
    })
  }

  onTagClick(tag: string) {
    this.selectedTag = tag;
    this.product.selectedTag = tag;
    var key = 0;
    if (this.product.countOfPhotos == 1) {
      key = 0;
    } else if (this.product.countOfPhotos == 2) {
      key = 1;
    } else if (this.product.countOfPhotos == 3) {
      key = 2;
    } else if (this.product.countOfPhotos == 4) {
      key = 3;
    } else if (this.product.countOfPhotos == 5) {
      key = 4;
    } if (this.product.countOfPhotos == 6) {
      key = 5;
    }
    if (tag === 'Smallest') {
      this.endValue = Number(this.products.find(p => p.name === "Smallest").prices[key].price) * this.product.countOfProduct;
      this.product.price = Number(this.products.find(p => p.name === "Smallest").prices[key].price);
      this.product.oldPrice = Number(this.products.find(p => p.name === "Smallest").prices[key].oldPrice);
    } else if (tag === '15 CM') {
      this.endValue = Number(this.products.find(p => p.name === "15 CM").prices[key].price) * this.product.countOfProduct;
      this.product.price = Number(this.products.find(p => p.name === "15 CM").prices[key].price);
      this.product.oldPrice = Number(this.products.find(p => p.name === "15 CM").prices[key].oldPrice);
    } else if (tag === '20 CM') {
      this.endValue = Number(this.products.find(p => p.name === "20 CM").prices[key].price) * this.product.countOfProduct;
      this.product.price = Number(this.products.find(p => p.name === "20 CM").prices[key].price);
      this.product.oldPrice = Number(this.products.find(p => p.name === "20 CM").prices[key].oldPrice);
    } else if (tag === '25 CM') {
      this.endValue = Number(this.products.find(p => p.name === "25 CM").prices[key].price) * this.product.countOfProduct;
      this.product.price = Number(this.products.find(p => p.name === "25 CM").prices[key].price);
      this.product.oldPrice = Number(this.products.find(p => p.name === "25 CM").prices[key].oldPrice);
    } else if (tag === '30 CM') {
      this.endValue = Number(this.products.find(p => p.name === "30 CM").prices[key].price) * this.product.countOfProduct;
      this.product.price = Number(this.products.find(p => p.name === "30 CM").prices[key].price);
      this.product.oldPrice = Number(this.products.find(p => p.name === "30 CM").prices[key].oldPrice);
    }
  }
  incrementQuantity() {
    this.product.countOfProduct += 1;
    this.endValue = this.product.price * this.product.countOfProduct;
  }

  onTypeClick(type: any){
    this.product.type = type;
    this.selectedType = type;
  }

  decrementQuantity() {
    if (this.product.countOfProduct > 1) {
      this.product.countOfProduct -= 1;
      this.endValue = this.product.price * this.product.countOfProduct;
    }
  }
  addChart() {
    const productCopy = { ...this.product }; 
    this.sharedDataService.changeChartData(productCopy); 
  }
  columns: number[] = [1, 2, 3, 4, 5, 6];
  calculateDiscount(oldPrice: number, price: number): number {
    if (oldPrice !== price) {
      return Math.abs((oldPrice - price) / oldPrice) * 100;
    }
    return 0;
  }
  preData(array: any) {
    this.products = Object.entries(array).map(([key, product]) => {
      if (Array.isArray(product)) {
        const prices = product
          .filter(item => item !== null)
          .map(item => {
            return {
              price: item.new !== undefined ? item.new : null,
              oldPrice: item.old !== undefined ? item.old : null
            };
          });

        return { name: key, prices };
      } else {
        return { key };
      }
    });
  }

  checkOut(){
    const productCopy = { ...this.product }; 
    this.sharedDataService.changeChartData(productCopy); 
    var dataCopy = {...this.product};
    this.sharedDataService.getShoppingData(dataCopy);
    this.router.navigate(['/check-out'])
  }


}
