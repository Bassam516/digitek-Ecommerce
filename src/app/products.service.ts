import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Products } from './products';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private _HttpClient: HttpClient) { }
  
  getAllCategories(): Observable<any> {
    return this._HttpClient.get('https://ecommerce.routemisr.com/api/v1/categories');
  }

  getLimitedProducts(limit:number): Observable<any> {
    return this._HttpClient.get<Products[]>('https://ecommerce.routemisr.com/api/v1/products', {
      params:{limit:limit}
    });
  }

  getAllProducts(): Observable<any> {
    return this._HttpClient.get<Products[]>('https://ecommerce.routemisr.com/api/v1/products');
  }

  getSpecificProduct(id:null|string):Observable<any> {
    return this._HttpClient.get<Products>(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
  }

}
