import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SortService } from '../../services/sort.service';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit, OnChanges {
  products: any[] = [];
  @Input() query: string | null = null;
  private productSubscription: Subscription | null = null;

  constructor(private productService: CategoryService, private route: ActivatedRoute, private sortService: SortService,
    private sharedDataService: SharedDataService, private router: Router) { }

  ngOnInit(): void {
    if (this.query) {
      this.searchProducts(this.query);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['query'] && changes['query'].currentValue !== changes['query'].previousValue) {
      this.searchProducts(changes['query'].currentValue);
    }
  }

  searchProducts(searchText: string | null): void {
    this.productService.getProductsForSearch(searchText).then((result) => {
      this.products = result.map(product => ({
        ...product,
        imageValid: true
      }));
    }).catch((error) => {
      console.error('Error fetching products:', error);
    });
  }

  onImageLoad(product: any): void {
    product.imageValid = true;
  }

  onImageError(product: any): void {
    this.products = this.products.filter((p) => p.key !== product.key);
  }

  calculateDiscount(oldPrice: number, newPrice: number): number {
    if (oldPrice !== newPrice) {
      return ((oldPrice - newPrice) / oldPrice) * 100;
    }
    return 0;
  }

  onSortChange(data: any): void {
    const filterName = data.target.value;
    console.log(filterName)
    let sortedProducts = [...this.products];
    switch (filterName) {
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
        sortedProducts = [...this.products];
        break;
    }
    this.products = sortedProducts;
  }

  addChart(product: any){
    this.sharedDataService.changeChartData({countOfProduct:1,...product});
  }
  
  getData(product: any) {
    this.router.navigate(['products/' + product.mainCategory + '-' + product.secondCategory + '-' + product.key])
  }
}
