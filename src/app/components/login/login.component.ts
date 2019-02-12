import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  

  public email: String;
  public password: String;
  public remember: boolean = false;

  public loginSuccess: boolean = true;

  constructor(private loginService: LoginService, private router: Router,private globalService:GlobalService) { }

  onSubmit() {

    var body = {
      "email": this.email,
      "password": this.password,
      "remember": this.remember
    }

    this.loginService.login(body).subscribe(
      res => {

        if (res.flag) {

          this.loginSuccess = true;

          if (res.entity === 0) {
            this.router.navigate(["/admin-dashboard"])
          }
          else if (res.entity === 1) 
          {
            this.router.navigate(["/student-dashboard"])
          } 
          else if (res.entity === 2) 
          {
            this.router.navigate(["/management-dashboard"])
          } 
          else if (res.entity === 3) 
          {
            this.router.navigate(["/faculty-dashboard"])
          }
        }

      },
      error => {
        // this.email = "";
        // this.password = "";
        this.loginSuccess = false;
        console.log(error)
      });
  }
  ngOnInit() {
  }

}
