import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../../core/services/odrers/orders.service';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  [x: string]: any;
  private readonly formBuilder = inject(FormBuilder);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly ordersService = inject(OrdersService);
  private readonly router = inject(Router);

  checkOutForm!: FormGroup;
  cartID: string = '';
  isLoading: boolean = false;

  ngOnInit(): void {
    this.initForm();
    this.getCrtId();
  }

  initForm(): void {
    this.checkOutForm = this.formBuilder.group({
      details: [null, [Validators.required]],
      phone: [
        null,
        [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
      ],
      city: [null, [Validators.required]],
    });
  }
  getCrtId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (res) => {
        this.cartID = res.get('id')!;
      },
    });
  }
  onlinePayment(): void {
    console.log(this.checkOutForm.value);
    this.ordersService
      .checkoutPayment(this.cartID, this.checkOutForm.value)
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res.status === 'success') {
            open(res.session.url, '_self');
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  cashPayment(): void {
    this.ordersService
      .createCashOrder(this.cartID, this.checkOutForm.value)
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res.status === 'success') {
            this.router.navigate(['/allorders']);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
