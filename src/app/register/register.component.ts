import { Component } from '@angular/core';
import { FormControl, FormGroup,Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NgFor, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  isLoading: boolean = false;
  showPassword: boolean = false;
  showrePassword: boolean = false;
  constructor(private _AuthService: AuthService, private _ToastrService:ToastrService) { }
  
  registerForm: FormGroup = new FormGroup({
    name: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/)]),
    rePassword: new FormControl(null, Validators.required),
    phone: new FormControl(null, [Validators.required,Validators.pattern(/^01[0125][0-9]{8}/)]),
  },{validators:this.rePasswordMatch})

  rePasswordMatch(registerForm:any) {
    let passwordInput = registerForm.get('password');
    let repasswordInput = registerForm.get('rePassword');

    if (passwordInput?.value === repasswordInput?.value) {
      return null;
    } else {
      repasswordInput?.setErrors({ repasswordMatch: 'password and confirm password doesnt matched' });
      return {repasswordMatch:'password and confirm password doesnt matched'}
    }
  }

  handleRegister(registerForm: FormGroup) {
    this.isLoading = true;
    this._AuthService.register(registerForm.value).subscribe({
      next: (res) => {
        console.log(res);
        if (res.message == 'success') {
          this._ToastrService.success('Your account has been added successfully.', 'Success', {
            positionClass: 'toast-top-center',
          });
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this._ToastrService.info(err.error.message,err.error.statusMsg, {
            positionClass:'toast-top-center'
          });
        this.isLoading = false;
      }
    })
  }
}
