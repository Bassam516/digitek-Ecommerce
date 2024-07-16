import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(private _AuthService: AuthService, private _Router: Router, private _ToastrService: ToastrService) { 
    
  }
  
   loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
   })
  
  handleLogin(loginForm: FormGroup) {
    this.isLoading = true;
    this._AuthService.login(loginForm.value).subscribe({
      next: (res) => {
        console.log(res);
        if (res.message == 'success') {
          localStorage.setItem('usertoken', res.token);
          localStorage.setItem('userData', JSON.stringify(res.user));
          this._AuthService.isLogin.next(true);
          this._Router.navigate(['/home']);
          this.isLoading = false;
        }
        
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
