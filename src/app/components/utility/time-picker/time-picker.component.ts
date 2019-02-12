import { Component, OnInit,Output,EventEmitter,Input } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent implements OnInit {

  @Output() timePicker=new EventEmitter();
  @Input() innerText="00:00";

  constructor() { 
  }

  emit(event)
  {
    this.innerText=event.target.innerText
    this.timePicker.emit(event.target.innerText)
  }
  ngOnInit() {
  }

}
