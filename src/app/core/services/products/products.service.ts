import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private httpClient: HttpClient) {}

  getAllProducts(page: number, limit: number): Observable<any> {
    return this.httpClient.get(
      'https://ecommerce.routemisr.com/api/v1/products' +
        '?limit=12' +
        '&page=' +
        page
    );
  }

  getSpecificProducts(id: string): Observable<any> {
    return this.httpClient.get(
      `https://ecommerce.routemisr.com/api/v1/products/${id}`
    );
  }
  getProductByCategory(
    id: string,
    page: number,
    limit: number
  ): Observable<any> {
    return this.httpClient.get(
      `https://ecommerce.routemisr.com/api/v1/products?page=${page}&category[in]=${id}&limit=10`
    );
  }

  getProductBybrand(idProd: string, idBrand: string): Observable<any> {
    return this.httpClient.get(
      `https://ecommerce.routemisr.com/api/v1/products/${idProd}?brand=${idBrand}`
    );
  }
  productsByPriceRange(minValue: number, maxValue: number): Observable<any> {
    return this.httpClient.get(
      `https://ecommerce.routemisr.com/api/v1/products?price[gte]=${minValue}&price[lte]=${maxValue}`
    );
  }
}
