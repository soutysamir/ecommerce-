import { Component, inject, OnInit,InputSignal,input,WritableSignal,signal  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart/cart.service';
import { Icart } from '../../shared/interfaces/icart';
import {  RouterLink } from '@angular/router';




@Component({
  selector: 'app-details',
  imports: [RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly productsService = inject(ProductsService)
  private readonly wishlistService = inject(WishlistService)
   private readonly toastrService = inject(ToastrService )
   private readonly cartService = inject(CartService )
  productId:any;
  productDetails:IProduct={}as IProduct;
  currentImage:string='';
  ProductImages:string[]=[];
  currentImageIndex: number = 0;
  limit!:number ;
  page!:number ;
  SimiProducts: IProduct[] = [];
  catId:string="";
  wishlistIDs: InputSignal<string[]> = input(['']);
  wishlistdata: WritableSignal<string[]> = signal(this.wishlistIDs());
  isloadingWishlist: WritableSignal<string> = signal('');
 cartDetails:Icart ={}as Icart
 quantity: number = 1;
unitPrice: number = 0;
totalPrice: number = 0;
  ngOnInit(): void {
    this.showDetails()
    this.cartService.getLoggedUserCart()

  }
    showDetails():void{
      this.activatedRoute.paramMap.subscribe({
        next:(res)=>{
          this.productId=res.get("id")
          console.log(this.productId)
          this.productsService.getSpecificProducts(this.productId).subscribe({
            next:(res)=>{
              this.productDetails=res.data
              this.currentImage=this.productDetails.imageCover
              this.ProductImages=this.productDetails.images
              this.currentImageIndex = this.ProductImages.indexOf(this.currentImage);
              this.catId=this.productDetails.category._id
              this.similarProducts();
              this.unitPrice = this.productDetails.price;
          this.calculateTotal();
              console.log(this.productDetails)
              console.log(this.productDetails.category._id)


            },error:(err)=>{
              console.log(err)
            }
          })
        },error:(err)=>{

        }
      })

    }
  changeImage(image:any):void{
this.currentImage=image

  }
  nextImage(): void {
    if (this.currentImageIndex < this.ProductImages.length - 1) {
      this.currentImageIndex++;
    } else {
      this.currentImageIndex = 0;
    }
    this.currentImage = this.ProductImages[this.currentImageIndex];
  }

  prevImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      this.currentImageIndex = this.ProductImages.length - 1;
    }
    this.currentImage = this.ProductImages[this.currentImageIndex];
  }
  similarProducts():void{
    this.productsService.getProductByCategory(this.catId,this.limit,this.page).subscribe({
      next:(res)=>{
        this.SimiProducts=res.data
        console.log(res)
console.log(this.catId)
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
    calculateTotal(): void {
      this.totalPrice = this.unitPrice * this.quantity;
    }

    increaseQuantity(): void {
      this.quantity++;
      this.calculateTotal();
    }

    decreaseQuantity(): void {
      if (this.quantity > 1) {
        this.quantity--;
        this.calculateTotal();
      }}


  }


