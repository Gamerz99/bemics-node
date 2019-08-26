import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit() {
    this.api.logout();
    setTimeout(() => {
      this.router.navigate(['home']);
    }, 2000);
  }
}
