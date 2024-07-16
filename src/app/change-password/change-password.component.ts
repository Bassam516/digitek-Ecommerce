import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, ConfirmDialogModule, ButtonModule,NgIf],
  providers: [ConfirmationService],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {

  isLoading: boolean = false;
  showPassword: boolean = false;
  showrePassword: boolean = false;
  showcPassword: boolean = false;

  updateUserPassword: FormGroup = new FormGroup({
    currentPassword: new FormControl(null, Validators.required),
    password: new FormControl(null, [Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/)]),
    rePassword: new FormControl(null, Validators.required),
  },{validators:this.rePasswordMatch});

  constructor(private _AuthService: AuthService, private _ToastrService: ToastrService, private confirmationService: ConfirmationService) { }

  rePasswordMatch(updateUserPassword:any) {
    let passwordInput = updateUserPassword.get('password');
    let repasswordInput = updateUserPassword.get('rePassword');

    if (passwordInput?.value === repasswordInput?.value) {
      return null;
    } else {
      repasswordInput?.setErrors({ repasswordMatch: 'password and confirm password doesnt matched' });
      return {repasswordMatch:'password and confirm password doesnt matched'}
    }
  }
  
  handleUpdateUserPassword(updateUserPassword:FormGroup) {
    this._AuthService.updateUsrePassword(updateUserPassword.value).subscribe({
      next: (res) => {
        console.log(res);
        if (res.message == 'success') {
          this._ToastrService.success('Your password has been updated successfully.', 'Success', {
            positionClass: 'toast-top-center',
          });
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this._ToastrService.info(err.error.errors.msg, err.error.statusMsg, {
            positionClass:'toast-top-center'
          });
        this.isLoading = false;
      }
    })
  }

  confirmUpdatePassword(updateUserPassword:FormGroup) {
        this.confirmationService.confirm({
            header: 'Are you sure?',
            message: 'Please confirm to update.',
            accept: () => {
              this.handleUpdateUserPassword(updateUserPassword);
            }
        });
  }
}
