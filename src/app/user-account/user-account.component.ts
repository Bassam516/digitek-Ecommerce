import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ChangeInformationComponent } from '../change-information/change-information.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [NgIf,RouterLink,ChangeInformationComponent,ChangePasswordComponent,RouterOutlet, FormsModule,ButtonModule],
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.scss'
})
export class UserAccountComponent implements OnInit {

  userData: any;
  constructor(private _AuthService:AuthService) {
    
  }
  ngOnInit(): void {
    this._AuthService.userData.subscribe({
      next:(res)=>{
        this.userData = res;
      }
    })

  }
 
}
