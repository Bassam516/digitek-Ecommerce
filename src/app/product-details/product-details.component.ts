import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { Products } from '../products';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { ParseIntPipe } from '../parse-int.pipe';
import { GalleriaModule } from 'primeng/galleria';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import { CartService } from '../cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../wishlist.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [NgFor,NgIf, ParseIntPipe, CurrencyPipe, GalleriaModule, RadioButtonModule, FormsModule,SkeletonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit{

  // product:undefined|Products;
  product:any;
  paramId: null | string = '';
  images: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  isLoading: boolean = true;
  addLoading: boolean = false;
  addToCartLoading: any = [];
  addToWishlistLoading: boolean = false;
  wishlistProductsIds: string[] = [];

  responsiveOptions: any[] = [
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
];
  
  constructor(private _ProductsService: ProductsService, private _ActivatedRoute: ActivatedRoute, private _CartService:CartService, private _ToastrService:ToastrService, private _WishlistService:WishlistService) { 
       
  }
  
 
  ngOnInit(): void {
    this.isLoading = true;
    this._ActivatedRoute.paramMap.subscribe((params) => {
      this.paramId = params.get('id');
    })
    this._ProductsService.getSpecificProduct(this.paramId).subscribe({
      next: (res) => {
        this.product = res.data;
        let imgs = [];
        for (let image of res.data.images) {
          imgs.push({itemImageSrc:image,thumbnailImageSrc:image});
        }
        this.images.next(imgs);
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

   handleAddToCart(productId: any) {
    this.addLoading = true;
    this._CartService.addToCart(productId).subscribe({
      next: (res) => {
        console.log(res);
        this.addLoading = false;
        this._CartService.numOfCartItems.next(res.numOfCartItems);
        this._CartService.sidebarVisible.next(true);
        this._ToastrService.success(res.message,'Success', {
          positionClass: 'toast-top-center'
        });
      },
      error: (err) => {
        console.log(err);
        this.addLoading = false;
        this._ToastrService.error(err.error.message, err.error.statusMsg, {
          positionClass: 'toast-top-center'
        });
      }
    })
  }

  handleAddToWishlist(productId: any) {
    this.addToWishlistLoading = true;
    this._WishlistService.addToWishlist(productId).subscribe({
      next: (res) => {
        console.log(res);
        this.wishlistProductsIds = res.data;
        this._WishlistService.wishlistItemNums.next(res.data.length);
        this.addToWishlistLoading = false;
        this._ToastrService.success(res.message,'Success', {
          positionClass: 'toast-top-center'
        });
      },
      error: (err) => {
        console.log(err);
        this.addToWishlistLoading = false;
        this._ToastrService.error(err.error.message, err.error.statusMsg, {
          positionClass: 'toast-top-center'
        });
      }
    })
  }


}
