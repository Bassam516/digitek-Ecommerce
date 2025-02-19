import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  wishlistItemNums = new BehaviorSubject(0);

  constructor(private _HttpClient: HttpClient) { }
  
  addToWishlist(id:string): Observable<any>{
    return this._HttpClient.post('https://ecommerce.routemisr.com/api/v1/wishlist', {
      productId: id
    });
  }

  getLoggedUserWishlist(): Observable<any>{
    return this._HttpClient.get('https://ecommerce.routemisr.com/api/v1/wishlist');
  }

  deleteWishlistItem(id:string): Observable<any>{
    return this._HttpClient.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${id}`);
  }
}
