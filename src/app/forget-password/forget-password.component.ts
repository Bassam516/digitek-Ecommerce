import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [NgIf,ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {

  isLoading: boolean = false;
  userEmail: any  ; 
  constructor(private _AuthService: AuthService,private _Router:Router,private _ToastrService:ToastrService) { }
  
  forgetPasswordForm: FormGroup = new FormGroup({
  email: new FormControl(null, [Validators.required,Validators.email]),
  })

  forgetPassword(forgetPasswordForm: FormGroup) {
    this.isLoading = true;
    this._AuthService.forgetPassword(forgetPasswordForm.value).subscribe({
      next: (res) => {
        this.userEmail = forgetPasswordForm.value;
        this.isLoading = false;
        this._ToastrService.success(res.message,res.statusMsg, {
          positionClass:'toast-top-center'
        })
        this._Router.navigate([`/verifyresetcode/${this.userEmail.email}`]);
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
}
