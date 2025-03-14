import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getDatabase, onValue, ref, set, push, update, get, remove, query as dbQuery,
  orderByKey, startAt, endAt, limitToFirst, orderByChild, equalTo
} from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  db = getDatabase(initializeApp(environment.firebaseConfig));
  private storage = getStorage(initializeApp(environment.firebaseConfig));


  getTreeNodesData() {
    return [
      {
        key: '0',
        label: 'Kids Models',
        data: 'kids',
        icon: '',
        children: [
          { key: '0-1', label: 'Boy', icon: '', data: 'boy' },
          { key: '0-2', label: 'Girl', icon: '', data: 'girl' },
          { key: '0-3', label: 'Baby', icon: '', data: 'baby' },
        ]
      },
      {
        key: '1',
        label: 'Man Models',
        data: 'man',
        icon: '',
        children: [
          { key: '1-1', label: 'Casual', icon: '', data: 'casual' },
          { key: '1-2', label: 'Doctor', icon: '', data: 'doctor' },
          { key: '1-3', label: 'Business', icon: '', data: 'business' },
          { key: '1-4', label: 'Soldier', icon: '', data: 'soldier' },
          { key: '1-5', label: 'Music', icon: '', data: 'music' },
          { key: '1-6', label: 'Hero', icon: '', data: 'hero' },
          { key: '1-7', label: 'Sport', icon: '', data: 'sport' },
        ]
      },
      {
        key: '2',
        label: 'Woman Models',
        data: 'woman',
        icon: '',
        children: [
          { key: '2-1', label: 'Casual', icon: '', data: 'casual' },
          { key: '2-2', label: 'Doctor', icon: '', data: 'doctor' },
          { key: '2-3', label: 'Business', icon: '', data: 'business' },
          { key: '2-4', label: 'Kitchen', icon: '', data: 'kitchen' },
          { key: '2-5', label: 'Music', icon: '', data: 'music' },
          { key: '2-6', label: 'Hero', icon: '', data: 'hero' },
          { key: '2-7', label: 'Sport', icon: '', data: 'sport' },
        ]
      },
      {
        key: '3',
        label: 'Wedding Models',
        data: 'wedding',
        icon: '',
      },
      {
        key: '4',
        label: 'Lovers Models',
        data: 'lover',
        icon: '',
      },
      {
        key: '5',
        label: 'Family Models',
        data: 'family',
        icon: '',
      },
      {
        key: '6',
        label: 'School Models',
        data: 'school',
        icon: '',
      },
    ];
  }

  getTreeNodes() {
    return Promise.resolve(this.getTreeNodesData());
  }

  getFiles() {
    return Promise.resolve(this.getTreeNodesData());
  }
  constructor() {
    this.getproducts();
  }
  private productsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private productsSubjectForCat: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  getproducts(): any {
    const listRef = dbQuery(ref(this.db, 'products'));
    onValue(listRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.productsSubject.next(data);
      } else {
        this.productsSubject.next([]);
      }
    });
  }
  getproductsObservable(): Observable<any[]> {
    return this.productsSubject.asObservable();
  }

  private allProducts: any[] = [];
  private lastKey: string | null = null;

  getProductsByPath(path: string | null): Promise<any[]> {
    this.allProducts = [];
    const pathForDb = `products/${path}`;
    let listRef = dbQuery(ref(this.db, pathForDb));
    if (this.lastKey) {
      listRef = dbQuery(ref(this.db, pathForDb));
    }
    return get(listRef).then((snapshot) => {
      const data = snapshot.val() as Record<string, any> | null;

      if (data) {
        const products = Object.entries(data).map(([key, value]) => ({
          key,
          ...value,
          imageValid: true,
          price: null, oldPrice: null
        }));
        this.lastKey = products.length ? products[products.length - 1].key : null;
        return this.allProducts = [...this.allProducts, ...products];
      } else {
        return [];
      }
    }).catch((error) => {
      console.error('Firebase error: ', error);
      return [];
    });
  }

  async getProductsForSearch(query: string | null): Promise<any[]> {
    if (!query) return [];
    const productsRef = ref(this.db, 'products');
    try {
      const snapshot = await get(productsRef);
      if (snapshot.exists()) {
        const products = snapshot.val();
        const filteredProducts = this.filterProductsByQuery(products, query);
        return filteredProducts;
      } else {
        return [];
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  private filterProductsByQuery(products: any, query: string): any[] {
    const results: any[] = [];
    for (const category in products) {
      for (const subcategory in products[category]) {
        for (const productId in products[category][subcategory]) {
          const product = products[category][subcategory][productId];
          const nameMatches = product.name.toLowerCase().includes(query.toLowerCase());
          const codeMatches = product.code.toLowerCase().includes(query.toLowerCase());
          if (nameMatches || codeMatches) {
            results.push(product);
          }
        }
      }
    }
    return results;
  }



  getProductsByPathMain(path: string | null): Promise<any[]> {
    this.allProducts = [];
    const pathForDb = `products/${path}`;
    let listRef = dbQuery(ref(this.db, pathForDb));

    if (this.lastKey) {
      listRef = dbQuery(ref(this.db, pathForDb));
    }
    return get(listRef).then((snapshot) => {
      const data = snapshot.val() as Record<string, any> | null;
      if (data) {
        const products = Object.keys(data).reduce((acc: any, categoryKey: any) => {
            const categoryProducts = Object.entries(data[categoryKey]).map(([key, product]) => {
              if (typeof product === 'object' && product !== null) {
                return { key, ...product, imageValid: true, price: null, oldPrice: null };
              } else {
                return { key };
              }
            });
          return acc.concat(categoryProducts);
        }, []);
        return this.allProducts = [...this.allProducts, ...products];
      } else {
        return [];
      }
    }).catch((error) => {
      console.error('Firebase error: ', error);
      return [];
    });
  }

  loadMoreProducts(limit: any): void {
    const currentLength = this.productsSubjectForCat.getValue().length;
    if (currentLength < this.allProducts.length) {
      const nextProducts = this.allProducts.slice(currentLength, currentLength + limit);
      this.productsSubjectForCat.next([...this.productsSubjectForCat.getValue(), ...nextProducts]);
    }
  }

  getProductsByPathWithId(path: string | null, productId: string): Promise<any> {
    this.allProducts = [];
    const pathForDb = `${path}/${productId}`;
    let listRef = dbQuery(ref(this.db, pathForDb));
    if (this.lastKey) {
      listRef = dbQuery(ref(this.db, pathForDb));
    }
    return get(listRef).then((snapshot) => {
      const data = snapshot.val() as Record<string, any> | null;
      console.log(data)
      return data;
    }).catch((error) => {
      console.error('Firebase error: ', error);
      return [];
    });
  }

  getPricing(): Promise<any> {
    let listRef = ref(this.db, 'price');
    return get(listRef).then((snapshot) => {
      const data = snapshot.val();
      return data;
    }).catch((error) => {
      console.error('Firebase error: ', error);
      return [];
    });
  }


  async addProduct(formValue: any, images: string[]): Promise<void> {
    try {
      const data = {
        mainCategory: formValue.value.mainCategory,
        secondCategory: formValue.value.secondCategory,
        name: formValue.value.productName,
        code: formValue.value.productCode,
        mainDescription: formValue.value.productMainDescription,
        secondDescription: formValue.value.productSecondDescription,
        inStock: 'INSTOCK',
        quantity: 999,
        createdDate: Date.now(),
        lastEditedDate: Date.now(),
      };
      const productRef = ref(this.db, 'products');
      const newproductRef = push(productRef);
      const id = newproductRef.key;

      if (!id) {
        console.error('Invalid product ID');
        throw new Error('Invalid product ID');
      }
      await this.uploadPhotos(images, 'categories', formValue.value.mainCategory, formValue.value.secondCategory, id);
      await set(newproductRef, data);

    } catch (error) {
      console.error('Error adding product:', error);
      const productRef = ref(this.db, 'products');
      const newProductRef = push(productRef);
      await remove(newProductRef).catch(removeError => {
        console.error('Error removing product:', removeError);
      });
      throw error;
    }
  }


  uploadPhotos(base64Images: string[], categories: string, main: string, second: string, id: string): Promise<any[]> {
    if (!id) {
      throw new Error('Invalid container ID');
    }

    const uploadPromises: Promise<any>[] = [];
    const path = `${categories}/${main}/${second}/${id}/`;

    base64Images.forEach((base64Image, index) => {
      const { fileName, mimeType } = this.extractFileNameAndMime(base64Image);
      const filePath = `${path}${fileName}`;
      const fileRef = storageRef(this.storage, filePath);
      const blob = this.base64ToBlob(base64Image, mimeType);

      uploadPromises.push(
        uploadBytes(fileRef, blob).then((result) => {
          console.log(result)
          return getDownloadURL(fileRef);
        }).then(downloadURL => {
          return (downloadURL);
        })
      );
    });
    return Promise.all(uploadPromises);
  }

  extractFileNameAndMime(base64Image: string): { fileName: string; mimeType: string } {
    const matches = base64Image.match(/^data:(.+);base64,(.+)$/);
    if (matches) {
      const mimeType = matches[1];
      const fileExtension = mimeType.split('/')[1];
      const fileName = `image_${Date.now()}.${fileExtension}`;
      return { fileName, mimeType };
    } else {
      throw new Error('Invalid base64 image format');
    }
  }

  base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }




}
