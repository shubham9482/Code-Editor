import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service'
import { GlobalService } from '../../../global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css'],
  providers: [DashboardService]
})
export class StudentDashboardComponent implements OnInit {

  courses;
  leaderBoard = []
  onGoingLeaderBoard=[]
  constructor(private router: Router, private dashboardService: DashboardService, private globalService: GlobalService) {
    this.getCourses()
  }

  getCourses() {
    this.globalService.loader(true)
    this.dashboardService.getCourses().subscribe(res => {
      this.courses = res.document
      this.globalService.loader(false)
    }, error => {
      console.log(error)
      this.globalService.loader(false)
    })
  }

  getLeaderboard(id,type) {
    this.globalService.loader(true)
    this.dashboardService.getLeaderBoard(id).subscribe(res => {

      if(type==='ongoing')
      {
        this.onGoingLeaderBoard=[]
        this.getKeys(res.documents).forEach(element => {
          this.onGoingLeaderBoard.push(res.documents[element])
        })
        this.onGoingLeaderBoard.sort(this.compare)
        this.onGoingLeaderBoard=this.rankStudent(this.onGoingLeaderBoard)
      }
      else if(type==='completed')
      {
        this.leaderBoard=[]
        this.getKeys(res.documents).forEach(element => {
          this.leaderBoard.push(res.documents[element])
        })
        this.leaderBoard.sort(this.compare)
        this.leaderBoard=this.rankStudent(this.leaderBoard)
      }
      
      this.globalService.loader(false)
    }, error => {
      console.log(error)
      this.globalService.loader(false)
    })
  }

  compare(a, b) {
    if ((a.testScore + a.practiceScore) < (b.testScore + b.practiceScore))
      return 1;
    if ((a.testScore + a.practiceScore) > (b.testScore + b.practiceScore))
      return -1;
    return 0;
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
        if (((element.testScore+element.practiceScore) == (prevElement.testScore+prevElement.practiceScore))) {
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

  resume(id) {

    this.router.navigate(['/courses'], { queryParams: { 'courseId': id } });
  }

  getKeys(obj) {
    return Object.keys(obj)
  }

  ngOnInit() {
  }

}
