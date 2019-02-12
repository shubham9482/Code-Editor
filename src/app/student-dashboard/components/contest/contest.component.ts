import { Component, OnInit } from '@angular/core';
import { ContestService } from '../../services/contest.service'
import { GlobalService } from '../../../global.service';

@Component({
  selector: 'app-contest',
  templateUrl: './contest.component.html',
  styleUrls: ['./contest.component.css', '../student-dashboard/student-dashboard.component.css'],
  providers: [ContestService]
})
export class ContestComponent implements OnInit {

  upcomingContests = [];
  completedContests = [];
  currentTab = "upcoming"
  leaderBoard = []
  constructor(private contestService: ContestService, private globalService: GlobalService) {

    this.getUpcomingContestDetail()
  }

  getUpcomingContestDetail() {
    this.globalService.loader(true)
    this.contestService.getUpcomingContests().subscribe(res => {

      this.upcomingContests = res.contestDetails || res.documents;
      this.globalService.loader(false)
    }, error => {
      console.log(error)
      this.globalService.loader(false)
    })
  }

  getCompletedContestDetail() {
    this.globalService.loader(true)
    this.contestService.getFinishedContests().subscribe(res => {
      this.completedContests = res.documents
      this.globalService.loader(false)
    }, error => {
      console.log(error)
      this.globalService.loader(false)
    })
  }

  getLeaderBoard(id) {
    this.globalService.loader(true)
    this.contestService.getContestLeaderboard(id).subscribe(res => {

      this.leaderBoard = res.documents
      this.leaderBoard.sort(this.compare)
      this.leaderBoard = this.rankStudent(this.leaderBoard)
      this.globalService.loader(false)
    }, error => {
      console.log(error)
      this.globalService.loader(false)
    })
  }

  compare(a, b) {
    if ((a.submittedContests[0].score) < (b.submittedContests[0].score))
      return 1;
    else if ((a.submittedContests[0].score) > (b.submittedContests[0].score))
      return -1;
    else {
      if ((a.submittedContests[0].executionTime) < (b.submittedContests[0].executionTime))
        return -1;
      else if ((a.submittedContests[0].executionTime) > (b.submittedContests[0].executionTime))
        return 1;
      else
        return 0;
    }

  }

  rankStudent(leaderBoard) {
    let rank = 1;

    for (var index = 0; index < leaderBoard.length; index++) {
      var element = leaderBoard[index];
      if (index === 0) {
        element.rank = 1;
      }
      else {
        var prevElement = leaderBoard[index - 1];
        if (((element.submittedContests[0].score) == (prevElement.submittedContests[0].score)) && ((element.submittedContests[0].executionTime) == (prevElement.submittedContests[0].executionTime))) {
          element.rank = rank;
        }
        else {
          element.rank = rank + 1;
          rank += 1;
        }
      }
    }
    return leaderBoard
  }

  tabClicked(tab) {
    this.currentTab = tab

    if (this.currentTab === 'upcoming') {
      this.getUpcomingContestDetail();
    }
    else if (this.currentTab === 'completed') {
      this.getCompletedContestDetail()
    }
  }
  ngOnInit() {
  }

}
