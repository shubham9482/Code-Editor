import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';
// import {AppModule} from '../app.module'

import { ManagementDashboardRoutingModule } from './management-dashboard-routing.module';
import { ContestReportComponent } from './components/contest-report/contest-report.component';
import { CourseReportComponent } from './components/course-report/course-report.component';
import { EditExamComponent } from './components/edit-exam/edit-exam.component';
import { ExamReportComponent } from './components/exam-report/exam-report.component';
import { LabReportComponent } from './components/lab-report/lab-report.component';
import { PracticeReportComponent } from './components/practice-report/practice-report.component';
import { StudentReportComponent } from './components/student-report/student-report.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {DateRangePickerComponent} from './../components/utility/date-range-picker/date-range-picker.component'

@NgModule({
  imports: [
    CommonModule,
    ManagementDashboardRoutingModule,FormsModule,ReactiveFormsModule,ChartsModule
  ],
  declarations: [DateRangePickerComponent,ContestReportComponent, CourseReportComponent, EditExamComponent, ExamReportComponent, LabReportComponent, PracticeReportComponent, StudentReportComponent, DashboardComponent]
})
export class ManagementDashboardModule { }
