import { Component, OnInit, OnDestroy } from '@angular/core';
import { PracticeService } from '../../services/practice.service'
import { GlobalService } from '../../../global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { language_desc } from '../../../../assets/config/language_description';

@Component({
  selector: 'app-practice-session',
  templateUrl: './practice-session.component.html',
  styleUrls: ['./practice-session.component.css', '../student-dashboard/student-dashboard.component.css'],
  providers: [PracticeService]
})
export class PracticeSessionComponent implements OnInit, OnDestroy {

  details;
  submissions = []
  challenge;

  options: any = { enableBasicAutocompletion: true, enableLiveAutocompletion: true, showPrintMargin: false };
  languageDesc = language_desc.languages;
  langCode;
  executionResult;
  executing = false;
  exapand = false;
  // minutes: any = constants.TEST_TIME;
  // seconds = 0;
  // intervalId;
  customInput = false;
  customInputText = "";
  tempCustomInputText = "";
  TESTCASE_STATUS = {
    "0": "SUCCESSFUL",
    "1": "SEGMENTATION_FAULT",
    "2": "RUNTIME_ERROR",
    "3": "TIMEOUT",
    "4": "WRONG_ANSWER"
  }
  rowButton = 'add'
  submissionId;
  
  constructor(private router: Router, private route: ActivatedRoute, private practiceService: PracticeService, private globalService: GlobalService) {

    this.route.queryParamMap.subscribe(map => {
      this.details = map['params']
      if (this.details != undefined && this.details.challengeId) {
        this.getPracticeChallenge()
      }
      else {
        window.onbeforeunload = null;
        alert("Please choose the Challenge")
        this.router.navigate(['/student-dashboard/practice']);
      }
    });
  }

  getPracticeChallenge() {
    this.globalService.loader(true)
    this.practiceService.getChallenge(this.details.challengeId).subscribe(res => {
      this.challenge = res.document
      this.langCode = this.challenge.languagesApplicable[0]
      this.getChallengeSubmission()
      this.globalService.loader(false)
      // this.intervalId = setInterval(() => {
      //   this.timer();
      // }, 1000);
    }, error => {
      console.log(error)
      this.globalService.loader(false)
    })
  }

  getChallengeSubmission() {
    this.practiceService.getSubmissions(this.details.challengeId, '').subscribe(res => {
      this.submissions = res.documents;
    }, error => {
      console.log(error)
    })
  }

  run() {
    this.executionResult = undefined
    this.executing = true;
    let body = {
      code: this.challenge.initialCode[this.challenge.languagesApplicable.indexOf(this.langCode)],
      language: this.langCode,
      testcases: (this.customInputText) ? [this.customInputText] : this.challenge.testcases,
      timeout: this.challenge.timeout
    }

    this.practiceService.executePractice(body).subscribe(res => {
      // this.challenge.outputAfterSubmission=res.
      this.executionResult = res.document || res
      this.executing = false;
      this.tempCustomInputText=this.customInputText
    }, error => {
      console.log(error)
    })
  }

  submit() {
    this.executionResult = undefined
    let body = {
      code: this.challenge.initialCode[this.challenge.languagesApplicable.indexOf(this.langCode)],
      language: this.langCode,
      challengeId: this.challenge._id,
    }

    this.practiceService.submitPractice(body).subscribe(res => {
      if (res.compiled) {
        res.document["code"] = this.challenge.initialCode[this.challenge.languagesApplicable.indexOf(this.langCode)]
        res.document["language"] = this.langCode
        this.submissions.push(res.document)
      }
    }, error => {
      console.log(error)
    })

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

  back()
  {
    this.router.navigate(['/student-dashboard/practice']);
  }

  ngOnDestroy() {
    // if (this.intervalId) {
    //   clearInterval(this.intervalId);
    // }
  }

  ngOnInit() {
  }

}
