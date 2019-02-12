import { Component, OnInit } from '@angular/core';
import { ExamReportService } from "../../services/exam-report.service"
import { GlobalService } from '../../../global.service';
import { CourseReportService } from "../../services/course-report.service"

@Component({
  selector: 'app-exam-report',
  templateUrl: './exam-report.component.html',
  styleUrls: ['./exam-report.component.css', '../dashboard/dashboard.component.css'],
  providers: [ExamReportService, CourseReportService]
})
export class ExamReportComponent implements OnInit {

  selectedExam = "";
  exams = [];
  examDetails = {"name":"", "startDate":"", "endDate":"", "numberOfStudentsParticipated":"","allocatedFaculty":[]};
  entities = [];
  filteredEntities = [];
  filterCondition = "";
  departments = []
  rollNo = "";
  years = [];
  deptSelected = false;
  yearSelected = false;
  selectedDept = [];
  selectedYears = [];
  sortOrder;
  constructor(private examService: ExamReportService, private globalService: GlobalService, private courseService: CourseReportService) {
    this.getEntities()
  }

  getEntities() {

    this.examService.getExams().subscribe(res => {
      this.exams = res.documents
    }, error => {
      console.log(error)
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

  examChange() {

    if (this.selectedExam) {
      this.filteredEntities = [];
      this.globalService.loader(true)
      this.examService.getExamDetail(this.selectedExam["_id"]).subscribe(res => {

        this.examDetails = res.examDetails
        this.entities = res.studentDetail
        
        this.entities.forEach(element => {
          // element.testScore = element.completedModuleNumber * 10
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

  resetFilters() {
    this.selectedDept = [];
    this.selectedYears = [];
    // this.entities = [];
    this.deptSelected = false;
    this.yearSelected = false;
    this.rollNo = "";
    this.filterCondition = "";
    this.filteredEntities = []
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

  compare(a, b) {
    if ((a.score) < (b.score))
      return 1;
    if ((a.score) > (b.score))
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
        if (((element.score) == (prevElement.score))) {
          element.rank = rank;
        }
        else {
          element.rank = rank + 1;
          rank += 1;
        }
      }
    }
  }

  

  ngOnInit() {
  }

}
