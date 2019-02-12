import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../services/exam.service'
import { GlobalService } from '../../../global.service';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css', '../student-dashboard/student-dashboard.component.css'],
  providers: [ExamService]
})
export class ExamsComponent implements OnInit {

  currentTab = "upcoming";
  upcomingExams;
  completedExams;
  examId = '';
  showExams = true;
  reviewedExam;
  examReviewDetails;
  selectedQuestion;
  selectedQuestionIndex;
  reviewResult;
  yourAnswer;
  correctAnswer;
  constructor(private examService: ExamService, private globalService: GlobalService) {

    this.getUpcomingExamData()
  }

  getUpcomingExamData() {
    this.globalService.loader(true)
    this.examService.getUpcomingExams().subscribe(res => {
      this.upcomingExams = res.examDetails
      this.globalService.loader(false)
    }, error => {
      this.globalService.loader(false)
      console.log(error)
    })
  }

  getCompletedExamData(examId) {
    this.globalService.loader(true)
    this.examService.getCompletedExams(examId).subscribe(res => {
      this.completedExams = res.examDetails
      this.globalService.loader(false)
    }, error => {
      console.log(error)
      this.globalService.loader(false)
    })
  }

  getCompletedExamDataWithId(examId) {
    this.globalService.loader(true)
    this.examService.getCompletedExams(examId).subscribe(res => {

      res.examDetails.forEach(element => {
        if (res.studentSubmission.length === 0) {
          element["attempt"] = "unattempted"
        }
        else{
          for (var index = 0; index < res.studentSubmission.length; index++) {
            var element2 = res.studentSubmission[index];
  
            if (element2._id === element._id) {
              element["attempt"] = "attempted"
              break
            }
  
            if (index === res.studentSubmission.length - 1) {
              element["attempt"] = "unattempted"
            }
          }
        }
      });
      this.examReviewDetails = res
      this.selectedQuestion = this.examReviewDetails.examDetails[0]
      this.selectedQuestionIndex = 0
      this.globalService.loader(false)
      this.showExams = false
    }, error => {
      console.log(error)
      this.globalService.loader(false)
    })
  }

  tabClicked(tab) {
    this.currentTab = tab
    this.examId = ''

    if (this.currentTab === 'upcoming') {
      this.getUpcomingExamData();
    }
    else if (this.currentTab === 'completed') {
      this.showExams = true;
      this.getCompletedExamData(this.examId)
    }
  }

  reviewExam(exam) {
    this.reviewedExam = exam
    this.examId = this.reviewedExam._id;
    this.getCompletedExamDataWithId(this.examId);
  }

  reviewQuestion() {
    if (this.examReviewDetails.studentSubmission.length === 0) {
      this.reviewResult = "unAttempted"
    }
    else {
      for (var index = 0; index < this.examReviewDetails.studentSubmission.length; index++) {
        var element = this.examReviewDetails.studentSubmission[index];

        if (element._id === this.selectedQuestion._id) {
          this.reviewResult = this.checkOptions(element.answer, this.selectedQuestion.ans)
          this.getAnswer(element.answer, this.selectedQuestion.ans)
          break
        }

        if (index === this.examReviewDetails.studentSubmission.length - 1) {
          this.reviewResult = "unAttempted"
        }
      }
    }
  }

  checkOptions(submissionAns, correctAns) {
    for (var index = 0; index < submissionAns.length; index++) {
      var element = submissionAns[index];

      if (element != correctAns[index]) {
        return "wrong"
      }

      if (index === submissionAns.length - 1) {
        return "correct"
      }
    }
  }

  getAnswer(submissionAns, correctAns) {
    this.yourAnswer = "";
    this.correctAnswer = ""
    debugger
    for (var index = 0; index < submissionAns.length; index++) {
      var element = submissionAns[index];

      if (element === true) {
        if (this.yourAnswer != "")
          this.yourAnswer += "\n"

        this.yourAnswer += (index + 1) + ". " + this.selectedQuestion.options[index]
      }

    }

    for (var index = 0; index < correctAns.length; index++) {
      var element = correctAns[index];

      if (element === true) {
        if (this.correctAnswer != "")
          this.correctAnswer += "\n"

        this.correctAnswer += (index + 1) + ". " + this.selectedQuestion.options[index]
      }

    }
  }

  ngOnInit() {
  }

}
