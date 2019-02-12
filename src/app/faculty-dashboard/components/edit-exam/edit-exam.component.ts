import { Component, OnInit } from '@angular/core';
import { EditExamService } from '../../services/edit-exam.service'
import { GlobalService } from '../../../global.service';

@Component({
  selector: 'app-edit-exam',
  templateUrl: './edit-exam.component.html',
  styleUrls: ['./edit-exam.component.css', '../dashboard/dashboard.component.css'],
  providers: [EditExamService]
})
export class EditExamComponent implements OnInit {

  public tzoffset = (new Date()).getTimezoneOffset() * 60000;
  selectedExam = "";
  exams = []
  public examDetails = {
    _id: "",
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    allocatedQuestions: [],
    allocatedStudents: []
  };

  public editQuestion = {
    question: "",
    ans: [false, false, false, false],
    options: ["", "", "", ""],
    tag: "",
    _id: "",
  }
  public popupEditButton = "Add";
  public showTag = true;

  public questionsForCurrentExam = [];
  searchService;
  public noSearchResultString;
  tagSearchResults = [];
  public tagValue = "";
  public inputTag = "";

  public allocatedSelectAll = false;
  public allocatedStudents = [];
  public departments = [];
  public years = [];
  public yearSelected: boolean = false;
  public deptSelected: boolean = false;

  public selectedDept = [];
  public selectedYears = [];

  public students = [];
  public rollNo = "";

  success = false;
  error = false;
  public filteredSelectAll: boolean = false;

  public allocatedStudentsToAllocate = [];
  public filteredStudentsToAllocate = [];
  startTime = "00:00";
  endTime = "00:00";
  onFocus;
  // notificationText=""
  constructor(private editExamService: EditExamService, private globalService: GlobalService) {

    this.getAllEntities();
  }

  getAllEntities() {
    this.editExamService.getAllExams().subscribe(res => {
      this.exams = res.documents
    }, error => {
      console.log(error)
    })

    this.editExamService.getDepts().subscribe(res => {

      res.departments.forEach(element => {
        this.departments.push({ "dept": element, "checked": false })
      });

    })

    this.editExamService.getYears().subscribe(res => {

      res.documents.forEach(element => {
        this.years.push({ "year": element, "checked": false })
      });
      // this.years = res.documents;
    })
  }

  examChange() {
    this.success = false;
    this.error = false;
    if (this.selectedExam) {
      this.globalService.loader(true)
      this.allocatedStudents = [];
      this.allocatedStudentsToAllocate = [];
      // this.questionIDs = [];
      this.students = [];
      this.editExamService.getExamDetails(this.selectedExam["_id"]).subscribe(res => {
        let startTimeArr=res.document.startDate.split('T')[1].split(':')
        let endTimeArr=res.document.endDate.split('T')[1].split(':')

        this.startTime=startTimeArr[0]+":"+startTimeArr[1]
        this.endTime=endTimeArr[0]+":"+endTimeArr[1]
        
        res.document.startDate = res.document.startDate ? res.document.startDate.split("T")[0] : ""
        res.document.endDate = res.document.endDate ? res.document.endDate.split("T")[0] : ""

        this.examDetails = res.document
        this.getQuestionsOnId();
        this.getStudentsOnId();
        this.globalService.loader(false)
      }, error => {
        console.log(error)
        this.globalService.loader(false)
      })

    }
    else {
      this.allocatedStudents = []
      this.questionsForCurrentExam = [];
      // this.questionIDs = [];
      this.examDetails = {
        _id: "",
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        allocatedQuestions: [],
        allocatedStudents: []
      }
      this.resetFilters()
      // this.departments = [];
      // this.years = [];
    }

  }

  getQuestionsOnId() {
    if (this.examDetails.allocatedQuestions.length != 0) {
      let body = { questionId: this.examDetails.allocatedQuestions }

      this.editExamService.getQuestionsOnId(body).subscribe(res => {

        this.questionsForCurrentExam = res.documents
      }, error => {
        console.log(error)
        this.globalService.loader(false)
      })
    }
    else
      return
  }

  getStudentsOnId() {
    if (this.examDetails.allocatedStudents.length != 0) {

      let detailsBody = {
        entity: true,
        _id: this.examDetails.allocatedStudents
      }
      this.editExamService.getDetails(detailsBody).subscribe(res => {

        this.allocatedSelectAll = true;
        res.documents.forEach(element => {
          element["checked"] = true;
          this.allocatedStudents.push(element)
          this.allocatedStudentsToAllocate.push(element._id)
        });
      }, error => {
        console.log(error)
      });
    }
    else
      return
  }

  delete(questionId) {
    for (var index = 0; index < this.questionsForCurrentExam.length; index++) {

      if (this.questionsForCurrentExam[index]._id === questionId) {
        this.questionsForCurrentExam.splice(index, 1);
        this.examDetails.allocatedQuestions.splice(index, 1);
        break;
      }
    }
  }

  edit(question) {
    this.showTag = false;
    this.editQuestion = question;
    this.popupEditButton = "Update";
  }

  closePopup() {
    this.noSearchResultString = ""
    this.showTag = true;
    this.editQuestion = {
      question: "",
      ans: [false, false, false, false],
      options: ["", "", "", ""],
      tag: "",
      _id: ""
    };
    this.popupEditButton = "Add";
  }

  tagValueEntered(enteredTag) {
    if (this.searchService) {
      this.searchService.unsubscribe();
    }
    if (enteredTag) {
      this.searchService = this.editExamService.tagSearch(enteredTag).subscribe(res => {
        this.tagSearchResults = res.documents;

        if (this.tagSearchResults.length == 0) {
          this.noSearchResultString = "No Question is available with this tag name."
          // this.tagSearchResults.push("")
        }
        else
          this.noSearchResultString = "";
      },
        error => {
          this.noSearchResultString = "No Question is available with this tag name."
          console.log(error)
        });
    }

  }

  tagSearchClicked(value) {
    this.tagValue = value;
    this.inputTag = this.tagValue["tag"];
    this.tagSearchResults = [];
  }

  addTaggedQuestion() {

    if (this.searchService) {
      this.searchService.unsubscribe();
    }

    let flag = true;
    let tagQuestion = [];

    for (var index = 0; index < this.questionsForCurrentExam.length; index++) {

      if (this.questionsForCurrentExam[index]._id === this.tagValue["_id"]) {
        flag = false;
        break;
      }
    }

    if (flag) {

      let body = {
        questionId: [this.tagValue["_id"]]
      }

      this.editExamService.getQuestionsOnId(body).subscribe(res => {

        tagQuestion = res.documents;
        this.questionsForCurrentExam.push(tagQuestion[0]);
        this.examDetails.allocatedQuestions.push(this.tagValue["_id"])

        this.tagValue = "";
        this.inputTag = "";
      },
        error => {
          console.log(error)
        });
    }
    else {
      this.noSearchResultString = "This Question is already added to exam."
    }

  }

  addQuestion() {
    let body = {
      "question": this.editQuestion.question,
      "options": this.editQuestion.options,
      "ans": this.editQuestion.ans,
      "tag": this.editQuestion.tag
    }
    this.editExamService.createQuestion(body).subscribe(res => {

      this.questionsForCurrentExam.push(res.document)
      this.examDetails.allocatedQuestions.push(res.document["_id"])

    }, error => {
      console.log(error)
    })
  }

  updateQuestion() {

    let body = {
      "question": this.editQuestion.question,
      "options": this.editQuestion.options,
      "ans": this.editQuestion.ans,
      "tag": this.editQuestion.tag,
      "questionId": this.editQuestion._id
    }

    this.editExamService.updateQuestion(body).subscribe(res => {

      for (var index = 0; index < this.questionsForCurrentExam.length; index++) {

        if (this.questionsForCurrentExam[index]._id === this.editQuestion._id) {
          this.questionsForCurrentExam[index] = this.editQuestion;
          break;
        }
      }
    }, error => {
      console.log(error)
    })
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

  applyFilter() {
    let rollBody = [];
    let postBody = {};
    this.students = [];
    if (this.deptSelected || this.yearSelected) {
      if (this.selectedDept.length != 0) {
        postBody["department"] = this.selectedDept;
      }
      if (this.selectedYears.length != 0) {
        postBody["year"] = this.selectedYears
      }
    }
    else {
      postBody["rollNo"] = this.rollNo.split(",");
    }
    postBody["entity"] = true
    postBody["examId"] = this.examDetails._id
    this.globalService.loader(true);
    this.editExamService.getStudentsOnFilter(postBody).subscribe(res => {
      res.documents.forEach(element => {
        element["checked"] = false;
        this.students.push(element);
        this.globalService.loader(false);
      });
    }, error => {
      this.globalService.loader(false);
      console.log(error)
    })
  }

  resetFilters() {
    this.success = false;
    this.error = false;
    this.selectedDept = [];
    this.selectedYears = [];
    this.students = [];
    this.deptSelected = false;
    this.yearSelected = false;
    this.rollNo = "";

    this.departments.forEach(element => {
      element.checked = false;
    });

    this.years.forEach(element => {
      element.checked = false;
    });
  }

  allocatedTableRowChecked(criteria, obj) {
    // console.log(this.selectAll)
    if (criteria === "allrowsselected") {
      this.allocatedStudentsToAllocate = [];
      if (this.allocatedSelectAll) {
        this.allocatedStudents.forEach(element => {
          element.checked = true;
          this.allocatedStudentsToAllocate.push(element._id);
        });
      }
      else {
        this.allocatedStudents.forEach(element => {
          element.checked = false;
        });
        this.allocatedStudentsToAllocate = [];
      }
    }
    else if (obj.checked) {

      this.allocatedStudentsToAllocate.push(obj._id);

    }
    else {
      for (var index = 0; index < this.allocatedStudentsToAllocate.length; index++) {
        var element = this.allocatedStudentsToAllocate[index];

        if (element === obj._id) {
          this.allocatedStudentsToAllocate.splice(index, 1);
          this.allocatedSelectAll = false;
          break;
        }
      }
    }

  }

  filteredTableRowChecked(criteria, obj) {
    // console.log(this.selectAll)
    if (criteria === "allrowsselected") {
      this.filteredStudentsToAllocate = [];
      if (this.filteredSelectAll) {
        this.students.forEach(element => {
          element.checked = true;
          this.filteredStudentsToAllocate.push(element._id);
        });
      }
      else {
        this.students.forEach(element => {
          element.checked = false;
        });
        this.filteredStudentsToAllocate = [];
      }
    }
    else if (obj.checked) {

      this.filteredStudentsToAllocate.push(obj._id);

    }
    else {
      for (var index = 0; index < this.filteredStudentsToAllocate.length; index++) {
        var element = this.filteredStudentsToAllocate[index];

        if (element === obj._id) {
          this.filteredStudentsToAllocate.splice(index, 1);
          this.filteredSelectAll = false;
          break;
        }
      }
    }
  }

  updateExam() {

    let body = {
      "name": this.examDetails["name"],
      "description": this.examDetails["description"],
      "studentId": this.allocatedStudentsToAllocate.concat(this.filteredStudentsToAllocate),
      "allocatedQuestions": this.examDetails.allocatedQuestions,
      "_id": this.examDetails["_id"],
      "startDate": (this.examDetails.startDate) ?  this.examDetails.startDate+"T"+this.startTime.split(":")[0]+":"+this.startTime.split(":")[1]+":00.000Z" : null,
      "endDate": (this.examDetails.endDate) ? this.examDetails.endDate+"T"+this.endTime.split(":")[0]+":"+this.endTime.split(":")[1]+":00.000Z" : null
    }
    this.editExamService.updateExam(body).subscribe(res => {
      if (res.flag) {
        this.success = true
        this.error = false;
      }
      else {
        this.success = false
        this.error = true
      }

    },
      error => {
        console.log(error)
        this.success = false
        this.error = true
      })
  }

  setTime(time, type) {
    if (type === 'startTime')
      this.startTime = time;
    else
      this.endTime = time;
    this.onFocus = "";

  }

  // sendNotification() {
  //   let body = {
  //     type: 3,
  //     studentId: this.allocatedStudentsToAllocate.concat(this.filteredStudentsToAllocate),
  //     message: this.notificationText
  //   }

  //   this.editExamService.sendNotification(body).subscribe(res => {

  //   }, error => {
  //     console.log(error)
  //   })
  // }

  ngOnInit() {
  }

}
