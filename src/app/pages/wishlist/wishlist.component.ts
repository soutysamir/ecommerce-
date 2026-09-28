import { Component, inject, OnInit } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IWishlist } from '../../shared/interfaces/iwishlist';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly cartServic = inject(CartService);
  private readonly toastrService = inject(ToastrService);

  wishlistDetails: IWishlist[] = [];

  ngOnInit(): void {
    this.getWishlistData();
  }
  getWishlistData(): void {
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this.wishlistDetails = res.data;
        console.log(this.wishlistDetails);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  removeProductFromWishlist(id: string): void {
    this.wishlistService.removeProductFromWishlist(id).subscribe({
      next: (res) => {
        console.log(res);
        this.toastrService.warning(res.message, 'FreshCart');
        this.getWishlistData();
        this.wishlistService.wishlistCount.next(res.data.length);
      },
    });
  }
  addProductToCart(id: string): void {
    this.cartServic.addProductToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          this.toastrService.success(res.message, 'FreshCart');
        }
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
