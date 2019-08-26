import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  loading = false;
  alert = false;
  message = "Try again"
  data = {
    name: null,
    email: null,
    password: null
  };

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit() {
  }

  save(data) {
    this.alert = false;
    if (!data.name || !data.email || !data.password) {
      this.message = "Please fill all fields"
      this.alert = true;
    } else {
      this.message = "Try again"
      this.loading = true;
      this.api.register(data).subscribe(
        res => {
          this.loading = false;
          this.router.navigate(['verify']);
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
