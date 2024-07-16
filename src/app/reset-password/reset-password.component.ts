import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(private _AuthService:AuthService, private _Router:Router, private _ToastrService:ToastrService){}
   resetPasswordForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required,Validators.email]),
    newPassword: new FormControl(null, [Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/)]),
   })
  
  handleResetPassword(resetPasswordForm: FormGroup) {
    this.isLoading = true;
    this._AuthService.resetPassword(resetPasswordForm.value).subscribe({
      next: (res) => {
        console.log(res);
        this._ToastrService.success('Your password has been updated successfully.', res.message, {
          positionClass: 'toast-top-center'
        });
        this._Router.navigate(['/login']);
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this._ToastrService.error(err.error.message, err.error.statusMsg, {
          positionClass: 'toast-top-center'
        });
        this.isLoading = false;
      }
    })
  }
}
