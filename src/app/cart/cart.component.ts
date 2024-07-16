import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { ParseIntPipe } from '../parse-int.pipe';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { GetTwoWordsPipe } from '../get-two-words.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, NgFor, NgIf, ParseIntPipe,RouterLink, SkeletonModule, ConfirmDialogModule, ButtonModule,GetTwoWordsPipe],
  providers: [ConfirmationService],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  cartItems: any;
  cartId: string = '';
  isLoading: boolean = true;
  cartEmpty: boolean = false;
  
  constructor(private _CartService: CartService, private _ToastrService:ToastrService,private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this._CartService.getLoggedUserCart().subscribe({
      next: (res) => {
        console.log(res);
        this.cartItems = res.data;
        this.cartId = res.data._id;
        if (res.numOfCartItems === 0) {
          this.cartEmpty = true;
        }
        this._CartService.numOfCartItems.next(res.numOfCartItems);
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
        this.cartEmpty = true;
      }
    })
  }

  handleUpdateProductCount(id: string, count: number) {
    this.isLoading = true;
    this._CartService.updateProductCount(id, count).subscribe({
      next: (res) => {
        console.log(res);
        this.cartItems = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  handleDeleteCartItem(id: string) {
    this.isLoading = true;
    this._CartService.deleteCartItem(id).subscribe({
      next: (res) => {
        console.log(res);
        this.cartItems = res.data;
        if (res.numOfCartItems === 0) {
          this.cartEmpty = true;
        }
        this._CartService.numOfCartItems.next(res.numOfCartItems);
        this._ToastrService.success('Your item deleted successfully', 'delete', {
          positionClass: 'toast-top-center'
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  handleDeleteCart() {
    this._CartService.deleteCart().subscribe({
      next: (res) => {
        console.log(res);
        this.cartItems = '';
        this._CartService.numOfCartItems.next(0);
        this._ToastrService.success('Your cart cleared successfully', 'delete', {
          positionClass: 'toast-top-center'
        });
        this.isLoading = false;
        this.cartEmpty = true;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  confirmDeletItem(id:string) {
        this.confirmationService.confirm({
            header: 'Are you sure?',
            message: 'Please confirm to delete.',
            accept: () => {
              this.handleDeleteCartItem(id);
            }
        });
  }
  
  confirmClearCart() {
        this.confirmationService.confirm({
            header: 'Are you sure?',
            message: 'Please confirm to clear your cart.',
            accept: () => {
              this.handleDeleteCart();
            }
        });
    }

}
