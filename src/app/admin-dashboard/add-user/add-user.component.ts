import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {AddUserService} from '../services/add-user.service'
import { GlobalService } from '../../global.service';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css', '../admin-dashboard/admin-dashboard.component.css'],
  providers: [AddUserService]
})
export class AddUserComponent implements OnInit {

  userForm: FormGroup;
  public emailID;
  public password;
  public rollNo;
  public entity;

  public submitted:boolean=false;
  public error:boolean=false;
  constructor(private addUserService:AddUserService,private globalService:GlobalService) { }

  ngOnInit() {
    this.userForm = new FormGroup({
      'email': new FormControl("", [
        Validators.required
      ]),
      'pwd': new FormControl("", [
        Validators.required
      ]),
      'roll': new FormControl("", [
        Validators.required
      ])
      ,
      'entity': new FormControl("", [
        Validators.required
      ])
    });
  }

  get email() { return this.userForm.get('email'); }
  get pwd() { return this.userForm.get('pwd'); }
  get roll() { return this.userForm.get('roll'); }

  onSubmit()
  {
    let body={
      "email": this.emailID,
      "password": this.password,
      "rollNo": this.rollNo,
      "entity": this.entity
    }
    

    this.addUserService.addUser(body).subscribe(res=>
    {
      if(res.flag === true)
      {
        this.submitted=true;
        this.error=false;        
      }
    },error=>
  {
    this.error=true;
    this.submitted=false;
    console.log(error)
  })
  }
}
