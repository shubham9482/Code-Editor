import { Component, OnInit } from '@angular/core';
import { LabsService } from '../../services/labs.service'
import { GlobalService } from '../../../global.service';

@Component({
  selector: 'app-lab-report',
  templateUrl: './lab-report.component.html',
  styleUrls: ['./lab-report.component.css', '../student-dashboard/student-dashboard.component.css'],
  providers: [LabsService]
})
export class LabReportComponent implements OnInit {

  readMore = true;
  studentLab = [];
  studentWiseReport = [];
  selectedReport = { submissionId: undefined };
  submissionReport;
  showLabs = true;
  selectedLab;
  selectAll = false
  selectedReportId = []
  constructor(private labsService: LabsService, private globalService: GlobalService) {

    this.getStudentLabs()
  }

  getStudentLabs() {
    this.globalService.loader(true)
    this.labsService.getSudentLab().subscribe(res => {

      this.studentLab = res.documents
      this.globalService.loader(false)
    }, error => {
      console.log(error)
      this.globalService.loader(false)
    })
  }

  getLabReport(lab) {
    this.selectedLab = lab
    this.globalService.loader(true)
    this.labsService.getSudentLabReport(this.selectedLab._id).subscribe(res => {

      for (var index = 0; index < res.weeks.length; index++) {
        var element = res.weeks[index];

        element["attempts"] = res.attempts[index]
        element["checked"] = false
        let submission = res.dateOfSubmissions.filter(e => {
          return e._id === element.number
        })

        if (submission.length != 0) {
          element["lastSubmittedDate"] = submission[0].lastSubmittedDate
          element["submissionId"] = submission[0].submissionId
        }
        else {
          element["lastSubmittedDate"] = null
          element["submissionId"] = null
        }
      }
      this.studentWiseReport = res.weeks;
      this.showLabs = false;
      this.globalService.loader(false)
    }, error => {
      console.log(error)
      this.globalService.loader(false)
    })
  }

  getLabSubmission(report) {
    this.selectedReport = report
    if (this.selectedReport["submissionId"]) {
      // let body = {
      //   labId: this.selectedLab._id,
      //   // studentId: this.selectedStudent._id,
      //   submissionId: report.submissionId
      // }

      this.labsService.getStudentLabReport(this.selectedReport["submissionId"], this.selectedLab._id).subscribe(res => {
        this.submissionReport = res.document
      }, error => {
        console.log(error)
      })
    }
  }

  select(type) {
    if (type === 'selectAll') {
      // console.log(type,this.selectAll)
      if (this.selectAll) {
        this.selectedReportId = this.studentWiseReport.map(element => {
          return element.number
        })

        this.studentWiseReport.forEach(element => {
          element["checked"] = true
        });
      }
      else {
        this.selectedReportId = []
        this.studentWiseReport.forEach(element => {
          element["checked"] = false
        });
      }
    }
    else {
      // let element = this.selectedStudents.find(e=>{
      let present = false
      //   return type._id===e._id && e.checked
      // })
      for (var index = 0; index < this.selectedReportId.length; index++) {
        var element = this.selectedReportId[index];

        if (element === type.number) {

          present = true
          break;
        }
      }
      if (present) {
        this.selectedReportId.splice(index, 1)
        this.selectAll = false
      }
      else {
        this.selectedReportId.push(type.number)
      }
    }
    // console.log(this.selectedStudents)
  }

  download() {

    let body = {
      labId: this.selectedLab._id,
      weekNumbers: this.selectedReportId
    }
    this.labsService.downloadLabReport(body).subscribe(res => {

      // var blob = new Blob([ atob(res.documents[0].data)], { type: 'application/pdf' });
      
      var data=[];
      res.documents.forEach(element => {
        data.push(element.data)
      });
      fetch("data:application/pdf;base64," +data)
        .then(function (resp) { return resp.blob() })
        .then(function (blob) {
          // FileSaver.saveAs(blob, 'foo.pdf')

          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, 'lab_report.pdf');
          } else {
            //  handling of blob for non ms browsers
            const doc = document.createElement('a');
            doc.href = URL.createObjectURL(blob);
            doc.download = 'lab_report.pdf';
            document.body.appendChild(doc);
            doc.click();
          }
          
        });

    }, error => {
      console.log(error)
    })


  }

  ngOnInit() {
  }

}
