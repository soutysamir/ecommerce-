import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  constructor(private httpClient: HttpClient) {}
  getAllBrands(page: number, limit: number): Observable<any> {
    return this.httpClient.get(
      `https://ecommerce.routemisr.com/api/v1/brands?limit=${limit}&page=${page}`
    );
  }
  getSpecificBrand(id: string): Observable<any> {
    return this.httpClient.get(
      `https://ecommerce.routemisr.com/api/v1/brands/${id}`
    );
  }
}
