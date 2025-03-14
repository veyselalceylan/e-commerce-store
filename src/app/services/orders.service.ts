import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set, push, remove, update, query, orderByChild, equalTo, get } from 'firebase/database';
import { BehaviorSubject, finalize, Observable, Subject } from 'rxjs';
import { environment } from '../../enviroments/enviroments';
import { HttpClient } from '@angular/common/http';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import firebase from 'firebase/compat/app';
@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  db = getDatabase(initializeApp(environment.firebaseConfig));

  constructor(private http: HttpClient, private storage: AngularFireStorage
  ) {
  }

  private auth = getAuth(initializeApp(environment.firebaseConfig));
  private ordersSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);


  getOrders(userUid: string): void {
    const listRef = query(ref(this.db, 'orders'), orderByChild('customer/uid'), equalTo(userUid));
    onValue(listRef, (snapshot) => {
      const data = snapshot.val();
      const filteredBookings: any = [];
      if (data) {
        Object.keys(data).forEach(key => {
          const booking = data[key];
          filteredBookings.push({ id: key, ...booking });
        });
        this.ordersSubject.next(filteredBookings);
      } else {
        this.ordersSubject.next([]);
      }
    });
  }
  getOrdersObservable(): Observable<any[]> {
    return this.ordersSubject.asObservable();
  }

  async createOrders(additionalData: any) {
    const newOrderData = {
      ...additionalData,
      products: additionalData.products.map((product: any) => ({
        ...product,
        uploadImagesUrl: []
      }))
    };
    try {
      const newData = { createdAt: new Date().getTime(), ...newOrderData };
      const user = await new Promise<User | null>((resolve) => {
        onAuthStateChanged(this.auth, (user) => resolve(user));
      });
      if (user) {
        const orderRef = ref(this.db, 'orders');
        const newOrderRef = await push(orderRef, newData);
        const orderId = newOrderRef.key;
        await this.uploadImages(orderId, additionalData.products);
        return { orderId: orderId, ...newData };
      }
    } catch (error) {
      console.error('Sipariş kaydedilirken hata oluştu:', error);
    }
  }

  private async uploadImages(orderId: string | null, products: any[]) {
    if (!orderId) {
      console.error("Geçersiz sipariş ID'si");
      return;
    }

    for (const product of products) {
      const productCode = product.code;
      const uploadTasks = product.uploadImagesUrl.map(async (imageObj: any, index: number) => {
        const file = imageObj.file;
        const filePath = `orders/${orderId}/${productCode}/${file.name}`;
        const fileRef = this.storage.ref(filePath);
        const blobUrl = file.objectURL.changingThisBreaksApplicationSecurity;
        const task = this.storage.upload(filePath, await fetch(blobUrl).then(res => res.blob()));
        return new Promise<string>((resolve, reject) => {
          task.snapshotChanges()
            .pipe(
              finalize(async () => {
                const downloadURL = await fileRef.getDownloadURL().toPromise();
                resolve(downloadURL);
              })
            )
            .subscribe({
              error: (error) => reject(error)
            });
        });
      });

      const imageUrls = await Promise.all(uploadTasks);
      product.uploadImagesUrl = imageUrls;
      const productRef = ref(this.db, `orders/${orderId}/products/${products.indexOf(product)}/uploadImagesUrl`);
      await set(productRef, imageUrls);
    }
  }

  async deleteOrder(orderId: string) {
    try {
      const orderRef = ref(this.db, `orders/${orderId}`);
      await remove(orderRef);
      console.log(`Sipariş ${orderId} başarıyla silindi.`);
    } catch (error) {
      console.error('Sipariş silinirken hata oluştu:', error);
    }
  }

  async updateOrderStatus(order: any, orderId: string, newStatus: string) {
    try {
      const orderRef = ref(this.db, `orders/${orderId}`);
      await update(orderRef, {
        paymentDetail: order.paymentDetail,
        status: newStatus,
      });
      console.log(`Sipariş ${orderId} durumu başarıyla güncellendi: ${newStatus}`);
    } catch (error) {
      console.error('Sipariş durumu güncellenirken hata oluştu:', error);
    }
  }

  async updateOrderMailStatus(order: any, orderId: string, newStatus: string) {
    try {
      const orderRef = ref(this.db, `orders/${orderId}`);
      await update(orderRef, {
        emailStatus: newStatus,
      });
      console.log(`Sipariş ${orderId} durumu başarıyla güncellendi: ${newStatus}`);
    } catch (error) {
      console.error('Sipariş durumu güncellenirken hata oluştu:', error);
    }
  }

  private apiUrl = 'https://app-r6z5go6nha-uc.a.run.app/payment-intent-status';

  getPaymentStatus(paymentIntentId: string): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${this.apiUrl}/${paymentIntentId}`);
  }

  async getOrder(uid: string): Promise<any> {
    try {
      const orderRef = ref(this.db, `orders/${uid}`);
      const snapshot = await get(orderRef);
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log('Veri bulunamadı');
        return null;
      }
    } catch (error) {
      console.error('Veri alınırken hata:', error);
      return null;
    }
  }


  //forpage
  async getPageDetails(): Promise<any>{
    const pathForDb = 'title';
    let listRef = ref(this.db, pathForDb)
    onValue(listRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data)
      return data;
    });
  }

  async getPromotion(promotionCode: string) { 
    const pathForDb = ref(this.db, 'promotions');
    try {
      const snapshot = await get(query(pathForDb, orderByChild('promotionCode'), equalTo(promotionCode)));
      if (snapshot.exists()) {
        const data = snapshot.val();
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting promotion:", error);
      return error;
    }
  }

  async deletePromotion(uid: string) {
    try {
      const pathForDb = ref(this.db, `promotions/${uid}`);
      await remove(pathForDb);
    } catch (error) {
      console.error('Sipariş silinirken hata oluştu:', error);
    }
  }

}
interface Address {
  formatted?: string;
}