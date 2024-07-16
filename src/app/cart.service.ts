import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  numOfCartItems = new BehaviorSubject(0);
  sidebarVisible: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  constructor(private _HttpClient: HttpClient) {
    this.getLoggedUserCart().subscribe({
      next: (res) => {
        this.numOfCartItems.next(res.numOfCartItems);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  
  addToCart(productId:string):Observable<any> {
    return this._HttpClient.post('https://ecommerce.routemisr.com/api/v1/cart', {
      productId: productId
    })
  }

  getLoggedUserCart():Observable<any> {
    return this._HttpClient.get('https://ecommerce.routemisr.com/api/v1/cart');
  }

  updateProductCount(id:string, count:number): Observable<any>{
    return this._HttpClient.put(`https://ecommerce.routemisr.com/api/v1/cart/${id}`, {
      count:count
    })
  }

  deleteCartItem(id:string): Observable<any>{
    return this._HttpClient.delete(`https://ecommerce.routemisr.com/api/v1/cart/${id}`);
  }

  deleteCart(): Observable<any>{
    return this._HttpClient.delete('https://ecommerce.routemisr.com/api/v1/cart');
  }

  checkout(shippingAddress:any, cartId:string): Observable<any>{
    return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=http://localhost:4200`, {
      shippingAddress: shippingAddress
    });
  }


}
