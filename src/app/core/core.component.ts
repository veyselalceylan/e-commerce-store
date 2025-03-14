import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { query, ref, onValue, orderByKey, limitToFirst, startAt } from 'firebase/database';
import { SharedDataService } from '../services/shared-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css']
})
export class CoreComponent implements OnInit {
  otherProducts: any[] = [];
  filteredProducts: any[] = [];
  allProducts: any[] = [];
  productsSubjectForCat = new BehaviorSubject<any[]>([]);
  lastKey: string | null = null;
  loading: boolean = false;
  pricing: any[] = [];
  pagePerference: any;
  responsiveOptions: any[] | undefined;
  constructor(private productService: CategoryService, private sharedDataService: SharedDataService, private router: Router) {
    this.getProductsByPathHome('products', 10);
    const pathForDb = 'title';
    let listRef = ref(this.productService.db, pathForDb)
    onValue(listRef, (snapshot) => {
      const data = snapshot.val();
      this.pagePerference = data;
      console.log(data)
    });
  }
  
  ngOnInit() {
   
    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
      }
    ];
    this.filteredProducts = [...this.allProducts];
    this.productsSubjectForCat.subscribe(products => {
      this.filteredProducts = [...products];
    });
  }

  getProductsByPathHome(path: string | null, limit: number = 10): void {
    this.loading = true;
    this.allProducts = [];
    const pathForDb = `${path}`;
    let listRef = this.getQueryRef(pathForDb, limit);
    onValue(listRef, (snapshot) => {
      const data = snapshot.val();
      this.loading = false;
      if (data) {
        this.handleProductData(data);
      } else {
        this.productsSubjectForCat.next([]);
      }
    });
  }

  private getQueryRef(pathForDb: string, limit: number) {
    let listRef = query(ref(this.productService.db, pathForDb), orderByKey(), limitToFirst(limit));
    if (this.lastKey) {
      listRef = query(ref(this.productService.db, pathForDb), orderByKey(), startAt(this.lastKey), limitToFirst(limit));
    }
    return listRef;
  }

  private handleProductData(data: any) {
    this.productService.getPricing().then((result) => {
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
      const products = Object.keys(data).flatMap((categoryKey) =>
        Object.entries(data[categoryKey]).flatMap(([id, product]: [string, any]) => {
          if (typeof product === 'object' && product !== null) {
            return Object.entries(product).map(([prodId, prod]: [string, any]) => {
              if (typeof prod === 'object' && prod !== null) {
                return {
                  key: prodId,
                  ...prod,
                  imageValid: true
                };
              }
              return null;
            }).filter(prod => prod !== null);
          }
          return null;
        })
      ).filter(product => product !== null).flat();
      this.shuffleArray(products);
      products.forEach((element: any) => {
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
      this.productsSubjectForCat.next(this.allProducts.slice(0, 20));
    })
  }

  private shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  getProductsByPathHomeObservable(): Observable<any[]> {
    return this.productsSubjectForCat.asObservable();
  }

  loadMoreHomeProducts(limit: number): void {
    const currentLength = this.productsSubjectForCat.getValue().length;
    if (currentLength < this.allProducts.length) {
      const nextProducts = this.allProducts.slice(currentLength, currentLength + limit);
      this.productsSubjectForCat.next([...this.productsSubjectForCat.getValue(), ...nextProducts]);
    }
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
  onSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    console.log(value);
    switch (value) {
      case 'asc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'desc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'A-Z':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Z-A':
        this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        this.filteredProducts = [...this.allProducts];
        break;
    }
    this.productsSubjectForCat.next(this.filteredProducts);
  }

  addChart(product: any) {
    var tag = "Smallest";
    if(product.countOfPhotos > 3){
      tag = "15 CM"
    }
    this.sharedDataService.changeChartData({countOfProduct:1,...product, selectedTag: tag, type: 'Biblo'});
  }

  getData(product: any) {
    console.log(product)
    this.router.navigate(['products/' + product.mainCategory + '-' + product.secondCategory + '-' + product.key])
  }
}

interface PricingItem {
  oldPrice: number;
  price: number;
  key: string;
}