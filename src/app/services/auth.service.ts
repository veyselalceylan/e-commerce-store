import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { deleteUser, getAuth, onAuthStateChanged, User } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroments';
import { FirebaseServerApp, initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, push, child } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: firebase.User | null = null;
  private db = getDatabase(initializeApp(environment.firebaseConfig));
  private auth = getAuth(initializeApp(environment.firebaseConfig));
  private userSubject = new BehaviorSubject<any>(null);
  public currentUser = this.userSubject.asObservable();
  user$: Observable<any>;
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.afAuth.onAuthStateChanged(user => {
      this.userSubject.next(user);
    });
    this.user$ = afAuth.authState;
  }
  isUserLoggedIn() {
    return this.user$;
  }
 
  async getCurrentUser(): Promise<firebase.User | null> {
    return firstValueFrom(this.afAuth.authState);
  }
  async signIn(email: string, password: string): Promise<string | null> {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      return null;
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        return "Yanlış şifre."; 
      }
      return "Giriş hatası: " + error.message;
    }
  }
  async getUserDb(uid: string): Promise<any> {
    try {
      const user = await new Promise<User | null>((resolve) => {
        onAuthStateChanged(this.auth, (user) => {
          resolve(user);
        });
      });
      if (user) {
        const userRef = ref(this.db, `users/${uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          return snapshot.val(); 
        } else {
          console.log('Veri bulunamadı');
          return null;
        }
      } else {
        console.log('Kullanıcı oturum açmamış');
        return null; 
      }
    } catch (error) {
      console.error('Veri alınırken hata:', error);
      return null; 
    }
  }

  async sendPasswordEmail(email: string): Promise<any>{
    this.afAuth.sendPasswordResetEmail(email).then((result: any)=>{
      return result;
    })
  }

  async isAdmin(): Promise<boolean> {
    const user = await firstValueFrom(this.afAuth.authState);
    if (user) {
      const token = await user.getIdTokenResult();
      return token.claims['admin'] ? true : false;
    }
    return false;
  }

  signUp(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          user.sendEmailVerification()
            .then(() => {
              console.log('Doğrulama e-postası gönderildi.');
            })
            .catch((error) => {
              console.error('Doğrulama e-postası gönderilirken hata oluştu: ', error);
            });
          this.router.navigate(['signin']);
        }
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
  async signInAnonymously() {
    try {
      const userCredential = await this.afAuth.signInAnonymously();
      return userCredential.user;
    } catch (error) {
      console.error('Geçici kullanıcı oluşturulamadı:', error);
      throw error;
    }
  }
  async deleteAnonymousUser() {
    const user = this.auth.currentUser;
    if (user?.isAnonymous) {
      try {
        const deleteuser = await deleteUser(user);
        console.log('Anonim kullanıcı silindi.');
        return deleteuser;
      } catch (error) {
        console.error('Anonim kullanıcı silinirken hata oluştu:', error);
      }
    } else {
      console.log('Anonim kullanıcı mevcut değil.');
    }
  }
  async saveUserData(userId: string, additionalData: any) {
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        const userRef = ref(this.db, `users/${userId}`);
        set(userRef, {
          uid: user.uid,
          ...additionalData
        }).then(() => {
          console.log('Kullanıcı verisi başarıyla kaydedildi.');
        }).catch((error) => {
          console.error('Veri kaydedilirken hata oluştu:', error);
        });
      } else {
        console.log('Kullanıcı oturumu kapalı.');
      }
    });
  }

  updateEmail(newEmail: string) {
    return this.afAuth.currentUser.then((user) => {
      if (user) {
        return user.updateEmail(newEmail);
      } else {
        throw new Error('Kullanıcı giriş yapmamış.');
      }
    });
  }
  updatePassword(newPassword: string) {
    return this.afAuth.currentUser.then((user) => {
      if (user) {
        return user.updatePassword(newPassword);
      } else {
        throw new Error('Kullanıcı oturum açmamış.');
      }
    });
  }
  async saveAddress(userId: string, addressForm: any, formatted: any) {
    try {
      console.log(addressForm)
      const data = {
        addressname: addressForm.value.addressname,
        housenumber: addressForm.value.housenumber,
        street: addressForm.value.street,
        district: addressForm.value.district,
        city: addressForm.value.city,
        state_code: addressForm.value.state_code,
        postcode: addressForm.value.postcode,
        country: addressForm.value.country,
        formatted: formatted
      };
      const productRef = ref(this.db, `users/${userId}/addresses/`);
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
  

  async updatePhoneNumber(phoneNumber: string, verificationCode: string, verificationId: string) {
    const user = await this.afAuth.currentUser;
    console.log(user)
    if (user) {
      const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
      await user.updatePhoneNumber(credential);
      console.log('Telefon numarası güncellendi.');
    }
  }

  logOut() {
    return this.afAuth.signOut();
  }
}
