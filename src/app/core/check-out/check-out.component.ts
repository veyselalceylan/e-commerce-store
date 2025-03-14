import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { SharedDataService } from '../../services/shared-data.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, firstValueFrom, Observable, Subject } from 'rxjs';
import { UserService } from '../../services/user.service';
import { loadStripe } from '@stripe/stripe-js';
import { Stripe, StripeElements, StripeCardElement, StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { OrdersService } from '../../services/orders.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class CheckOutComponent implements OnInit {
  active: number = 0;
  checkoutForm: FormGroup;
  shoppingCart: any[] = [];
  promotionInfo: any;
  states: { name: string, code: string }[] = [
    { name: 'New South Wales', code: 'NSW' },
    { name: 'Queensland', code: 'QLD' },
    { name: 'South Australia', code: 'SA' },
    { name: 'Tasmania', code: 'TAS' },
    { name: 'Victoria', code: 'VIC' },
    { name: 'Western Australia', code: 'WA' },
    { name: 'Australian Capital Territory', code: 'ACT' },
    { name: 'Northern Territory', code: 'NT' }
  ];
  promotion: string = '';
  discount: number = 0;
  addressResult: any[] = [];
  userAddresses: Address[] = [];
  currentUser: any;
  selectedOption: string = '';
  user$: Observable<any>;
  contactForm: FormGroup;
  proccess: boolean = false;
  messages: Message[] = [];
  addressOption: any[] = [{ label: 'Home', value: 'home' }, { label: 'Work', value: 'work' }, { label: 'Other', value: 'other' }];
  addressValue: string = 'off';
  private searchSubject = new Subject<string>();
  constructor(private sharedDataService: SharedDataService, private checkoutBuilder: FormBuilder, private userService: UserService,
    private confirmationService: ConfirmationService, private messageService: MessageService, private http: HttpClient,
    private authService: AuthService, private afAuth: AngularFireAuth, private contactFormBuilder: FormBuilder,
    private orderService: OrdersService, private router: Router
  ) {
    this.contactForm = this.contactFormBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      surname: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{4}-[0-9]{3}-[0-9]{3}$')]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['AU', Validators.required],
      postal_code: ['', Validators.required],
    });
    this.checkoutForm = this.checkoutBuilder.group({
      description: ['', Validators.required],
      note: ['', Validators.required],
      files: new FormControl()
    });
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query) {
        this.userService.search(query).subscribe((res: any) => {
          this.addressResult = res;
          console.log(this.addressResult)
        });
      } else {
        this.addressResult = [];
      }
    });
    this.user$ = this.afAuth.authState;
  }

  stripe: Stripe | null = null;
  elements: StripeElements | undefined = undefined;
  card: StripeCardElement | null = null;
  async ngOnInit() {
    this.messages = [{ severity: 'warn', detail: 'You Need to Click on Each Products for Upload Your Own Photo(s).' }];
    this.user$.subscribe((user: any) => {
      if (user) {
        this.authService.getUserDb(user.uid).then((result) => {
          this.currentUser = result;
          if (this.currentUser) {
            this.contactForm.patchValue({
              email: this.currentUser.email,
              name: this.currentUser.name,
              surname: this.currentUser.surname,
              phoneNumber: this.currentUser.phoneNumber?.slice(3),
              address: this.currentUser.address
            });
          }
        })
        this.userService.getAddresses(user.uid);
        this.userService.getBookingsObservable().subscribe((result: Address[]) => {
          this.userAddresses = Object.entries(result).map(([key, address]) => {
            return { key: key, ...address } as Address
          });
        });
      }
    })
    this.loadShoppingCart();
    this.loadStripe();

  }

  async loadStripe() {
    this.stripe = await loadStripe('pk_live_51QL0U9RwFZTfPT6bmGY3j7MCBlTUVIGFHDbDceQg94sAlRZNUu2ZZqGWwAc3XiuGsIy7ssqM7PRLXZPkghD44z8b00lP2aVPUj');
    if (this.stripe) {
      this.elements = this.stripe.elements();

      const cardStyle: StripeCardElementOptions['style'] = {
        base: {
          color: '#32325d',
          lineHeight: '24px',
          fontFamily: 'Open Sans, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#fa755a',
        },
      };
      if (this.elements) {
        this.card = this.elements.create('card', { style: cardStyle, disableLink: true });
        this.card.mount('#card-element');
      }
      const cardElementWrapper = document.getElementById('card-element-wrapper');
      if (cardElementWrapper) {
        cardElementWrapper.setAttribute('aria-hidden', 'true');
      }
    }
  }
  selectedOptionChanged(option: string) {
    this.selectedOption = option;
    if (option === 'credit') {
      this.loadStripe();
    } else {
      const container = document.getElementById('paypal-button-container');
      if (container) {
        container.innerHTML = '';
      }
    }
  }
  loadShoppingCart(): void {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      this.shoppingCart = this.mergeCartData(parsedCart);
      console.log(this.shoppingCart)
    } else {
      this.sharedDataService.currentChartData.subscribe(data => {
        if (data) {
          this.updateShoppingCart(data);
          localStorage.setItem('shoppingCart', JSON.stringify(this.shoppingCart));
        }
      });
    }
  }
  mergeCartData(parsedCart: any): any {
    if (parsedCart && Array.isArray(parsedCart)) {
      return parsedCart.map(item => ({
        ...item,
        note: item.note || '',
        description: item.description || '',
        images: item.images || []
      }));
    }
    return [];
  }
  updateShoppingCart(data: any): void {
    const existingProduct = this.shoppingCart.find(product =>
      product.code === data.code && product.selectedTag === data.selectedTag
    );

    if (existingProduct) {
      existingProduct.countOfProduct += 1;
      existingProduct.note = data.note || existingProduct.note;
      existingProduct.description = data.description || existingProduct.description;
      existingProduct.images = data.images || existingProduct.images;
    } else {
      this.shoppingCart.push({
        ...data,
        note: data.note || '',
        description: data.description || '',
        images: data.images || []
      });
      (this.shoppingCart)
    }
    localStorage.setItem('shoppingCart', JSON.stringify(this.shoppingCart));
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

  removeProduct(product: any): void {
    const index = this.shoppingCart.indexOf(product);
    if (index !== -1) {
      this.shoppingCart.splice(index, 1);
      this.sharedDataService.changeChartDataDelete(product);
      localStorage.setItem('shoppingCart', JSON.stringify(this.shoppingCart));
      if (this.shoppingCart.length < 1) {
        this.router.navigate(['/home']);
      }
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
    console.log(mainPrice)
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
    return this.shoppingCart.reduce((total, product) =>
      total + (product.price * product.countOfProduct), 0
    );
  }
  nextDisabled = false;
  fileUploads: { [key: number]: File[] } = {};
  uploadFile(product: any, event: any, index: number, fileUpload: any): void {
    let files: File[] = event.files;

    if (files.length > product.countOfPhotos) {
      this.messageService.add({
        severity: 'error',
        summary: 'Rejected',
        detail: 'Your Upload Has Been Rejected',
        life: 3000
      });
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'You Can Upload Up To ' + product.countOfPhotos + ' Photos',
        life: 3000
      });
      event.files.length = 0;
    } else {
      if (!product.images) {
        product.images = [];
      }
      for (let file of files) {
        const objectURL = URL.createObjectURL(file);
        product.images.push({ file: file, objectURL: objectURL });
      }
      fileUpload.clear();
      this.fileUploads[index] = files;

      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Your Upload Has Been Accepted',
        life: 3000
      });
    }
  }

  deleteImage(product: any, image: any): void {
    const index = product.images.indexOf(image);
    if (index !== -1) {
      product.images.splice(index, 1);
    }
  }

  onNextClick(event: any): void {
    console.log(this.shoppingCart)
    for (let i = 0; i < this.shoppingCart.length; i++) {
      const description = (document.getElementById(`description${i}`) as HTMLTextAreaElement).value;
      const note = (document.getElementById(`note${i}`) as HTMLTextAreaElement).value;
      const files = this.shoppingCart[i].images;
      const countOfPhotos = this.shoppingCart[i].countOfPhotos;
      if (files.length < countOfPhotos) {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: `You Have to Upload ${countOfPhotos} photos.`,
          life: 3000
        });
        return;
      }
    }
    this.active = 1;
  }

  editCart() {
    this.active = 0;
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchSubject.next(query);
  }
  selectedAddress: any;
  addressSearchShow: boolean = true;
  addressForm: boolean = true;
  onResultClick(result: any): void {
    this.addressForm = true;
    this.addressResult.length = 0
    this.selectedAddress = result.properties;
    this.contactForm.patchValue({
      address: result.properties.address_line1,
      city: result.properties.city,
      state: result.properties.state_code,
      country: 'AU',
      postal_code: result.properties.postcode,
    });
  }

  addressOptionChange(event: any) {
    if (event.option.value === 'other') {
      this.addressForm = true;
    } else {
      this.addressForm = true;
      this.userService.getAddresses(this.currentUser.uid);
      this.userService.getBookingsObservable().subscribe((result: Address[]) => {
        this.userAddresses = Object.entries(result).map(([key, address]) => {
          return { key: key, ...address } as Address
        });
        const selectedAddress = this.userAddresses.find(
          (address) => address.addressname === event.option.value
        );
        if (selectedAddress) {
          this.selectedAddress = selectedAddress;
          this.contactForm.patchValue({
            address: selectedAddress.line1,
            city: selectedAddress.city,
            state: selectedAddress.state_code,
            country: 'AU',
            postal_code: selectedAddress.postcode,
          });
        } else {
          this.selectedAddress = '';
          this.contactForm.patchValue({ address: '' });
        }
      });
    }
  }

  //stripe
  subTotal: number = 0;
  finalPrice: number = 0;
  promotionText: boolean = false;

  getSubTotal(discount: number): number {
    const subtotal = this.shoppingCart.reduce((total, product) => total + product.price, 0);
    this.subTotal = subtotal - (subtotal * (discount / 100));
    return this.subTotal;
  }
  addPromotion() {
    if (this.promotion) {
      this.orderService.getPromotion(this.promotion).then((res) => {
        if (res) {
          this.promotionInfo = Object.entries(res).map(([key, value]) => {
            const validValue = (typeof value === 'object' && value !== null) ? value : { discount: value };
            return { key, ...validValue };
          });

          this.discount = this.promotionInfo[0]?.discount || 0;
          this.getSubTotal(this.discount);
          this.getTotalPrice();
          this.promotionText = true;
          console.log(this.promotionInfo);
        } else {
          this.promotionText = false;
          this.promotionInfo = 'null';
        }
      }).catch((err) => {
        console.error('Error adding promotion:', err);
      });
    }
  }

  removePromotion() {
    this.discount = 0;
    this.promotion = 'null';
    this.promotionText = false;
    this.promotionInfo = 'null';
    this.getSubTotal(0);
    this.getTotalPrice();
  }
  shipping: number = 10;
  getTotalPrice(): number {
    this.finalPrice = this.getSubTotal(this.discount)
    return this.finalPrice + this.shipping;
  }
  async handlePayment(amount: number, paymentOption: string) {
    if (!this.stripe || !this.card || !this.contactForm.valid) {
      this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Please Check The Contact Form', life: 3000 });
      this.contactForm.markAllAsTouched();
      return;
    }
    if (!this.currentUser) {
      this.currentUser = await this.authService.signInAnonymously();

    }
    const address = {
      line1: this.contactForm.get('address')?.value,
      city: this.contactForm.get('city')?.value,
      state: this.contactForm.get('state')?.value.code,
      country: 'AU',
      postal_code: this.contactForm.get('postal_code')?.value,
    }
    if (!this.promotionInfo?.key) {
      this.promotionInfo = 'null';
    }
    const name = this.contactForm.get('email')?.value;
    const email = this.contactForm.get('email')?.value;
    const orderObject = {
      products: this.shoppingCart.map((element: any) => ({
        code: element.code,
        countOfProduct: element.countOfProduct,
        selectedTag: element.selectedTag,
        type: element.type,
        productImageUrl: element.imageUrl,
        description: element.description,
        note: element.note,
        uploadImagesUrl: element.images
      })),
      shippingPrice: this.shipping,
      totalPrice: this.getTotalPrice(),
      promotion: this.promotionInfo[0],
      customer: {
        uid: this.currentUser.uid,
        isAnonymous: !this.currentUser.email,
        name: this.contactForm.get('name')?.value,
        surname: this.contactForm.get('surname')?.value,
        email: email
      },
      paymentDetail: {
        shipping: address,
        company: '',
        cargoId: '',
        id: '',
        shippingStatus: 'pending',
        method: ''
      },
      status: 'pending',
      emailStatus: 'pending'
    }

    if (paymentOption === 'paypal') {

    } else {
      this.proccess = true;
      this.http.post('https://app-r6z5go6nha-uc.a.run.app/create-payment-intent', { amount, paymentOption, address, name })
        .subscribe(async (res: any) => {
          const clientSecret = res.clientSecret;
          if (paymentOption === 'credit') {
            orderObject.paymentDetail.method = 'card'
            const returnOrder = await this.orderService.createOrders(orderObject);
            const { error, paymentIntent } = await this.stripe!.confirmCardPayment(clientSecret, {
              payment_method: {
                card: this.card!,
                billing_details: {
                  name: name,
                  address: address,
                  email: email
                },
              },
              return_url: 'https://www.onyxnthings.com.au/check-out/order/' + returnOrder.orderId,
            });

            if (error) {
              this.orderService.deleteOrder(returnOrder.orderId);
              this.proccess = false;
              this.messageService.add({ severity: 'error', summary: 'Rejected', detail: error.message, life: 3000 });
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {

              this.router.navigate(['/check-out/order/' + returnOrder.orderId], { queryParams: { payment_intent: paymentIntent.id } })
              this.proccess = false;
            }
          } else if (paymentOption === 'afterpay') {
            orderObject.paymentDetail.method = 'afterpay'
            const returnOrder = await this.orderService.createOrders(orderObject);
            const { error, paymentIntent } = await this.stripe!.confirmAfterpayClearpayPayment(clientSecret, {
              payment_method: {
                billing_details: {
                  name: name,
                  address: address,
                  email: email
                },
              },
              return_url: 'https://www.onyxnthings.com.au/check-out/order/' + returnOrder.orderId,
            });

            if (error) {
              this.orderService.deleteOrder(returnOrder.orderId);
              this.proccess = false;
              this.messageService.add({ severity: 'error', summary: 'Rejected', detail: error.message, life: 3000 });
              console.log('Payment Error:', error.message);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
              this.proccess = false;
            } else {
              this.proccess = false;
              console.log('Payment Unsuccesfully.');
            }
          } else if (paymentOption === 'zip') {
            const returnOrder = await this.orderService.createOrders(orderObject);
            const { error, paymentIntent } = await this.stripe!.confirmPayPalPayment(clientSecret, {
              payment_method: {
                billing_details: {
                  name: name,
                  address: address,
                  email: email
                },
              },
              return_url: 'https://www.onyxnthings.com.au/check-out/order/' + returnOrder.orderId,
            });

            if (error) {
              this.orderService.deleteOrder(returnOrder.orderId);
              this.proccess = false;
              this.messageService.add({ severity: 'error', summary: 'Rejected', detail: error.message, life: 3000 });
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
              this.proccess = false;
            } else {
              this.proccess = false;
              console.log('Payment Unsuccesfully.');
            }
          }
        });
    }

  }
  //paypal
  payWithPaypal() {
    this.proccess = true;
    this.loadPayPalScript().then(() => {
      this.renderPayPalButton();
      this.proccess = false;
    });
  }
  loadPayPalScript(): Promise<void> {
    return new Promise((resolve) => {
      if ((window as any).paypal) {
        resolve();
      } else {
        const script = document.createElement('script');
        script.src = 'https://www.paypal.com/sdk/js?client-id=AUfkJG5UelFChQW9LwOWl-EerW6bG92xwJiQ9JwaZfg2wWus-gOeUTwtwmDVJMa6ThRaP02yKA6tvD7m&currency=AUD';
        script.onload = () => resolve();
        document.body.appendChild(script);
      }
    });
  }

  async renderPayPalButton() {
    if (!this.stripe || !this.card || !this.contactForm.valid) {
      this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Please Check The Payment Form', life: 3000 });
      this.contactForm.markAllAsTouched();
      return;
    }
    if (!this.currentUser) {
      this.currentUser = await this.authService.signInAnonymously();
    }
    if (!this.promotionInfo?.key) {
      this.promotionInfo = 'null';
    }
    const email = this.contactForm.get('email')?.value;
    const address = {
      line1: this.contactForm.get('address')?.value,
      city: this.contactForm.get('city')?.value,
      state: this.contactForm.get('state')?.value.code,
      country: 'AU',
      postal_code: this.contactForm.get('postal_code')?.value,
    }
    const orderObject = {
      products: this.shoppingCart.map((element: any) => ({
        code: element.code,
        countOfProduct: element.countOfProduct,
        selectedTag: element.selectedTag,
        type: element.type,
        productImageUrl: element.imageUrl,
        uploadImagesUrl: element.images
      })),
      description: this.checkoutForm.get('description')?.value,
      note: this.checkoutForm.get('note')?.value,
      shippingPrice: this.shipping,
      totalPrice: this.getTotalPrice(),
      promotion: this.promotionInfo[0],
      customer: {
        uid: this.currentUser.uid,
        isAnonymous: !this.currentUser.email,
        name: this.contactForm.get('name')?.value,
        surname: this.contactForm.get('surname')?.value,
        email: email
      },
      paymentDetail: {
        shipping: address,
        id: '',
        company: '',
        cargoId: '',
        shippingStatus: 'pending',
        method: 'paypal'
      },
      status: 'pending',
      emailStatus: 'pending'
    };
    console.log(orderObject);
    (window as any).paypal.Buttons({
      fundingSource: (window as any).paypal.FUNDING.PAYPAL,
      createOrder: (data: any, actions: any) => {
        return firstValueFrom(this.http.post<{ approvalUrl: string }>('https://app-r6z5go6nha-uc.a.run.app/paypal-create-payment', { amount: this.getTotalPrice() }))
          .then((response: any) => {
            console.log(response)
            if (response.approvalUrl) {
              return response.approvalUrl.split('token=')[1];
            } else {
              throw new Error('Approval URL alınamadı.');
            }
          });
      },
      onApprove: async (data: any, actions: any) => {
        const result = await this.orderService.createOrders(orderObject);
        try {
          const captureResult: any = await firstValueFrom(
            this.http.post('https://app-r6z5go6nha-uc.a.run.app/paypal-capture-payment', { orderId: data.orderID })
          );
          result.paymentDetail = {
            shipping: result.paymentDetail?.shipping,
            method: 'paypal',
            shippingStatus: 'pending',
            id: captureResult.captureResult.id
          }
          this.proccess = true;
          console.log(123)
          const orderId = result.orderId;
          this.http.post('https://app-r6z5go6nha-uc.a.run.app/send-email', { orderId, result })
            .subscribe({
              next: async (res: any) => {
                console.log(result, orderId)
                await this.orderService.updateOrderMailStatus(result, orderId, 'completed');
                await this.orderService.updateOrderStatus(result, orderId, 'completed');
                this.router.navigate(['/check-out/order/' + result.orderId], { queryParams: { payment_intent: captureResult.captureResult.id } })

              },
              error: (err) => {
                console.error('E-mail doesnt sent:', err);
              }
            });
          console.log('test23')

        } catch (error) {
          console.error('Payment Error', error);
          alert('Payment Error');
          this.orderService.deleteOrder(result.orderId);
          this.proccess = false;
          this.anonymLogOut();
        }
      },
      onError: async (err: any) => {
        const returnOrder = await this.orderService.createOrders(orderObject);
        console.error('PayPal ödemesi sırasında hata oluştu:', err);
        alert('there is a problem on Payment Method.');
        this.orderService.deleteOrder(returnOrder.orderId);
        this.proccess = false;
        this.anonymLogOut();
      },
    }).render('#paypal-button-container');
  }

  anonymLogOut() {
    this.authService.deleteAnonymousUser().then((result) => {
      this.authService.logOut();
    }).catch((err) => {

    })
  }

}

interface Address {
  id: string;
  addressname: string;
  city: string;
  country: string;
  district: string;
  formatted: string;
  housenumber: string;
  postcode: string;
  state_code: string;
  street: string;
  fullAdress: string;
  line1: string;
}