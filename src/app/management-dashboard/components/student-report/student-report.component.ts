import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../global.service';
import { StudentReportService } from "../../services/student-report.service"
import { getConstant } from '../../../../assets/config/constants';
import { language_desc } from '../../../../assets/config/language_description';

@Component({
  selector: 'app-student-report',
  templateUrl: './student-report.component.html',
  styleUrls: ['./student-report.component.css', '../dashboard/dashboard.component.css'],
  providers: [StudentReportService]
})
export class StudentReportComponent implements OnInit {

  studentDetails = {}
  getConstant = getConstant;
  langDesc = language_desc
  currentTab = 'contestReportTab';
  currentScreen = 'contestReportTab'
  rollNo = "";

  contestReport = {
    "upcomingContestDetails": {},
    "ongoingContestDetails": {},
    "submittedContestDetails": {}
  };
  contestReportOnId = {};
  selectedContestId;
  showContestOnId = false;

  //
  showCourseOnId = false;
  selectedCourseId;
  courseReport = {};
  courseReportOnId = {};

  //
  practiceReport = {
    "documents": []
  }

  //
  examReport = {}

  //
  labReport = [];
  selectedLab;
  labs = []
  studentWiseReport;
  submissionReport;
  selectedReport={submissionId:undefined};
  constructor(private globalService: GlobalService, private studentReportService: StudentReportService) { }

  submitRoll() {
    if (this.rollNo) {
      this.globalService.loader(true);
      this.studentDetails = {}
      this.studentReportService.getStudentDetails(this.rollNo).subscribe(res => {
        this.studentDetails = res.document;
        this.getLabs();
        this.getReport()
      }, error => {
        console.log(error)
      })
    }
  }

  getLabs() {
    this.studentReportService.getStudentLabs(this.studentDetails["_id"]).subscribe(res => {
      this.labs = res.documents
      this.currentScreen = this.currentTab
    }, error => {
      console.log(error)
    })
  }

  getReport() {
    this.currentScreen = ""
    if (this.rollNo) {
      this.globalService.loader(true);
      if (this.currentTab === 'contestReportTab') {
        this.selectedContestId = ""
        this.getContestReport()
      }
      else if (this.currentTab === 'courseReportTab') {
        this.selectedCourseId = ""
        this.getCourseReport()
      }
      else if (this.currentTab === 'practiceReportTab')
        this.getPracticeReport()
      else if (this.currentTab === 'labReportTab')
        this.getLabReport()
      else if (this.currentTab === 'examReportTab')
        this.getExamReport()
    }
  }

  getContestReport() {
    // this.showContestOnId=false;

    this.contestReportOnId = {}
    let body = { "rollNo": this.rollNo }
    if (this.selectedContestId) {
      body["contestId"] = this.selectedContestId
    }
    this.studentReportService.getContestReport(body).subscribe(res => {

      if (this.selectedContestId) {
        this.contestReportOnId = res
        this.showContestOnId = true;
      }
      else {
        this.contestReport = res
        this.showContestOnId = false;
      }
      // this.contestReport={
      //   "upcomingContestDetails":
      //   {
      //     "5b1589ed627c0c576e01e150":
      //     {
      //       "name":"New Exam",
      //       "startDate":"2018-05-23T03:45:00.000Z",
      //       "endDate":"2018-05-24T18:15:00.000Z"
      //     },
      //     "5b1589ed627c0c576e01e151":
      //     {
      //       "name":"New Exam",
      //       "startDate":"2018-05-23T03:45:00.000Z",
      //       "endDate":"2018-05-24T18:15:00.000Z"
      //     }
      //   },
      //   "ongoingContestDetails":{
      //     "5b1589ed627c0c576e01e150":
      //     {
      //       "name":"New Exam",
      //       "startDate":"2018-05-23T03:45:00.000Z",
      //       "endDate":"2018-05-24T18:15:00.000Z"
      //     }
      //   },
      //   "submittedContestDetails":
      //   {
      //     "5b1589ed627c0c576e01e150":
      //     {
      //       "name":"New Exam",
      //       "startDate":"2018-05-23T03:45:00.000Z",
      //       "endDate":"2018-05-24T18:15:00.000Z"
      //     }
      //   }
      // }
      this.currentScreen = this.currentTab
      this.globalService.loader(false);
    }, error => {
      console.log(error)
      this.globalService.loader(false);
    })
  }

  getCourseReport() {

    this.showCourseOnId = false;
    this.courseReport = {}
    this.courseReportOnId = {}
    let body = { "rollNo": this.rollNo }
    if (this.selectedCourseId) {
      body["courseId"] = this.selectedCourseId
    }
    this.studentReportService.getCourseReport(body).subscribe(res => {

      if (this.selectedCourseId) {
        this.courseReportOnId = res
        this.showCourseOnId = true;
      }
      else
        this.courseReport = res

      this.currentScreen = this.currentTab
      this.globalService.loader(false);
    }, error => {
      console.log(error)
      this.globalService.loader(false);
    })
  }

  getPracticeReport() {
    this.practiceReport = { "documents": [] }
    let body = { "rollNo": this.rollNo }
    this.studentReportService.getPracticeReport(body).subscribe(res => {
      this.practiceReport = res;
      this.currentScreen = this.currentTab
      this.globalService.loader(false);
    }, error => {
      console.log(error)
      this.globalService.loader(false);
    })
  }

  getLabReport() {
    this.studentWiseReport = []
    if (this.selectedLab) {
      let body = {
        studentId: this.studentDetails["_id"],
        labId: this.selectedLab._id
      }

      this.studentReportService.getStudentLabReport(body).subscribe(res => {

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
        this.currentScreen = this.currentTab
        this.globalService.loader(false);
      }, error => {
        console.log(error)
        this.globalService.loader(false);
      })
    }
    else {
      this.currentScreen = this.currentTab
      this.globalService.loader(false);
    }
  }

  getLabSubmission(report) {
    this.selectedReport = report
    if (this.selectedReport["submissionId"]) {
      let body = {
        labId: this.selectedLab._id,
        // studentId: this.studentDetails["_id"],
        submissionId: report.submissionId
      }

      this.studentReportService.getStudentLabReport(body).subscribe(res => {
        this.submissionReport = res.document
      }, error => {
        console.log(error)
      })
    }
  }

  getExamReport() {
    this.examReport = {}
    let body = { "rollNo": this.rollNo }
    this.studentReportService.getExamReport(body).subscribe(res => {
      for (var index = 0; index < res.examSubmissions.length; index++) {
        var element = res.examSubmissions[index];

        for (var i = 0; i < res.examDetails.length; i++) {
          var element2 = res.examDetails[i];

          if (element2._id === element.examId) {
            element2["attemptedQuestions"] = element.answers.length
            element2["score"] = element.score
            break;
          }
        }
      }
      this.examReport = res.examDetails;
      this.currentScreen = this.currentTab
      this.globalService.loader(false);
    }, error => {
      console.log(error)
      this.globalService.loader(false);
    })
  }

  tabClicked(tab) {
    this.currentTab = tab;
    this.getReport();
  }

  getKeys(array): Array<String> {
    if (array)
      return Object.keys(array)

    else return
  }

  getContestDetails(id) {
    this.selectedContestId = id;
    this.getContestReport()
  }

  getCourseDetails(id) {
    this.selectedCourseId = id;
    this.getCourseReport()
  }

  ngOnInit() {
  }

}
