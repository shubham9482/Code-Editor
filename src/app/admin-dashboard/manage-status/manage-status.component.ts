import { Component, OnInit } from '@angular/core';
import { ContestService } from '../services/contest.service'
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-manage-status',
  templateUrl: './manage-status.component.html',
  styleUrls: ['./manage-status.component.css', '../admin-dashboard/admin-dashboard.component.css'],
  providers: [ContestService]
})
export class ManageStatusComponent implements OnInit {

  searchResults = [];
  conService;
  noContestSearchResultString = ""
  searchedContest;
  contest = ""

  currentTab = "active-list";
  studentList = [];

  selectAll = false;

  unlockList = [];

  constructor(private contestService: ContestService, private globalService: GlobalService) { }


  search(name) {
    this.searchResults = [];
    if (this.conService) {
      this.conService.unsubscribe();
    }
    if (name && name != '') {

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

  searchClicked(searchResult, type) {

    this.searchResults = [];
    this.noContestSearchResultString = "";
    this.globalService.loader(true);

    this.contestService.getContestDetails(searchResult._id).subscribe(res => {

      this.searchedContest = res.document;
      this.contest = this.searchedContest.name;
      this.getList(this.searchedContest._id);

    }, error => {
      console.log(error)
      this.globalService.loader(false);
    })
  }

  getList(id) {
    this.studentList = [];
    this.contestService.getList(id, this.currentTab).subscribe(res => {

      if (this.currentTab === 'locked-list') {
        res.documents.forEach(element => {
          element["checked"] = false;
        });
      }
      if (this.currentTab === 'finished-list') {

        res.documents.forEach(element => {
          element["rank"] = 0;
        });
        this.studentList = res.documents; 
        this.studentList.sort(this.compare);
        this.rankStudent();
      }
      else
        this.studentList = res.documents;

      this.globalService.loader(false);
    },
      error => {
        this.globalService.loader(false);
        console.log(error);
      })
  }

  tabClicked(currentTab) {
    this.currentTab = currentTab;
    this.searchResults = [];
    if (this.searchedContest) {
      this.getList(this.searchedContest._id);
    }
  }

  rowChecked(criteria, obj) {
    if (criteria === "allrowsselected") {
      this.unlockList = [];
      if (this.selectAll) {
        this.studentList.forEach(element => {
          element.checked = true;
          this.unlockList.push({ "_id": element._id, "timeLeft": element.timeLeft });
        });
      }
      else {
        this.studentList.forEach(element => {
          element.checked = false;
        });
        this.unlockList = [];
      }
    }
    else if (obj.checked) {

      this.unlockList.push({ "_id": obj._id, "timeLeft": obj.timeLeft });

    }
    else {
      for (var index = 0; index < this.unlockList.length; index++) {
        var element = this.unlockList[index];

        if (element._id === obj._id) {
          this.unlockList.splice(index, 1);
          this.selectAll = false;
          break;
        }
      }
    }
  }

  timeLeftChange(student) {
    for (var index = 0; index < this.unlockList.length; index++) {
      var element = this.unlockList[index];

      if (element._id === student._id) {
        element.timeLeft = student.timeLeft;
        break;
      }
    }
  }

  unlock() {
    let postBody = {
      "contestid": this.searchedContest._id,
      "studentId": this.unlockList
    }

    if (postBody.studentId.length != 0) {
      this.contestService.unlockStudent(postBody, 'locked-list').subscribe(res => {
        
      }, error => {
        console.log(error)
      })
    }

  }

  compare(a, b) {
    if (a.submittedContests[0].score < b.submittedContests[0].score)
      return 1;
    if (a.submittedContests[0].score > b.submittedContests[0].score)
      return -1;
    return 0;
  }

  rankStudent() {
    let rank = 1;

    for (var index = 0; index < this.studentList.length; index++) {
      var element = this.studentList[index];
      if (index === 0) {
        element.rank = 1;
      }
      else {
        var prevElement = this.studentList[index - 1];
        if (element.submittedContests[0].score == prevElement.submittedContests[0].score) {
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
