import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionService } from '../../services/session.service'
import { GlobalService } from '../../../global.service';
// import { constants } from '../../../../assets/config/api_config'
import { Router } from '@angular/router';

@Component({
  selector: 'app-exam-session',
  templateUrl: './exam-session.component.html',
  styleUrls: ['./exam-session.component.css', '../student-dashboard/student-dashboard.component.css'],
  providers: [SessionService]
})
export class ExamSessionComponent implements OnInit, OnDestroy {

  intervalId;
  minutes: any;
  seconds = 0;
  questions;
  selectedQuestion
  selectedQuestionIndex
  constructor(private router: Router, private sessionService: SessionService, private globalService: GlobalService) {
    window.onbeforeunload = function (e) {
      var dialogText = 'Are you sure?';
      e.returnValue = dialogText;
      return confirm(dialogText);
    };
    this.getExamQuestions()
  }

  getExamQuestions() {
    this.sessionService.getExamQuestions().subscribe(res => {
      res.documents.forEach(element => {
        element["answers"] = new Array(element.options.length).fill(false)
      });
      this.questions = res
      this.selectedQuestion = this.questions.documents[0]
      this.selectedQuestionIndex = 0
      this.minutes = this.questions.duration
      this.intervalId = setInterval(() => {
        this.timer();
      }, 1000);
    }, error => {
      console.log(error)
      if (error.status === 403) {
        alert("Unauthoried")
        window.onbeforeunload = null;
        this.router.navigate(['/student-dashboard']);
      }
      else
        alert("Error!")
    })

    // this.questions = {
    //   flag: true,
    //   documents: [
    //     { question: "question 1", _id: "id1", options: ["option1", "option2", "option3", "option4"], tag: "tag1", type: "type1" },
    //     { question: "question 2", _id: "id2", options: ["option5", "option4", "option2", "option100"], tag: "tag1", type: "type1" },
    //     { question: "question 3", _id: "id3", options: ["option6", "option9", "option0", "option10"], tag: "tag1", type: "type1" },
    //     { question: "question 4", _id: "id4", options: ["option7", "option6", "option11", "option12"], tag: "tag1", type: "type1" },
    //     { question: "question 5", _id: "id5", options: ["option8", "option15", "option14", "option13"], tag: "tag1", type: "type1" }
    //   ],
    //   examName: "Exam 1",
    //   duration: 200
    // }

    // this.questions.documents.forEach(element => {
    //   element["answers"] = new Array(element.options.length).fill(false)
    // });

    // debugger
    // this.selectedQuestion = this.questions.documents[0]
    // this.selectedQuestionIndex = 0
    // this.minutes = this.questions.duration
    // this.intervalId = setInterval(() => {
    //   this.timer();
    // }, 1000);
  }

  timer() {
    if (this.minutes === 0 && this.seconds === 0) {
      clearInterval(this.intervalId)
      alert("Your Time is over. Press Click Ok to Submit")
      this.submit()
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

  submit() {
    var answersArray = this.questions.documents.map(e => {
      return { _id: e._id, answer: e.answers }
    })

    this.sessionService.submitExam(answersArray).subscribe(res => {
      alert("Your score is : " + res.score)
      window.onbeforeunload = null;
      this.router.navigate(['/student-dashboard'])
    }, error => [
      console.log(error)
    ])
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
