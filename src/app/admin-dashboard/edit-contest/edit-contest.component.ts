import { Component, OnInit } from '@angular/core';
import { ContestService } from '../services/contest.service'
import { GlobalService } from '../../global.service';
import { AdminDashboardService } from '../services/admin-dashboard.service'

@Component({
  selector: 'app-edit-contest',
  templateUrl: './edit-contest.component.html',
  styleUrls: ['./edit-contest.component.css', '../admin-dashboard/admin-dashboard.component.css'],
  providers: [ContestService]
})
export class EditContestComponent implements OnInit {

  public tzoffset = (new Date()).getTimezoneOffset() * 60000;

  public editorConfig = {
    "editable": true,
    "spellcheck": true,
    "height": "100px",
    "minHeight": "0",
    "width": "800px",
    "minWidth": "0",
    "translate": "yes",
    "enableToolbar": true,
    "showToolbar": true,
    "placeholder": "Enter text here...",
    "imageEndPoint": "",
    "toolbar": [
      ["bold", "italic", "underline", "strikeThrough", "superscript", "subscript"],
      ["fontName", "fontSize", "color"],
      ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
      ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
      ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"],
      ["link", "unlink"]
    ]
  }

  searchedContest = {
    "_id": "",
    "slug": "",
    "name": "",
    "description": "",
    "prizes": "",
    "startDate": (new Date(Date.now() - this.tzoffset)).toISOString().split('T')[0],
    "endDate": (new Date(Date.now() - this.tzoffset)).toISOString().split('T')[0],
    "duration": 0,
    "maxScore": 0,
    "challenges": [],
    "allocatedStudents": []
  };

  startTime = "00:00";
  endTime = "00:00";
  onFocus;

  conService;
  searchResults = [];
  noChallengeSearchResultString = "";
  noContestSearchResultString = "";

  // addedChallenge = [];

  public departments = [];
  public years = [];
  public rollNo = "";
  // public yearSelected: boolean = false;
  // public deptSelected: boolean = false;
  students = [];
  selectedDept = [];
  selectedYears = [];

  allocatedSelectAll = false;
  filteredSelectAll = false;
  allocatedStudents = [];
  allocatedStudentsToAllocate = [];
  filteredStudentsToAllocate = [];

  success=false;
  error=false;
  constructor(private contestService: ContestService, private adminService: AdminDashboardService, private globalService: GlobalService) { }

  getEntity() {
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
  }

  search(name, type) {
    this.searchResults = [];
    if (this.conService) {
      this.conService.unsubscribe();
    }
    if (name && name != '') {
      if (type === 'challenge') {
        this.conService = this.contestService.getChallenge(name).subscribe(res => {
          this.searchResults = res.documents;
          if (this.searchResults.length == 0) {
            this.noChallengeSearchResultString = "No Challenge available by this name."
          }
          else
            this.noChallengeSearchResultString = "";
        }, error => {
          this.noChallengeSearchResultString = "No Challenge available by this name."
          console.log(error)
        })
      }
      else {
        this.conService = this.contestService.getContest(name).subscribe(res => {
          this.searchResults = res.documents;
          if (this.searchResults.length == 0) {
            this.noContestSearchResultString = "No Contest available by this name."
          }
          else
            this.noContestSearchResultString = "";
        }, error => {
          this.noContestSearchResultString = "No Contest available by this name."
          console.log(error)
        })
      }
    }
  }

  searchClicked(searchResult, type) {
    this.error=false;
    this.success=false;
    this.searchResults = [];
    this.noChallengeSearchResultString = "";
    this.noContestSearchResultString = "";
    this.globalService.loader(true);
    if (type === 'challenge') {
      this.contestService.getChallengeDetails(searchResult._id).subscribe(res => {

        let add = true;
        for (var index = 0; index < this.searchedContest.challenges.length; index++) {
          var element = this.searchedContest.challenges[index];
          if (res.document._id === element._id) {
            add = false;
            this.noChallengeSearchResultString = "Challenge :" + searchResult.name + " already present."
            break;
          }
        }
        if (add) {
          this.searchedContest.challenges.push({"_id":res.document._id,"name":res.document.name,"score":0});
        }
        this.globalService.loader(false);
      }, error => {
        console.log(error)
        this.globalService.loader(false);
      })
    }
    else {
      this.searchedContest.challenges = [];
      this.contestService.getContestDetails(searchResult._id).subscribe(res => {

        this.searchedContest = res.document;

        let startTimeArr=this.searchedContest.startDate.split('T')[1].split(':')
        let endTimeArr=this.searchedContest.endDate.split('T')[1].split(':')

        this.searchedContest.startDate=this.searchedContest.startDate.split('T')[0];
        this.searchedContest.endDate=this.searchedContest.endDate.split('T')[0];        

        this.startTime=startTimeArr[0]+":"+startTimeArr[1]
        this.endTime=endTimeArr[0]+":"+endTimeArr[1]
        
        this.allocatedStudentsToAllocate = this.searchedContest.allocatedStudents;
        let postBody = { "_id": this.searchedContest.allocatedStudents, "entity": true }

        this.getAllocatedStudents(postBody)
        this.getEntity();
        this.resetFilters();
        this.globalService.loader(false);
      }, error => {
        console.log(error)
        this.globalService.loader(false);
      })
    }
  }
  changeScore()
  {
    let score=0;
    this.searchedContest.challenges.forEach(element => {
      score+=element.score
    });
    this.searchedContest.maxScore=score;
  }

  getAllocatedStudents(postBody) {
    this.allocatedStudents = [];
    this.adminService.getDetails(postBody).subscribe(res => {
      res.documents.forEach(element => {
        this.allocatedSelectAll = true;
        element["checked"] = true;
        this.allocatedStudents.push(element)
      });
    },
      error => {
        console.log(error)
      })
  }
  setTime(time, type) {
    if (type === 'startTime')
      this.startTime = time;
    else
      this.endTime = time;
    this.onFocus = "";

  }
  removeTestCase(row_no) {
    this.searchedContest.challenges.splice(row_no, 1);
  }

  onDeptChange(dept) {

    // this.selectedDept = [];
    // this.deptSelected = false;
    // for (var index = 0; index < this.departments.length; index++) {

    //   if (this.departments[index].checked) {
    //     this.deptSelected = true;
    //     this.selectedDept.push(this.departments[index].dept)
    //     // break;
    //   }
    //   // else {
    //   //   this.deptSelected = false;
    //   // }
    // }

    if (dept.checked) {
      this.selectedDept.push(dept.dept)
      // break;
    }
    else {
      for (var index = 0; index < this.selectedDept.length; index++) {
        var element = this.selectedDept[index];
        if (element === dept.dept) {
          this.selectedDept.splice(index, 1);
          break;
        }
      }
    }

  }

  onYearChange(year) {

    // this.selectedYears = [];
    // this.yearSelected = false;
    // for (var index = 0; index < this.years.length; index++) {

    //   if (this.years[index].checked) {
    //     this.yearSelected = true;
    //     this.selectedYears.push(this.years[index].year)
    //     // break;
    //   }
    //   // else {
    //   //   this.yearSelected = false;
    //   // }
    // }

    console.log(year)
    if (year.checked) {
      this.selectedYears.push(year.year)
      // break;
    }
    else {
      for (var index = 0; index < this.selectedYears.length; index++) {
        var element = this.selectedYears[index];
        if (element === year.year) {
          this.selectedYears.splice(index, 1);
          break;
        }
      }
    }

  }

  applyFilter() {
    this.globalService.loader(true);
    let rollBody = [];
    let postBody = {};
    this.students = [];
    if (this.selectedDept.length != 0 || this.selectedYears.length != 0) {
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

    this.adminService.getDetails(postBody).subscribe(res => {
      res.documents.forEach(element => {
        element["checked"] = false;
        this.students.push(element)

      });
      this.globalService.loader(false);
    },
      error => {
        this.globalService.loader(false);
      })
  }

  resetFilters() {
    this.selectedDept = [];
    this.selectedYears = [];
    this.filteredStudentsToAllocate = [];
    this.students = [];
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

  submit() {
    this.success=false;
    this.error=false;

    let startDateToSend =this.searchedContest.startDate+"T"+this.startTime.split(":")[0]+":"+this.startTime.split(":")[1]+":00.000Z"
    let endDateToSend = this.searchedContest.endDate+"T"+this.endTime.split(":")[0]+":"+this.endTime.split(":")[1]+":00.000Z"

    let body = {
      "_id": this.searchedContest._id,
      "name": this.searchedContest.name,
      "description": this.searchedContest.description,
      "prizes": this.searchedContest.prizes,
      "startDate": startDateToSend,
      "endDate": endDateToSend,
      "maxScore": this.searchedContest.maxScore,
      "duration": this.searchedContest.duration,
      "allocatedStudents": this.allocatedStudentsToAllocate.concat(this.filteredStudentsToAllocate),
      "challenges": this.searchedContest.challenges
    }
    this.contestService.updateContest(body).subscribe(res => {
      
      this.success=true;
    },
      error => {
        console.log(error)
        this.error=true;
      })
  }
  ngOnInit() {
  }

}
