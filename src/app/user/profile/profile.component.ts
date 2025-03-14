import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { debounce, debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Modal } from 'bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  providers: [ConfirmationService, MessageService]
})
export class ProfileComponent implements OnInit {
  profile = {
    phone: '',
    email: '',
    password: '',
    card: ''
  };

  editField: string | null = null;
  cardForm: FormGroup;
  monthlist = [
    { value: '01', text: 'January' },
    { value: '02', text: 'February' },
    { value: '03', text: 'March' },
    { value: '04', text: 'April' },
    { value: '05', text: 'May' },
    { value: '06', text: 'June' },
    { value: '07', text: 'July' },
    { value: '08', text: 'August' },
    { value: '09', text: 'September' },
    { value: '10', text: 'October' },
    { value: '11', text: 'November' },
    { value: '12', text: 'December' }
  ];
  isVerifyAccount: boolean = false;
  years: Array<{ value: string, text: string }> = [];
  user$: Observable<any>;
  currentUser: any;
  loading: boolean = false;
  addressResult: any[] = [];
  selectedResult: any = null;
  formKeys: string[] = [];
  private searchSubject = new Subject<string>();
  addressForm: FormGroup;
  userAddresses: Address[] = [];
  orders: any[] = [];
  mode: 'create' | 'edit' = 'create';
  constructor(private fb: FormBuilder, private afAuth: AngularFireAuth, private authService: AuthService, private ordersService: OrdersService,
    private router: Router, private userService: UserService, private confirmationService: ConfirmationService, private messageService: MessageService
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query) {
        this.userService.search(query).subscribe((res: any) => {
          this.addressResult = res;
        });
      } else {
        this.addressResult = [];
      }
    });
    this.addressForm = this.fb.group({
      addressname: [{ value: '', disabled: false }, Validators.required],
      housenumber: [{ value: '', disabled: false }, Validators.required],
      street: [{ value: '', disabled: false }, Validators.required],
      district: [{ value: '', disabled: false }, Validators.required],
      city: [{ value: '', disabled: false }, Validators.required],
      state_code: [{ value: '', disabled: false }, Validators.required],
      postcode: [{ value: '', disabled: false }, Validators.required],
      country: [{ value: '', disabled: false }, Validators.required],
      formatted: [{ value: '', disabled: false }, Validators.required],
    });
    this.generateYearOptions();
    this.cardForm = this.fb.group({
      name: ['', Validators.required],
      expiryMonth: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{4}-\d{4}-\d{4}$/)]],
      expiryYear: ['', Validators.required],
    });
    this.user$ = this.afAuth.authState;
  }
  recaptchaVerifier: any;

  ngOnInit(): void {
    this.user$.subscribe((user: any) => {
      if (user.emailVerified == false) {
        this.isVerifyAccount = true;
      } else {
        this.authService.getUserDb(user.uid).then((result) => {
          if (!result) {
            this.authService.saveUserData(user.uid, { email: user.email }).then((result) => {
              this.profile.email = user.email || '';
              this.userService.getAddresses(user.uid);
              this.userService.getBookingsObservable().subscribe((result: Address[]) => {
                this.userAddresses = Object.entries(result).map(([key, address]) => {
                  return { key: key, ...address } as Address
                });

              });
              this.ordersService.getOrders(user.uid);
              this.ordersService.getOrdersObservable().subscribe((orders) => {
                this.orders = orders;
              });
            }).catch((err) => {
              console.log(err)
            })
          } else {
            this.authService.getUserDb(user.uid).then((result) => {
              this.currentUser = result;
              this.userService.getAddresses(user.uid);
              this.userService.getBookingsObservable().subscribe((result: Address[]) => {
                this.userAddresses = Object.entries(result).map(([key, address]) => {
                  return { key: key, ...address } as Address
                });

              });
              this.ordersService.getOrders(user.uid);
              this.ordersService.getOrdersObservable().subscribe((orders) => {
                this.orders = orders;
              });
              this.profile.phone = result.phoneNumber || '';
              this.profile.email = result.email || '';
            })
          }
        })
      }

    });
  }
  isAddressExists(address: string): boolean {
    return this.userAddresses.some(addr => addr.addressname === address);
  }
  openModal(selectedAddress?: any) {
    if (selectedAddress) {
      this.mode = 'edit';
      this.selectedResult = selectedAddress;
      this.fillFormWithSelectedData();
    } else {
      this.mode = 'create';
      this.selectedResult = null;
      this.addressForm.reset();
    }
  }
  fillFormWithSelectedData() {
    if (this.selectedResult) {
      this.addressForm.patchValue({
        addressname: this.selectedResult.addressname,
        housenumber: this.selectedResult.housenumber,
        street: this.selectedResult.street,
        district: this.selectedResult.district,
        city: this.selectedResult.city,
        state_code: this.selectedResult.state_code,
        postcode: this.selectedResult.postcode,
        line1: this.selectedResult.address_line1,
        country: this.selectedResult.country_code,
        formatted: this.selectedResult.formatted,

      });
    }
  }
  formatCardNumber(event: any) {
    let input = event.target.value;
    input = input.replace(/\D/g, '');
    let formattedInput = '';
    for (let i = 0; i < input.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedInput += '-';
      }
      formattedInput += input[i];
    }
    event.target.value = formattedInput;
  }



  generateYearOptions() {
    const currentYear = new Date().getFullYear();
    const range = 10;
    for (let i = 0; i <= range; i++) {
      const year = (currentYear + i).toString();
      this.years.push({ value: year, text: year });
    }
  }

  edit(field: string) {
    this.editField = field;
  }

  save(field: string) {
    if (field === 'password') {
      this.savePassword();
    } else if (field === 'email') {
      this.saveEmail();
    } else if (field === 'phone') {
      this.savePhone();
    }
    else if (field === 'card' && this.cardForm.valid) {
      this.saveCard();
    } else {
      this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Form Invalid', life: 3000 });
    }
  }
  closeEdit() {
    this.editField = '';
  }
  isInvalid(field: string) {
    return this.cardForm.get(field)?.invalid && (this.cardForm.get(field)?.dirty || this.cardForm.get(field)?.touched);
  }

  showVerifyCode: boolean = false;
  emailVerified: boolean = false;
  verificationSent: boolean = false;
  verificationCode: string = '';
  verificationId: string = '';
  checkEmailVerification(user: any) {
    user.reload().then(() => {
      this.emailVerified = user.emailVerified;
    });
  }
  showEmailVerify = false;
  showEmailVerifyError = false;
  async sendVerificationEmail() {
    const user = await this.afAuth.currentUser;
    if (user) {
      user.sendEmailVerification().then(() => {
        this.verificationSent = true;
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Verify Mail has been sent', life: 3000 });
      }).catch((error) => {
        this.verificationSent = false;
        this.showEmailVerifyError = true;
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Some Problem on System', life: 3000 });
      });
    }
  }
  saveEmail() {
    this.currentUser.email = this.profile.email;
    this.authService.updateEmail(this.profile.email).then(() => {
      this.authService.saveUserData(this.currentUser.uid, this.currentUser).then((result) => {
        this.authService.logOut();
        this.router.navigate(['/home']);
      }).catch((error) => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: error.message, life: 3000 });
      });
    }).catch((error) => {
      this.messageService.add({ severity: 'error', summary: 'Rejected', detail: error.message, life: 3000 });
    });
  }

  savePhone() {
    this.user$.subscribe((user: any) => {
      if (user) {
        this.currentUser.phoneNumber = '+61' + this.profile.phone;
        this.authService.saveUserData(user.uid, this.currentUser).then((result: any) => {
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Phone has been updated', life: 3000 });
          this.editField = '';
        }).catch((error) => {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: error.message, life: 3000 });
        });
      }
    });

  }

  savePassword() {

    this.authService.updatePassword(this.profile.password).then((result) => {
      this.authService.logOut();
      this.router.navigate(['/home']);
    }).catch((error) => {
      this.messageService.add({ severity: 'error', summary: 'Rejected', detail: error.message, life: 3000 });
    });
  }

  saveCard() {
    this.user$.subscribe((user: any) => {
      this.currentUser.cardDetail = this.cardForm.value;
      this.authService.saveUserData(user.uid, this.currentUser).then((result) => {
        this.editField = '';
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Address has been created', life: 3000 });
      }).catch((error) => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: error.message, life: 3000 });
      });
    })

  }
  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchSubject.next(query);
  }


  onResultClick(result: any): void {
    if (this.mode === 'create') {
      this.selectedResult = result.properties;
      this.addressForm.patchValue({
        addressname: this.selectedResult.addressname || '',
        housenumber: this.selectedResult.housenumber || '',
        street: this.selectedResult.street || '',
        district: this.selectedResult.district || '',
        city: this.selectedResult.city || '',
        state_code: this.selectedResult.state_code || '',
        postcode: this.selectedResult.postcode || '',
        country: this.selectedResult.country || '',
        formatted: this.selectedResult.formatted || ''
      });
    } else if (this.mode === 'edit') {
      const data = {
        id: this.selectedResult.key,
        addressname: result.properties.addressname || '',
        housenumber: result.properties.housenumber || '',
        street: result.properties.street || '',
        district: result.properties.district || '',
        city: result.properties.city || '',
        state_code: result.properties.state_code || '',
        postcode: result.properties.postcode || '',
        country: result.properties.country || '',
        formatted: result.properties.formatted || ''
      }
      this.addressForm.patchValue({
        addressname: data.addressname || '',
        housenumber: data.housenumber || '',
        street: data.street || '',
        district: data.district || '',
        city: data.city || '',
        state_code: data.state_code || '',
        postcode: data.postcode || '',
        country: data.country || '',
        formatted: data.formatted || ''
      });
    }
    this.addressResult.length = 0;
  }
  @ViewChild('closebutton') closebutton: any;
  showAddressSuc: boolean = false;
  showAddressErr: boolean = false;
  addressSuccess: string = '';
  addressError: string = '';
  saveAddress() {
    if (this.mode === 'create') {
      this.createAddress();
    } else if (this.mode === 'edit') {
      this.updateAddress();
    }

  }

  createAddress() {
    this.authService.saveAddress(this.currentUser.uid, this.addressForm, this.selectedResult.formatted).then((result) => {
      this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Address has been created', life: 3000 });
      this.addressForm.reset();
      this.closebutton.nativeElement.click();
    }).catch((error) => {
      this.messageService.add({ severity: 'error', summary: 'Rejected', detail: error.message, life: 3000 });
    })
  }

  updateAddress() {
    this.userService.editAddress(this.currentUser.uid, this.selectedResult.key, this.addressForm).then((result) => {
      this.addressForm.reset();
      this.closebutton.nativeElement.click();
      this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Address has been updated', life: 3000 });
    }).catch((error) => {
      this.messageService.add({ severity: 'error', summary: 'Rejected', detail: error.message, life: 3000 });
    })
  }

  deleteAddress(event: Event, result: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.removeAddress(this.currentUser.uid, result.key).then(() => {
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Address has been deleted', life: 3000 });
        }).catch((error) => {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: error.message, life: 3000 });
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      },
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger p-button-outlined m-1',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined  m-1'
    });
  }

  getPaymentSeverity(status: string): 'secondary' | 'success' | 'contrast' | undefined {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'completed':
        return 'success';
      default:
        return undefined;
    }
  }
  getSizeSeverity(status: string): 'secondary' | 'success' | 'contrast' | undefined {
    switch (status) {
      case 'Smallest':
        return 'secondary';
      case '15 CM':
        return 'secondary';
      case '20 CM':
        return 'contrast';
      case '25 CM':
        return 'contrast';
      case '30 CM':
        return 'contrast';
      default:
        return undefined;
    }
  }
  getShippingSeverity(status: string): 'secondary' | 'success' | 'contrast' | undefined {
    switch (status) {
      case 'PENDING':
        return 'secondary';
      case 'PREPARED':
        return 'contrast';
      case 'ONTHEWAY':
        return 'success';
      default:
        return undefined;
    }
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
}
export function cardNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const cardNumberPattern = /^[0-9]{13,19}$/;

    if (!value || !cardNumberPattern.test(value)) {
      return { invalidCardNumber: true };
    }

    return null;
  };
}

