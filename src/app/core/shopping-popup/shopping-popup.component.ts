import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ConfirmationService, MessageService } from 'primeng/api';
import { concatMap, Observable, take } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SharedDataService } from '../../services/shared-data.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-shopping-popup',
  templateUrl: './shopping-popup.component.html',
  styleUrl: './shopping-popup.component.css',
  animations: [
    trigger('openClose', [
      state('open', style({
        height: '*',
        opacity: 1,
        display: 'block'
      })),
      state('closed', style({
        height: '0px',
        opacity: 0,
        display: 'none'
      })),
      transition('closed => open', [
        style({ display: 'block', height: '0px', opacity: 0 }),
        animate('300ms ease', style({ height: '*', opacity: 1 }))
      ]),
      transition('open => closed', [
        animate('300ms ease', style({ height: '0px', opacity: 0 }))
      ])
    ])
  ],
  providers: [ConfirmationService, MessageService],
})
export class ShoppingPopupComponent implements OnInit {
  shoppingCart: any[] = [];
  user$: Observable<any>;
  @Input() shoppingChartOpened: boolean = false;

  constructor(private afAuth: AngularFireAuth, private authService: AuthService, private router: Router, private route: ActivatedRoute,
    private confirmationService: ConfirmationService, private messageService: MessageService, private sharedDataService: SharedDataService,
    private paymentService: PaymentService
  ) {
    this.user$ = this.afAuth.authState;
    this.user$.subscribe(user => {
      console.log(user);
    });
  }
  ngOnInit(): void {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
      this.shoppingCart = JSON.parse(savedCart);
    }

    this.sharedDataService.currentChartData.subscribe(data => {
      if (data) {
        console.log(this.shoppingCart)
        const existingProduct = this.shoppingCart.find(product => product.code === data.code && product.selectedTag === data.selectedTag
          && product.type === data.type);
        if (existingProduct) {
          if(existingProduct.countOfProduct > 1 ){
            existingProduct.price += data.price / 2;
          }
        } else {
          this.shoppingCart.push(data);
        }
        localStorage.setItem('shoppingCart', JSON.stringify(this.shoppingCart));
      }
    });
  }


  removeProduct(productA: any) {
    const index = this.shoppingCart.indexOf(productA);
    if (index !== -1) {
      this.shoppingCart.splice(index, 1);
      this.sharedDataService.changeChartDataDelete(productA);
      localStorage.setItem('shoppingCart', JSON.stringify(this.shoppingCart));
    }
  }

  incrementQuantity(product: any) {
    const mainPrice = (2 * product.price) / (product.countOfProduct + 1);
    product.countOfProduct += 1;
    product.price += mainPrice / 2;
    localStorage.setItem('shoppingCart', JSON.stringify(this.shoppingCart));
  }


  decrementQuantity(product: any) {
    const originalPrice = product.price;
    const mainPrice = (2 * originalPrice) / (product.countOfProduct + 1);
    if (product.countOfProduct > 1) {
      product.countOfProduct -= 1;
      product.price -= mainPrice / 2;
    } else if (product.countOfProduct = 1) {
      product.price = mainPrice;
    } else {
      this.shoppingCart = this.shoppingCart.filter(item => item.code !== product.code);
    }

  }


  get totalPrice(): number {
    return this.shoppingCart.reduce((total, product) => total + product.price, 0);
  }
  get productPrice() {
    return this.shoppingCart.map(product => {
      const discountedPrice = product.price * 0.5;
      let totalPrice = 0;

      for (let i = 0; i < product.countOfProduct; i++) {
        if (i === 0) {
          totalPrice += product.price;
        } else {
          totalPrice += discountedPrice;
        }
      }

      return {
        productName: product.name,
        totalPrice: totalPrice
      };
    });
  }

  @Output() shoppingChartToggle = new EventEmitter<boolean>();
  checkOut(shoppingCart: any) {
    this.shoppingChartOpened = false;
    this.shoppingChartToggle.emit(this.shoppingChartOpened);
    this.sharedDataService.getShoppingData(shoppingCart);
    this.router.navigate(['/check-out'])
  }

}
