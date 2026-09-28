import { AuthService } from './../../core/services/auth/auth.service';
import { Component, inject, input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { DarkmodeService } from '../../core/services/darkmode/darkmode.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  themeService = inject(DarkmodeService);
  isDark = this.themeService.isDark;
  isLogin = input<boolean>(true);
  clicked: boolean = false;
  cartNumber!: number;
  wishlistnumber!: number;

  clickedBtn(): void {
    this.clicked = !this.clicked;
  }
  ngOnInit(): void {
    this.cartService.countCart.subscribe({
      next: (value) => {
        console.log(value);
        this.cartNumber = value;
      },
    });
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartService.countCart.next(res.numOfCartItems);
      },
    });
    this.wishlistService.wishlistCount.subscribe({
      next: (value) => {
        console.log(value);
        this.wishlistnumber = value;
      },
    });
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        console.log(res.count);
        this.wishlistService.wishlistCount.next(res.count);
      },
    });
  }
  logout(): void {
    this.authService.logoutUser();
  }
}
