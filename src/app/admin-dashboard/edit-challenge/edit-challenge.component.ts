import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ContestService } from '../services/contest.service'
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import 'rxjs/Rx';
import { GlobalService } from '../../global.service';
import { language_desc } from '../../../assets/config/language_description';

const languages = ['c', 'c++', 'java', 'python 2.7', 'python 3.4'];

@Component({
  selector: 'app-edit-challenge',
  templateUrl: './edit-challenge.component.html',
  styleUrls: ['./edit-challenge.component.css', '../admin-dashboard/admin-dashboard.component.css'],
  providers: [ContestService]
})
export class EditChallengeComponent implements OnInit {

  success = false;
  error = false;

  languageDesc = language_desc;
  initialCode: Array<string> = new Array(language_desc.languages.length)
  laterCode: Array<string> = new Array(language_desc.languages.length)
  studentAlgorithm: Array<string> = new Array(language_desc.languages.length)

  options: any = { enableBasicAutocompletion: true, enableLiveAutocompletion: true };
  singleLanguage;
  selectedLanguage;
  // modes=["c_cpp","c_cpp","java","python","python"];
  currentLanguage = { "name": "", "mode": "c_cpp", "i": 0 };
  appliedLanguage = [];

  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = false;
  separatorKeysCodes = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags = [];
  tags = [];
  service;
  noSearchResultString;
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

  public language: Array<boolean> = new Array(language_desc.languages.length).fill(false);
  checkboxSelected = false;

  public timeout: Number = 0;
  searchResults = [];
  conService;
  searchedChallenge = {
    "_id": "",
    "name": "",
    "description": "",
    "input": "",
    "output": "",
    "constraints": "",
    "explanation": "",
    "timeout": 0,
    "codeComplete": "true",
    "testcases": [],
    "difficulty": 0,
    "score": 0,
    "slug": ""
  };
  inputFileUploadMessage;
  outputFileUploadMessage;
  inputTestCase;
  outputTestCase;
  testCaseTag;
  prevTestCasePercent;
  testCasePercent = 100;
  outputTextTestCase;
  inputTextTestCase;
  constructor(private contestService: ContestService, private globalService: GlobalService) {
  }
  //   onChange(code) {
  //     console.log("new code", code);
  // }
  searchChallenge(name) {
    this.searchResults = [];
    if (this.conService) {
      this.conService.unsubscribe();
    }
    if (name && name != '') {
      this.conService = this.contestService.getChallenge(name).subscribe(res => {
        this.searchResults = res.documents;
        if (this.searchResults.length == 0) {
          this.noSearchResultString = "No Challenge available by this name."
        }
        else
          this.noSearchResultString = "";
      }, error => {
        this.noSearchResultString = "No Challenge available by this name."
        console.log(error)
      })
    }
  }

  searchClicked(searchResult) {
    this.searchResults = [];
    this.noSearchResultString = "";
    this.globalService.loader(true);
    this.contestService.getChallengeDetails(searchResult._id).subscribe(res => {
      (res.document.codeComplete === true) ? (res.document.codeComplete = "true") : (res.document.codeComplete = "false")

      this.searchedChallenge = res.document;
      this.tags = res.document.tags
      if (res.document.codeComplete === true) {
        this.singleLanguage = res.document.languagesApplicable[0]
        this.initialCode[res.document.languagesApplicable[0]] = res.document.initialCode[0];
        this.laterCode[res.document.languagesApplicable[0]] = res.document.initialCode[1];
        this.studentAlgorithm[res.document.languagesApplicable[0]] = res.document.initialCode[2];

      }
      else {
        this.language.fill(false);
        this.checkboxSelected=true;
        res.document.languagesApplicable.forEach(element => {
          this.language[element] = true;
          for (var index = 0; index < res.document.initialCode.length; index++) {
            var element1 = res.document.initialCode[index];
            if (element1.languageCode === element) {
              this.initialCode[element1.languageCode] = element1.initialCode;
              // this.laterCode[element1.languageCode]=element1.formerCode;
              // this.studentAlgorithm[element1.languageCode]=element1.studentAlgorithm;
              break;
            }

          }

        });
      }
      this.calculatePercent();
      this.globalService.loader(false);
    }, error => {
      console.log(error)
      this.globalService.loader(false);
    })
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

  filter(name: string): any {


  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  tagValueEntered(value) {
    // this.filteredTags=[];

    if (value && value != '') {
      if (this.service) {
        this.service.unsubscribe()
      }

      this.service = this.contestService.getTag(value).subscribe(res => {

        this.filteredTags = res.documents

      }, error => {
        console.log(error)
        this.filteredTags = [];
      })


    }
  }


  fileChange(event, type) {

    if (type === 'input') {
      if (event.target.files[0].name.toString().split('.')[1] != 'txt') {
        this.inputFileUploadMessage = "Only text files are allowed.";
        event.srcElement.files = null;
        event.target.files = null;
      }
      else {
        this.inputFileUploadMessage = event.target.files[0].name.toString();
        var reader = new FileReader();
        reader.readAsText(event.srcElement.files[0]);
        var scope = this;
        reader.onload = function () {
          scope.inputTestCase = encodeURIComponent(reader.result)
          event.srcElement.files = null;
          event.target.files = null;
        }
      }
    }
    else if (type === 'output') {
      if (event.target.files[0].name.toString().split('.')[1] != 'txt') {
        this.outputFileUploadMessage = "Only text files are allowed.";
        event.srcElement.files = null;
        event.target.files = null;
      }
      else {
        this.outputFileUploadMessage = event.target.files[0].name.toString();
        var reader = new FileReader();
        reader.readAsText(event.srcElement.files[0]);
        var scope = this;
        reader.onload = function () {
          scope.outputTestCase = encodeURIComponent(reader.result)
          event.srcElement.files = null;
          event.target.files = null;
        }
      }
    }

  }

  downloadInput(input) {
    var blob = new Blob([decodeURIComponent(input)], { type: 'text/plain' });

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, 'input.txt');
    } else {
      //  handling of blob for non ms browsers
      const doc = document.createElement('a');
      doc.href = URL.createObjectURL(blob);
      doc.download = 'input.txt';
      document.body.appendChild(doc);
      doc.click();
    }

  }

  downloadOutput(output) {
    var blob = new Blob([decodeURIComponent(output)], { type: 'text/plain' });

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, 'output.txt');
    } else {
      //  handling of blob for non ms browsers
      const doc = document.createElement('a');
      doc.href = URL.createObjectURL(blob);
      doc.download = 'output.txt';
      document.body.appendChild(doc);
      doc.click();
    }
  }

  closeTestCase() {
    this.inputTestCase = null;
    this.outputTestCase = null;
    this.calculatePercent();
    this.testCaseTag = "";
    this.outputFileUploadMessage = "";
    this.inputFileUploadMessage = "";
    this.inputTextTestCase = null;
    this.outputTextTestCase = null;
  }

  addTestCase() {
    if (this.testCasePercent >= 0 && this.testCasePercent <= 100) {
      let newTestCase = { "input": this.inputTestCase || this.inputTextTestCase, "output": this.outputTestCase || this.outputTextTestCase, "percent": this.testCasePercent, "tag": this.testCaseTag }
      this.searchedChallenge.testcases.push(newTestCase);
      // this.testCasePercent-=this.testCasePercent;
      this.closeTestCase();
    }
  }

  getLanguage() {

    this.appliedLanguage = [];
    if (this.searchedChallenge.codeComplete === 'false') {
      for (var index = 0; index < this.language.length; index++) {
        var element = this.language[index];
        if (element === true) {
          // if (index === 0)
          //   this.appliedLanguage.push('c');
          // else if (index === 1)
          //   this.appliedLanguage.push('c++');
          // else if (index === 2)
          //   this.appliedLanguage.push('java');
          // else if (index === 3)
          //   this.appliedLanguage.push('Python 2.7');
          // else if (index === 4)
          //   this.appliedLanguage.push('Python 3.4');
          this.appliedLanguage.push({ "name": this.languageDesc.languages[index].languageName, "mode": this.languageDesc.languages[index].mode, "i": index });
        }
      }

      this.currentLanguage = this.appliedLanguage[0];
    }
    else {
      // if (this.singleLanguage === 'c') {
      //   this.appliedLanguage[0] = 'c';
      // }
      // else if (this.singleLanguage === 'c++') {
      //   this.appliedLanguage[0] = 'c++';
      // }
      // else if (this.singleLanguage === 'python 3.4') {
      //   this.appliedLanguage[0] = 'Python 3.4';
      // }
      // else if (this.singleLanguage === 'python 2.7') {
      //   this.appliedLanguage[0] = 'Python 2.7';
      // }
      // else {
      //   this.appliedLanguage[0] = this.singleLanguage;

      // }
      for (var index = 0; index < this.languageDesc.languages.length; index++) {
        var element1 = this.languageDesc.languages[index];
        if (element1.code === this.singleLanguage) {
          this.appliedLanguage.push({ "name": element1.languageName, "mode": element1.mode, "i": index });
          this.currentLanguage = this.appliedLanguage[0];
          break;
        }
      }
    }
  }

  submit() {

    let languageArr = [];
    let initialCodeVar = [];
    this.success = false;
    this.error = false;

    if (this.searchedChallenge.codeComplete === 'false') {
      for (var index = 0; index < this.language.length; index++) {
        var element = this.language[index];
        if (element === true) {
          languageArr.push(index);

          initialCodeVar.push({ "languageCode": index, "initialCode": this.initialCode[index] })
        }
      }
    }
    else {
      // if (this.singleLanguage === 'c') {
      //   languageArr[0] = 0;
      //   initialCodeVar=[this.initialCode[0],this.laterCode[0],this.studentAlgorithm[0]]
      // }
      // else if (this.singleLanguage === 'c++') {
      //   languageArr[0] = 1;
      //   initialCodeVar=[this.initialCode[1],this.laterCode[1],this.studentAlgorithm[1]]
      // }
      // else if (this.singleLanguage === 'java'){
      //   languageArr[0] = 2;
      //   initialCodeVar=[this.initialCode[2],this.laterCode[2],this.studentAlgorithm[2]]
      // }
      // else if (this.singleLanguage === 'python 2.7') {
      //   languageArr[0] = 3;
      //   initialCodeVar=[this.initialCode[3],this.laterCode[3],this.studentAlgorithm[3]]
      // }
      // else if (this.singleLanguage === 'python 3.4') {
      //   languageArr[0] = 4;
      //   initialCodeVar=[this.initialCode[4],this.laterCode[4],this.studentAlgorithm[4]]
      // }

      for (var index = 0; index < this.languageDesc.languages.length; index++) {
        var element1 = this.languageDesc.languages[index];
        if (element1.code === this.singleLanguage) {
          languageArr[0] = index;
          initialCodeVar = [this.initialCode[index], this.laterCode[index], this.studentAlgorithm[index]]
          break;
        }
      }
    }


    let body = {
      "_id": this.searchedChallenge._id, //Necessary
      "name": this.searchedChallenge.name,
      "description": this.searchedChallenge.description,
      "input": this.searchedChallenge.input,
      "output": this.searchedChallenge.output,
      "constraints": this.searchedChallenge.constraints,
      "explanation": this.searchedChallenge.explanation,
      "tags": this.tags,
      "difficulty": this.searchedChallenge.difficulty, // [0, 1, 2] - any of the three
      "testcases": this.searchedChallenge.testcases, // Note : The sum of percentages must be 100
      "timeout": this.searchedChallenge.timeout, //Always ms
      "languagesApplicable": languageArr, // Must read language details from local json file
      "codeComplete": (this.searchedChallenge.codeComplete === 'true') ? true : false,
      "initialCode": initialCodeVar,
      "score": this.searchedChallenge.score
    }

    this.contestService.updateChallenge(body).subscribe(res => {

      this.success = true;
    },
      error => {
        console.log(error)
        this.error = true;
      })
  }

  calculatePercent() {
    let percent = 0;
    if (this.searchedChallenge.testcases.length != 0) {
      this.searchedChallenge.testcases.forEach(element => {
        percent += element.percent;
      });
      if (percent === 100)
        this.testCasePercent = 0;
      else
        this.testCasePercent = Math.abs(100 - percent)
    }
    else
      this.testCasePercent = 100;
  }

  removeTestCase(row_no) {
    this.searchedChallenge.testcases.splice(row_no, 1);
    this.calculatePercent();
  }

  change() {
    let flag = false;
    for (var index = 0; index < this.language.length; index++) {
      var element = this.language[index];
      if (element) {
        flag = true;
        break;
      }
    }

    if (flag)
      this.checkboxSelected = true;
    else
      this.checkboxSelected = false;
  }
  ngOnInit() {
  }

}
