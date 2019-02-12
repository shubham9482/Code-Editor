import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from '../services/admin-dashboard.service'
import { EditUserService } from '../services/edit-user.service'
import { GlobalService } from '../../global.service';


@Component({
  selector: 'app-edit-faculty',
  templateUrl: './edit-faculty.component.html',
  styleUrls: ['./edit-faculty.component.css', '../admin-dashboard/admin-dashboard.component.css'],
  providers: [EditUserService]
})
export class EditFacultyComponent implements OnInit {

  public departments = [];
  public rollNo = "";

  public allocatedStudents = [];
  public filteredStudents = [];

  public courses = [];
  public labs = [];

  public deptSelected: boolean = false;
  public yearSelected: boolean = false;

  public selectedDept = [];
  public selectedYears = [];

  public faculties = [];
  public years = [];

  public imgSrc = "data:image/jpg;base64,"

  public submitted = false;
  public message = ""

  public selectedCourse = [];
  public selectedLabs = [];
  public filterSelectedDept = [];
  public filterSelectedYears = [];

  public allocatedStudentsToAllocate = [];
  public allocatedSelectAll = false;

  public filteredStudentsToAllocate = [];
  public filteredSelectAll = false;
  public editfaculty = {
    "checked": false,
    "department": "",
    "email": "",
    "firstName": "",
    "lastName": "",
    "rollNo": "",
    "year": "",
    "_id": "",
    "allocatedLabs": [],
    "allocatedStudents": [],
    "dob":"",
    "mobileNo":""
  };

  public filterDepartments = [];
  public filterYears = [];
  public filterRollNo = "";
  public filterDeptSelected = false;
  public filterYearSelected = false;
  public allocate = false;
  constructor(private adminService: AdminDashboardService, private editService: EditUserService,private globalService:GlobalService) {

    this.getEntities();
  }

  getEntities() {

    this.adminService.getDepts().subscribe(res => {

      res.departments.forEach(element => {
        this.departments.push({ "dept": element, "checked": false });
        this.filterDepartments.push({ "dept": element, "checked": false });
      });

    })

    this.adminService.getYears().subscribe(res => {

      res.documents.forEach(element => {
        this.years.push({ "year": element, "checked": false })
        this.filterYears.push({ "year": element, "checked": false })
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

  onFilterDeptChange() {
    this.filterSelectedDept = [];
    this.filterDeptSelected = false;
    for (var index = 0; index < this.filterDepartments.length; index++) {

      if (this.filterDepartments[index].checked) {
        this.filterDeptSelected = true;
        this.filterSelectedDept.push(this.filterDepartments[index].dept)
        // break;
      }
      // else {
      //   this.deptSelected = false;
      // }
    }
  }

  onFilterYearChange() {
    this.filterSelectedYears = [];
    this.filterYearSelected = false;
    for (var index = 0; index < this.filterYears.length; index++) {

      if (this.filterYears[index].checked) {
        this.filterYearSelected = true;
        this.filterSelectedYears.push(this.filterYears[index].year)
        // break;
      }
      // else {
      //   this.yearSelected = false;
      // }
    }
  }

  resetFilters(type) {


    if (type === 'faculty') {
      this.selectedDept = [];
      this.selectedYears = [];
      this.faculties = [];
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
    else if ('students') {
      this.filterSelectedDept = [];
      this.filterSelectedYears = [];
      this.filteredStudents = [];
      this.filterDeptSelected = false;
      this.filterYearSelected = false;
      this.filterRollNo = "";

      this.filterDepartments.forEach(element => {
        element.checked = false;
      });

      this.filterYears.forEach(element => {
        element.checked = false;
      });
    }
  }

  applyFilter(type) {
    this.globalService.loader(true);
    this.filteredStudents=[];
    this.faculties=[];
    let postBody = {};

    if (type === 'faculty') {
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

      postBody["entity"] = false;
    }
    else if (type === 'students') {
      if (this.filterDeptSelected || this.filterYearSelected) {
        if (this.filterSelectedDept.length != 0) {
          postBody["department"] = this.filterSelectedDept;

        }
        if (this.filterSelectedYears.length != 0) {
          postBody["year"] = this.filterSelectedYears
        }
      }
      else {
        postBody["rollNo"] = this.filterRollNo.split(",");
      }

      postBody["facultyId"] = this.editfaculty._id;
      postBody["entity"] = true;
    }

    this.adminService.getDetails(postBody).subscribe(res => {
      res.documents.forEach(element => {
        
        element["checked"] = false;
        if (type === 'faculty')
          this.faculties.push(element)
        else if (type === 'students')
          this.filteredStudents.push(element)
          
        this.globalService.loader(false);  
      });
    },
      error => {
        console.log(error)
        this.globalService.loader(false);
      })
  }

  edit(facultyID) {

    this.imgSrc = "data:image/jpg;base64,";
    this.selectedLabs = [];
    this.selectedCourse = [];
    this.allocatedStudents = [];
    this.allocatedStudentsToAllocate = [];
    this.submitted = false;
    let body = {
      "_id": [facultyID],
      "entity": false
    }

    this.adminService.getDetails(body).subscribe(res => {
      // this.editedPassword = "";

      this.editfaculty = res.documents[0];
      // this.imgSrc += res.documents["0"].profilePic.data;

      if (this.editfaculty.allocatedLabs) {
        this.editfaculty.allocatedLabs.forEach(element => {
          for (var index = 0; index < this.labs.length; index++) {
            if (this.labs[index]._id === element) {
              this.labs[index].checked = true;
              this.selectedLabs.push(this.labs[index]._id)
              break;
            }
          }
        });
      }

      if (this.editfaculty.allocatedStudents) {
        let postBody = { "_id": this.editfaculty.allocatedStudents,"entity":true }
        this.adminService.getDetails(postBody).subscribe(res => {
          res.documents.forEach(element => {
            this.allocatedSelectAll = true;
            element["checked"] = true;
            this.allocatedStudents.push(element)
            this.allocatedStudentsToAllocate.push(element._id)
          });
        },
          error => {
            console.log(error)
          })
      }

    },
      error => {
        console.log(error)
      })
  }

  allocatedTableRowChecked(criteria, table) {
    // console.log(this.selectAll)
    this.allocatedStudentsToAllocate = [];
    if (criteria === "allrowsselected" && table === "allocatedStudent") {
      if (this.allocatedSelectAll) {
        this.allocatedStudents.forEach(element => {
          element.checked = true;
          this.allocatedStudentsToAllocate.push(element._id);
        });
      }
      else {
        this.allocatedStudents.forEach(element => {
          element.checked = false;
        });
        this.allocatedStudentsToAllocate = [];
      }
    }
    else if (criteria === '' && table === "allocatedStudent") {
      for (var index = 0; index < this.allocatedStudents.length; index++) {

        if (this.allocatedStudents[index].checked) {
          this.allocatedStudentsToAllocate.push(this.allocatedStudents[index]._id)
        }
        else {
          this.allocatedSelectAll = false;
        }
      }
    }

  }

  filteredTableRowChecked(criteria, table) {
    // console.log(this.selectAll)
    this.filteredStudentsToAllocate = [];
    if (criteria === "allrowsselected" && table === "filteredStudent") {
      if (this.filteredSelectAll) {
        this.filteredStudents.forEach(element => {
          element.checked = true;
          this.filteredStudentsToAllocate.push(element._id);
        });
      }
      else {
        this.filteredStudents.forEach(element => {
          element.checked = false;
        });
        this.filteredStudentsToAllocate = [];
      }
    }
    else if (criteria === '' && table === "filteredStudent") {
      for (var index = 0; index < this.filteredStudents.length; index++) {

        if (this.filteredStudents[index].checked) {
          this.filteredStudentsToAllocate.push(this.filteredStudents[index]._id)
        }
        else {
          this.filteredSelectAll = false;
        }
      }
    }
  }

  onSubmit() {
    let body = {
      "facultyId": this.editfaculty._id,
      "email": this.editfaculty.email,
      "rollNo": this.editfaculty.rollNo,
      "allocatedLabs": this.selectedLabs,
      "allocatedStudents": this.allocatedStudentsToAllocate.concat(this.filteredStudentsToAllocate),
    }

    this.editService.editFaculty(body).subscribe(
      res => {
        
        this.submitted = true;
        this.message = "Submitted",
          // this.allocatedStudents=[];
          // this.filteredStudents=[]; 
          this.allocate = false;
        // this.selectedLabs=[];
      },
      error => {
        console.log(error)
        this.submitted = true;
        this.message = "Error While Submitting"
        // this.selectedLabs=[];
      }
    );

  }
  ngOnInit() {
  }

}
