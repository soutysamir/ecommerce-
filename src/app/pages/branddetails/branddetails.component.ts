import { Component, inject, input, InputSignal, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BrandsService } from '../../core/services/brands/brands.service';
import { IBrand } from '../../shared/interfaces/ibrand';
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { WishlistComponent } from '../wishlist/wishlist.component';
import { CartComponent } from '../cart/cart.component';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart/cart.service';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';


@Component({
  selector: 'app-branddetails',
  imports: [RouterLink],
  templateUrl: './branddetails.component.html',
  styleUrl: './branddetails.component.scss'
})
export class BranddetailsComponent implements OnInit {



private readonly activatedRoute = inject(ActivatedRoute)
private readonly brandsService = inject(BrandsService)
private readonly productsService = inject(ProductsService)
 private readonly cartService = inject(CartService)
  private readonly categoriesService = inject(CategoriesService)
  private readonly wishlistService = inject(WishlistService)
  private readonly toastrService = inject(ToastrService )

 brandId:any;
 idProd:string='';
brandDetails:IBrand={}as IBrand;
productdetails:IProduct[]=[];
wishlistIDs: InputSignal<string[]> = input(['']);
wishlistdata: WritableSignal<string[]> = signal(this.wishlistIDs());
isloadingWishlist: WritableSignal<string> = signal('');
ngOnInit(): void {
this.showBrandDetails()
this.showProductsByBrand()
this.getUserWishList();
}


showBrandDetails():void{
this.activatedRoute.paramMap.subscribe({
  next:(res)=>{
    this.brandId=res.get('id')
    console.log(this.brandId)
    this.brandsService.getSpecificBrand(this.brandId).subscribe({
      next:(res)=>{
        this.brandDetails=res.data
        console.log(this.brandDetails)
      }
    })
  }

})

}
showProductsByBrand():void{
  this.productsService.getProductBybrand(this.idProd,this.brandId).subscribe({
    next:(res)=>{
this.productdetails=res.data
      console.log(res.data)
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
getFullStars(rating: number): number[] {
  return Array(Math.floor(rating)).fill(0);
}
hasHalfStar(rating: number): boolean {
  return rating % 1 >= 0.5;
}
getEmptyStars(rating: number): number[] {
  return Array(5 - Math.ceil(rating)).fill(0);
}


}
