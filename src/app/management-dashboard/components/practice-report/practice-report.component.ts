import { Component, HostListener, OnInit } from '@angular/core';
import { CourseReportService } from "../../services/course-report.service";
import { PracticeReportService } from "../../services/practice-report.service"
import { GlobalService } from '../../../global.service';
import * as moment from 'moment';


@Component({
  selector: 'app-practice-report',
  templateUrl: './practice-report.component.html',
  styleUrls: ['./practice-report.component.css', '../dashboard/dashboard.component.css'],
  providers: [CourseReportService, PracticeReportService]
})
export class PracticeReportComponent implements OnInit {

  public tzoffset = (new Date()).getTimezoneOffset() * 60000;
  departments = [];
  rollNo = "";
  years = [];
  deptSelected = false;
  yearSelected = false;
  selectedYears = [];
  selectedDept = [];
  students = [];
  loadAPI: Promise<any>;
  notificationText = ""
  startDate = moment().subtract(1, 'days');
  endDate = moment();
  selectAll = false;
  selectedStudents=[];
  constructor(private courseService: CourseReportService, private globalService: GlobalService, private practiceReport: PracticeReportService) {

    this.getEntities();
  }


  getEntities() {

    this.courseService.getDepts().subscribe(res => {

      res.departments.forEach(element => {
        this.departments.push({ "dept": element, "checked": false })
      });

    })

    this.courseService.getYears().subscribe(res => {

      res.documents.forEach(element => {
        this.years.push({ "year": element, "checked": false })
      });
      // this.years = res.documents;
    })
  }

  applyFilter() {

    let postBody = {};
    if (this.startDate && this.endDate) {
      // var temp = this.inputDate.split("-")      
      var fromDate = new Date(Date.parse(this.startDate.toString()) - this.tzoffset).toISOString().split('T')[0]
      var toDate = new Date(Date.parse(this.endDate.toString()) - this.tzoffset).toISOString().split('T')[0]
      postBody["startDate"] = fromDate;
      postBody["endDate"] = toDate;
      // console.log(toDate,fromDate)
    }
    if (this.deptSelected || this.yearSelected) {
      if (this.selectedDept.length != 0) {
        postBody["department"] = this.selectedDept;
      }
      if (this.selectedYears.length != 0) {
        postBody["year"] = this.selectedYears
      }
    }
    else if (this.rollNo) {
      postBody["rollNo"] = this.rollNo.split(",");
    }
    this.globalService.loader(true)
    this.practiceReport.getPracticeReport(postBody).subscribe(res => {
      res.studentDetails.forEach(element => {
        element["checked"] = false
      });
      this.students = res.studentDetails
      this.students.sort(this.compare)
      this.rankStudent()
      this.globalService.loader(false)
    }, error => {
      console.log(error)
      this.globalService.loader(false)
    })
  }

  resetFilters() {
    this.students = []
    this.selectedDept = [];
    this.selectedYears = [];
    this.deptSelected = false;
    this.yearSelected = false;
    this.rollNo = "";
    // this.inputDate=undefined;
    // document.getElementById("reportrangeSpan").innerHTML=""
    this.departments.forEach(element => {
      element.checked = false;
    });

    this.years.forEach(element => {
      element.checked = false;
    });
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

  sendNotification() {
    let body = {
      type: 4,
      studentId: this.selectedStudents,
      message: this.notificationText
    }

    this.practiceReport.sendNotification(body).subscribe(res => {

    }, error => {
      console.log(error)
    })
  }
  
  compare(a, b) {
    if ((a.totalScore) < (b.totalScore))
      return 1;
    if ((a.totalScore) > (b.totalScore))
      return -1;
    return 0;
  }

  rankStudent() {
    let rank = 1;

    for (var index = 0; index < this.students.length; index++) {
      var element = this.students[index];
      if (index === 0) {
        element.rank = 1;
      }
      else {
        var prevElement = this.students[index - 1];
        if (((element.totalScore) == (prevElement.totalScore))) {
          element.rank = rank;
        }
        else {
          element.rank = rank + 1;
          rank += 1;
        }
      }
    }
  }

  getDate(event) {
    if (event != null) {
      let startDate = moment(event.split("split")[0]).format('YYYY-MM-DD')
      let endDate = moment(event.split("split")[1]).format('YYYY-MM-DD')
      this.startDate = moment(startDate)
      this.endDate = moment(endDate)
      console.log(startDate, endDate)

    }
    else {
      this.startDate = null;
      this.endDate = null;
    }
  }
  ngOnInit() {
  }

}
