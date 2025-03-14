import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { PaymentService } from './payment.service';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private chartDataSource = new BehaviorSubject<any>(null);
  currentChartData = this.chartDataSource.asObservable();
  private shoppingCart: any[] = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
  private cartSubject = new BehaviorSubject<any[]>(this.shoppingCart);
  cart$ = this.cartSubject.asObservable();
  constructor(private paymentService: PaymentService) {
    this.paymentService.paymentStatus$.subscribe(status => {
      if (status === true) {
        this.clearShoppingCart(); 
      } else if (status === false) {
      }
    });
  }
  getChartData() {
    return this.chartDataSource.asObservable();
  }
  changeChartData(data: any[]) {
    this.chartDataSource.next(data);
  }

  private chartDataSourceDelete = new BehaviorSubject<any>(null);
  currentChartDataDelete = this.chartDataSourceDelete.asObservable();

  changeChartDataDelete(data: any[]) {
    this.chartDataSourceDelete.next(data);
  }

  private shoppingCartSource = new Subject<any>();
  shoppingCartData = this.shoppingCartSource.asObservable();

  getShoppingData(data: any) {
    this.shoppingCartSource.next(data);
  }

  clearShoppingCart() {
    this.shoppingCart = [];
    localStorage.setItem('shoppingCart', JSON.stringify(this.shoppingCart));
    this.cartSubject.next(this.shoppingCart); 
  }

  getShoppingCart() {
    return this.shoppingCart;
  }

  setShoppingCart(cart: any[]) {
    this.shoppingCart = cart;
    localStorage.setItem('shoppingCart', JSON.stringify(this.shoppingCart));
    this.cartSubject.next(this.shoppingCart);
  }

}
