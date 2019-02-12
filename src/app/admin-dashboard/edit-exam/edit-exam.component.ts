import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { CreateExamService } from '../services/create-exam.service'
import { AdminDashboardService } from '../services/admin-dashboard.service'
import { ManageCourseService } from '../services/manage-course.service'
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-edit-exam',
  templateUrl: './edit-exam.component.html',
  styleUrls: ['./edit-exam.component.css', '../admin-dashboard/admin-dashboard.component.css'],
  providers: [CreateExamService, ManageCourseService]
})
export class EditExamComponent implements OnInit {

  public selectedExam = "";
  // public newCreatedExam={
  //   "_id":"",
  //   "name":""
  // };
  public exams = [];
  public examDetails = {
    "_id": "",
    "name": "",
    "description": "",
    "questionId": [],
    "studentId": [],

  };
  public showTag = true;
  public questionsForCurrentExam = [];

  public questionIDs = [];

  public editQuestion = {
    question: "",
    ans: [false, false, false, false],
    options: ["", "", "", ""],
    tag: "",
    _id: "",
  }

  public popupEditButton = "Add";

  public noSearchResultString;
  public tagSearchResults = [];
  public searchService;
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

  public filteredSelectAll: boolean = false;

  public allocatedStudentsToAllocate = [];
  public filteredStudentsToAllocate = [];

  constructor(private route: ActivatedRoute, private courseService: ManageCourseService, private editExamService: CreateExamService, private adminService: AdminDashboardService, private globalService: GlobalService) {

    this.route.params.subscribe(params => {
      if (params["_id"] && params["name"]) {
        this.selectedExam = JSON.stringify({
          "_id": params["_id"],
          "name": params["name"]
        });
        this.selectedExam = JSON.parse(this.selectedExam);
        this.examChange();
      }
      this.getEntities();
    }
    );

  }

  getEntities() {

    this.editExamService.getExams().subscribe(res => {

      this.exams = res.documents;
    },
      error => {
        console.log(error)
      })

  }

  examChange() {
    this.globalService.loader(true);
    this.allocatedStudents = [];
    this.allocatedStudentsToAllocate = [];
    this.questionIDs = [];
    this.students = [];
    if (this.selectedExam) {

      // if(typeof(this.selectedExam)==="string")
      // {
      //   this.selectedExam=JSON.parse(this.selectedExam);
      //   console.log()
      // }
      this.globalService.loader(true)
      this.editExamService.getExamDetails(this.selectedExam["_id"]).subscribe(res => {
        this.examDetails = res.document;
        let body = {
          questionId: this.examDetails["questionId"]
        }

        this.editExamService.getQuestions(body).subscribe(res => {

          this.questionsForCurrentExam = res.documents;
          this.questionsForCurrentExam.forEach(element => {
            this.questionIDs.push(element._id);
          });
          this.globalService.loader(false)
        },
          error => {
            console.log(error)
            this.globalService.loader(false)
          });

        let detailsBody = {
          entity: true,
          _id: this.examDetails["studentId"]
        }
        this.adminService.getDetails(detailsBody).subscribe(res => {

          this.allocatedSelectAll = true;
          res.documents.forEach(element => {
            element["checked"] = true;
            this.allocatedStudents.push(element)
            this.allocatedStudentsToAllocate.push(element._id)
          });
        }, error => {
          console.log(error)
        });

        this.adminService.getDepts().subscribe(res => {

          res.departments.forEach(element => {
            this.departments.push({ "dept": element, "checked": false })
          });

        })

        this.adminService.getYears().subscribe(res => {

          res.documents.forEach(element => {
            this.years.push({ "year": element, "checked": false })
          });
          // this.years = res.documents;
        })
        this.globalService.loader(false);
      },
        error => {
          console.log(error)
          this.globalService.loader(false);
        });


    }
    else {
      this.allocatedStudents = []
      this.questionsForCurrentExam = [];
      this.questionIDs = [];
      this.examDetails = {
        "_id": "",
        "name": "",
        "description": "",
        "questionId": [],
        "studentId": [],
      };
      this.departments = [];
      this.years = [];
    }
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

    let body = {
      questionId: [this.tagValue["_id"]]
    }

    this.editExamService.getQuestions(body).subscribe(res => {

      tagQuestion = res.documents;
      for (var index = 0; index < this.questionsForCurrentExam.length; index++) {

        if (this.questionsForCurrentExam[index]._id === tagQuestion[0]._id) {
          flag = false;
          break;
        }
      }
      if (flag) {
        this.questionsForCurrentExam.push(tagQuestion[0]);
        this.questionIDs.push(this.tagValue["_id"])
      }
      else {
        this.noSearchResultString = "This Question is already added to exam."
      }
      this.tagValue = "";
      this.inputTag = "";
    },
      error => {
        console.log(error)
      });

  }

  delete(questionId) {
    for (var index = 0; index < this.questionsForCurrentExam.length; index++) {

      if (this.questionsForCurrentExam[index]._id === questionId) {
        this.questionsForCurrentExam.splice(index, 1);
        this.questionIDs.splice(index, 1);
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

  addQuestion() {
    let body = {
      "question": this.editQuestion.question,
      "options": this.editQuestion.options,
      "ans": this.editQuestion.ans,
      "tag": this.editQuestion.tag
    }
    this.editExamService.createQuestion(body).subscribe(res => {

      this.questionsForCurrentExam.push(res.document)
      this.questionIDs.push(res.document["_id"])

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
    postBody["examId"] = this.examDetails["_id"],
      this.globalService.loader(true)
    this.courseService.getStudentsOnFilter(postBody).subscribe(res => {
      res.documents.forEach(element => {
        element["checked"] = false;
        this.students.push(element);

      });
      this.globalService.loader(false)
    }, error => {
      console.log(error)
      this.globalService.loader(false)
    })
  }

  resetFilters() {
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

  allocatedTableRowChecked(criteria, table) {
    // console.log(this.selectAll)
    this.allocatedStudentsToAllocate = [];
    if (criteria === "allrowsselected" && table === "allocatedStudent") {
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
    else if (criteria === '' && table === "allocatedStudent") {
      for (var index = 0; index < this.allocatedStudents.length; index++) {

        if (this.allocatedStudents[index].checked) {
          this.allocatedStudentsToAllocate.push(this.allocatedStudents[index]._id)
        }
        else {
          this.allocatedSelectAll = false;
        }
      }
    }

  }

  filteredTableRowChecked(criteria, table) {
    // console.log(this.selectAll)
    this.filteredStudentsToAllocate = [];
    if (criteria === "allrowsselected" && table === "filteredStudent") {
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
    else if (criteria === '' && table === "filteredStudent") {
      for (var index = 0; index < this.students.length; index++) {

        if (this.students[index].checked) {
          this.filteredStudentsToAllocate.push(this.students[index]._id)
        }
        else {
          this.filteredSelectAll = false;
        }
      }
    }
  }

  updateExam() {

    let body = {
      "name": this.examDetails["name"],
      "description": this.examDetails["description"],
      "studentId": this.allocatedStudentsToAllocate.concat(this.filteredStudentsToAllocate),
      "questionId": this.questionIDs,
      "_id": this.examDetails["_id"]
    }

    this.editExamService.updateExam(body).subscribe(res => {

    },
      error => {
        console.log(error)
      })
  }

  ngOnInit() {
  }

}
