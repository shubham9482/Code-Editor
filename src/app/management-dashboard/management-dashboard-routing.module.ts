import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContestReportComponent } from './components/contest-report/contest-report.component';
import { CourseReportComponent } from './components/course-report/course-report.component';
import { EditExamComponent } from './components/edit-exam/edit-exam.component';
import { ExamReportComponent } from './components/exam-report/exam-report.component';
import { LabReportComponent } from './components/lab-report/lab-report.component';
import { PracticeReportComponent } from './components/practice-report/practice-report.component';
import { StudentReportComponent } from './components/student-report/student-report.component';
import { ManagementAuthGuardService } from '../services/management-auth-guard.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  {path: '',canActivate:[ManagementAuthGuardService], component:DashboardComponent},
  {path: 'contest-report',canActivate:[ManagementAuthGuardService],component:ContestReportComponent},
  {path: 'course-report',canActivate:[ManagementAuthGuardService],component:CourseReportComponent},
  // {path: 'edit-exam',component:EditExamComponent},
  {path: 'exam-report',canActivate:[ManagementAuthGuardService],component:ExamReportComponent},
  {path: 'lab-report',canActivate:[ManagementAuthGuardService],component:LabReportComponent},
  {path: 'practice-report',canActivate:[ManagementAuthGuardService],component:PracticeReportComponent},
  {path: 'student-report',canActivate:[ManagementAuthGuardService],component:StudentReportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementDashboardRoutingModule { }
