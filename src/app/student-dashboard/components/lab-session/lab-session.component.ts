import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service'
import { GlobalService } from '../../../global.service';
import { Router } from '@angular/router';
import { language_desc } from '../../../../assets/config/language_description';
import { constants } from '../../../../assets/config/api_config'

@Component({
  selector: 'app-lab-session',
  templateUrl: './lab-session.component.html',
  styleUrls: ['./lab-session.component.css', '../student-dashboard/student-dashboard.component.css'],
  providers: [SessionService]
})
export class LabSessionComponent implements OnInit {

  labContent;
  selectedWeek;
  langCode;
  languageDesc = language_desc.languages;
  weekCode;
  customInput = false;
  customInputText = "";
  tempCustomInputText = "";
  executionResult;
  executing = false;
  minutes: any;
  seconds = 0;
  intervalId
  exapand = false;
  TESTCASE_STATUS = {
    "0": "SUCCESSFUL",
    "1": "SEGMENTATION_FAULT",
    "2": "RUNTIME_ERROR",
    "3": "TIMEOUT",
    "4": "WRONG_ANSWER"
  }
  rowButton = 'add'
  submissionId;
  options: any = { enableBasicAutocompletion: true, enableLiveAutocompletion: true, showPrintMargin: false };
  submissions = []
  constructor(private router: Router, private sessionService: SessionService, private globalService: GlobalService) {
    window.onbeforeunload = function (e) {
      var dialogText = 'Are you sure?';
      e.returnValue = dialogText;
      return confirm(dialogText);
    };
    this.getLabContent()
  }

  getLabContent() {
    this.globalService.loader(true)
    this.sessionService.getLabContent().subscribe(res => {

      res.weeks.forEach(element => {
        element.weekCode = ""
      });
      this.labContent = res
      this.selectedWeek = this.labContent.weeks[0]
      this.langCode = this.labContent.languagesApplicable[0]
      this.minutes = res.duration
      this.globalService.loader(false)
      this.getLabSubmission()
      this.intervalId = setInterval(() => {
        this.timer();
      }, 1000);
      this.globalService.loader(false)
    }, error => {
      console.log(error)
      this.globalService.loader(false)
      if (error.status === 403) {
        alert("You have been already allocated this lab session. Please contact support to re-allocate.")
        window.onbeforeunload = null;
        this.router.navigate(['/student-dashboard']);
      }
      clearInterval(this.intervalId)
    })
  }

  getLabSubmission() {
    this.sessionService.getLabSubmissions(this.labContent.labId, this.selectedWeek.number).subscribe(res => {
      this.submissions = res.documents;
    }, error => {
      console.log(error)
    })
  }

  run() {
    this.executionResult = undefined
    this.executing = true;
    let body = {
      code: this.selectedWeek.weekCode,
      language: this.langCode,
      testcases: (this.customInputText) ? [this.customInputText] : [],
      timeout: 5000
    }

    this.sessionService.executeLab(body).subscribe(res => {
      // this.selectedChallenge.outputAfterSubmission=res.
      this.executionResult = res.document || res
      this.executing = false;
      this.tempCustomInputText=this.customInputText
    }, error => {
      console.log(error)
    })
  }

  changeWeek(week) {
    this.executionResult = undefined
    this.selectedWeek = week
    this.getLabSubmission()
  }

  stopSession() {
    let confirmation = confirm("Are you sure?")
    if (confirmation) {
      window.onbeforeunload = null
      this.sessionService.endLabSession().subscribe(res => {
        if (res.flag) {
          this.router.navigate(['/student-dashboard']);
        }
      }, error => {
        console.log(error)
      })
    }
  }

  addRow(index, submission) {

    if (document.getElementById("addedRow") != null) {
      let rowElement = document.getElementById("addedRow");
      rowElement.parentNode.removeChild(rowElement);
    }
    var table: HTMLTableElement = <HTMLTableElement>document.getElementById("submissionTable");
    var row = table.insertRow(index + 2)
    row.id = "addedRow"
    var cell = row.insertCell(0)
    cell.colSpan = 5
    cell.innerHTML = "TESTCASE STATUS<br>"
    for (var i = 0; i < submission.status.length; i++) {
      var element = this.TESTCASE_STATUS[submission.status[i].toString()];
      cell.innerHTML += "Testcase " + (i + 1) + " : " + element + "<br>"

    }
    this.rowButton = 'remove'
    this.submissionId = submission._id
  }

  removeRow(index) {
    var table: HTMLTableElement = <HTMLTableElement>document.getElementById("submissionTable");
    table.deleteRow(index + 2)
    this.rowButton = 'add'
    // var cell = row.insertCell(0)
    // cell.colSpan = 5
    // cell.innerHTML = "TESTCASE STATUS<br>"
    // for (var i = 0; i < submission.status.length; i++) {
    //   var element = this.TESTCASE_STATUS[submission.status[i].toString()];
    //   cell.innerHTML += "Testcase " + i + " : " + element + "<br>"

    // }
  }

  expandMid() {
    if (this.exapand) {
      document.getElementById("midPanel").style.width = "40%"
      document.getElementById("leftPanel").style.width = "30%"
      document.getElementById("rightPanel").style.width = "30%"
    }
    else if (!this.exapand) {
      document.getElementById("midPanel").style.width = "100%"
      document.getElementById("leftPanel").style.width = "0%"
      document.getElementById("rightPanel").style.width = "0%"
    }
    this.exapand = !this.exapand
  }

  submit() {
    this.executionResult = undefined
    let body = {
      code: this.selectedWeek.weekCode,
      number: this.selectedWeek.number,
      language: this.langCode
    }

    if (this.selectedWeek.flag) {
      this.sessionService.submitLab(body).subscribe(res => {
        if (res.submitted) {
          res["code"] = this.selectedWeek.weekCode
          res["language"] = this.langCode
          this.submissions.push(res)
        }
      }, error => {
        console.log(error)
      })
    }

  }

  timer() {
    if (this.minutes === 0 && this.seconds === 0) {
      clearInterval(this.intervalId)
      alert("Your Time is over.")
      window.onbeforeunload = null
      this.sessionService.endLabSession().subscribe(res => {
        if (res.flag) {
          this.router.navigate(['/student-dashboard']);
        }
      }, error => {
        console.log(error)
      })
    }
    else if (this.seconds === 0) {
      // if (this.minutes === 180) {
      //   this.minutes -= 1
      // }
      this.seconds = 59
      this.minutes -= 1

    }
    else {
      // if (this.seconds - 1 === 0)
      //   this.minutes -= 1

      this.seconds -= 1;
      // this.minutes-=1
    }
  }

  ngOnInit() {
  }

}
