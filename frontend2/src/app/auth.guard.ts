import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private api: ApiService, private router: Router) {

  }

  canActivate(): boolean {
    if (this.api.loggedin()) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
