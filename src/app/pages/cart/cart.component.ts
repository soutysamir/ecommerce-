import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { Icart } from '../../shared/interfaces/icart';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  cartDetails: Icart = {} as Icart;
  length: number = 0;
  totalPrice: number = 0;

  ngOnInit(): void {
    this.getCartData();
  }

  getCartData(): void {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartDetails = res.data;
        this.length = res.data.products.length;
        this.totalPrice = res.data.totalCartPrice;
        console.log(res.data.products.length);

        console.log(this.cartDetails);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  removeProduct(id: string): void {
    this.cartService.removeSpecificCartItem(id).subscribe({
      next: (res) => {
        console.log(res);
        this.cartDetails = res.data;
        this.toastrService.warning(
          'Product removed dtom cart Successfully',
          'FreshCart'
        );
        this.cartService.countCart.next(res.numOfCartItems);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  updateQuantity(id: string, count: number): void {
    this.cartService.updateCartProductQuantity(id, count).subscribe({
      next: (res) => {
        this.cartDetails = res.data;
        this.toastrService.success('Quantity Of product Updated', ' FreshCart');
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  clearCart(): void {
    this.cartService.clearUserCart().subscribe({
      next: (res) => {
        console.log(res);
        if (res.message === 'success') {
          this.cartDetails = {} as Icart;
          this.toastrService.warning('All Products Cleared', 'FreshCart');
        }
        this.cartService.countCart.next(0);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
