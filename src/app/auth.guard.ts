import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (typeof window !== 'undefined') {
    var userToken = localStorage.getItem('usertoken');
  } else {
    userToken = 'null';
  }

  if ( userToken != null) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  

};
