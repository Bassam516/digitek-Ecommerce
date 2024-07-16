import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-change-information',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, ConfirmDialogModule, ButtonModule],
  providers: [ConfirmationService],
  templateUrl: './change-information.component.html',
  styleUrl: './change-information.component.scss'
})
export class ChangeInformationComponent implements OnInit {

  isLoading: boolean = false;
  userData: any;

  updateUserData: FormGroup = new FormGroup({
    name: new FormControl(null),
    email: new FormControl(null, Validators.email),
    phone: new FormControl(null, Validators.pattern(/^01[0125][0-9]{8}/)),
  })

  constructor(private _AuthService:AuthService, private _ToastrService:ToastrService,private confirmationService: ConfirmationService) { }
  
  ngOnInit(): void {
    this._AuthService.userData.subscribe({
      next:(res)=>{
        this.userData = res;
      }
    })
  }

  handleUpdateUserData(updateUserData: FormGroup) {
    const userDataMap = new Map(Object.entries(updateUserData.value));
    for (let [key,value] of userDataMap){
      if (value == null || value == '') {
        userDataMap.delete(key);
      }
    }
    let userDataObj = Object.fromEntries(userDataMap);
    this.isLoading = true;
    this._AuthService.updateUsreData(userDataObj).subscribe({
      next: (res) => {
        console.log(res);
        localStorage.setItem('userData', JSON.stringify(res.user));
        this._AuthService.userData.next(res.user);
        this.ngOnInit();
        if (res.message == 'success') {
          this._ToastrService.success('Your Data has been Updated successfully.', 'Success', {
            positionClass: 'toast-top-center',
          });
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this._ToastrService.info(err.error.errors.msg, err.error.message, {
            positionClass:'toast-top-center'
          });
        this.isLoading = false;
      }
    })
  }

  confirmUpdateInformation(updateUserData:FormGroup) {
        this.confirmationService.confirm({
            header: 'Are you sure?',
            message: 'Please confirm to update.',
            accept: () => {
              this.handleUpdateUserData(updateUserData);
            }
        });
  }
}
