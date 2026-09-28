import { Component, inject, OnInit, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { Icategory } from '../../shared/interfaces/icategory';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { ProductsService } from '../../core/services/products/products.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IProduct } from '../../shared/interfaces/iproduct';


@Component({
  selector: 'app-categorydetails',
  imports: [RouterLink],
  templateUrl: './categorydetails.component.html',
  styleUrl: './categorydetails.component.scss'
})
export class CategorydetailsComponent implements OnInit {
  private readonly categoriesService= inject(CategoriesService)
  private readonly activatedRoute = inject(ActivatedRoute)
private readonly productsService = inject(ProductsService)
   private readonly cartService = inject(CartService)
     private readonly wishlistService = inject(WishlistService)
  private readonly toastrService = inject(ToastrService )


catId:any;
catDetails:Icategory={}as Icategory;
wishlistIDs: InputSignal<string[]> = input(['']);
wishlistdata: WritableSignal<string[]> = signal(this.wishlistIDs());
isloadingWishlist: WritableSignal<string> = signal('');
limit:number=10;
result!:number;
selectedCategoryId: string | null = null;
isCategoryEmpty: boolean = false;
productData:IProduct[]=[];
p: number=0 ;


ngOnInit(): void {
  this.showCategoryDeatails();
  this.databyCategory();
  this.getUserWishList();
}
showCategoryDeatails():void{
  this.activatedRoute.paramMap.subscribe({
    next:(res)=>{
      this.catId=res.get('id')
      console.log(res)
    }
  })
  this.categoriesService.getSpecificCategory(this.catId).subscribe({
    next:(res)=>{
      this.catDetails=res.data
      console.log(this.catDetails)
    }
  })
}
addRemoveWishlist(id: string): void {
  this.isloadingWishlist.set(id);
  if (this.wishlistdata().includes(id)) {
    this.wishlistService.removeProductFromWishlist(id).subscribe({
      next: (res) => {
        this.toastrService.warning(res.message,'FreshCart')
        // this.wishlistService.wishlistCount.set(res.data.length);
        this.wishlistService.wishlistCount.next(res.data.length)
        this.wishlistdata.set(res.data);
        this.isloadingWishlist.set('');
      },
      error: (err) => {
        this.toastrService.error(err.message,'FreshCart')
        console.log(err);
        this.isloadingWishlist.set('');
      },
    });
  } else {
    this.wishlistService.addProductToWishlist(id).subscribe({
      next: (res) => {
        this.toastrService.success(res.message,'FreshCart');
        // this.wishlistService.wishlistCount.set(res.data.length);
        this.wishlistService.wishlistCount.next(res.data.length)

        this.wishlistdata.set(res.data);
        this.isloadingWishlist.set('');
      },
      error: (err) => {
        this.toastrService.error(err.message,'FreshCart');
        console.log(err);
        this.isloadingWishlist.set('');
      },
    });
  }
}
getUserWishList():void{
  this.wishlistService.getLoggedUserWishlist().subscribe({
    next:(res)=>{
      this.wishlistdata.set(res.data.map((element: any) => element.id));
         console.log(res.data.map((element: any) => element.id))

      console.log(res.count)
    }
  })
  }
  addToCart(id:string):void{
    this.cartService.addProductToCart(id).subscribe({
     next:(res)=>{
       console.log(res)
      if (res.status ==='success') {
       this.toastrService.success(res.message,'FreshCart')
       this.cartService.countCart.next(res.
         numOfCartItems)
      }
     },error:(err)=>{
       console.log(err)
     }
    })
   }
databyCategory():void{
  this.productsService.getProductByCategory(this.catId,this.p,this.limit).subscribe({
    next:(res)=>{
      this.productData=res.data
      this.result=res.results
      this.p=res.metadata.currentPage
      console.log(this.productData)

    }
  })
}
getSalePercentage(price: number, priceAfterDiscount: number): number {
  return Math.round(((price - priceAfterDiscount) / price) * 100);
}
getStarsArray(rating: number): ('full' | 'half' | 'empty')[] {
  const stars: ('full' | 'half' | 'empty')[] = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push('full');
    } else if (i === fullStars && hasHalf) {
      stars.push('half');
    } else {
      stars.push('empty');
    }
  }

  return stars;
}
}
