import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set, push, remove, update } from 'firebase/database';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../enviroments/enviroments';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  db = getDatabase(initializeApp(environment.firebaseConfig));

  async addProduct(formValue: any): Promise<void> {
    try {
      const data = {
        name: formValue.value.name,
        email: formValue.value.email,
        phoneNumber: formValue.value.phone,
        subject: formValue.value.subject,
        description: formValue.value.message,
        createdDate: Date.now(),
      };
      const productRef = ref(this.db, 'contact-us');
      const newproductRef = push(productRef);
      const id = newproductRef.key;

      if (!id) {
        console.error('Invalid product ID');
        throw new Error('Invalid product ID');
      }
      await set(newproductRef, data);

    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }



  constructor(private http: HttpClient) {
  }

  search(query: string): Observable<any> {
    const apiUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&apiKey=80af97ce5e19464cb0a89018b2dc956d`;

    return new Observable(observer => {
      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Ağ hatası');
          }
          return response.json();
        })
        .then(data => {
          if (data.features && data.features.length > 0) {
            const result = data.features;
            observer.next(result); // Başarılı sonuç
          } else {
            observer.error('Sonuç bulunamadı.');
          }
        })
        .catch(error => {
          observer.error('API çağrısında hata: ' + error.message);
        });
    });
  }
  private bookingsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);


  getAddresses(uid: string): void {
    const pathForDb = ref(this.db, `users/${uid}/addresses`);
    onValue(pathForDb, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.bookingsSubject.next(data);
      } else {
        this.bookingsSubject.next([]);
      }
    });
  }
  getBookingsObservable(): Observable<any[]> {
    return this.bookingsSubject.asObservable();
  }
  removeAddress(uid: string, addressUid: string): Promise<any> {
    const dataRef = ref(this.db, `users/${uid}/addresses/${addressUid}`);
    return remove(dataRef).then((result) => {
      result;
    }).catch((error) => {
      error;
    });
  }

  editAddress(uid: string, addressUid: string, addressForm: any): Promise<any> {
    const data = {
      addressname: addressForm.value.addressname,
      housenumber: addressForm.value.housenumber,
      street: addressForm.value.street,
      district: addressForm.value.district,
      city: addressForm.value.city,
      state_code: addressForm.value.state_code,
      postcode: addressForm.value.postcode,
      country: addressForm.value.country,
      formatted: addressForm.value.formatted
    };
    const userRef = ref(this.db, `users/${uid}/addresses/${addressUid}`);
    return update(userRef, data)
      .then((result) => {
        console.log(result)
        result;
      })
      .catch((error) => {
        error
      });
  }

}
interface Address {
  formatted?: string;
}