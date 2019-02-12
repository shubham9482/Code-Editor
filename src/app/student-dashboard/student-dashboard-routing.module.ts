import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { LabReportComponent } from './components/lab-report/lab-report.component';
import { ExamsComponent } from './components/exams/exams.component';
import { StudentAuthGuardService } from '../services/student-auth-guard.service';
import { ExamSessionComponent } from './components/exam-session/exam-session.component';
import { LabSessionComponent } from './components/lab-session/lab-session.component';
import { ContestSessionComponent } from './components/contest-session/contest-session.component';
import { PracticeComponent } from './components/practice/practice.component';
import { PracticeSessionComponent } from './components/practice-session/practice-session.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { ContestComponent } from './components/contest/contest.component';

const routes: Routes = [
  {path: '',canActivate:[StudentAuthGuardService],component:StudentDashboardComponent},
  {path: 'lab-report',canActivate:[StudentAuthGuardService],component:LabReportComponent},
  {path: 'exams',canActivate:[StudentAuthGuardService],component:ExamsComponent},
  {path: 'exam-session',canActivate:[StudentAuthGuardService],component:ExamSessionComponent},
  {path: 'lab-session',canActivate:[StudentAuthGuardService],component:LabSessionComponent},
  {path: 'contest-session',canActivate:[StudentAuthGuardService],component:ContestSessionComponent},
  {path: 'practice',canActivate:[StudentAuthGuardService],component:PracticeComponent},
  {path: 'practice-session',canActivate:[StudentAuthGuardService],component:PracticeSessionComponent},
  {path: 'profile-settings',canActivate:[StudentAuthGuardService],component:ProfileSettingsComponent},
  {path: 'contests',canActivate:[StudentAuthGuardService],component:ContestComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentDashboardRoutingModule { }
