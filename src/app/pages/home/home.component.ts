import { IProduct } from './../../shared/interfaces/iproduct';
import {
  Component,
  inject,
  OnInit,
  InputSignal,
  input,
  WritableSignal,
  signal,
} from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { Icategory } from '../../shared/interfaces/icategory';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../shared/pipes/search/search.pipe';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CarouselModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastrService);

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    navSpeed: 500,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 6,
      },
    },
    nav: true,
  };
  customMainSlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    nav: true,
  };
  products: IProduct[] = [];
  category: Icategory[] = [];
  wishlistIDs: InputSignal<string[]> = input(['']);
  wishlistdata: WritableSignal<string[]> = signal(this.wishlistIDs());
  isloadingWishlist: WritableSignal<string> = signal('');

  ngOnInit(): void {
    this.getProductsData();
    this.getCategoriesData();
    this.getUserWishList();
  }
  getProductsData(): void {
    this.productsService.getAllProducts(1, 12).subscribe({
      next: (res) => {
        this.products = res.data;
        console.log(this.products);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getCategoriesData(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.category = res.data;
        console.log(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addToCart(id: string): void {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          this.toastrService.success(res.message, 'FreshCart');
          this.cartService.countCart.next(res.numOfCartItems);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addRemoveWishlist(id: string): void {
    this.isloadingWishlist.set(id);
    if (this.wishlistdata().includes(id)) {
      this.wishlistService.removeProductFromWishlist(id).subscribe({
        next: (res) => {
          this.toastrService.warning(res.message, 'FreshCart');
          // this.wishlistService.wishlistCount.set(res.data.length);
          this.wishlistService.wishlistCount.next(res.data.length);
          this.wishlistdata.set(res.data);
          this.isloadingWishlist.set('');
        },
        error: (err) => {
          this.toastrService.error(err.message, 'FreshCart');
          console.log(err);
          this.isloadingWishlist.set('');
        },
      });
    } else {
      this.wishlistService.addProductToWishlist(id).subscribe({
        next: (res) => {
          this.toastrService.success(res.message, 'FreshCart');
          // this.wishlistService.wishlistCount.set(res.data.length);
          this.wishlistService.wishlistCount.next(res.data.length);

          this.wishlistdata.set(res.data);
          this.isloadingWishlist.set('');
        },
        error: (err) => {
          this.toastrService.error(err.message, 'FreshCart');
          console.log(err);
          this.isloadingWishlist.set('');
        },
      });
    }
  }

  getUserWishList(): void {
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this.wishlistdata.set(res.data.map((element: any) => element.id));
        console.log(res.data.map((element: any) => element.id));

        console.log(res.count);
      },
    });
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
