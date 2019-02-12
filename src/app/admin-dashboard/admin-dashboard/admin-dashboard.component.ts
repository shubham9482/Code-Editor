import { Component, OnInit } from '@angular/core';
import {AdminDashboardService} from '../services/admin-dashboard.service'
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  // providers: [AdminDashboardService]
})
export class AdminDashboardComponent implements OnInit {

  public noOfFaculties:any;
  public noOfStudents:any;
  public noOfUsers;
  public numberOfCourses;
  public numberOfLabs;
  public numberOfContests;
  public numberOfExams;

  constructor(private adminService:AdminDashboardService,private globalService:GlobalService) { }

  ngOnInit() {

    this.globalService.loader(true);
    this.adminService.getNoOfEntities().subscribe(
      res=>{
        if(res.flag)
        {
          this.noOfStudents = res.numberOfStudents;
          this.noOfFaculties = res.numberOfFaculties;
          this.noOfUsers=parseInt(this.noOfFaculties)+parseInt(this.noOfStudents);
          this.numberOfCourses=res.numberOfCourses
          this.numberOfLabs=res.numberOfLabs
          this.numberOfContests=res.numberOfContests
          this.numberOfExams=res.numberOfExams
          this.globalService.loader(false);
        }
      }
    );
  }

}
