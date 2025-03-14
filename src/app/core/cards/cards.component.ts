import { Component, Input, OnInit, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Subscription } from 'rxjs';
import { SortService } from '../../services/sort.service';
import { SharedDataService } from '../../services/shared-data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit, OnChanges {
  filteredProducts: any[] = [];
  allProducts: any[] = [];
  loading: boolean = true;
  itemsPerPage: number = 10;
  currentPage: number = 0;
  pricing: any[] = [];
  @Input() url: string | null = null;

  constructor(private productService: CategoryService, private route: ActivatedRoute, private sortService: SortService,
    private sharedDataService: SharedDataService, private router: Router, private categoryService: CategoryService) { }

  ngOnInit() {
    this.sortService.currentData.subscribe(data => {
      this.sortData(data);
    });

  }
  ngOnChanges(changes: SimpleChanges): void {
    window.scrollTo(0, 0);
    if (changes['url'] && this.url) {
      this.loadProducts();
    }
  }


  loadProducts(): void {
    this.categoryService.getPricing().then((result) => {
      this.pricing = Object.entries(result).map(([key, product]) => {
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
      this.loading = true;
      this.productService.getProductsByPath(this.url).then((result) => {

        this.loading = false;
        result.forEach((element: any) => {
          if (element.countOfPhotos == 1) {
            var oldPrice = Number(this.pricing.find(p => p.name === "Smallest").prices[0].oldPrice);
            var price = Number(this.pricing.find(p => p.name === "Smallest").prices[0].price);
            this.allProducts.push({ ...element, oldPrice: oldPrice, price: price })
          } else if (element.countOfPhotos == 2) {
            var oldPrice = Number(this.pricing.find(p => p.name === "Smallest").prices[1].oldPrice);
            var price = Number(this.pricing.find(p => p.name === "Smallest").prices[1].price);
            this.allProducts.push({ ...element, oldPrice: oldPrice, price: price })
          } else if (element.countOfPhotos == 3) {
            var oldPrice = Number(this.pricing.find(p => p.name === "Smallest").prices[2].oldPrice);
            var price = Number(this.pricing.find(p => p.name === "Smallest").prices[2].price);
            this.allProducts.push({ ...element, oldPrice: oldPrice, price: price })
          } else if (element.countOfPhotos == 4) {
            var oldPrice = Number(this.pricing.find(p => p.name === "15 CM").prices[3].oldPrice);
            var price = Number(this.pricing.find(p => p.name === "15 CM").prices[3].price);
            this.allProducts.push({ ...element, oldPrice: oldPrice, price: price })
          } else if (element.countOfPhotos == 5) {
            var oldPrice = Number(this.pricing.find(p => p.name === "15 CM").prices[4].oldPrice);
            var price = Number(this.pricing.find(p => p.name === "15 CM").prices[4].price);
            this.allProducts.push({ ...element, oldPrice: oldPrice, price: price })
          } else if (element.countOfPhotos == 6) {
            var oldPrice = Number(this.pricing.find(p => p.name === "15 CM").prices[5].oldPrice);
            var price = Number(this.pricing.find(p => p.name === "15 CM").prices[5].price);
            this.allProducts.push({ ...element, oldPrice: oldPrice, price: price })
          }
        });
        this.filteredProducts = this.allProducts.slice(0, this.itemsPerPage);
      });
    })

  }

  loadMore(): void {
    this.currentPage++;
    const startIndex = this.currentPage * this.itemsPerPage;
    const newProducts = this.allProducts.slice(startIndex, startIndex + this.itemsPerPage);
    this.filteredProducts = [...this.filteredProducts, ...newProducts];
  }

  onImageLoad(product: any): void {
    product.imageValid = true;
  }

  onImageError(product: any): void {
    this.filteredProducts = this.filteredProducts.filter((p) => p.key !== product.key);
  }
  calculateDiscount(oldPrice: number, price: number): number {
    if (oldPrice !== price) {
      return Math.abs((oldPrice - price) / oldPrice) * 100;
    }
    return 0;
  }
  sortData(data: string) {
    let sortedProducts = [...this.allProducts];
    switch (data) {
      case 'asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'desc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'A-Z':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Z-A':
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        sortedProducts = [...this.allProducts];
        break;
    }
    this.allProducts = sortedProducts;
    this.filteredProducts = sortedProducts.slice(0, this.itemsPerPage);
    this.currentPage = 0;
  }

  addChart(product: any){
    var tag = "Smallest";
    if(product.countOfPhotos > 3){
      tag = "15 CM"
    }
    this.sharedDataService.changeChartData({countOfProduct:1,...product, selectedTag: tag, type: 'Biblo'});
  }

  getData(product: any) {
    this.router.navigate(['products/' + product.mainCategory + '-' + product.secondCategory + '-' + product.key])
  }

}
