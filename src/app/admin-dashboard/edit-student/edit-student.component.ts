import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from '../services/admin-dashboard.service'
import { EditUserService } from '../services/edit-user.service'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css', '../admin-dashboard/admin-dashboard.component.css'],
  providers: [EditUserService]
})
export class EditStudentComponent implements OnInit {

  // userForm: FormGroup;
  public submitted = false;
  public message = ""

  public editedPassword = "";

  public activateStatus = "activate";
  public departments = [];
  public years = [];
  public rollNo = "";

  public courses = [];
  public labs = [];

  public yearSelected: boolean = false;
  public deptSelected: boolean = false;

  public selectedDept = [];
  public selectedYears = [];

  public students = [];

  public filteredSelectAll: boolean = false;
  public filteredStudentsToDelete = [];

  public editStudent = {
    "checked": false,
    "department": "",
    "email": "",
    "firstName": "",
    "lastName": "",
    "rollNo": "",
    "year": "",
    "_id": "",
    "enabledLabs": [],
    "enabledContests": [],
    "DOB": "",
    "mobileNo": "",

  };
  public imgSrc = "data:image/jpg;base64,"

  public selectedCourse = [];
  public selectedLabs = [];
  constructor(private adminService: AdminDashboardService, private editService: EditUserService, private globalService: GlobalService) {
    this.getEntities();
  }

  getEntities() {

    this.adminService.getDepts().subscribe(res => {

      res.departments.forEach(element => {
        this.departments.push({ "dept": element, "checked": false })
      });

    })

    this.adminService.getYears().subscribe(res => {

      res.documents.forEach(element => {
        this.years.push({ "year": element, "checked": false })
      });
      // this.years = res.documents;
    })

    this.adminService.getCourses().subscribe(res => {

      res.documents.forEach(element => {
        element["checked"] = false;
        this.courses.push(element);
      });

    })

    this.adminService.getAllLabs().subscribe(
      res => {

        res.forEach(element => {
          element["checked"] = false;
          this.labs.push(element);
        });
      }
    )
  }

  onDeptChange() {

    this.selectedDept = [];
    this.deptSelected = false;
    for (var index = 0; index < this.departments.length; index++) {

      if (this.departments[index].checked) {
        this.deptSelected = true;
        this.selectedDept.push(this.departments[index].dept)
        // break;
      }
      // else {
      //   this.deptSelected = false;
      // }
    }
  }

  onYearChange() {

    this.selectedYears = [];
    this.yearSelected = false;
    for (var index = 0; index < this.years.length; index++) {

      if (this.years[index].checked) {
        this.yearSelected = true;
        this.selectedYears.push(this.years[index].year)
        // break;
      }
      // else {
      //   this.yearSelected = false;
      // }
    }
  }

  onCourseChange() {

    this.selectedCourse = [];
    for (var index = 0; index < this.courses.length; index++) {

      if (this.courses[index].checked) {
        this.selectedCourse.push(this.courses[index]._id)
        // break;
      }
      // else {
      //   this.deptSelected = false;
      // }
    }
  }

  onLabsChange() {

    this.selectedLabs = [];
    for (var index = 0; index < this.labs.length; index++) {

      if (this.labs[index].checked) {
        this.selectedLabs.push(this.labs[index]._id)
        // break;
      }
      // else {
      //   this.deptSelected = false;
      // }
    }
  }


  resetFilters() {
    this.selectedDept = [];
    this.selectedYears = [];
    this.students = [];
    this.deptSelected = false;
    this.yearSelected = false;
    this.rollNo = "";

    this.departments.forEach(element => {
      element.checked = false;
    });

    this.years.forEach(element => {
      element.checked = false;
    });
  }

  applyFilter() {
    this.globalService.loader(true);
    let rollBody = [];
    let postBody = {};
    this.students = [];
    if (this.deptSelected || this.yearSelected) {
      if (this.selectedDept.length != 0) {
        postBody["department"] = this.selectedDept;
      }
      if (this.selectedYears.length != 0) {
        postBody["year"] = this.selectedYears
      }
    }
    else {
      postBody["rollNo"] = this.rollNo.split(",");
    }

    postBody["entity"] = true

    this.adminService.getDetails(postBody).subscribe(res => {
      res.documents.forEach(element => {
        element["checked"] = false;
        this.students.push(element)
        this.globalService.loader(false);
      },
        error => {
          this.globalService.loader(false);
        });
    })
  }

  // filteredTableRowChecked(criteria, table) {
  //   // console.log(this.selectAll)
  //   this.filteredStudentsToDelete = [];
  //   if (criteria === "allrowsselected" && table === "filteredStudent") {
  //     if (this.filteredSelectAll) {
  //       this.students.forEach(element => {
  //         element.checked = true;
  //         this.filteredStudentsToDelete.push(element._id);
  //       });
  //     }
  //     else {
  //       this.students.forEach(element => {
  //         element.checked = false;
  //       });
  //       this.filteredStudentsToDelete = [];
  //     }
  //   }
  //   else if (criteria === '' && table === "filteredStudent") {
  //     for (var index = 0; index < this.students.length; index++) {

  //       if (this.students[index].checked) {
  //         this.filteredStudentsToDelete.push(this.students[index]._id)
  //       }
  //       else {
  //         this.filteredSelectAll = false;
  //       }
  //     }
  //   }
  // }

  edit(studentID) {

    this.imgSrc = "data:image/jpg;base64,";
    this.selectedLabs = [];
    this.selectedCourse = [];
    this.submitted = false;
    let body = {
      "_id": [studentID],
      "entity": true
    }

    this.adminService.getDetails(body).subscribe(res => {
      this.editedPassword = "";
      this.editStudent = res.documents[0];
      this.imgSrc += res.documents["0"].profilePic.data;

      this.editStudent.enabledLabs.forEach(element => {
        for (var index = 0; index < this.labs.length; index++) {
          if (this.labs[index]._id === element) {
            this.labs[index].checked = true;
            this.selectedLabs.push(this.labs[index]._id)
            break;
          }
        }
      });

      this.editStudent.enabledContests.forEach(element => {
        for (var index = 0; index < this.courses.length; index++) {
          if (this.courses[index]._id === element) {
            this.courses[index].checked = true;
            this.selectedCourse.push(this.courses[index]._id)
            break;
          }
        }
      });
      // this.userForm = new FormGroup({
      //   'email': new FormControl(this.editStudent.email, [
      //     Validators.required
      //   ]),
      //   'pwd': new FormControl(this.editedPassword, [
      //     Validators.required
      //   ]),
      //   'roll': new FormControl(this.editStudent.rollNo, [
      //     Validators.required
      //   ]),
      //   'labchecked': new FormControl(false),
      //   'coursechecked': new FormControl(false),
      //   'status': new FormControl(this.activateStatus, [Validators.required])
      // });


    },
      error => {
        console.log(error)
      })
  }

  onSubmit() {
    let body = {
      "studentId": this.editStudent._id,
      "email": this.editStudent.email,
      "rollNo": this.editStudent.rollNo,
      "enabledLabs": this.selectedLabs,
      "courses": this.selectedCourse
    }

    if (this.activateStatus === "activate")
      body["status"] = true
    else
      body["status"] = false

    this.editService.editStudent(body).subscribe(
      res => {
        
        this.submitted = true;
        this.message = "Submitted"
        // this.selectedCourse=[];
        // this.selectedLabs=[];
      },
      error => {
        console.log(error)
        this.submitted = true;
        this.message = "Error While Submitting"
        // this.selectedCourse=[];
        // this.selectedLabs=[];
      }
    );
  }

  // get email() { return this.userForm.get('email'); }
  // get pwd() { return this.userForm.get('pwd'); }
  // get roll() { return this.userForm.get('roll'); }
  // get labchecked() { return this.userForm.get('labchecked'); }
  // get coursechecked() { return this.userForm.get('coursechecked'); }
  // get status() { return this.userForm.get('status'); }


  ngOnInit() {

    // this.userForm = new FormGroup({
    //   'email': new FormControl(this.editStudent.email, [
    //     Validators.required
    //   ]),
    //   'pwd': new FormControl(this.editedPassword, [
    //     Validators.required
    //   ]),
    //   'roll': new FormControl(this.editStudent.rollNo, [
    //     Validators.required
    //   ]),
    //   'labchecked': new FormControl(false),
    //   'coursechecked': new FormControl(false),
    //   'status': new FormControl(this.activateStatus, [Validators.required])
    // });
  }

}
