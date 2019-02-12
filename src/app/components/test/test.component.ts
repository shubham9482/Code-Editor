import { Component, OnInit, OnDestroy,ViewChild,AfterViewInit } from '@angular/core';
import { CoursesService } from '../../services/courses.service'
import { GlobalService } from '../../global.service'
import { language_desc } from '../../../assets/config/language_description';
import { ActivatedRoute, Router } from '@angular/router';
import { constants } from '../../../assets/config/api_config'

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css', '../../admin-dashboard/admin-dashboard/admin-dashboard.component.css'],
  providers: [CoursesService]
})
export class TestComponent implements OnInit, OnDestroy, AfterViewInit{

  @ViewChild('editor') editor;
  testChallenges = []
  selectedChallenge;
  options: any = { enableBasicAutocompletion: false, enableLiveAutocompletion: false, showPrintMargin: false };
  languageDesc = language_desc.languages;
  langCode;
  executionResult;
  executing = false;
  details;
  exapand = false;
  minutes: any = constants.TEST_TIME;
  seconds = 0;
  intervalId;
  customInput = false;
  customInputText = "";
  tempCustomInputText=""
  submissions = [];
  TESTCASE_STATUS = {
    "0": "SUCCESSFUL",
    "1": "SEGMENTATION_FAULT",
    "2": "RUNTIME_ERROR",
    "3": "TIMEOUT",
    "4": "WRONG_ANSWER"
  }
  rowButton = 'add'
  submissionId;
  // @ViewChild('submissionTable') submissionTable: HTMLTableElement;
  constructor(private route: ActivatedRoute, private router: Router, private testService: CoursesService, private globalService: GlobalService) {


    // document.getElementById("headernav").style.display="none";
    // document.getElementById("footer").style.display="none";

    // this.details = this.globalService.details

    this.route.queryParamMap.subscribe(map => {
      this.details = map['params']
      this.submissions = []
      if (this.details != undefined && this.details.type === 'practice') {
        this.getPracticeTest()
      }
      else if (this.details != undefined && this.details.type === 'test') {
        window.onbeforeunload = function (e) {
          var dialogText = 'Are you sure?';
          e.returnValue = dialogText;
          return confirm(dialogText);
        };
        this.getTest()
      }
      else {
        window.onbeforeunload = null;
        alert("Please choose the course/module")
        if (this.globalService.roleType === 1) {
          this.router.navigate(['/student-dashboard']);
        }
        else if (this.globalService.roleType === 3) {
          this.router.navigate(['/faculty-dashboard']);
        }
      }
    });
  }

  getTest() {
    this.globalService.loader(true)
    this.testService.getTestChallenges(this.details.courseId).subscribe(res => {

      this.testChallenges = res.documents
      this.selectedChallenge = this.testChallenges[0]
      this.langCode = this.selectedChallenge.languagesApplicable[0]
      this.getTestSubmission()
      this.globalService.loader(false)
      this.intervalId = setInterval(() => {
        this.timer();
      }, 1000);
    }, error => {
      console.log(error)
      this.globalService.loader(false)
      if (error.status === 403) {
        alert("You have been already allocated this test. Please contact support to re-allocate.")
        window.onbeforeunload = null;
        this.router.navigate(['/courses'], { queryParams: { 'courseId': this.details.courseId } });
      }
    })
    // this.intervalId = setInterval(this.timer(),1)      
    // document.getElementsByClassName('ace_print-margin')[0].remove()    

  }

  getPracticeTest() {
    this.globalService.loader(true)
    this.testService.getPracticeChallenges(this.details.courseId, this.details.moduleId).subscribe(res => {

      this.testChallenges = res.documents
      this.selectedChallenge = this.testChallenges[0]
      this.langCode = this.selectedChallenge.languagesApplicable[0]
      this.getPracticeSubmission()
      this.globalService.loader(false)
      // this.intervalId = setInterval(() => {
      //   this.timer();
      // }, 1000);
    }, error => {
      console.log(error)
      this.globalService.loader(false)
    })
    // document.getElementsByClassName('ace_print-margin')[0].remove()    

  }

  getTestSubmission() {
    this.testService.getTestSubmissions(this.selectedChallenge._id).subscribe(res => {
      this.submissions = res.documents;
    }, error => {
      console.log(error)
    })
  }

  getPracticeSubmission() {
    this.testService.getPracticeSubmissions(this.selectedChallenge._id).subscribe(res => {
      this.submissions = res.documents;
    }, error => {
      console.log(error)
    })
  }

  changeChallenge(challenge) {
    this.executionResult = undefined
    this.selectedChallenge = challenge
    if (this.details != undefined && this.details.type === 'practice') {
      this.getPracticeSubmission()
    }
    else if (this.details != undefined && this.details.type === 'test') {
      this.getTestSubmission()
    }
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

    this.testService.execute(body).subscribe(res => {
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
      courseId: this.details.courseId,
      moduleId: this.details.moduleId,
      challengeId: this.selectedChallenge._id,
    }

    if (this.details.type === 'practice') {
      this.testService.practiceSubmit(body).subscribe(res => {
        if (res.compiled) {
          res.document["code"] = this.selectedChallenge.initialCode[this.selectedChallenge.languagesApplicable.indexOf(this.langCode)]
          res.document["language"] = this.langCode
          this.submissions.push(res.document)
        }
      }, error => {
        console.log(error)
      })
    }
    else if (this.details.type === 'test') {
      this.testService.testSubmit(body).subscribe(res => {
        if (res.compiled) {
          res.document["code"] = this.selectedChallenge.initialCode[this.selectedChallenge.languagesApplicable.indexOf(this.langCode)]
          res.document["language"] = this.langCode
          this.submissions.push(res.document)
        }
      }, error => {
        console.log(error)
      })
    }
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
      alert("Your Time is over. Press Click Ok to Submit")
      this.unlock()
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

  unlock() {
    this.testService.unlockModule(this.details.courseId).subscribe(res => {
      if (res.flag) {
        alert("Congratulations!! You passed the test.")
      }
      else {
        alert("You did not pass the test. Try again")
      }
      window.onbeforeunload = null;
      this.router.navigate(['/courses'], { queryParams: { 'courseId': this.details.courseId } });
      // this.globalService.testWindow.opener.location.reload();
      // this.globalService.testWindow.close()
      // this.globalService.navigateTocourses(this.details.courseId);
    }, error => {
      console.log(error)
    })
  }

  back()
  {
    this.router.navigate(['/courses'], { queryParams: { 'courseId': this.details.courseId } });
  }

  ngAfterViewInit()
  {
    // console.log(this.editor)
    // this.editor._editor.commands.on("exec", (e)=> { 
    //   var rowCol = this.editor._editor.selection.getCursor();
    //   if ((rowCol.row == 0)) {
    //     e.preventDefault();
    //     e.stopPropagation();
    //   }
    // });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
