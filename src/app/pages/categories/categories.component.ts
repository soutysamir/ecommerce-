import { Component, inject, OnInit } from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { Icategory } from '../../shared/interfaces/icategory';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  imports: [NgxPaginationModule,RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
private readonly categoriesService = inject(CategoriesService)
categoryData:Icategory[]=[];
p: number=0 ;
length:number=0;
ngOnInit(): void {
  this.showAllCategory();

}

showAllCategory():void{
  this.categoriesService.getAllCategories().subscribe({
    next:(res)=>{
      this.categoryData=res.data
      this.length=res.data.length
      console.log(res.data)
    }
  })
}
}
