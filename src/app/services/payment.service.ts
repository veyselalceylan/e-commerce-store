import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private paymentStatusSubject = new BehaviorSubject<boolean>(false); 
  paymentStatus$ = this.paymentStatusSubject;

  setPaymentStatus(status: boolean) {
    console.log("Setting payment status to", status); 
    this.paymentStatusSubject.next(status);
  }
}
