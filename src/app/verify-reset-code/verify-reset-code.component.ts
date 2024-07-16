import { Component } from '@angular/core';
import { FormControl, FormGroup,FormsModule,ReactiveFormsModule,Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { NgxOtpInputConfig, NgxOtpInputModule } from 'ngx-otp-input';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify-reset-code',
  standalone: true,
  imports: [NgIf,ReactiveFormsModule,FormsModule,NgxOtpInputModule],
  templateUrl: './verify-reset-code.component.html',
  styleUrl: './verify-reset-code.component.scss'
})
export class VerifyResetCodeComponent {

  isLoading: boolean = false;
  isLoadingResend: boolean = false;
  inputVal: any = new BehaviorSubject(null);
  userEmail: any ;

  constructor(private _AuthService: AuthService, private _Router: Router, private _ToastrService:ToastrService,private _ActivatedRoute:ActivatedRoute) { 
    _ActivatedRoute.paramMap.subscribe((param) => {
      this.userEmail = param.get('email');
    })
  }
  
  verifyResetCodeForm: FormGroup = new FormGroup({
  resetCode: new FormControl(null, [Validators.required,Validators.maxLength(6),Validators.minLength(6)]),
  })


handeOtpChange(value: string[]): void {
    if (value.includes('')) {
      this.inputVal.next(null);
    }
  }
  handleFillEvent(value: string): void {
    this.inputVal.next(value);
  }

  verifyResetCode() {
    let resetCode = {
      resetCode:this.inputVal.value,
    }
    this.isLoading = true;
    this._AuthService.verifyResetCode(resetCode).subscribe({
      next: (res) => {
        this.isLoading = false;
        this._Router.navigate(['/resetpassword']);
        console.log(res);
      },
      error: (err) => {
        this.isLoading = false;
        this._ToastrService.error(err.error.message,err.error.statusMsg, {
          positionClass:'toast-top-center'
        })
        console.log(err);
      }
    })
  }

  resendCode() {
    this.isLoadingResend = true;
    this._AuthService.forgetPassword({ email: this.userEmail }).subscribe({
      next: (res) => {
        this.isLoadingResend = false;
        this._ToastrService.success(res.message,res.statusMsg, {
          positionClass:'toast-top-center'
        })
      },
      error: (err) => {
        this.isLoadingResend = false;
        this._ToastrService.error(err.error.message,err.error.statusMsg, {
          positionClass:'toast-top-center'
        })
        console.log(err);
      }
    })
  }

otpInputConfig: NgxOtpInputConfig = {
    otpLength: 6,
    autofocus: true,
    classList: {
      container: 'justify-content-between shadow-none py-5 w-75 m-auto',
      inputBox: 'my-super-box-class',
      input: 'my-super-class',
      inputFilled: 'my-super-filled-class',
      inputDisabled: 'my-super-disable-class',
      inputSuccess: 'my-super-success-class',
      inputError: 'my-super-error-class',
    },
  };

  
}
