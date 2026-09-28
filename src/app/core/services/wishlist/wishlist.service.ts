import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  // myToken:any=localStorage.getItem('userToken');
  constructor(private httpClient: HttpClient) { }
  wishlistCount:BehaviorSubject<number>= new BehaviorSubject(0)

  addProductToWishlist(id:string):Observable<any>{
return this.httpClient.post('https://ecommerce.routemisr.com/api/v1/wishlist',{
  "productId": id
})
  }

  getLoggedUserWishlist():Observable<any>{
    return this.httpClient.get('https://ecommerce.routemisr.com/api/v1/wishlist')
  }
removeProductFromWishlist(id:string):Observable<any>{
  return this.httpClient.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${id}`)
}
}
