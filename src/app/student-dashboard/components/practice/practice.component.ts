import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { PracticeService } from '../../services/practice.service'
import { GlobalService } from '../../../global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.css', '../student-dashboard/student-dashboard.component.css'],
  providers: [PracticeService]
})
export class PracticeComponent implements OnInit {

  status = "unsolved";
  difficulty = [false, false, false]
  tags = [];
  removable: boolean = true;
  selectable: boolean = true;
  tagCtrl = new FormControl();
  addOnBlur: boolean = false;
  separatorKeysCodes = [ENTER, COMMA];
  filteredTags = [];
  service;
  filterClicked = false
  @ViewChild('tagInput') tagInput: ElementRef;
  showLoader = false;

  challenges = [];
  buttonText = "Solve Challenge"
  lastScrollTop = 0;
  scrollService;
  constructor(private router: Router, private practiceService: PracticeService, private globalService: GlobalService) {
    // console.log(document.documentElement.scrollHeight !== document.documentElement.clientHeight)
    this.getInitialChallenges()
  }

  getInitialChallenges() {
    let body = {
      status: false,
    }
    this.globalService.loader(true)
    this.practiceService.getChallenges(body).subscribe(res => {
      this.challenges=res.documents
      this.globalService.loader(false)
    }, error => {
      console.log(error)
      this.globalService.loader(false)
    })
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
    let scroll = document.documentElement.scrollTop
    if (document.documentElement.scrollHeight !== document.documentElement.clientHeight && scroll > this.lastScrollTop) {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        // you're at the bottom of the page
        this.bottomOfScreen()
      }
    }
    this.lastScrollTop=scroll
  }

  remove(tag: any): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  tagValueEntered(value) {
    // this.filteredTags=[];

    if (value && value != '') {
      if (this.service) {
        this.service.unsubscribe()
      }

      this.service = this.practiceService.getTags(value).subscribe(res => {

        this.filteredTags = res.documents

      }, error => {
        console.log(error)
        this.filteredTags = [];
      })


    }
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

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  bottomOfScreen() {
    this.showLoader = true
    if(this.scrollService)
    {
      this.scrollService.unsubscribe()
    }
    if (this.filterClicked) {
      let difficulty = []

      for (let index = 0; index < this.difficulty.length; index++) {
        const element = this.difficulty[index];
        if (element) {
          difficulty.push(index)
        }
      }

      let body = {
        status: (this.status === 'solved') ? true : false,
      }

      if (difficulty.length != 0) {
        body['difficulty'] = difficulty
      }
      if (this.tags.length != 0) {
        body['tags'] = this.tags
      }

      body['range'] = this.challenges.length
      this.scrollService=this.practiceService.getChallenges(body).subscribe(res => {

        // this.challenges.push(res.documents);
        if (res.documents.length != 0) {
          this.challenges.push(res.documents)
        }
        (this.status === 'solved') ? (this.buttonText = "Try Again") : (this.buttonText = "Solve Challenge");
        this.showLoader = false
      }, error => {
        console.log(error)
        this.showLoader = false
      })
    }
    else {

      let body = {
        status: false,
        range: this.challenges.length
      }
      this.scrollService=this.practiceService.getChallenges(body).subscribe(res => {
        if (res.documents.length != 0) {
          this.challenges.push(res.documents)
        }
        this.showLoader = false
      }, error => {
        console.log(error)
        this.showLoader = false
      })
    }
  }

  filter() {
    let difficulty = []

    for (let index = 0; index < this.difficulty.length; index++) {
      const element = this.difficulty[index];
      if (element) {
        difficulty.push(index)
      }
    }

    let body = {
      status: (this.status === 'solved') ? true : false,
    }

    if (difficulty.length != 0) {
      body['difficulty'] = difficulty
    }
    if (this.tags.length != 0) {
      body['tags'] = this.tags
    }

    this.globalService.loader(true)
    this.practiceService.getChallenges(body).subscribe(res => {

      this.challenges = res.documents;
      (this.status === 'solved') ? (this.buttonText = "Try Again") : (this.buttonText = "Solve Challenge");
      this.globalService.loader(false)
    }, error => {
      console.log(error)
      this.globalService.loader(false)
    })
  }

  navigateToPracticeSession(id) {
    this.router.navigate(['/student-dashboard/practice-session'], { queryParams: { 'challengeId': id } })
  }

  ngOnInit() {
  }

}
