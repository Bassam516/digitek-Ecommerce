import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../wishlist.service';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { ParseIntPipe } from '../parse-int.pipe';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { ProductsService } from '../products.service';
import { CartService } from '../cart.service';
import { GetTwoWordsPipe } from '../get-two-words.pipe';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, ParseIntPipe, ConfirmDialogModule, ButtonModule,GetTwoWordsPipe],
  providers: [ConfirmationService],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit {

  wishlistItems: any;
  returnWishlistItems: any[] = [];
  addToCartLoading: any[] = [];
  wishlistEmpty: boolean = false;
  isLoading: boolean = false;

  constructor(private _WishlistService: WishlistService, private _ToastrService:ToastrService,private confirmationService: ConfirmationService, private _ProductsService:ProductsService, private _CartService:CartService) { }
  
  ngOnInit(): void {
    this.isLoading = true;
    this._WishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        console.log(res);
        this.isLoading = false;
        this.wishlistItems = res.data;
        this._WishlistService.wishlistItemNums.next(res.count);
        if (res.count == 0) {
          this.wishlistEmpty = true;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  handleDeleteWishlistItem(id: string) {
    this.isLoading = true;
    this._WishlistService.deleteWishlistItem(id).subscribe({
      next: (res) => {
        console.log(res);
        this.wishlistItems = res.data;
        this.returnWishlistItems = [];
        for (let id of this.wishlistItems) {
          this._ProductsService.getSpecificProduct(id).subscribe({
            next: (res) => {
              this.returnWishlistItems.push(res.data);
            }
          })
        }
        this.wishlistItems = this.returnWishlistItems;
        
        if (res.data.length === 0) {
          this.wishlistEmpty = true;
        }
        this._WishlistService.wishlistItemNums.next(res.data.length);
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

  handleAddToCart(productId: string, i:number) {
    this.addToCartLoading[i] = true;
    this._CartService.addToCart(productId).subscribe({
      next: (res) => {
        console.log(res);
        this.addToCartLoading[i] = false;
        this._CartService.numOfCartItems.next(res.numOfCartItems);
        this._CartService.sidebarVisible.next(true);
        this.handleDeleteWishlistItem(productId);
        this._ToastrService.success(res.message,'Success', {
          positionClass: 'toast-top-center'
        });
      },
      error: (err) => {
        console.log(err);
        this.addToCartLoading[i] = false;
        this._ToastrService.error(err.error.message, err.error.statusMsg, {
          positionClass: 'toast-top-center'
        });
      }
    })
  }

  confirmDeletItem(id:string) {
        this.confirmationService.confirm({
            header: 'Are you sure?',
            message: 'Please confirm to delete.',
            accept: () => {
              this.handleDeleteWishlistItem(id);
            }
        });
  }
}
