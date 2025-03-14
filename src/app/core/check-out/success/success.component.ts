import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../../services/orders.service';
import { AuthService } from '../../../services/auth.service';
import { SharedDataService } from '../../../services/shared-data.service';
import { PaymentService } from '../../../services/payment.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent implements OnInit {
  paymentStatus: string = '';
  constructor(
    private route: ActivatedRoute, private authService: AuthService, private sharedDataService: SharedDataService,
    private orderService: OrdersService, private paymentService: PaymentService,private http: HttpClient,
  ) { }
  paymentIntentId: string = '';
  orderNumber: string = '';
  errorPage: boolean = false;
  paymentFailedPage: boolean = false;
  successPage: boolean = false;
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.paymentIntentId = params['payment_intent'];
      if (this.paymentIntentId) {
        this.paymentService.setPaymentStatus(true);
        this.orderNumber = window.location.href.split('/check-out/order/')[1].split('?')[0]
        this.checkPaymentStatus(this.paymentIntentId);
      } else {
        this.errorPage = true;
      }
    });
    
  }

  checkPaymentStatus(paymentIntentId: string): void {
    this.orderService.getOrder(this.orderNumber).then((result) => {
      console.log(result)
      if(result.status === "completed"){
        this.successPage = true;
        this.anonymLogOut();
        return;
      }
      this.orderService.getPaymentStatus(paymentIntentId).subscribe({
       
        next: (response: any) => {
          this.paymentStatus = response.status;
      
          if (this.paymentStatus === 'succeeded' && result.status !== 'completed') {
            if (result.emailStatus === 'pending') {
              const orderId = this.orderNumber;
              this.http.post('https://app-r6z5go6nha-uc.a.run.app/send-email', { orderId, result })
                .subscribe({
                  next: async (res: any) => {
                    this.orderService.updateOrderMailStatus(result, this.orderNumber, 'completed');
                  },
                  error: (err) => {
                    console.error('Email gönderimi sırasında hata oluştu:', err);
                  }
                });
            }
            this.successPage = true;
            this.paymentService.setPaymentStatus(true);
            result.paymentDetail = {
              shipping: result.paymentDetail?.shipping,
              method: result.paymentDetail?.method,
              id: this.paymentIntentId,
              shippingStatus: 'pending',
            };
            this.orderService.updateOrderStatus(result, this.orderNumber, 'completed');
            this.anonymLogOut();
          } else {
            this.paymentFailedPage = true;
            this.paymentService.setPaymentStatus(false);
            console.log(`Ödeme durumu: ${this.paymentStatus}`);
            this.anonymLogOut();
          }
        },
        error: (error) => {
          this.errorPage = true;
          this.paymentService.setPaymentStatus(false);
          this.anonymLogOut();
          console.error('Ödeme durumu sorgulanırken hata oluştu:', error);
        }
      });
      
      
    }).catch((err) => {
      this.paymentService.setPaymentStatus(false);
      this.errorPage = true;
      console.log(err);
      this.anonymLogOut();
    })


   
  }

  anonymLogOut() {
    this.authService.deleteAnonymousUser().then((result) => {
      this.authService.logOut();
    }).catch((err) => {

    })
  }
}
