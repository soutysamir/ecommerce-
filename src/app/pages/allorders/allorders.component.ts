import { Component, inject, OnInit } from '@angular/core';
import { OrdersService } from '../../core/services/odrers/orders.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { Iuserorder } from '../../shared/interfaces/iuserorder';

@Component({
  selector: 'app-allorders',
  imports: [],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss',
})
export class AllordersComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly authService = inject(AuthService);

  userId: string = '';
  userOrder: Iuserorder[] = [];
  orderId: number = 0;

  ngOnInit(): void {
    // this.UserOrdersData('id');
    this.UserIdData();
    this.UserOrdersData();
  }
  UserOrdersData(): void {
    this.ordersService.getUserOrderds(this.userId).subscribe({
      next: (res) => {
        this.userOrder = res;

        console.log(res.data);
        console.log(this.userOrder);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  UserIdData(): void {
    this.authService.saveUserData();
    this.userId = this.authService.userData.id;
    console.log(this.userId);
  }
}
