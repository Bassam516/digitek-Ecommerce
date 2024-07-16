import { AfterContentChecked, AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { GetTwoWordsPipe } from '../get-two-words.pipe';
import { ParseIntPipe } from '../parse-int.pipe';
import { RouterLink } from '@angular/router';
import { Products } from '../products';
import { TooltipModule } from 'primeng/tooltip';
import { CartService } from '../cart.service';
import { ToastrService } from 'ngx-toastr';
import { SkeletonModule } from 'primeng/skeleton';
import { WishlistService } from '../wishlist.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor,NgIf,CurrencyPipe,GetTwoWordsPipe,ParseIntPipe,RouterLink,TooltipModule,SkeletonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  allProducts: undefined | Products[] = [];
  isLoading: boolean = true;
  addToCartLoading: any = [];
  addToWishlistLoading: any = [];
  wishlistProductsIds: string[] = [];
  showOverlay: boolean = false;

  constructor(private _ProductsService: ProductsService, private _CartService: CartService, private _ToastrService: ToastrService, private _WishlistService: WishlistService) { 
    
  }
  
  ngOnInit(): void {
    this.isLoading = true;
    this._ProductsService.getLimitedProducts(8).subscribe({
      next: (res) => {
        this.allProducts = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
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

  // ngAfterViewInit(): void {
  //   setTimeout(() => {
  //     this.showOverlay = true;
  //   }, 6000);
  // }


  handleAddToCart(productId: string, i:number) {
    this.addToCartLoading[i] = true;
    this._CartService.addToCart(productId).subscribe({
      next: (res) => {
        console.log(res);
        this.addToCartLoading[i] = false;
        this._CartService.numOfCartItems.next(res.numOfCartItems);
        this._CartService.sidebarVisible.next(true);
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
