import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service'
import { GlobalService } from '../../../global.service';
import { Router } from '@angular/router';
import { language_desc } from '../../../../assets/config/language_description';
import { constants } from '../../../../assets/config/api_config'

@Component({
  selector: 'app-contest-session',
  templateUrl: './contest-session.component.html',
  styleUrls: ['./contest-session.component.css', '../student-dashboard/student-dashboard.component.css'],
  providers: [SessionService]
})
export class ContestSessionComponent implements OnInit {

  testChallenges
  selectedChallenge;
  options: any = { enableBasicAutocompletion: true, enableLiveAutocompletion: true, showPrintMargin: false };
  languageDesc = language_desc.languages;
  langCode;
  executionResult;
  executing = false;
  // details;
  exapand = false;
  minutes: any;
  seconds = 0;
  intervalId;
  customInput = false;
  customInputText = "";
  tempCustomInputText = "";
  // submissions = [];
  TESTCASE_STATUS = {
    "0": "SUCCESSFUL",
    "1": "SEGMENTATION_FAULT",
    "2": "RUNTIME_ERROR",
    "3": "TIMEOUT",
    "4": "WRONG_ANSWER"
  }
  rowButton = 'add'
  submissionId;
  leaderboard = []
  easy = false
  medium = false
  hard = false
  constructor(private router: Router, private sessionService: SessionService, private globalService: GlobalService) {
    window.onbeforeunload = function (e) {
      var dialogText = 'Are you sure?';
      e.returnValue = dialogText;
      return confirm(dialogText);
    };
    this.getContestChallenges()
  }

  // getContestChallenges()
  // {
  //   this.sessionService.getContestSessionChallenges().subscribe(res=>{

  //   },error=>{
  //     console.log(error)
  //   })
  // }

  getContestChallenges() {
    this.globalService.loader(true)
    this.sessionService.getContestSessionChallenges().subscribe(res => {
      res.documents.forEach(element => {
        element.submissions = []
        if (element.difficulty === 0)
          this.easy = true
        if (element.difficulty === 1)
          this.medium = true
        if (element.difficulty === 2)
          this.hard = true
      });
      this.testChallenges = res
      this.minutes = res.duration
      this.selectedChallenge = this.testChallenges.documents[0]
      this.langCode = this.selectedChallenge.languagesApplicable[0]
      // this.getTestSubmission()
      this.globalService.loader(false)
      this.intervalId = setInterval(() => {
        this.timer();
      }, 1000);
    }, error => {
      console.log(error)
      this.globalService.loader(false)
      if (error.status === 403) {
        alert("You have been already allocated this contest. Please contact support to re-allocate.")
        window.onbeforeunload = null;
        this.router.navigate(['/student-dashboard']);
      }
      clearInterval(this.intervalId)
    })
    // this.intervalId = setInterval(this.timer(),1)      
    // document.getElementsByClassName('ace_print-margin')[0].remove()    

  }

  // getTestSubmission() {
  //   this.testService.getTestSubmissions(this.selectedChallenge._id).subscribe(res => {
  //     this.submissions = res.documents;
  //   }, error => {
  //     console.log(error)
  //   })
  // }

  changeChallenge(challenge) {
    this.executionResult = undefined
    this.selectedChallenge = challenge
  }

  run() {
    this.executionResult = undefined
    this.executing = true;
    let body = {
      code: this.selectedChallenge.initialCode[this.selectedChallenge.languagesApplicable.indexOf(this.langCode)],
      language: this.langCode,
      testcases: (this.customInputText) ? [this.customInputText] : this.selectedChallenge.testcases,
      timeout: this.selectedChallenge.timeout
    }

    this.sessionService.executeContest(body).subscribe(res => {
      // this.selectedChallenge.outputAfterSubmission=res.
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
      code: this.selectedChallenge.initialCode[this.selectedChallenge.languagesApplicable.indexOf(this.langCode)],
      language: this.langCode,
      contestId: this.testChallenges["contestId"],
      challengeId: this.selectedChallenge._id
    }


    this.sessionService.submitContest(body).subscribe(res => {
      if (res.compiled) {
        res.document["code"] = this.selectedChallenge.initialCode[this.selectedChallenge.languagesApplicable.indexOf(this.langCode)]
        res.document["language"] = this.langCode
        this.selectedChallenge.submissions.push(res.document)
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

  timer() {
    if (this.minutes === 0 && this.seconds === 0) {
      clearInterval(this.intervalId)
      alert("Your Time is over.")
      window.onbeforeunload = null
      this.sessionService.endContestSession().subscribe(res => {
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

  stopSession() {
    let confirmation = confirm("Are you sure?")
    if (confirmation) {
      window.onbeforeunload = null
      this.sessionService.endContestSession().subscribe(res => {
        if (res.flag) {
          this.router.navigate(['/student-dashboard']);
        }
      }, error => {
        console.log(error)
      })
    }
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

  getLeaderBoard(challengeId, contestId) {
    this.leaderboard = []
    this.globalService.loader(true)
    this.sessionService.getLeaderboard(challengeId, contestId).subscribe(res => {
      this.leaderboard = Object.values(res.documents)
      this.leaderboard.sort(this.compare)
      this.rankStudent()
      this.globalService.loader(false)
    }, error => {
      console.log(error)
      this.globalService.loader(false)
    })
  }

  compare(a, b) {
    if ((a.score) < (b.score))
      return 1;
    if ((a.score) > (b.score))
      return -1;
    else {
      if ((a.totalExecutionTime) < (b.totalExecutionTime))
        return 1;
      if ((a.totalExecutionTime) > (b.totalExecutionTime))
        return -1;
      else
        return 0
    }
  }

  rankStudent() {
    let rank = 1;

    for (var index = 0; index < this.leaderboard.length; index++) {
      var element = this.leaderboard[index];
      if (index === 0) {
        element.rank = 1;
      }
      else {
        var prevElement = this.leaderboard[index - 1];
        if (((element.score) == (prevElement.score)) && ((element.totalExecutionTime) == (prevElement.totalExecutionTime))) {
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
