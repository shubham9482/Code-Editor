import { Component, OnInit } from '@angular/core';
import { ManageCourseService } from '../services/manage-course.service'
import { AdminDashboardService } from '../services/admin-dashboard.service'
import { GlobalService } from '../../global.service';


@Component({
  selector: 'app-manage-course',
  templateUrl: './manage-course.component.html',
  styleUrls: ['./manage-course.component.css', '../admin-dashboard/admin-dashboard.component.css'],
  providers: [ManageCourseService]
})
export class ManageCourseComponent implements OnInit {

  public entity = "student";

  public students = [];
  public allocatedStudents = [];

  public allocatedFaculties = [];
  public faculties = [];

  public courses = [];
  public selectedCourse: any = '';

  public departments = [];
  public years = [];

  public rollNo = "";

  public yearSelected: boolean = false;
  public deptSelected: boolean = false;

  public selectedDept = [];
  public selectedYears = [];

  public allocatedSelectAll: boolean = false;
  public filteredSelectAll: boolean = false;

  public allocatedStudentsToAllocate = [];
  public filteredStudentsToAllocate = [];

  public allocatedFacultiesToAllocate = [];
  public filteredFacultyToAllocate = [];

  constructor(private courseService: ManageCourseService, private adminService: AdminDashboardService,private globalService:GlobalService) {

    this.getEntities()
  }

  getEntities() {
    this.adminService.getCourses().subscribe(res => {
      this.courses = res.documents;
    })

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
  }

  display() {
    console.log(this.selectedCourse)
  }

  applyFilter() {
    this.globalService.loader(true);
    let rollBody = [];
    let postBody = {};
    this.students = [];
    this.faculties = [];
    this.filteredFacultyToAllocate=[];
    this.filteredStudentsToAllocate=[];
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
    postBody["courseId"] = this.selectedCourse._id
    postBody["entity"] = this.entity === 'student' ? true : false

    this.courseService.getEntitiesOnFilter(postBody).subscribe(res => {
      
      res.documents.forEach(element => {
        element["checked"] = false;
        // this.entity === 'student' ? this.students.push(element) : this.faculties.push(element)
        if(this.entity==='student')
        {
          this.students.push(element)
        }
        else if(this.entity==='faculty')
        {
          this.faculties.push(element)
        }
      });
      this.globalService.loader(false);
    }, error => {
      console.log(error)
      this.globalService.loader(false);
    })
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

  radioButtonClicked() {
    this.courseChange();
    this.resetFilters();
  }

  courseChange() {
    this.globalService.loader(true);
    let entityBoolean=this.entity==='student'?true:false
    this.allocatedStudents = [];
    this.allocatedStudentsToAllocate = [];

    this.allocatedFaculties = [];
    this.allocatedFacultiesToAllocate = [];

    this.faculties=[];
    this.filteredFacultyToAllocate=[];

    this.students=[];
    this.filteredStudentsToAllocate=[];
    // this.students=[];
    if (this.selectedCourse) {
      this.courseService.getEntitiesOnCourseID(this.selectedCourse._id,entityBoolean).subscribe(
        res => {
          this.allocatedSelectAll = true;
          res.documents.forEach(element => {
            element["checked"] = true;

            // this.entity === 'student' ? (this.allocatedStudents.push(element), this.allocatedStudentsToAllocate.push(element._id)) : (this.allocatedFaculties.push(element), this.allocatedFacultiesToAllocate.push(element._id))
            if(this.entity==='student')
            {
              this.allocatedStudents.push(element)
              this.allocatedStudentsToAllocate.push(element._id)
            }
            else if(this.entity==='faculty')
            {
              this.allocatedFaculties.push(element)
              this.allocatedFacultiesToAllocate.push(element._id)
            }
          });
          this.globalService.loader(false);
        }, error => {
          console.log(error)
          this.globalService.loader(false);
        }
      )

    }
    else {
      this.resetFilters();
    }
  }

  resetFilters() {
    this.selectedDept = [];
    this.selectedYears = [];
    this.filteredStudentsToAllocate=[];
    this.students = [];
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

  allocatedTableRowChecked(criteria, table) {
    // console.log(this.selectAll)
    this.allocatedStudentsToAllocate = [];
    this.allocatedFacultiesToAllocate=[];
    if (criteria === "allrowsselected" && (table === "allocatedStudent" || table === "allocatedFaculty")) {
      if (table === 'allocatedStudent') {
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
      else {
        if (this.allocatedSelectAll) {
          this.allocatedFaculties.forEach(element => {
            element.checked = true;
            this.allocatedFacultiesToAllocate.push(element._id);
          });
        }
        else {
          this.allocatedFaculties.forEach(element => {
            element.checked = false;
          });
          this.allocatedFacultiesToAllocate = [];
        }
      }
    }
    else if (criteria === '' && (table === "allocatedStudent" || table === "allocatedFaculty")) {
      if (table === 'allocatedStudent') {
        for (var index = 0; index < this.allocatedStudents.length; index++) {

          if (this.allocatedStudents[index].checked) {
            this.allocatedStudentsToAllocate.push(this.allocatedStudents[index]._id)
          }
          else {
            this.allocatedSelectAll = false;
          }
        }
      }
      else {
        for (var index = 0; index < this.allocatedFaculties.length; index++) {

          if (this.allocatedFaculties[index].checked) {
            this.allocatedFacultiesToAllocate.push(this.allocatedFaculties[index]._id)
          }
          else {
            this.allocatedSelectAll = false;
          }
        }
      }
    }

  }

  filteredTableRowChecked(criteria, table) {
    // console.log(this.selectAll)
    this.filteredStudentsToAllocate = [];
    this.filteredFacultyToAllocate=[];
    if (criteria === "allrowsselected" && (table === "filteredStudent" || table === "filteredFaculty")) {
      if (table === 'filteredStudent') {
        if (this.filteredSelectAll) {
          this.students.forEach(element => {
            element.checked = true;
            this.filteredStudentsToAllocate.push(element._id);
          });
        }
        else {
          this.students.forEach(element => {
            element.checked = false;
          });
          this.filteredStudentsToAllocate = [];
        }
      }
      else {
        if (this.filteredSelectAll) {
          this.faculties.forEach(element => {
            element.checked = true;
            this.filteredFacultyToAllocate.push(element._id);
          });
        }
        else {
          this.faculties.forEach(element => {
            element.checked = false;
          });
          this.filteredFacultyToAllocate = [];
        }
      }
    }
    else if (criteria === '' && (table === "filteredStudent" || table === "filteredFaculty")) {
      if (table === 'filteredStudent') {
        for (var index = 0; index < this.students.length; index++) {

          if (this.students[index].checked) {
            this.filteredStudentsToAllocate.push(this.students[index]._id)
          }
          else {
            this.filteredSelectAll = false;
          }
        }
      }
      else {
        for (var index = 0; index < this.faculties.length; index++) {

          if (this.faculties[index].checked) {
            this.filteredFacultyToAllocate.push(this.faculties[index]._id)
          }
          else {
            this.filteredSelectAll = false;
          }
        }
      }
    }
  }

  allocateStudents() {
    let body = {
      "_id": this.allocatedStudentsToAllocate.concat(this.filteredStudentsToAllocate),
      "courseId": this.selectedCourse._id,
      "entity":true
    }
    
    this.courseService.allocateEntities(body).subscribe(
      res => {
        
      }
    )
  }

  allocateFaculties() {
    let body = {
      "_id": this.allocatedFacultiesToAllocate.concat(this.filteredFacultyToAllocate),
      "courseId": this.selectedCourse._id,
      "entity":false
    }
    
    this.courseService.allocateEntities(body).subscribe(
      res => {
        
      }
    )
  }
  ngOnInit() {
  }

}
