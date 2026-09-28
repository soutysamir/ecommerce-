import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private httpClient:HttpClient) { }
  // myToken:any=localStorage.getItem('userToken');
  countCart :BehaviorSubject<number>= new BehaviorSubject(0);

  addProductToCart(id:string):Observable<any>{
    return this.httpClient.post('https://ecommerce.routemisr.com/api/v1/cart',
      {
        "productId": id
    }

    )
  }

  getLoggedUserCart():Observable<any>{
    return this.httpClient.get('https://ecommerce.routemisr.com/api/v1/cart')
  }

  removeSpecificCartItem(id:string):Observable<any>{
    return this.httpClient.delete(`https://ecommerce.routemisr.com/api/v1/cart/${id}`)
  }
  updateCartProductQuantity(id:string ,newcount:number):Observable<any>{
    return this.httpClient.put(`https://ecommerce.routemisr.com/api/v1/cart/${id}`,
      {
        "count": newcount
    }
    )
  }
  clearUserCart():Observable<any>{
    return this.httpClient.delete('https://ecommerce.routemisr.com/api/v1/cart')
  }
}
