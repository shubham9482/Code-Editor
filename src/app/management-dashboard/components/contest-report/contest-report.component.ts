import { Component, OnInit } from '@angular/core';
import { ContestReportService } from "../../services/contest-report.service"
import { GlobalService } from '../../../global.service';
import { language_desc } from '../../../../assets/config/language_description';

@Component({
  selector: 'app-contest-report',
  templateUrl: './contest-report.component.html',
  styleUrls: ['./contest-report.component.css', '../dashboard/dashboard.component.css'],
  providers: [ContestReportService]
})
export class ContestReportComponent implements OnInit {

  challenges = [];
  languageDesc = language_desc;

  performanceCriteria = ["Poor", "Average", "Good", "Very Good", "Excellent"]
  selectedContest = "";
  selectedContestDetails = {
    "allocatedStudents": [],
    "challenges": [],
    "description": "",
    "duration": "",
    "endDate": "",
    "maxScore": 0,
    "name": "",
    "prizes": "",
    "slug": "",
    "startDate": "",
    "_id": "",
  }
  contests = [];
  currentTab = "performanceReportTab";
  currentScreen;

  public doughnutChartLabels: string[] = [];
  public doughnutChartData: number[] = [];
  public doughnutChartType: string = 'pie';
  public doughnutChartColours = [{
    backgroundColor: ['rgba(0,0,255,0.5)', 'rgba(10,100,0,0.5)', 'rgba(0,255,255,0.5)', 'rgba(201, 162,14,0.6)', 'rgba(0,255,0,0.8)', 'rgb(213, 158, 185)']
  }]

  public doughnutChartOptions: any = {
    legend: { position: 'right' },
    tooltips: {
      callbacks: {
        label: function (t, d) {

          let label = d.labels[t.index]

          return label;
        }
      }
    }
  };

  performanceReport = [];

  participatedStudents = 0;

  // programming report
  programmingReport = [];
  mostPreferredLanguage = "";
  leastPreferredLanguage = "";

  //challenge Report
  challengeReport = [];

  public barChartType: String = 'bar';

  //Bar Chart data and options for Wit Ageing
  public barChartData: any[] = [
    // [{ data: [1], label: "label1" },{ data: [2], label: "label1" },{ data: [3], label: "label1" },{ data: [4], label: "label1" },{ data: [5], label: "label1" }],
    // [{ data: [1], label: "label1" },{ data: [2], label: "label1" },{ data: [3], label: "label1" },{ data: [4], label: "label1" },{ data: [5], label: "label1" }],
    // [{ data: [1], label: "label1" },{ data: [2], label: "label1" },{ data: [3], label: "label1" },{ data: [4], label: "label1" },{ data: [5], label: "label1" }],
    // [{ data: [1], label: "label1" },{ data: [2], label: "label1" },{ data: [3], label: "label1" },{ data: [4], label: "label1" },{ data: [5], label: "label1" }]
  ];

  public barChartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true,
    // legend: {position: 'right'},
    scales: {
      xAxes: [{
        barPercentage: 0.6
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          userCallback: function (label, index, labels) {
            // when the floored value is the same as the value we have a whole number
            if (Math.floor(label) === label) {
              return label;
            }

          }
        }
      }]
    }
  };

  public barChartColour = [{ backgroundColor: 'rgba(255,0,0,0.5)' }, { backgroundColor: 'rgba(0,0,255,0.5)' }, { backgroundColor: 'rgba(0,155,0,0.5)' }];
  // public barLabels: any = ["label1","label2","label3","label4","label5"];


  //student report
  studentReport = [];

  //Time Report
  studentDetails = [];
  timeReport = [];

  public lineChartData: Array<any> = [];
  public lineChartLabels: Array<any> = [];

  public lineChartOptions: any = {
    responsive: true,
    scales:
    {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    // },
    // tooltips: {
    //   intersect: true,
    //   mode: 'point',
    //   callbacks: {
    //     label: function (t, d) {

    //       console.log(t,d)
    //       let xlabel = d.labels[t.index]

    //       // return label;
    //     }
    //   }
    }

  };
  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(243, 141, 102,0.4)',
      borderColor: 'rgb(243, 141, 102)',
      pointBackgroundColor: '#fff',
      pointBorderColor: 'rgba(148,159,177,1)',
      pointHoverBackgroundColor: 'rgb(243, 141, 102)',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(255, 230, 129,0.4)',
      borderColor: 'rgb(255, 230, 129)',
      pointBackgroundColor: '#fff',
      pointBorderColor: 'rgba(77,83,96,1)',
      pointHoverBackgroundColor: 'rgb(255, 230, 129)',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];
  public lineChartType: string = 'line';

  constructor(private contestService: ContestReportService, private globalService: GlobalService) {

    this.contestService.getManagementContests().subscribe(res => {
      this.contests = res.documents
    }, error => {
      console.log(error)
    })
  }

  getPerformanceReport() {
    this.currentScreen = "";
    this.contestService.getPerformanceReport(this.selectedContest["_id"]).subscribe(res => {
      this.performanceReport = res.documents;
      let sum = 0
      this.performanceReport.forEach(element => {
        sum += element;
      });
      this.participatedStudents = sum;
      this.performancePiChart();
      this.currentScreen = this.currentTab
      this.globalService.loader(false);
    }, error => {
      console.log(error)
      this.globalService.loader(false);
    })
  }

  performancePiChart() {

    this.doughnutChartData = [];
    this.doughnutChartLabels = [];
    for (var index = 0; index < this.performanceReport.length; index++) {
      var element = this.performanceReport[index];

      this.doughnutChartData.push((element / this.selectedContestDetails.allocatedStudents.length) * 100)
      this.doughnutChartLabels.push(this.performanceCriteria[index] + ":" + this.doughnutChartData[index] + "%")

    }
    this.doughnutChartData.push(((this.selectedContestDetails.allocatedStudents.length - this.participatedStudents) / this.selectedContestDetails.allocatedStudents.length) * 100)
    this.doughnutChartLabels.push("Not Participated:" + this.doughnutChartData[5] + "%")

  }

  getProgrammingReport() {
    this.currentScreen = "";
    this.contestService.getProgrammingReport(this.selectedContest["_id"]).subscribe(res => {
      this.programmingReport = res.documents;
      this.programmingReport.sort(this.compare)
      this.mostPreferredLanguage = this.languageDesc.languages[this.programmingReport[0].key].languageName
      this.leastPreferredLanguage = this.languageDesc.languages[this.programmingReport[this.programmingReport.length - 1].key].languageName
      this.languagePiechart();
      this.currentScreen = this.currentTab
      this.globalService.loader(false);
    }, error => {
      console.log(error)
      this.globalService.loader(false);
    })
  }

  languagePiechart() {
    let programmingChartData = [];
    let programmingChartLabel = [];
    this.doughnutChartData = [];
    this.doughnutChartLabels = [];

    for (var index = 0; index < this.programmingReport.length; index++) {
      var element = this.programmingReport[index];

      programmingChartData[index] = element.y
      programmingChartLabel[index] = this.languageDesc.languages[element.key].languageName + ":" + element.y
    }
    // performanceChartData[5] = ((this.selectedContestDetails.allocatedStudents.length - this.participatedStudents) / this.selectedContestDetails.allocatedStudents.length) * 100
    // performanceChartLabel[5] = "Not Participated:" + performanceChartData[5] + "%"

    this.doughnutChartData = programmingChartData;
    this.doughnutChartLabels = programmingChartLabel;
  }

  getChallengeReport() {
    this.currentScreen = "";
    this.contestService.getPerChallengeReport(this.selectedContest["_id"]).subscribe(res => {
      this.challengeReport = res.documents
      this.challengeBarChart();
      this.currentScreen = this.currentTab
      this.globalService.loader(false);
    }, error => {
      console.log(error)
      this.globalService.loader(false);
    })
  }

  challengeBarChart() {
    this.barChartData = [];

    for (var index = 0; index < this.challengeReport.length; index++) {
      var element = this.challengeReport[index].submissions;
      this.barChartData[index] = []
      this.barChartData[index][0] = { data: [element[0]], label: "Completely solved" }
      this.barChartData[index][1] = { data: [element[1]], label: "Partially solved" }
      this.barChartData[index][2] = { data: [element[2]], label: "Not attempted or zero score" }
    }

  }

  getStudentReport() {
    this.currentScreen = "";
    this.contestService.getStudentWiseReport(this.selectedContest["_id"]).subscribe(res => {
      this.challenges = res.challengeNames
      this.studentReport = res.documents;
      this.studentReport.sort(this.sortStudent)
      this.rankStudent();
      this.currentScreen = this.currentTab;
      this.globalService.loader(false);
    }, error => {
      console.log(error)
      this.globalService.loader(false);
    })
  }

  geTimeReport() {
    this.currentScreen = "";
    this.contestService.getPerChallengeTimeReport(this.selectedContest["_id"]).subscribe(res => {
      this.challenges = res.challengeNames
      this.studentDetails = res.studentNames
      this.timeReport = res.documents
      this.timeLineGraph();
      this.currentScreen = this.currentTab;
      this.globalService.loader(false);
    }, error => {
      console.log(error)
      this.globalService.loader(false);
    })
  }

  timeLineGraph() {

    this.lineChartData = [];
    this.lineChartLabels = []
    for (var index = 0; index < this.timeReport.length; index++) {

      this.lineChartData[index] = [{ data: [], label: 'Total Execution Time' }, { data: [], label: 'Score' }]
      this.lineChartLabels[index] = [];
      var element = this.timeReport[index];

      for (var index1 = 0; index1 < element.length; index1++) {
        var element1 = element[index1];
        this.lineChartData[index][0].data.push(element1.score)
        this.lineChartData[index][1].data.push(element1.totalExecutionTime)
        this.lineChartLabels[index].push(this.studentDetails[element1.studentId].rollNo + " " + this.studentDetails[element1.studentId].firstName + " " + this.studentDetails[element1.studentId].lastName)
      }

    }
    
  }

  getContestDetails() {
    if (this.selectedContest) {
      this.contestService.getManagementContestDetails(this.selectedContest["_id"]).subscribe(res => {
        this.selectedContestDetails = res.document;
        this.selectedContestDetails.startDate = res.document.startDate.split("T")[0] + " " + res.document.startDate.split("T")[1]
        this.selectedContestDetails.endDate = res.document.endDate.split("T")[0] + " " + res.document.endDate.split("T")[1]
        this.getReport();
      }, error => {
        console.log(error)
      })
    }
    else {
      this.reset();
    }
  }

  getReport() {
    if (this.selectedContest) {
      this.globalService.loader(true);
      if (this.currentTab === 'performanceReportTab')
        this.getPerformanceReport()
      else if (this.currentTab === 'programmingReportTab')
        this.getProgrammingReport()
      else if (this.currentTab === 'challengeReportTab')
        this.getChallengeReport()
      else if (this.currentTab === 'studentReportTab')
        this.getStudentReport()
      else if (this.currentTab === 'timeReportTab')
        this.geTimeReport()

    }
    else {
      this.reset()
    }
  }

  tabClicked(tab) {
    this.currentTab = tab;
    this.getReport();
  }

  reset() {
    this.selectedContestDetails = {
      "allocatedStudents": [],
      "challenges": [],
      "description": "",
      "duration": "",
      "endDate": "",
      "maxScore": 0,
      "name": "",
      "prizes": "",
      "slug": "",
      "startDate": "",
      "_id": "",
    }

    // this.currentTab="performanceReportTab",
    this.currentScreen = "";
  }

  compare(a, b) {
    if (a.y < b.y)
      return 1;
    if (a.y > b.y)
      return -1;
    return 0;
  }

  sortStudent(a, b) {
    if (a.submittedContests[0].score < b.submittedContests[0].score)
      return 1;
    if (a.submittedContests[0].score > b.submittedContests[0].score)
      return -1;
    if (a.submittedContests[0].executionTime < b.submittedContests[0].executionTime)
      return 1;
    if (a.submittedContests[0].executionTime > b.submittedContests[0].executionTime)
      return -1;
    return 0;
  }

  rankStudent() {
    let rank = 1;

    for (var index = 0; index < this.studentReport.length; index++) {
      var element = this.studentReport[index];
      if (index === 0) {
        element.rank = 1;
      }
      else {
        var prevElement = this.studentReport[index - 1];
        if ((element.submittedContests[0].score == prevElement.submittedContests[0].score) && (element.submittedContests[0].executionTime == prevElement.submittedContests[0].executionTime)) {
          element.rank = rank;
        }
        else {
          element.rank = rank + 1;
          rank += 1;
        }
      }
    }
  }

  getKeys(obj)
  {
    return Object.keys(obj)
  }

  ngOnInit() {
  }

}
