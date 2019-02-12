import { Component, OnInit } from '@angular/core';
import { ForgotPasswordService } from '../../services/forgot-password.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  providers: [ForgotPasswordService]
})
export class ForgotPasswordComponent implements OnInit {

  public email:string;
  public afterResend:boolean=false
  public message:String="";
  constructor(private forgotPassword:ForgotPasswordService) { }

  onSubmit()
  {
    var body = {"email":this.email}

    this.forgotPassword.resend(body).subscribe(
      res=>{
        
        if(res.flag)
        {
          this.message = "We will send a verification code to "+this.email;
        }
        else if(!res.flag)
        {
          this.message = res.errorMessage;
        }
        this.afterResend=true;
      },
      error=>
      {
        console.log(error)
      }
    );
    
  } 
  ngOnInit() {
  }

}
