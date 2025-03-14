import { Component, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ConfirmationService, MegaMenuItem, MenuItem, MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';
import { debounceTime, switchMap, take } from 'rxjs/operators';
import { Observable, Subject,concatMap  } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SharedDataService } from '../services/shared-data.service';
import { PaymentService } from '../services/payment.service';
import { CategoryService } from '../services/category.service';
import { query, ref, onValue, orderByKey, limitToFirst, startAt } from 'firebase/database';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [ConfirmationService, MessageService],
  animations: [
    trigger('slideInOut', [
      state('collapsed', style({
        transform: 'translateX(-500%)',
        opacity: 0,
      })),
      state('expanded', style({
        transform: 'translateX(0)',
        opacity: 1,
      })),
      transition('collapsed <=> expanded', [
        animate('300ms ease-in-out')
      ]),
    ]),
  ],
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  @Output() toogleShoppingChartEvent = new EventEmitter<void>();
  user$: Observable<any>;
  currentUser: any;
  shoppingCart: any[]= [];
  pagePerference: any;
  constructor(private afAuth: AngularFireAuth, private authService: AuthService, private router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService, private messageService: MessageService,
    private sharedDataService: SharedDataService,  private paymentService: PaymentService,private productService: CategoryService,
  ) {
    this.user$ = this.afAuth.authState;
    const pathForDb = 'title';
    let listRef = ref(this.productService.db, pathForDb)
    onValue(listRef, (snapshot) => {
      const data = snapshot.val();
      this.pagePerference = data;
    });
  }
  ngOnInit(): void {
    this.user$.subscribe((user: any) => {
      this.currentUser = user;
    });
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
      this.shoppingCart = JSON.parse(savedCart);
    }
    this.sharedDataService.currentChartData.subscribe(data => {
      if (data) {
        const existingProduct = this.shoppingCart.find(product => product.code === data.code && product.selectedTag === data.selectedTag);
        if (existingProduct) {
          existingProduct.countOfProduct += 1;
        } else {
          console.log('Adding new product:', data);
          this.shoppingCart.push(data);
        }
        localStorage.setItem('shoppingCart', JSON.stringify(this.shoppingCart));
      }
    });
    this.sharedDataService.currentChartDataDelete.subscribe(data => {
      if (data) {
        const index = this.shoppingCart.indexOf(data);
        this.shoppingCart.splice(index, 1);
      }
    });
  }
  
  toogleShoppingChart(){
    this.toogleShoppingChartEvent.emit();
  }
  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }
  showSearchBar: boolean = false;
  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;
    this.searchInputChanged.emit('');
  }
  @Output() searchInputChanged = new EventEmitter<string>();
  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchInputChanged.emit(input.value);
  }
  logOut() {
    this.authService.logOut();
    this.router.navigate(['home']);
  }
}
