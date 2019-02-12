import { Component, OnInit } from '@angular/core';
import {TimePickerComponent} from '../../components/utility/time-picker/time-picker.component'
import { ContestService } from '../services/contest.service'

@Component({
  selector: 'app-create-contest',
  templateUrl: './create-contest.component.html',
  styleUrls: ['./create-contest.component.css', '../admin-dashboard/admin-dashboard.component.css'],
  providers: [TimePickerComponent,ContestService]
})
export class CreateContestComponent implements OnInit {

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

  public tzoffset = (new Date()).getTimezoneOffset() * 60000; //timezone offset in milliseconds
  public startDate: any = (new Date(Date.now() - this.tzoffset)).toISOString().split('T')[0];
  public endDate: any = (new Date(Date.now() - this.tzoffset)).toISOString().split('T')[0];

  duration=0;
  startTime="00:00";
  endTime="00:00";
  onFocus;
  prizes="";
  description="";
  contestName="";
  submitted=false;
  error=false;
  constructor(private contestService: ContestService) { }

  setTime(time,type)
  {
    if(type==='startTime')
      this.startTime=time;
    else
      this.endTime=time;
    this.onFocus="";
    
    
  }

  submit()
  {
    this.submitted=false;
    this.error=false
    let startDateToSend =this.startDate+"T"+this.startTime.split(":")[0]+":"+this.startTime.split(":")[1]+":00.000Z"
    let endDateToSend = this.endDate+"T"+this.endTime.split(":")[0]+":"+this.endTime.split(":")[1]+":00.000Z"

    let body={
      "name": this.contestName,
      "description": this.description,
      "prizes": this.prizes,
      "startDate": startDateToSend,
      "endDate": endDateToSend,
      "duration": this.duration
      }
    
    

    this.contestService.createContest(body).subscribe(res => {
      this.submitted=true;
      
    },
      error => {
        this.error=true
        console.log(error)
      })
  }

  ngOnInit() {
  }

}
