import { Component, OnInit } from '@angular/core';
import { DashboardService } from "../../services/dashboard.service"
import { GlobalService } from '../../../global.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DashboardService]
})
export class DashboardComponent implements OnInit {

  yearDept=[];
  currentYear=new Date().getFullYear()
  secondYear=this.currentYear-1;
  thirdYear=this.currentYear-2;
  fourthYear=this.currentYear-3;
  
  constructor(private dashboardService: DashboardService, private globalService: GlobalService) {
    this.getEntities();
  }

  getEntities() {
    this.globalService.loader(true);
    this.dashboardService.getYearsDept().subscribe(res => {
      this.yearDept=res.documents
      this.globalService.loader(false)
    }, error => {
      console.log(error)
      this.globalService.loader(false)
    })
  }

  getKeys(obj)
  {
    return Object.keys(obj)
  }

  downloadInput() {
    let downloadData=[]
    console.log("download")
    this.getKeys(this.yearDept).forEach(element => {
      
      downloadData.push(
        {
          'Branch': element,
          '1st Year': this.yearDept[element][this.currentYear] || 0,
          '2nd Year': this.yearDept[element][this.secondYear] || 0,
          '3rd Year': this.yearDept[element][this.thirdYear] || 0,
          '4th Year': this.yearDept[element][this.fourthYear] || 0
        }
      )
    });
    new Angular2Csv(downloadData, 'Report');
  }
  
  ngOnInit() {
  }

}
