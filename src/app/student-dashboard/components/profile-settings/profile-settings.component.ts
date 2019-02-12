import { Component, OnInit } from '@angular/core';
import { ProfileSettingService } from '../../services/profile-setting.service'
import { GlobalService } from '../../../global.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css', '../student-dashboard/student-dashboard.component.css'],
  providers: [ProfileSettingService]
})
export class ProfileSettingsComponent implements OnInit {

  studentDetails;
  newPassword = ""
  newEmail = ""
  OTP = ""
  currentPassword = ""
  confirmPassword = ""
  expire;
  emailUpdateSuccess = false;
  emailUpdateFail = false;
  unsuccessfulText = ""
  checkStatus = true
  updated = false
  constructor(private profileSettingService: ProfileSettingService, private globalService: GlobalService) {
    this.getDetails()
  }

  getDetails() {
    this.globalService.loader(true)
    this.profileSettingService.getProfileDetails().subscribe(res => {
      res.document.DOB = res.document.DOB.split("T")[0]
      this.studentDetails = res.document
      this.globalService.loader(false)
    }, error => {
      console.log(error)
      this.globalService.loader(false)
    })
  }
  update() {
    this.checkStatus = this.check()
    this.updated = false
    if (this.checkStatus) {
      let body = {
        firstName: this.studentDetails.firstName,
        lastName: this.studentDetails.lastName,
        address: this.studentDetails.address,
        mobileNumber: this.studentDetails.mobileNumber,
        DOB: new Date(this.studentDetails.DOB).toISOString()
      }
      if (this.currentPassword) {
        body['newPassword'] = this.newPassword
        body['oldPassword'] = this.currentPassword
      }
      this.globalService.loader(true)
      this.profileSettingService.updateProfileDetails(body).subscribe(res => {
        this.updated = true
        this.globalService.loader(false)
      }, error => {
        console.log(error)
        this.globalService.loader(false)
      })
    }
  }

  check() {
    if (!this.currentPassword && (this.newPassword || this.confirmPassword)) {
      this.unsuccessfulText = "Please enter your current password."
      return false
    }
    else if (this.currentPassword && !this.newPassword) {
      this.unsuccessfulText = "Please enter your new password."
      return false
    }
    else if (this.currentPassword && !this.confirmPassword) {
      this.unsuccessfulText = "New password does not match with confirm password."
      return false
    }
    else if ((this.currentPassword && this.newPassword && this.confirmPassword) && (this.newPassword !== this.confirmPassword)) {
      this.unsuccessfulText = "New password does not match with confirm password."
      return false
    }
    else if (this.studentDetails.firstName && this.studentDetails.lastName && this.studentDetails.address && this.studentDetails.mobileNumber && this.studentDetails.DOB) {
      return true
    }
    else {
      this.unsuccessfulText = "Please enter the required fields."
      return false
    }
  }

  sendOtp() {
    this.emailUpdateFail = false;
    this.emailUpdateSuccess = false
    this.expire = undefined
    this.profileSettingService.sendNotificationEmail(this.newEmail).subscribe(res => {
      this.expire = res.expire
    }, error => {
      console.log(error)
    })
  }

  checkOtp() {
    this.profileSettingService.updateEmail(this.OTP).subscribe(res => {
      this.emailUpdateSuccess = true
      this.studentDetails.email = this.newEmail
      this.newEmail = ""
    }, error => {
      if (error.status === 422) {
        this.emailUpdateFail = true
      }
      console.log(error)
    })
  }

  ngOnInit() {
  }

}
