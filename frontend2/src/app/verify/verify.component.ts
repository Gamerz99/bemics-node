import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
  loading = false;
  alert = false;
  message = "Try again"
  data = {
    secrettoken: null,
  };

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit() {
  }

  verify(data) {
    this.alert = false;
    if (!data.secrettoken) {
      this.message = "Please fill all fields"
      this.alert = true;
    } else {
      this.message = "Try again"
      this.loading = true;
      this.api.verify(data).subscribe(
        res => {
          this.loading = false;
          this.router.navigate(['login']);
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
