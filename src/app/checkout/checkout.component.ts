import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../cart.service';
import { ActivatedRoute } from '@angular/router';
import { GetTwoWordsPipe } from '../get-two-words.pipe';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf,CurrencyPipe,NgFor,GetTwoWordsPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {

  isLoading: boolean = false;
  cartId!: any;
  cartItems: any;

  checkoutForm: FormGroup = new FormGroup({
    details: new FormControl(null, Validators.required),
    phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}/)]),
    city: new FormControl(null, Validators.required),
  });

  constructor(private _CartService:CartService, private _ActivatedRoute:ActivatedRoute) { 
    this._ActivatedRoute.paramMap.subscribe((params) => {
          this.cartId = params.get('id');
    })
    
    this._CartService.getLoggedUserCart().subscribe({
      next: (res) => {
        console.log(res);
        this.cartItems = res.data;
        this._CartService.numOfCartItems.next(res.numOfCartItems);
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    })
  }

  compeletPayment(url:string) {
    window.location.href = url;
  }

  handleCheckout(checkoutForm: FormGroup) {
    this.isLoading = true;
    this._CartService.checkout(checkoutForm.value, this.cartId).subscribe({
      next: (res) => {
        console.log(res);
        this.compeletPayment(res.session.url);
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    })
  }
  
}
