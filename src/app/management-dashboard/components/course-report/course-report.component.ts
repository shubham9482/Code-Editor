import { Component, OnInit } from '@angular/core';
import { CourseReportService } from "../../services/course-report.service"
import { GlobalService } from '../../../global.service';

@Component({
  selector: 'app-course-report',
  templateUrl: './course-report.component.html',
  styleUrls: ['./course-report.component.css', '../dashboard/dashboard.component.css'],
  providers: [CourseReportService]
})
export class CourseReportComponent implements OnInit {

  entity = "student";

  selectedCourse = "";
  courses = [];
  departments = []
  rollNo = "";
  years = [];
  deptSelected = false;
  yearSelected = false;
  selectedDept = [];
  selectedYears = [];
  entities = [];
  filteredEntities = [];
  filterCondition = "";
  sortOrder;
  sortCol;
  notificationText = ""
  selectedStudents=[];
  selectAll=false
  constructor(private courseService: CourseReportService, private globalService: GlobalService) {
    this.getEntities();
  }

  getEntities() {
    this.courseService.getCourses().subscribe(res => {
      this.courses = res.documents;
    })

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

  ngOnInit() {
  }

  courseChange() {

    if (this.selectedCourse) {
      this.filteredEntities = [];
      this.globalService.loader(true)
      let body = {
        entity: true ? (this.entity === 'student') : false,
        courseId: this.selectedCourse["_id"]
      }
      this.courseService.getCourseReport(body).subscribe(res => {
        res.documents.forEach(element => {
          element["checked"]=false
        });
        this.entities = res.documents

        this.entities.forEach(element => {
          element.testScore = element.completedModuleNumber * 10
          this.filteredEntities.push(element)
        });
        this.filteredEntities.sort(this.compare)
        this.entities.sort(this.compare)
        this.rankStudent()
        this.globalService.loader(false)
      }, error => {
        console.log(error)
        this.globalService.loader(false)
      })
    }
    else {
      this.entities = [];
      this.resetFilters();
      // this.filteredEntities=[];
    }

  }

  resetFilters() {
    this.selectedDept = [];
    this.selectedYears = [];
    // this.entities = [];
    this.deptSelected = false;
    this.yearSelected = false;
    this.rollNo = "";
    this.filterCondition = "";
    this.filteredEntities=[]
    this.entities.forEach(element => {
      this.filteredEntities.push(element)
    });
    this.departments.forEach(element => {
      element.checked = false;
    });

    this.years.forEach(element => {
      element.checked = false;
    });
  }

  applyFilter() {
    if (this.deptSelected || this.yearSelected) {

      if (this.deptSelected && this.yearSelected) {
        this.filterCondition = "multiple"
      }
      else if (this.deptSelected) {
        this.filterCondition = "dept"
      }
      else if (this.yearSelected) {
        this.filterCondition = "year"
      }
    }
    else {
      this.filterCondition = "roll"
    }

    this.filteredEntities = this.entities.filter(this.filter, this)
  }

  filter(studentObj) {

    let flag = false;
    if (this.filterCondition === 'multiple') {
      for (var index = 0; index < this.selectedDept.length; index++) {
        var element = this.selectedDept[index];

        for (var index1 = 0; index1 < this.selectedYears.length; index1++) {
          var element1 = this.selectedYears[index1];

          if (studentObj.department.toLowerCase() == element.toLowerCase() && studentObj.year == element1) {
            flag = true;
            break;
          }
        }
        if (flag) {
          break;
        }
      }
    }
    else if (this.filterCondition === 'dept') {
      // this.selectedDept.forEach(element => {
      //   console.log(studentObj.department.toLowerCase(), element.toLowerCase())
      //   if (studentObj.department.toLowerCase() == element.toLowerCase()) {
      //     return true;
      //   }
      // });
      for (var index = 0; index < this.selectedDept.length; index++) {
        var element = this.selectedDept[index];

        if (studentObj.department.toLowerCase() == element.toLowerCase()) {
          flag = true;
          break;
        }
      }

    }
    else if (this.filterCondition === 'year') {
      // this.selectedYears.forEach(element => {
      //   if (studentObj.year == element) {
      //     return true;
      //   }
      // });
      for (var index = 0; index < this.selectedYears.length; index++) {
        var element = this.selectedYears[index];

        if (studentObj.year == element) {
          flag = true;
          break;
        }
      }
    }
    else {
      let rollArr = this.rollNo.split(",")

      // rollArr.forEach(element => {
      //   if (studentObj.roll.toLowerCase() == element.toLowerCase()) {
      //     return true;
      //   }
      // });
      for (var index = 0; index < rollArr.length; index++) {
        var element: any = rollArr[index];
        if (studentObj.rollNo.toLowerCase() == element.toLowerCase()) {
          flag = true;
          break;
        }
      }
    }
    if (flag) {
      return true;
    }
    else
      return false;
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

  compare(a, b) {
    if ((a.completedPracticeQuestionsScore + a.testScore) < (b.completedPracticeQuestionsScore + b.testScore))
      return 1;
    if ((a.completedPracticeQuestionsScore + a.testScore) > (b.completedPracticeQuestionsScore + b.testScore))
      return -1;
    return 0;
  }

  rankStudent() {
    let rank = 1;

    for (var index = 0; index < this.filteredEntities.length; index++) {
      var element = this.filteredEntities[index];
      if (index === 0) {
        element.rank = 1;
      }
      else {
        var prevElement = this.filteredEntities[index - 1];
        if (((element.completedPracticeQuestionsScore + element.testScore) == (prevElement.completedPracticeQuestionsScore + prevElement.testScore))) {
          element.rank = rank;
        }
        else {
          element.rank = rank + 1;
          rank += 1;
        }
      }
    }
  }

  sortColumn(event, col) {

    this.sortCol = col;
    if (event.target.innerText === '▲') {
      // ascending  html code
      event.target.innerHTML = '&#x25bc;'
      this.sortOrder = "DESC"


    } else {
      // sorting descending order
      event.target.innerHTML = '&#x25b2;'
      this.sortOrder = "ASC"

    }

    this.filteredEntities.sort(this.sortBasedOnColumn(this))
  }

  sortBasedOnColumn(scope) {
    return function (a, b) {

      if (scope.sortOrder === 'ASC') {
        if (scope.sortCol === 'completedModuleNumber') {
          if (a.completedModuleNumber < b.completedModuleNumber)
            return -1;
          if (a.completedModuleNumber > b.completedModuleNumber)
            return 1;
          return 0;
        }
        else if (scope.sortCol === 'completedPracticeQuestionsScore') {
          if (a.completedPracticeQuestionsScore < b.completedPracticeQuestionsScore)
            return -1;
          if (a.completedPracticeQuestionsScore > b.completedPracticeQuestionsScore)
            return 1;
          return 0;
        }
        else if (scope.sortCol === 'testScore') {
          if (a.testScore < b.testScore)
            return -1;
          if (a.testScore > b.testScore)
            return 1;
          return 0;
        }
      }

      else if (scope.sortOrder === 'DESC') {
        if (scope.sortCol === 'completedModuleNumber') {
          if (a.completedModuleNumber < b.completedModuleNumber)
            return 1;
          if (a.completedModuleNumber > b.completedModuleNumber)
            return -1;
          return 0;
        }
        else if (scope.sortCol === 'completedPracticeQuestionsScore') {
          if (a.completedPracticeQuestionsScore < b.completedPracticeQuestionsScore)
            return 1;
          if (a.completedPracticeQuestionsScore > b.completedPracticeQuestionsScore)
            return -1;
          return 0;
        }
        else if (scope.sortCol === 'testScore') {
          if (a.testScore < b.testScore)
            return 1;
          if (a.testScore > b.testScore)
            return -1;
          return 0;
        }
      }
    }
  }

  intermediateClick(col)
  {
    this.sortCol=col;
    this.sortOrder = "ASC"
    this.filteredEntities.sort(this.sortBasedOnColumn(this))
  }
  select(type) {
    if (type === 'selectAll') {
      // console.log(type,this.selectAll)
      if (this.selectAll) {
        this.selectedStudents = this.entities.map(element => {
          return element._id
        })

        this.entities.forEach(element => {
          element["checked"] = true
        });
      }
      else {
        this.selectedStudents = []
        this.entities.forEach(element => {
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
      type: 5,
      studentId: this.selectedStudents,
      message: this.notificationText
    }

    this.courseService.sendNotification(body).subscribe(res => {

    }, error => {
      console.log(error)
    })
  }
}
