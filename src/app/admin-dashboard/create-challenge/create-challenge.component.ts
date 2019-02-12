import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ContestService } from '../services/contest.service'
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-create-challenge',
  templateUrl: './create-challenge.component.html',
  styleUrls: ['./create-challenge.component.css', '../admin-dashboard/admin-dashboard.component.css'],
  providers: [ContestService]

})
export class CreateChallengeComponent implements OnInit {

  
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = false;
  separatorKeysCodes = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags=[];
  tags = [];
  service;
  @ViewChild('tagInput') tagInput: ElementRef;

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
  public challengeName = "";
  public description = "";
  public input = "";
  public output = "";
  public constraints = "";
  public explanation = "";
  // public tags = "";
  public difficulty = 0;
  public language = [false, false, false, false, false];
  public codeCompletion;
  public timeout: Number = 0;
  submitted=false;
  error=false;
  constructor(private contestService: ContestService,private globalService:GlobalService) {

  }


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.tagCtrl.setValue(null);
  }

  remove(tag: any): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  filter(name: string):any {

    
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  tagValueEntered(value)
  {
    // this.filteredTags=[];
    
    if(value && value!='')
    {
      if(this.service)
      {
        this.service.unsubscribe()
      }

      this.service=this.contestService.getTag(value).subscribe(res=>{
        
        this.filteredTags=res.documents

      },error=>{
        console.log(error)
        this.filteredTags=[];
      })
      

    }
  }
  
  submit() {
   
    this.submitted=false;
    this.error=false
    let languageArr = [];
    for (var index = 0; index < this.language.length; index++) {
      var element = this.language[index];
      if (element === true) {
        languageArr.push(index)
      }
    }
    let body = {
      name: this.challengeName,
      description: this.description,
      input: this.input,
      output: this.output,
      constraints: this.constraints,
      explanation: this.constraints,
      tags: this.tags,
      difficulty: this.difficulty,
      languagesApplicable: languageArr,
      timeout: this.timeout,
      codeComplete: this.codeCompletion
    }

    this.contestService.createChallenge(body).subscribe(res => {
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
