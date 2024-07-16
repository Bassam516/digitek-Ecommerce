import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { Products } from '../products';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { GetTwoWordsPipe } from '../get-two-words.pipe';
import { ParseIntPipe } from '../parse-int.pipe';
import { RouterLink } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { CartService } from '../cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../wishlist.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgFor,NgIf,CurrencyPipe,GetTwoWordsPipe,ParseIntPipe,RouterLink,TooltipModule,SkeletonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {

  allProducts: undefined | Products[] = [];
  isLoading: boolean = true;
  addLoading: any = [];
  addToWishlistLoading: any = [];
  wishlistProductsIds: string[] = [];

  constructor(private _ProductsService: ProductsService, private _CartService:CartService, private _ToastrService:ToastrService, private _WishlistService:WishlistService) { }
  
  ngOnInit(): void {
    this.isLoading = true;
    this._ProductsService.getAllProducts().subscribe({
      next: (res) => {
        this.allProducts = res.data;
        this.isLoading = false;
        console.log(res)
      },
      error: (err) => {
        console.log(err)
      }
    })

    this._WishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this._WishlistService.wishlistItemNums.next(res.count);
        for (let id of res.data) {
          this.wishlistProductsIds.push(id._id);
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

   handleAddToCart(productId: string, i:number) {
    this.addLoading[i] = true;
    this._CartService.addToCart(productId).subscribe({
      next: (res) => {
        console.log(res);
        this.addLoading[i] = false;
        this._CartService.numOfCartItems.next(res.numOfCartItems);
        this._CartService.sidebarVisible.next(true);
        this._ToastrService.success(res.message,'Success', {
          positionClass: 'toast-top-center'
        });
      },
      error: (err) => {
        console.log(err);
        this.addLoading[i] = false;
        this._ToastrService.error(err.error.message, err.error.statusMsg, {
          positionClass: 'toast-top-center'
        });
      }
    })
  }

  handleAddToWishlist(productId: string, i:number) {
    this.addToWishlistLoading[i] = true;
    this._WishlistService.addToWishlist(productId).subscribe({
      next: (res) => {
        console.log(res);
        this.wishlistProductsIds = res.data;
        this._WishlistService.wishlistItemNums.next(res.data.length);
        this.addToWishlistLoading[i] = false;
        this._ToastrService.success(res.message,'Success', {
          positionClass: 'toast-top-center'
        });
      },
      error: (err) => {
        console.log(err);
        this.addToWishlistLoading[i] = false;
        this._ToastrService.error(err.error.message, err.error.statusMsg, {
          positionClass: 'toast-top-center'
        });
      }
    })
  }
}
