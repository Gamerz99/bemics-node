import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading = false;
  alert = false;
  message = "Try again"
  data = {
    email: null,
    password: null
  };

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit() {
  }

  login(data) {
    this.alert = false;
    if (!data.email || !data.password) {
      this.message = "Please fill all fields"
      this.alert = true;
    } else {
      this.message = "Try again"
      this.loading = true;
      this.api.login(data).subscribe(
        res => {
          this.loading = false;
          localStorage.setItem('token', res.token);
          localStorage.setItem('session_data', JSON.stringify(res.userdata));
          this.router.navigate(['home']);
        },
        err => {
          if (err.error.message) {
            this.message = err.error.message
          }
          this.loading = false;
          this.alert = true;
          console.log(this.message);
        }
      );
    }
  }

  alert_close() {
    this.alert = false
    this.loading = false;
  }
}
