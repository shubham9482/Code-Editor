import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var $: any;
// import { } from '../../admin-dashboard/admin-dashboard/'
import { AdminDashboardService } from '../../admin-dashboard/services/admin-dashboard.service'
import { CoursesService } from '../../services/courses.service'
import { GlobalService } from '../../global.service'
import { Router, ActivatedRoute } from '@angular/router';
import { constants } from '../../../assets/config/api_config'

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css', '../../admin-dashboard/admin-dashboard/admin-dashboard.component.css'],
  providers: [AdminDashboardService, CoursesService]
})
export class CoursesComponent implements OnInit, AfterViewInit {


  courses = [];
  selectedCourse = "";
  modules = {
    completedModules: [],
    laterModules: [],
    ongoingModule: {}

  };
  selectedLesson;
  selectedModule;
  tempSelectedModule;
  selectedModuleDesc;
  nextModuleDesc;
  prevModuleAv;
  showModules = true;
  answers = [];
  radioButtonAnswer = ""
  correctAnswer = false;
  submitted = false;

  modulesKeyValuePairs = [];
  takeTest = ""
  details
  showPreviousButton = false
  // ongoingModulesKeyValuePairs=[];

  constructor(private route: ActivatedRoute, private router: Router, private adminService: AdminDashboardService, private courseService: CoursesService, private globalService: GlobalService) {

    window.onbeforeunload = null;
    this.route.queryParamMap.subscribe(map => {
      this.details = map['params']
      if (this.details != undefined && this.details.courseId) {
        // this.courseChange();
      }
      else {
        // this.router.navigate(['/courses']);
        alert("Please choose the course")
        if (this.globalService.roleType === 1) {
          this.router.navigate(['/student-dashboard']);
        }
        else if (this.globalService.roleType === 3) {
          this.router.navigate(['/faculty-dashboard']);
        }
      }
    });
  }

  getEntities() {
    this.adminService.getCourses().subscribe(res => {
      this.courses = res.documents;
    })
  }

  courseChange() {
    // if (this.selectedCourse) {
    // this.globalService.loader(true)
    // this.courseService.getCourseContent(this.details.courseId).subscribe(res => {
    //   this.modules = res
    //   delete this.modules["flag"];
    //   if (("_id" in this.modules.ongoingModule)) {
    //     this.selectedModule = this.modules.ongoingModule["_id"]
    //     this.tempSelectedModule = this.modules.ongoingModule["_id"]
    //     this.selectedModuleDesc = { description: this.modules.ongoingModule["description"], name: this.modules.ongoingModule["name"] }
    //     this.takeTest = "ongoingModule"
    //   }
    //   else {
    //     this.selectedModule = this.modules.completedModules[0]["_id"]
    //     this.tempSelectedModule = this.modules.completedModules[0]["_id"]
    //     this.selectedModuleDesc = { description: this.modules.completedModules[0]["description"], name: this.modules.completedModules[0]["name"] }
    //     this.takeTest = "completedModules"
    //   }
    //   // console.log(document.getElementById("moduleDesc"))
    //   const fragment = document.createRange().createContextualFragment(this.selectedModuleDesc.description);
    //   document.getElementById("moduleDesc").appendChild(fragment);
    //   this.loadJquery()
    //   this.storeModuleKeyValuePairs()
    //   // this.getCurrentModule();
    //   this.globalService.loader(false)
    // }, error => {

    //   this.globalService.loader(false)

    //   console.log(error)
    // })
    // }
  }

  loadJquery() {
    $(function () {
      // Add minus icon for collapse element which is open by default
      $(".collapse.in").each(function () {
        $(this).siblings(".panel-heading").find(".glyphicon").addClass("glyphicon-minus").removeClass("glyphicon-plus");
      });

      // Toggle plus minus icon on show hide of collapse element
      $(".collapse").on('show.bs.collapse', function () {
        $(this).parent().find(".glyphicon").removeClass("glyphicon-plus").addClass("glyphicon-minus");
      }).on('hide.bs.collapse', function () {
        $(this).parent().find(".glyphicon").removeClass("glyphicon-minus").addClass("glyphicon-plus");
      });
    });
  }

  // getCurrentModule() {
  //   if (this.getKeys(this.modules.ongoingModule).length != 0)
  //     this.selectedModule = "ongoingModule"
  //   else if(this.getKeys(this.modules.completedModules).length !=0)
  //     this.selectedModule="completedModules"
  // }

  storeModuleKeyValuePairs() {

    this.modulesKeyValuePairs = [];
    let keys = this.getKeys(this.modules)
    keys.splice(2, 1)
    for (var index = 0; index < keys.length; index++) {
      var element = keys[index];

      if (element === "completedModules") {
        for (var i = 0; i < this.modules[element].length; i++) {
          var module$ = this.modules[element][i];

          for (var j = 0; j < module$.lessons.length; j++) {
            var lesson = module$.lessons[j];

            this.modulesKeyValuePairs.push({ module: element, moduleId: module$._id, moduleName: module$.name, moduleIndex: i, lessonIndex: j, lessonId: lesson.lessonId, flag: 0 })
          }

        }
      }
      else {

        if (("lessons" in this.modules[element])) {
          for (var j = 0; j < this.modules[element].lessons.length; j++) {
            var lesson = this.modules[element].lessons[j];

            this.modulesKeyValuePairs.push({ module: element, moduleId: this.modules.ongoingModule["_id"], moduleName: this.modules.ongoingModule["name"], lessonIndex: j, lessonId: lesson.lessonId, flag: lesson.flag })
          }
        }

      }
    }
  }

  nextModule() {
    for (let index = 0; index < this.modulesKeyValuePairs.length; index++) {
      const element = this.modulesKeyValuePairs[index];

      if (element.moduleId === this.selectedModule._id && element.module === "completedModules") {
        if (element.moduleIndex === (this.modules.completedModules.length - 1)) {

          if (("_id" in this.modules.ongoingModule)) {
            this.moduleClicked("ongoingModule", this.modules.ongoingModule)
            this.nextModuleDesc = "Next Module Unavailable"
            this.prevModuleAv = true
          }
        }
        else {
          this.moduleClicked("completedModules", this.modules.completedModules[element.moduleIndex + 1])
          if (element.moduleIndex + 1 === (this.modules.completedModules.length - 1)) {

            if (("_id" in this.modules.ongoingModule)) {
              this.nextModuleDesc = this.modules.ongoingModule["name"]
            }
            else {
              this.nextModuleDesc = "Next Module Unavailable"
            }
          }
          else {
            this.nextModuleDesc = this.modules.completedModules[element.moduleIndex + 2].name
          }
          this.prevModuleAv = true
        }
        break;
      }
      // else if (element.moduleId === this.selectedModule._id && element.module === "ongoingModule") {
      //   this.prevModuleAv = false
      // }
    }
  }

  previousModule() {

    for (let index = 0; index < this.modulesKeyValuePairs.length; index++) {
      const element = this.modulesKeyValuePairs[index];

      if (element.moduleId === this.selectedModule._id && element.module === "completedModules") {
        if (element.moduleIndex !== 0) {
          this.moduleClicked("completedModules", this.modules.completedModules[element.moduleIndex - 1])
          this.nextModuleDesc = element.moduleName
          if (element.moduleIndex === 1) {
            this.prevModuleAv = false
          }
          else {
            this.prevModuleAv = true
          }
          break;
        }
      }
      else if (element.moduleId === this.selectedModule._id && element.module === "ongoingModule") {
        if (this.modules.completedModules.length !== 0) {
          this.moduleClicked("completedModules", this.modules.completedModules[this.modules.completedModules.length - 1])
          this.nextModuleDesc = element.moduleName
          if (this.modules.completedModules.length === 1) {
            this.prevModuleAv = false
          }
          else {
            this.prevModuleAv = true
          }
          break;
        }
      }
    }

  }

  moduleClicked(testType, module$) {

    let parser = new DOMParser();
    let doc = parser.parseFromString(module$.description, "text/html");
    doc = this.getVideoTag(doc)
    module$.description = doc
    this.selectedLesson = ""

    this.takeTest = testType;
    this.tempSelectedModule = module$
    this.selectedModule = module$
    this.selectedModuleDesc = { description: module$.description, name: module$.name }

    var moduleDesc = document.getElementById("moduleDesc");   // Get the <ul> element with id="myList"
    moduleDesc.innerHTML = "";
    const fragment = document.createRange().createContextualFragment(this.selectedModuleDesc.description);
    moduleDesc.appendChild(fragment);
  }

  lessonClicked(lesson) {
    if (lesson.lessonDescription) {


      let parser = new DOMParser();
      let doc = parser.parseFromString(lesson.lessonDescription, "text/html");

      doc = this.getVideoTag(doc)

      lesson.lessonDescription = doc
      this.selectedLesson = lesson
      for (var index = 0; index < this.modulesKeyValuePairs.length; index++) {
        var element = this.modulesKeyValuePairs[index].lessonId;
        if (element === this.selectedLesson["lessonId"]) {
          if (index === 0)
            this.showPreviousButton = false
          else
            this.showPreviousButton = true

          break
        }

      }
      // if (("ans" in this.selectedLesson["lessonQuestion"])) {
      //   this.answers.length = this.selectedLesson["lessonQuestion"]["ans"].length
      // }
      // else
      // {
      // }

      var lessonDesc = document.getElementById("lessonDesc");   // Get the <ul> element with id="myList"
      lessonDesc.innerHTML = "";
      const fragment = document.createRange().createContextualFragment(this.selectedLesson["lessonDescription"]);
      lessonDesc.appendChild(fragment);

      this.reset()
    }
  }

  getVideoTag(doc) {
    let videoUrl = doc.getElementsByClassName('videoContainer')

    for (var index = 0; index < videoUrl.length; index++) {
      var element = videoUrl[index];

      if (element.hasChildNodes()) {
        element.removeChild(element.childNodes[0]);
      }

      let videoElement = doc.createElement("video");
      videoElement.setAttribute("controls", "controls")
      videoElement.setAttribute("width", "600")

      let sourceElement = doc.createElement("source");
      sourceElement.setAttribute("src", element.getAttribute("src"))
      sourceElement.setAttribute("type", "video/mp4")

      videoElement.appendChild(sourceElement)
      // element.setAttribute("src","#")
      element.appendChild(videoElement)

      // console.log(element)
    }
    return doc.querySelector("body").innerHTML
  }

  getKeys(object): Array<string> {

    if (object)
      return Object.keys(object)

    else return
  }

  gotoLessonQuestion() {
    this.showModules = false;
  }

  checkAnswer() {

    this.selectedLesson["lessonQuestions"].forEach(element => {
      if (("ans" in element)) {
        if (this.selectedLesson["lessonQuestion"]["questionType"] === 0) {
          for (var index = 0; index < this.selectedLesson["lessonQuestion"]["options"].length; index++) {
            var element = this.selectedLesson["lessonQuestion"]["options"][index];
  
            if (element === this.radioButtonAnswer) {
              if (this.selectedLesson["lessonQuestion"]["ans"][index] === true) {
                //correct
                this.correctAnswer = true
                this.submitted = true
              }
              else {
                //incorrect
                this.correctAnswer = false
                this.submitted = true
                break;
              }
            }
          }
        }
        else if (this.selectedLesson["lessonQuestion"]["questionType"] === 1) {
          let flag = true;
          for (var index = 0; index < this.selectedLesson["lessonQuestion"]["ans"].length; index++) {
            var element = this.selectedLesson["lessonQuestion"]["ans"][index];
  
            if (element != this.answers[index]) {
              flag = false;
              break;
            }
          }
          if (flag) {
            this.correctAnswer = true
            this.submitted = true
            //answer correct
          }
          else {
            this.correctAnswer = false
            this.submitted = true
            //incorrect
          }
        }
      }
      else {
        let answers = this.answers
        let body = {
          courseId: this.details.courseId
        }
  
        if (this.selectedLesson["lessonQuestion"]["questionType"] === 0) {
  
          answers.length = this.selectedLesson["lessonQuestion"]["options"].length
          answers.fill(false)
          for (var index = 0; index < this.selectedLesson["lessonQuestion"]["options"].length; index++) {
            var element = this.selectedLesson["lessonQuestion"]["options"][index];
  
            if (element === this.radioButtonAnswer) {
              answers[index] = true
              break;
            }
          }
          body["ans"] = answers
        }
        else if (this.selectedLesson["lessonQuestion"]["questionType"] === 1) {
          body["ans"] = answers
        }
  
        this.courseService.unlockLesson(body).subscribe(res => {
  
          this.correctAnswer = true
          this.submitted = true
  
          this.changeLessonState(res.nextLesson, answers)
        }, error => {
          this.correctAnswer = false
          this.submitted = true
          console.log(error)
        })
      }
    });
    
  }

  changeLessonState(nextLesson, answers) {
    for (var index = 0; index < this.modules.ongoingModule["lessons"].length; index++) {
      var element = this.modules.ongoingModule["lessons"][index];
      if (element.flag === 1) {

        element["flag"] = 0;
        element["lessonQuestion"]["ans"] = answers
        this.modules.ongoingModule["lessons"][index] = element;

        if (nextLesson) {
          nextLesson["flag"] = 1
          this.modules.ongoingModule["lessons"][index + 1] = nextLesson;
          // this.selectedLesson=this.modules.ongoingModule["lessons"][index + 1]
        }
        else {
          // this.modules.completedModules[this.modules.completedModules.length]=new Object(this.modules.ongoingModule)
          // this.modules.ongoingModule={}
        }
        this.storeModuleKeyValuePairs();
        break;
      }
    }
  }

  nextLesson() {
    for (var index = 0; index < this.modulesKeyValuePairs.length; index++) {
      var element = this.modulesKeyValuePairs[index];
      if (element.lessonId === this.selectedLesson["lessonId"] && element.flag !== 2 && index + 1 !== this.modulesKeyValuePairs.length) {
        if (element.module === "completedModules" && this.modulesKeyValuePairs[index + 1].module === "completedModules") {
          this.lessonClicked(this.modules.completedModules[this.modulesKeyValuePairs[index + 1].moduleIndex].lessons[this.modulesKeyValuePairs[index + 1].lessonIndex])
          this.takeTest = "completedModules"
        }
        else {
          this.lessonClicked(this.modules.ongoingModule["lessons"][this.modulesKeyValuePairs[index + 1].lessonIndex])
          this.takeTest = "ongoingModule"
        }
        this.selectedModule = (this.modulesKeyValuePairs[index + 1].module === "completedModules") ? this.modules[this.modulesKeyValuePairs[index + 1].module][this.modulesKeyValuePairs[index + 1].moduleIndex] : this.modules[this.modulesKeyValuePairs[index + 1].module]
        this.tempSelectedModule = (this.modulesKeyValuePairs[index + 1].module === "completedModules") ? this.modules[this.modulesKeyValuePairs[index + 1].module][this.modulesKeyValuePairs[index + 1].moduleIndex] : this.modules[this.modulesKeyValuePairs[index + 1].module]
        this.showModules = true;
        this.reset()
        break;
      }
      else
      {
        this.reset()
        this.showModules = true;
      }
        
      // if(index===this.modulesKeyValuePairs.length-1)
      // {
      //   this.selectedModule=this.modulesKeyValuePairs[index].moduleId
      // }
    }
    // this.loadJquery()

  }

  previousLesson() {
    for (var index = 0; index < this.modulesKeyValuePairs.length; index++) {
      var element = this.modulesKeyValuePairs[index];

      if (element.lessonId === this.selectedLesson["lessonId"] && index != 0) {
        // if (element.module === "ongoingModule") {
        //   if(this.modulesKeyValuePairs[index - 1].module === "ongoingModule")
        //   {
        //     this.lessonClicked(this.modules.ongoingModule["lessons"][this.modulesKeyValuePairs[index - 1].lessonIndex])
        //     this.takeTest = "ongoingModule"
        //   }
        //   this.selectedLesson = this.modules.completedModules[this.modulesKeyValuePairs[index + 1].moduleIndex].lessons[this.modulesKeyValuePairs[index + 1].lessonIndex]
        //   this.takeTest = "completedModules"
        // }
        // else {
        //   this.selectedLesson = 
        //   this.takeTest = "ongoingModule"
        // }
        this.selectedModule = (this.modulesKeyValuePairs[index - 1].module === "completedModules") ? this.modules[this.modulesKeyValuePairs[index - 1].module][this.modulesKeyValuePairs[index - 1].moduleIndex] : this.modules[this.modulesKeyValuePairs[index - 1].module];
        this.tempSelectedModule = (this.modulesKeyValuePairs[index - 1].module === "completedModules") ? this.modules[this.modulesKeyValuePairs[index - 1].module][this.modulesKeyValuePairs[index - 1].moduleIndex] : this.modules[this.modulesKeyValuePairs[index - 1].module];
        (this.modulesKeyValuePairs[index - 1].module === "ongoingModule") ? this.lessonClicked(this.modules.ongoingModule["lessons"][this.modulesKeyValuePairs[index - 1].lessonIndex]) : this.modules.completedModules[this.modulesKeyValuePairs[index + 1].moduleIndex].lessons[this.modulesKeyValuePairs[index + 1].lessonIndex];
        this.reset()
        break;
      }
      // if(index===this.modulesKeyValuePairs.length-1)
      // {
      //   this.selectedModule=this.modulesKeyValuePairs[index].moduleId
      // }
    }

    // this.showModules = true;
    // this.reset()
    // this.loadJquery()
  }

  goBackToLesson()
  {
    this.showModules=true
  }

  reset() {
    this.selectedLesson["lessonQuestions"].forEach(element => {
      let quesAns = []
      quesAns.length = element.options.length
      quesAns.fill(false)
      this.answers.push(quesAns)
      // this.answers.length = this.selectedLesson["lessonQuestion"]["options"].length
      // this.answers.fill(false)
    });
    this.radioButtonAnswer = ""
    this.correctAnswer = false;
    this.submitted = false;
  }

  practice() {

    let moduleId = this.modulesKeyValuePairs.filter(e => {
      return this.tempSelectedModule._id === e.moduleId
    })[0].moduleId

    // let obj={
    //   type:"practice",
    //   courseId:this.details.courseId,
    //   moduleId:moduleId
    // }
    // this.globalService.setCourseDetails(obj)
    this.router.navigate(['/test'], { queryParams: { type: 'practice', 'courseId': this.details.courseId, 'moduleId': moduleId } });
  }

  test() {

    let moduleId = this.modulesKeyValuePairs.filter(e => {
      return this.tempSelectedModule._id === e.moduleId
    })[0].moduleId
    // let obj={
    //   type:"test",
    //   courseId:this.details.courseId,
    //   moduleId:moduleId
    // }
    // this.globalService.setCourseDetails(obj)
    // this.globalService.testWindow = window.open("http://localhost:4200/#/test" + "?type=test&courseId=" + this.details.courseId + "&moduleId=" + moduleId, '_self', "height=500,width=1000,location=0,menubar=no,toolbar=no,status=no");
    this.router.navigate(['/test'], { queryParams: { type: 'test', 'courseId': this.details.courseId, 'moduleId': moduleId } });
    // this.router.navigate(['/test'],{queryParams:{type:'test','courseId':this.details.courseId,'moduleId':moduleId},replaceUrl:true});

  }

  ngAfterViewInit(): void {
    // throw new Error("Method not implemented.");

    this.globalService.loader(true)
    this.courseService.getCourseContent(this.details.courseId).subscribe(res => {
      this.modules = res
      delete this.modules["flag"];
      if (("_id" in this.modules.ongoingModule)) {
        this.selectedModule = this.modules.ongoingModule
        this.nextModuleDesc = "Next Module Unavailable"
        this.modules.completedModules.length === 0 ? this.prevModuleAv = false : this.prevModuleAv = true
        this.moduleClicked('ongoingModule', this.modules.ongoingModule)
      }
      else {
        this.selectedModule = this.modules.completedModules[0]
        this.nextModuleDesc = this.modules.completedModules[1].name
        this.prevModuleAv = false
        this.moduleClicked('completedModules', this.modules.completedModules[0])
      }
      // console.log(document.getElementById("moduleDesc"))
      // const fragment = document.createRange().createContextualFragment(this.selectedModuleDesc.description);
      // document.getElementById("moduleDesc").appendChild(fragment);
      // this.loadJquery()
      this.storeModuleKeyValuePairs()
      // this.getCurrentModule();
      this.globalService.loader(false)
    }, error => {

      this.globalService.loader(false)

      console.log(error)
    })
  }

  ngOnInit() {
  }

}
