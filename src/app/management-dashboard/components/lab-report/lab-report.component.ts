import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../global.service';
import { LabReportService } from "../../services/lab-report.service"

@Component({
  selector: 'app-lab-report',
  templateUrl: './lab-report.component.html',
  styleUrls: ['./lab-report.component.css', '../dashboard/dashboard.component.css'],
  providers: [LabReportService]
})
export class LabReportComponent implements OnInit {

  labs = []
  departments = [];
  faculties = [];
  selectedLab;
  selectedDepartments = [];
  selectedFaculties = [];
  rollNo = "";

  students = [];
  public selectAll: boolean = false;
  selectedStudents = [];
  studentWiseReport = [];
  selectedStudent;
  selectedReport={submissionId:undefined};
  submissionReport;
  // notification = 3
  notificationText = ""
  constructor(private globalService: GlobalService, private labService: LabReportService) {

    this.getEntities()
  }

  getEntities() {
    this.labService.getLabs().subscribe(res => {
      this.labs = res.documents
    }, error => {
      console.log(error)
    })

    this.labService.getFaculties().subscribe(res => {

      res.documents.forEach(element => {
        element["checked"] = false
      });

      this.faculties = res.documents
    }, error => {
      console.log(error)
    })

    this.labService.getDepts().subscribe(res => {
      res.departments.forEach(element => {
        this.departments.push({ "dept": element, "checked": false })
      });

    }, error => {
      console.log(error)
    })
  }

  labChange() {
    if (this.selectedLab) {
      this.selectAll = false
      this.students = []
      let body = this.getBody()

      this.globalService.loader(true)
      this.labService.getLabReports(body).subscribe(res => {

        res.documents.students.forEach(element => {
          element["checked"] = false
        });
        this.students = res.documents.students;
        this.globalService.loader(false)
      }, error => {
        console.log(error)
        this.globalService.loader(false)
      })
    }
    else {
      this.students = [];
      this.resetFilters()
    }
  }

  getBody() {
    let body = {
      labId: this.selectedLab._id
    }

    if (this.selectedFaculties.length != 0) {
      body["facultyId"] = this.selectedFaculties
    }
    else if (this.rollNo) {
      body["studentRollNo"] = this.rollNo.split(",")
    }
    else if (this.selectedDepartments.length != 0) {
      body["department"] = this.selectedDepartments
    }
    return body

  }

  onDeptChange() {
    this.selectedDepartments = this.departments.filter(e => {
      return e.checked === true;
    }).map(obj => {
      return obj.dept
    })
  }

  onFacultyChange() {
    this.selectedFaculties = this.faculties.filter(e => {
      return e.checked === true;
    }).map(obj => {
      return obj._id
    })
  }

  resetFilters() {
    this.selectAll = false
    this.selectedDepartments = [];
    this.selectedFaculties = [];

    this.departments.forEach(element => {
      element.checked = false;
    });

    this.faculties.forEach(element => {
      element.checked = false;
    });

    this.rollNo = ""
    // this.labChange();
  }

  select(type) {
    if (type === 'selectAll') {
      // console.log(type,this.selectAll)
      if (this.selectAll) {
        this.selectedStudents = this.students.map(element => {
          return element._id
        })

        this.students.forEach(element => {
          element["checked"] = true
        });
      }
      else {
        this.selectedStudents = []
        this.students.forEach(element => {
          element["checked"] = false
        });
      }
    }
    else {
      // let element = this.selectedStudents.find(e=>{

      //   return type._id===e._id && e.checked
      // })
      let present = false
      // if (this.selectedStudents.length === 0) {
      //   this.selectedStudents.push(type._id)
      // }
      for (var index = 0; index < this.selectedStudents.length; index++) {
        var element = this.selectedStudents[index];
        
        if (element === type._id) {

          present = true
          break;
        }
      }
      if (present) {
        this.selectedStudents.splice(index, 1)
        this.selectAll = false
      }
      else {
        this.selectedStudents.push(type._id)
      }
    }

    // console.log(this.selectedStudents)
  }

  getWeekWiseReport(student) {
    this.selectedStudent = student
    this.studentWiseReport = []
    let body = {
      labId: this.selectedLab._id,
      studentId: student._id
      // submissionId: ""/
    }

    this.globalService.loader(true)
    this.labService.getStudentLabReport(body).subscribe(res => {

      for (var index = 0; index < res.weeks.length; index++) {
        var element = res.weeks[index];

        element["attempts"] = res.attempts[index]

        let submission = res.dateOfSubmissions.filter(e => {
          return e._id === element.number
        })

        if (submission.length != 0) {
          element["lastSubmittedDate"] = submission[0].lastSubmittedDate
          element["submissionId"] = submission[0].submissionId
        }
        else {
          element["lastSubmittedDate"] = null
          element["submissionId"] = null
        }
      }
      this.studentWiseReport = res.weeks;
      this.globalService.loader(false)
    }, error => {
      this.globalService.loader(false)
      console.log(error)
    })
  }

  getLabSubmission(report) {
    this.selectedReport = report
    if (this.selectedReport["submissionId"]) {
      let body = {
        labId: this.selectedLab._id,
        // studentId: this.selectedStudent._id,
        submissionId: report.submissionId
      }

      this.labService.getStudentLabReport(body).subscribe(res => {
        this.submissionReport = res.document
      }, error => {
        console.log(error)
      })
    }
  }

  sendNotification() {
    let body = {
      type: 3,
      studentId: this.selectedStudents,
      message: this.notificationText
    }

    this.labService.sendNotification(body).subscribe(res => {

    }, error => {
      console.log(error)
    })
  }

  ngOnInit() {
  }

}
