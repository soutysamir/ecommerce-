import { Component, inject, OnInit } from '@angular/core';
import { BrandsService } from '../../core/services/brands/brands.service';
import { IBrand } from '../../shared/interfaces/ibrand';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brands',
  imports: [NgxPaginationModule, RouterLink],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
})
export class BrandsComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);
  brandData: IBrand[] = [];
  p: number = 0;
  limit: number = 20;
  result!: number;
  length: number = 0;

  ngOnInit(): void {}
  pageChangeEvent(event: number) {
    this.p = event;
    this.getAllBrandsData();
  }

  getAllBrandsData(): void {
    this.brandsService.getAllBrands(this.p, this.limit).subscribe({
      next: (res) => {
        this.brandData = res.data;
        this.result = res.results;
        this.length = res.data.length;
        console.log(this.brandData);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  // pageChangeEvent(event: number){
  //   this.p = event;
  //   if (this.selectedCategoryId) {
  //     this.databyCategory(this.selectedCategoryId, this.limit, this.p);
  //   } else {
  //     this.getData();
  //   }
  // }
}
