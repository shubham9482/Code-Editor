import { Component, OnInit } from '@angular/core';
import { CreateExamService } from '../services/create-exam.service'
import { AdminDashboardService } from '../services/admin-dashboard.service'
// import { ManageCourseService } from '../services/manage-course.service'
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-create-exam',
  templateUrl: './create-exam.component.html',
  styleUrls: ['./create-exam.component.css', '../admin-dashboard/admin-dashboard.component.css'],
  providers: [CreateExamService]
})
export class CreateExamComponent implements OnInit {

  public examName = "";
  public error = false;
  public success = false;
  public activeTab = "createExam"
  public exams = [];
  public examDetails = {
    _id: "",
    name: ""
  };
  public selectedExam = "";

  public allocatedFaculties = [];
  public faculties = [];

  public departments = [];
  public years = [];

  public rollNo = "";

  public yearSelected: boolean = false;
  public deptSelected: boolean = false;

  public selectedDept = [];
  public selectedYears = [];

  public allocatedSelectAll: boolean = false;
  public filteredSelectAll: boolean = false;

  public allocatedFacultiesToAllocate = [];
  public filteredFacultyToAllocate = [];

  public selectedName = "";
  constructor(private createExamService: CreateExamService, private adminService: AdminDashboardService, private globalService: GlobalService) {
  }

  getEntities() {

    this.createExamService.getExams().subscribe(res => {

      this.exams = res.documents;
      if (this.selectedName) {
        for (var index = 0; index < this.exams.length; index++) {
          if (this.exams[index].name === this.selectedName) {
            this.selectedExam = this.exams[index];
            // let selectedExamString = '{"_id":"'+ this.exams[index]._id+'", "name":"'+ this.exams[index].name+'"}'
            // this.selectedExam=JSON.parse(selectedExamString);
            this.examChange();
            break;
          }
        }
      }
    },
      error => {
        console.log(error)
      });
  }

  createExam() {
    this.error = false;
    this.success = false;
    this.createExamService.createExam(this.examName).subscribe(res => {
      this.success = true;
    }, error => {
      this.error = true;
      console.log(error)
    })
  }

  tabChange(tabName) {
    if (tabName === 'allocate') {
      this.examName = "";
      this.error = false;
      this.success = false;
      this.getEntities();
    }
    else {
      this.allocatedFaculties = []
      this.allocatedFacultiesToAllocate = [];
      this.faculties = [];
      this.selectedExam = "";
      this.selectedName = '';
      this.examDetails = {
        _id: "",
        name: ""
      };
      this.departments = [];
      this.years = [];
      this.rollNo = "";
      this.exams = [];
    }
    this.activeTab = tabName
  }

  facultyAllocation() {

    this.selectedName = this.examName;
    this.tabChange('allocate');
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

  examChange() {
    this.allocatedFaculties = [];
    this.allocatedFacultiesToAllocate = [];
    this.filteredFacultyToAllocate = [];
    this.faculties = [];

    if (this.selectedExam) {
      this.years = [];
      this.departments = [];
      this.examDetails._id = this.selectedExam["_id"];
      this.examDetails.name = this.selectedExam["name"]
      this.globalService.loader(true)
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
        this.globalService.loader(false)
      }, error => {
        console.log(error)
        this.globalService.loader(false)

      })

      this.createExamService.getAllocatedFacultiesForExam(this.selectedExam["_id"]).subscribe(res => {

        let body = {
          "_id": res.documents,
          "entity": false
        }
        this.adminService.getDetails(body).subscribe(detailsRes => {
          console.log(detailsRes)
          this.allocatedSelectAll = true;
          detailsRes.documents.forEach(element => {
            element["checked"] = "true";
            this.allocatedFaculties.push(element);
            this.allocatedFacultiesToAllocate.push(element._id)
          });
        }, error => {
          console.log(error)
        })

      },
        error => {
          console.log(error)
        });


    }
    else {
      this.selectedName = "";
      this.examDetails = {
        _id: "",
        name: ""
      };
      this.resetFilters();
      this.years = [];
      this.departments = [];
    }
  }

  applyFilter() {
    let rollBody = [];
    let postBody = {};
    this.faculties = [];
    this.filteredFacultyToAllocate = [];
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
    postBody["examId"] = this.selectedExam["_id"]
    // postBody["entity"] = false

    this.globalService.loader(true)
    this.createExamService.getEntitiesOnFilter(postBody).subscribe(res => {

      res.documents.forEach(element => {
        element["checked"] = false;
        // this.entity === 'student' ? this.students.push(element) : this.faculties.push(element)

        this.faculties.push(element)
      });

      this.globalService.loader(false)
    }, error => {
      console.log(error)
      this.globalService.loader(false)
    })
  }

  resetFilters() {
    this.selectedDept = [];
    this.selectedYears = [];
    this.faculties = [];
    this.filteredFacultyToAllocate = [];
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
    this.allocatedFacultiesToAllocate = [];
    if (criteria === "allrowsselected" && table === "allocatedFaculty") {

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
    else if (criteria === '' && table === "allocatedFaculty") {

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

  filteredTableRowChecked(criteria, table) {
    // console.log(this.selectAll)
    this.filteredFacultyToAllocate = [];
    if (criteria === "allrowsselected" && table === "filteredFaculty") {

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
    else if (criteria === '' && table === "filteredFaculty") {

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

  allocateFaculties() {
    let body = {
      "facultyId": this.allocatedFacultiesToAllocate.concat(this.filteredFacultyToAllocate),
      "examId": this.selectedExam["_id"]
    }
    this.createExamService.allocateEntities(body).subscribe(
      res => {

      }
    )
  }

  ngOnInit() {
  }

}
