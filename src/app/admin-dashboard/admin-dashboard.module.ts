import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';
import { NgxEditorModule } from 'ngx-editor';
import { HttpClientModule } from '@angular/common/http'; 
import { AceEditorModule } from 'ng2-ace-editor/dist';
import { MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule,MatChipsModule, MatIconModule, MatAutocompleteModule, MatInputModule,MatFormFieldModule } from '@angular/material';
import {SharedModule} from '../shared/shared.module'

import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageCourseComponent } from './manage-course/manage-course.component';
import { CreateChallengeComponent } from './create-challenge/create-challenge.component';
import { AddUserComponent } from './add-user/add-user.component';
import { EditStudentComponent } from './edit-student/edit-student.component';
import { EditFacultyComponent } from './edit-faculty/edit-faculty.component'
import { ManageLabsComponent } from './manage-labs/manage-labs.component';
import { CreateExamComponent } from './create-exam/create-exam.component';
import { EditExamComponent } from './edit-exam/edit-exam.component';
import { EditChallengeComponent } from './edit-challenge/edit-challenge.component';
import { CreateContestComponent } from './create-contest/create-contest.component';
import { EditContestComponent } from './edit-contest/edit-contest.component';
import { ManageStatusComponent } from './manage-status/manage-status.component';
// import {TimePickerComponent} from './../components/utility/time-picker/time-picker.component'

// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';NgbModule,

import {AdminDashboardService} from './services/admin-dashboard.service';

@NgModule({
  imports: [
    CommonModule,SharedModule,NgxEditorModule,HttpClientModule,AceEditorModule,
    AdminDashboardRoutingModule,
    FormsModule,ReactiveFormsModule,
    MatButtonModule,MatChipsModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatAutocompleteModule, MatInputModule,MatFormFieldModule
  ],
  declarations: [AdminDashboardComponent, ManageCourseComponent, CreateChallengeComponent, AddUserComponent, EditStudentComponent, EditFacultyComponent, ManageLabsComponent, CreateExamComponent, EditExamComponent, EditChallengeComponent, CreateContestComponent, EditContestComponent, ManageStatusComponent],
  providers:[AdminDashboardService]
})
export class AdminDashboardModule { 
  // let headers = this._appConfigService.getGetHeader();
  // let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json , withCredentials: true });
  // this.http.get(getApiConfig('GET_USER_ROLE'), options).map(res => res.json()).subscribe(res => {
  //     if (res.flag) {
  //       console.log(res)
  //       this.globalService.roleType=res.entity;
  //     }
  //   },
  //     error => {
  //       return false;
  //     });
}
