import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';
import { AceEditorModule } from 'ng2-ace-editor/dist';
import { MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule,MatChipsModule, MatIconModule, MatAutocompleteModule, MatInputModule,MatFormFieldModule } from '@angular/material';
// import {AppModule} from '../app.module'

import { StudentDashboardRoutingModule } from './student-dashboard-routing.module';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { LabReportComponent } from './components/lab-report/lab-report.component';
import { ExamsComponent } from './components/exams/exams.component';
import { ExamSessionComponent } from './components/exam-session/exam-session.component';
import { LabSessionComponent } from './components/lab-session/lab-session.component';
import { ContestSessionComponent } from './components/contest-session/contest-session.component';
import { PracticeComponent } from './components/practice/practice.component';
import { PracticeSessionComponent } from './components/practice-session/practice-session.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { ContestComponent } from './components/contest/contest.component';

@NgModule({
  imports: [
    CommonModule,AceEditorModule,
    StudentDashboardRoutingModule,FormsModule,ReactiveFormsModule,
    MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule,MatChipsModule, MatIconModule, MatAutocompleteModule, MatInputModule,MatFormFieldModule
  ],
  declarations: [StudentDashboardComponent, LabReportComponent, ExamsComponent, ExamSessionComponent, LabSessionComponent, ContestSessionComponent, PracticeComponent, PracticeSessionComponent, ProfileSettingsComponent, ContestComponent]
})
export class StudentDashboardModule { }
