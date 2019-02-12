import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { GlobalService } from './global.service';
import { SocketServiceService } from './services/socket-service.service'
import { SessionService } from './services/session.service'
// import * as types from 'ClusterWS-Client-JS/src/utils/types';
import { modalDetails } from './models/modal'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SessionService]
})
export class AppComponent implements OnDestroy {

  public isRoleAdmin: boolean = false;
  public isRoleManager: boolean = false;
  public isLoginScreen = true;
  public activeTab;
  public load = false;
  service;
  service2;
  service3;
  role;
  name=""
  notifications = []
  showNav = true;
  notificationType = [
    "lab",
    "contest",
    "exam",
    "lab_attendance",
    "student_practice",
    "contest_participation",
  ]

  modalDetails: modalDetails = {
    visible: false,
    type: undefined,
    message: "",
  }
  notificationId;
  // socket.BrokerClient('ws://127.0.0.1:2000',this.customObj);
  constructor(private router: Router, private globalService: GlobalService, private socketService: SocketServiceService, private sessionService: SessionService) {

    this.socketService.notificationrBroadcast$.subscribe(res => {
      // console.log(res)
      this.notifications.push(res)
      // console.log(this.notifications)
    });

    this.service = this.globalService.loaderBroadcast$.subscribe(res => {
      this.load = res;
    });

    this.service2 = this.globalService.roleBroadcast$.subscribe(res => {
      this.role = res;
      if (this.role === 1) {

        this.sessionService.getAllNotifications().subscribe(res => {
          res.documents.forEach(element => {
            element['event'] = this.notificationType[element.type]
          });
          this.notifications = res.documents
        });
      }
    });

    this.service3=this.globalService.nameBroadcast$.subscribe(res=>{
      this.name=res
    })

    router.events.forEach((event) => {

      if (event instanceof NavigationStart) {
        if (event.url === "/login") {

          this.isRoleManager = false;
          this.isLoginScreen = true;
          this.showNav = true
        }
        else if (event.url === "/forgot-password") {

          this.isRoleManager = false;
          this.isLoginScreen = true;
          this.showNav = true
        }
        else if (event.url === "/register") {

          this.isRoleManager = false;
          this.isLoginScreen = true;
          this.showNav = true
        }
        else if (event.url.search("/courses") !== -1) {
          this.showNav = true;
          this.activeTab = "";
        }
        else if (event.url.search("/test") !== -1) {

          this.showNav = false
        }
        else if (event.url.search("/admin-dashboard") !== -1) {

          this.isRoleAdmin = true;
          this.isRoleManager = false;
          this.showNav = true
          if (event.url.search("/manage-course") !== -1)
            this.activeTab = "manageCourse";

          // else if(event.url.search("/manage-contest") !== -1)
          // this.activeTab="manageContest";

          else if (event.url.search("/add-new") !== -1)
            this.activeTab = "manageUsers";

          else if (event.url.search("/edit-student") !== -1)
            this.activeTab = "manageUsers";

          else if (event.url.search("/edit-faculty") !== -1)
            this.activeTab = "manageUsers";

          else if (event.url.search("/manage-labs") !== -1)
            this.activeTab = "manageLabs";

          else if (event.url.search("/create-exam") !== -1)
            this.activeTab = "manageExams";

          else if (event.url.search("/create-challenge") !== -1)
            this.activeTab = "manageContest";

          else if (event.url.search("/edit-challenge") !== -1)
            this.activeTab = "manageContest";

          else if (event.url.search("/create-contest") !== -1)
            this.activeTab = "manageContest";

          else if (event.url.search("/edit-contest") !== -1)
            this.activeTab = "manageContest";

          else if (event.url.search("/manage-status") !== -1)
            this.activeTab = "manageContest";
          else
            this.activeTab = "home";
        }
        else if (event.url.search("/management-dashboard") !== -1) {

          this.showNav = true
          if (event.url.search("/contest-report") !== -1)
            this.activeTab = "contestreport";

          // else if(event.url.search("/manage-contest") !== -1)
          // this.activeTab="manageContest";

          else if (event.url.search("/course-report") !== -1)
            this.activeTab = "coursereport";

          else if (event.url.search("/practice-report") !== -1)
            this.activeTab = "practicereport";

          else if (event.url.search("/lab-report") !== -1)
            this.activeTab = "labreport";

          else if (event.url.search("/exam-report") !== -1)
            this.activeTab = "examreport";

          else if (event.url.search("/student-report") !== -1)
            this.activeTab = "studentreport";

          // else if (event.url.search("/create-challenge") !== -1)
          //   this.activeTab = "manageContest";

          // else if (event.url.search("/edit-challenge") !== -1)
          //   this.activeTab = "manageContest";

          // else if (event.url.search("/create-contest") !== -1)
          //   this.activeTab = "manageContest";

          // else if (event.url.search("/edit-contest") !== -1)
          //   this.activeTab = "manageContest";

          // else if (event.url.search("/manage-status") !== -1)
          //   this.activeTab = "manageContest";
          else
            this.activeTab = "home";
        }
        else if (event.url.search("/faculty-dashboard") !== -1) {

          this.showNav = true
          if (event.url.search("/edit-exam") !== -1)
            this.activeTab = "editExam";

          // else if(event.url.search("/manage-contest") !== -1)
          // this.activeTab="manageContest";

          else if (event.url.search("/edit-labs") !== -1)
            this.activeTab = "editLabs";

          // else if (event.url.search("/courses") !== -1)
          // this.activeTab = "courses";
          // else if (event.url.search("/edit-labs") !== -1)
          //   this.activeTab = "practicereport";

          // else if (event.url.search("/lab-report") !== -1)
          //   this.activeTab = "labreport";

          // else if (event.url.search("/exam-report") !== -1)
          //   this.activeTab = "examreport";

          // else if (event.url.search("/student-report") !== -1)
          //   this.activeTab = "studentreport";

          // else if (event.url.search("/create-challenge") !== -1)
          //   this.activeTab = "manageContest";

          // else if (event.url.search("/edit-challenge") !== -1)
          //   this.activeTab = "manageContest";

          // else if (event.url.search("/create-contest") !== -1)
          //   this.activeTab = "manageContest";

          // else if (event.url.search("/edit-contest") !== -1)
          //   this.activeTab = "manageContest";

          // else if (event.url.search("/manage-status") !== -1)
          //   this.activeTab = "manageContest";
          else
            this.activeTab = "home";
        }
        else if (event.url.search("/student-dashboard") !== -1) {

          if (event.url.search("/lab-report") !== -1) {
            this.activeTab = "labreport";
            this.showNav = true
          }
          else if (event.url.search("/exams") !== -1) {
            this.showNav = true
            this.activeTab = "exams";
          }
          else if (event.url.search("/contests") !== -1) {
            this.showNav = true
            this.activeTab = "studentContests";
          }
          else if (event.url.search("/practice") !== -1) {
            this.showNav = true
            this.activeTab = "practice";
          }
          else if (event.url.search("/profile-settings") !== -1) {
            this.showNav = true
            this.activeTab = "profile";
          }
          else if (event.url.search("/exam-session") !== -1)
            this.showNav = false
          else if (event.url.search("/lab-session") !== -1)
            this.showNav = false
          else if (event.url.search("/contest-session") !== -1)
            this.showNav = false
          else if (event.url.search("/practice-session") !== -1)
            this.showNav = false
          else {
            this.showNav = true
            this.activeTab = "home";
          }
        }
      }
    })
  }

  redirect() {
    window.open("/logout", '_self');
  }

  createSession(notification) {
    if (notification.event === "lab") {
      // this.router.navigate(['/test'], { queryParams: { type: 'practice', 'courseId': this.details.courseId, 'moduleId': moduleId } });
      this.notificationId = notification.notificationId
      this.modalBoxDetails("input", "Please enter your lab session key")
      // var password = ;

    }
    else if (notification.event === "exam") {

      this.sessionService.enableExamSession(notification.notificationId).subscribe(res => {
        if (res.flag) {
          this.router.navigate(['/student-dashboard/exam-session']);
        }
      }, error => {
        console.log(error)
        alert("Error")
      })

    }
    else if (notification.event === "contest") {
      // this.router.navigate(['/student-dashboard/exam-session'], { queryParams: { type: 'practice', 'courseId': this.details.courseId, 'moduleId': moduleId } });
      this.sessionService.enableContestSession(notification.notificationId).subscribe(res => {
        if (res.flag) {
          this.router.navigate(['/student-dashboard/contest-session']);
        }
      }, error => {
        console.log(error)
        alert("Error")
      })
    }
    else if (notification.event === "lab_attendance") {
      // alert(notification.message)
      this.modalBoxDetails("message", notification.message)
    }
    else if (notification.event === "student_practice") {
      // alert(notification.message)
      this.modalBoxDetails("message", notification.message)
    }
    else if (notification.event === "contest_participation") {
      // alert(notification.message)
      this.modalBoxDetails("message", notification.message)
    }
  }

  modalBoxDetails(type, message) {
    this.modalDetails.visible = true
    this.modalDetails.message = message
    this.modalDetails.type = type
  }

  receiveData(data) {
    if (data) {
      this.sessionService.enableLabSession(this.notificationId, data).subscribe(res => {
        if (res.flag) {
          this.router.navigate(['/student-dashboard/lab-session']);
        }
      }, error => {
        console.log(error)
        if (error.status === 403)
          this.modalBoxDetails("message", "Please enter the correct session key.")

      })
    }
    // return data;
  }

  ngOnDestroy(): void {
    this.service.unsubscribe();
    this.service2.unsubscribe();
    this.service3.unsubscribe()
  }
}
