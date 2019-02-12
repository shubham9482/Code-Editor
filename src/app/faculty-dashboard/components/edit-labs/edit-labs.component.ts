import { Component, OnInit } from '@angular/core';
import { EditLabsService } from '../../services/edit-labs.service'
import { EditExamService } from '../../services/edit-exam.service'
import { GlobalService } from '../../../global.service';
// import { DatepickerOptions } from 'ng2-datepicker';

@Component({
  selector: 'app-edit-labs',
  templateUrl: './edit-labs.component.html',
  styleUrls: ['./edit-labs.component.css', '../dashboard/dashboard.component.css'],
  providers: [EditLabsService, EditExamService]
})
export class EditLabsComponent implements OnInit {

  // options: DatepickerOptions = {
  //   minYear: 1970,
  //   maxYear: 2030,
  //   displayFormat: 'MMM D[,] YYYY',
  //   barTitleFormat: 'MMMM YYYY',
  //   dayNamesFormat: 'dd',
  //   firstCalendarDay: 0, // 0 - Sunday, 1 - Monday

  //   barTitleIfEmpty: 'Click to select a date',
  //   placeholder: 'Click to select a date', // HTML input placeholder attribute (default: '')
  //   addClass: '', // Optional, value to pass on to [ngClass] on the input field
  //   addStyle: {}, // Optional, value to pass to [ngStyle] on the input field
  //   fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
  //   useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  // };

  currentTab = "generateLabKeys"
  currentScreen = "generateLabKeys"
  labs = [];
  selectedLab = "";
  labDetails = {};
  allocatedStudents = []
  allocatedSelectAll = false;
  weekSelectAll = false;
  allocatedStudentsChecked = []
  weekChecked = [];
  labKeys = {};

  //Allocate students
  public departments = [];
  public years = [];

  public rollNo = "";

  public yearSelected: boolean = false;
  public deptSelected: boolean = false;

  public selectedDept = [];
  public selectedYears = [];

  // public allocateSelectAll: boolean = false;
  filteredStudents = [];
  public filteredSelectAll: boolean = false;

  public allocatedStudentsToAllocate = [];
  public filteredStudentsToAllocate = [];


  //labReport
  labReport = [];
  labReportSelectAll = false;
  labReportSelectedStudent = [];
  studentWiseReport = [];
  selectedStudent;
  selectedReport = { submissionId: undefined };
  submissionReport;

  startTime = "00:00";
  endTime = "00:00";
  onFocus;
  startDate
  endDate
  notificationText=""
  constructor(private editLabsService: EditLabsService, private globalService: GlobalService, private editExamService: EditExamService) {
    this.getEntities();

  }

  getEntities() {
    this.editLabsService.getLabs().subscribe(res => {
      this.labs = res.documents
    }, error => {
      console.log(error)
    })

    this.editExamService.getDepts().subscribe(res => {

      res.departments.forEach(element => {
        this.departments.push({ "dept": element, "checked": false })
      });

    })

    this.editExamService.getYears().subscribe(res => {

      res.documents.forEach(element => {
        this.years.push({ "year": element, "checked": false })
      });
      // this.years = res.documents;
    })
  }

  tabClicked(tab) {
    this.currentTab = tab
    this.getDataForCurrentScreen()

  }

  getDataForCurrentScreen() {
    this.currentScreen = ""

    if (this.currentTab === 'generateLabKeys') {
      this.generateLabsKeysReset()
      this.labChange()
    }
    else if (this.currentTab === 'allocate') {
      this.allocateReset()
      this.allocateStudents()
    }
    else if (this.currentTab === 'reports') {
      this.getReport()
    }
    // else if (this.currentTab === 'labReportTab')
    //   this.getLabReport()
    // else if (this.currentTab === 'examReportTab')
    //   this.getExamReport()
  }

  change() {
    if (this.currentTab === 'generateLabKeys') {
      this.labChange()
    }
    else if (this.currentTab === 'reports') {
      this.getReport()
    }
    else if (this.currentTab === 'allocate') {
      this.allocateStudents()
    }
  }

  labChange() {
    if (this.selectedLab) {
      this.globalService.loader(true)
      this.editLabsService.getLabDetails(this.selectedLab["_id"]).subscribe(res => {

        res.document.weeks.forEach(element => {
          element["checked"] = false;
        });
        this.labDetails = res.document
        // this.getStudentsOnId()
        this.getStudentsAllocatedToFaculty();
        this.currentScreen = this.currentTab;
        this.globalService.loader(false)
      }, error => {
        console.log(error)
        this.globalService.loader(false)
      })
    }
    else {
      this.generateLabsKeysReset();
    }
  }

  // getStudentsOnId() {
  //   if (this.labDetails["allocatedStudents"].length != 0) {

  //     let detailsBody = {
  //       entity: true,
  //       _id: this.labDetails["allocatedStudents"]
  //     }
  //     this.editExamService.getDetails(detailsBody).subscribe(res => {

  //       // this.allocatedSelectAll = true;
  //       res.documents.forEach(element => {
  //         element["checked"] = false;
  //         this.allocatedStudents.push(element)
  //         // this.allocatedStudentsChecked.push(element._id)
  //       });
  //     }, error => {
  //       console.log(error)
  //     });
  //   }
  //   else
  //     return
  // }
  getReport() {
    this.studentWiseReport = []
    if (this.selectedLab) {
      this.globalService.loader(true)
      this.editLabsService.getLabReport(this.selectedLab["_id"], '', '').subscribe(res => {
        res.documents.students.forEach(element => {
          element["checked"] = false
        });
        this.labReport = res.documents.students;
        this.globalService.loader(false)
        this.currentScreen = this.currentTab;
      }, error => {
        this.globalService.loader(false)
        console.log(error)
      })
    }
    else {
      this.labReport = [];
      this.labReportSelectAll = false
    }
  }

  select(type) {
    if (type === 'selectAll') {
      // console.log(type,this.selectAll)
      if (this.labReportSelectAll) {
        this.labReportSelectedStudent = this.labReport.map(element => {
          return element._id
        })

        this.labReport.forEach(element => {
          element["checked"] = true
        });
      }
      else {
        this.labReportSelectedStudent = []
        this.labReport.forEach(element => {
          element["checked"] = false
        });
      }
    }
    else {
      // let element = this.selectedStudents.find(e=>{
      let present = false
      //   return type._id===e._id && e.checked
      // })
      for (var index = 0; index < this.labReportSelectedStudent.length; index++) {
        var element = this.labReportSelectedStudent[index];

        if (element === type._id) {

          present = true
          break;
        }
      }
      if (present) {
        this.labReportSelectedStudent.splice(index, 1)
        this.labReportSelectAll = false
      }
      else {
        this.labReportSelectedStudent.push(type._id)
      }
    }
    // console.log(this.selectedStudents)
  }

  getWeekWiseReport(student) {
    this.selectedStudent = student
    this.studentWiseReport = []
    // let body = {
    //   labId: this.selectedLab._id,
    //   studentId: student._id
    //   // submissionId: ""/
    // }

    this.globalService.loader(true)
    this.editLabsService.getLabReport(this.selectedLab["_id"], student._id, '').subscribe(res => {

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
      // let body = {
      //   labId: this.selectedLab["_id"],
      //   // studentId: this.selectedStudent._id,
      //   submissionId: report.submissionId
      // }

      this.editLabsService.getLabReport(this.selectedLab["_id"], '', report.submissionId).subscribe(res => {
        this.submissionReport = res.document
      }, error => {
        console.log(error)
      })
    }
  }

  getStudentsAllocatedToFaculty() {
    this.allocatedStudents = [];
    this.allocatedStudentsChecked = []
    this.editLabsService.getStudentsAllocatedToFaculty(this.selectedLab["_id"]).subscribe(res => {

      if (this.currentScreen === 'allocate') {
        this.allocatedSelectAll = true;
        res.documents.forEach(element => {
          element["checked"] = true;
          this.allocatedStudents.push(element)
          this.allocatedStudentsChecked.push(element._id)
        });

      }
      else {
        res.documents.forEach(element => {
          element["checked"] = false;
          this.allocatedStudents.push(element)
        });
      }


    }, error => {
      console.log(error)
    })
  }

  generateLabsKeysReset() {
    this.labDetails = {};
    this.allocatedStudents = []
    this.allocatedSelectAll = false;
    this.weekSelectAll = false;
    this.allocatedStudentsChecked = []
    this.weekChecked = [];
    this.labKeys = {}
    this.currentScreen = this.currentTab;
  }


  allocatedTableRowChecked(criteria, obj) {
    // console.log(this.selectAll)
    if (criteria === "allrowsselected") {
      this.allocatedStudentsChecked = [];
      if (this.allocatedSelectAll) {
        this.allocatedStudents.forEach(element => {
          element.checked = true;
          this.allocatedStudentsChecked.push(element._id);
        });
      }
      else {
        this.allocatedStudents.forEach(element => {
          element.checked = false;
        });
        this.allocatedStudentsChecked = [];
      }
    }
    else if (obj.checked) {

      this.allocatedStudentsChecked.push(obj._id);

    }
    else {
      for (var index = 0; index < this.allocatedStudentsChecked.length; index++) {
        var element = this.allocatedStudentsChecked[index];

        if (element === obj._id) {
          this.allocatedStudentsChecked.splice(index, 1);
          this.allocatedSelectAll = false;
          break;
        }
      }
    }

  }

  // tableRowChecked(criteria, obj)
  // {
  //   if (criteria === "allrowsselected") {
  //     this.studentsChecked = [];
  //     if (this.selectAll) {
  //       this.students.forEach(element => {
  //         element.checked = true;
  //         this.studentsChecked.push(element._id);
  //       });
  //     }
  //     else {
  //       this.students.forEach(element => {
  //         element.checked = false;
  //       });
  //       this.studentsChecked = [];
  //     }
  //   }
  //   else if (obj.checked) {

  //     this.studentsChecked.push(obj._id);

  //   }
  //   else {
  //     for (var index = 0; index < this.studentsChecked.length; index++) {
  //       var element = this.studentsChecked[index];

  //       if (element === obj._id) {
  //         this.studentsChecked.splice(index, 1);
  //         this.selectAll = false;
  //         break;
  //       }
  //     }
  //   }
  // }

  weekTableRowChecked(criteria, obj) {
    if (criteria === "allrowsselected") {
      this.weekChecked = [];
      if (this.weekSelectAll) {
        this.labDetails["weeks"].forEach(element => {
          element.checked = true;
          this.weekChecked.push(element.number);
        });
      }
      else {
        this.labDetails["weeks"].forEach(element => {
          element.checked = false;
        });
        this.weekChecked = [];
      }
    }
    else if (obj.checked) {

      this.weekChecked.push(obj.number);

    }
    else {
      for (var index = 0; index < this.weekChecked.length; index++) {
        var element = this.weekChecked[index];

        if (element === obj.number) {
          this.weekChecked.splice(index, 1);
          this.weekSelectAll = false;
          break;
        }
      }
    }
  }

  generateKeys() {
    let body = {
      studentId: this.allocatedStudentsChecked,
      labId: this.labDetails["_id"],
      weekNumbers: this.weekChecked,
      duration: this.labDetails["duration"],
      startDate: (this.startDate) ? this.startDate + "T" + this.startTime.split(":")[0] + ":" + this.startTime.split(":")[1] + ":00.000Z" : null,
      // endDate: (this.endDate) ? this.endDate + "T" + this.endTime.split(":")[0] + ":" + this.endTime.split(":")[1] + ":00.000Z" : null,
    }
    this.editLabsService.getLabKeys(body).subscribe(res => {
      this.labKeys = res.documents
    }, error => {
      console.log(error)
    })
  }

  getKeys(object): Array<String> {

    if (object)
      return Object.keys(object)

    else return
  }

  allocateReset() {
    this.selectedDept = [];
    this.selectedYears = [];
    this.filteredStudentsToAllocate = [];
    this.filteredStudents = [];
    this.deptSelected = false;
    this.yearSelected = false;
    this.currentScreen = this.currentTab
    this.rollNo = "";

    this.departments.forEach(element => {
      element.checked = false;
    });

    this.years.forEach(element => {
      element.checked = false;
    });

  }

  allocateStudents() {

    if (this.selectedLab) {
      this.getStudentsAllocatedToFaculty();
      this.currentScreen = this.currentTab
    }
    else {
      this.allocatedStudents = []
      this.allocateReset()
    }
  }

  applyFilter() {
    this.globalService.loader(true);
    let rollBody = [];
    let postBody = {};



    this.filteredStudents = [];
    this.filteredStudentsToAllocate = [];
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
    postBody["labId"] = this.selectedLab["_id"]
    postBody["entity"] = true

    this.editExamService.getDetails(postBody).subscribe(res => {

      res.documents.forEach(element => {
        element["checked"] = false;
        this.filteredStudents = res.documents
      });
      this.globalService.loader(false);
    }, error => {
      console.log(error)
      this.globalService.loader(false);
    })
  }

  filteredTableRowChecked(criteria, obj) {
    // console.log(this.selectAll)

    if (criteria === "allrowsselected") {
      this.filteredStudentsToAllocate = [];
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
    else if (obj.checked) {

      this.filteredStudentsToAllocate.push(obj._id);

    }
    else {
      for (var index = 0; index < this.filteredStudentsToAllocate.length; index++) {
        var element = this.filteredStudentsToAllocate[index];

        if (element === obj._id) {
          this.filteredStudentsToAllocate.splice(index, 1);
          this.filteredSelectAll = false;
          break;
        }
      }
    }

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

  allocate() {
    let body = {
      labId:this.selectedLab["_id"],
      studentId: this.allocatedStudentsChecked.concat(this.filteredStudentsToAllocate)
    }
    this.editLabsService.allocateStudents(body).subscribe(res => {

    }, error => {
      console.log(error)
    })
  }

  setTime(time, type) {
    if (type === 'startTime')
      this.startTime = time;
    else
      this.endTime = time;
    this.onFocus = "";

  }

  sendNotification() {
    let body = {
      type: 3,
      studentId: this.labReportSelectedStudent,
      message: this.notificationText
    }

    this.editLabsService.sendNotification(body).subscribe(res => {

    }, error => {
      console.log(error)
    })
  }

  updateAttempts(number,attempts)
  {
    this.editLabsService.updateAttempts(number,attempts,this.selectedLab["_id"], this.selectedStudent._id).subscribe(res=>{
      if(res.flag)
      {
        this.getWeekWiseReport(this.selectedStudent)
      }
    },error=>{
      console.log(error)
    })
  }
  ngOnInit() {
  }

}
