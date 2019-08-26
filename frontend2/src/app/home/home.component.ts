import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  login = true;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.login = this.api.loggedin()
    console.log(this.login)
  }

}
