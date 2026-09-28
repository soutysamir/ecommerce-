import { ProductsService } from './../../core/services/products/products.service';
import {
  Component,
  inject,
  OnInit,
  InputSignal,
  input,
  WritableSignal,
  signal,
} from '@angular/core';
import { IProduct } from '../../shared/interfaces/iproduct';
import { NgxPaginationModule } from 'ngx-pagination';
import { CartService } from '../../core/services/cart/cart.service';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { Icategory } from '../../shared/interfaces/icategory';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // استيراد FormsModule للموديلات
import {
  NgxSliderModule,
  Options,
  LabelType,
} from '@angular-slider/ngx-slider';
import { SearchPipe } from '../../shared/pipes/search/search.pipe';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-products',
  imports: [NgxPaginationModule, RouterLink, FormsModule, NgxSliderModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastrService);

  minValue: number = 100;
  maxValue: number = 45000;
  options: Options = {
    floor: 0,
    ceil: 50000,
    step: 100,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return (
            '<b class="text-black font-bold text-md">From:</b> EGP' + value
          );
        case LabelType.High:
          return '<b class="text-black font-bold text-md">TO:</b> EGP' + value;
        default:
          return 'EGP' + value;
      }
    },
  };

  productData: IProduct[] = [];
  p: number = 0;
  clicked: boolean = false;
  clickedDropdown: boolean = false;
  category: Icategory[] = [];
  limit: number = 10;
  result!: number;
  selectedCategoryId: string | null = null;
  isCategoryEmpty: boolean = false;
  selectedCategoryName!: string;
  wishlistIDs: InputSignal<string[]> = input(['']);
  wishlistdata: WritableSignal<string[]> = signal(this.wishlistIDs());
  isloadingWishlist: WritableSignal<string> = signal('');

  ngOnInit(): void {
    this.getData();
    this.getUserWishList();
  }

  getData(): void {
    this.selectedCategoryId = null;
    this.productsService.getAllProducts(this.p, this.limit).subscribe({
      next: (res) => {
        this.productData = res.data;
        this.result = res.results;
        this.isCategoryEmpty = false;
        console.log(this.p);
        console.log(res);
        console.log(this.productData);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  pageChangeEvent(event: number) {
    this.p = event;
    if (this.selectedCategoryId) {
      this.databyCategory(this.selectedCategoryId, this.limit, this.p);
    } else {
      this.getData();
    }
  }
  showCategoriesData(): void {
    this.clickedDropdown = !this.clickedDropdown;
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.category = res.data;
        if (this.category.length > 0) {
          this.selectedCategoryName = this.category[0].name;
        }
        console.log(this.selectedCategoryName);
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
  clickedBtn(): void {
    this.clicked = !this.clicked;
  }
  databyCategory(id: string, limit: number, p: number): void {
    this.selectedCategoryId = id;
    this.p = 1;
    const selectedCategory = this.category.find((cat) => cat._id === id);
    this.selectedCategoryName = selectedCategory
      ? selectedCategory.name
      : 'All Products';
    this.productsService.getProductByCategory(id, p, limit).subscribe({
      next: (res) => {
        this.productData = res.data;
        this.result = res.results;
        this.p = res.metadata.currentPage;
        this.isCategoryEmpty = this.productData.length === 0;
        console.log(res);
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
  applyPriceFilter() {
    this.productsService
      .productsByPriceRange(this.minValue, this.maxValue)
      .subscribe({
        next: (res) => {
          this.productData = res.data;
          console.log(this.productData);
          console.log('hello');
        },
        error: (err) => {
          console.error('Error loading products:', err);
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
