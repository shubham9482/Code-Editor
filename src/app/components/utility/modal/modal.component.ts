import { Component, OnInit,Input,Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Input() visible=false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() type;
  // @Output() typeChange = new EventEmitter<string>();

  @Input() message=""
  // @Output() messageChange = new EventEmitter<string>();

  userInput=""

  @Output() sendData = new EventEmitter<string>()
  constructor() { }

  closeModal()
  {
    this.visible=false;
    this.visibleChange.emit(false)
    if(this.type==='input')
    {
      this.sendData.emit(this.userInput)
    }
  }
  
  close()
  {
    this.visible=false;
    this.visibleChange.emit(false)
  }

  ngOnInit() {
  }

}
