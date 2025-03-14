import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  constructor(private http: HttpClient) {}

  createCheckoutSession() {
    return this.http.post<any>('/create-checkout-session', {}); 
  }
}
