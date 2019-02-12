import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';
import {SharedModule} from '../shared/shared.module'

import { FacultyDashboardRoutingModule } from './faculty-dashboard-routing.module';
import { EditExamComponent } from './components/edit-exam/edit-exam.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditLabsComponent } from './components/edit-labs/edit-labs.component';
// import {TimePickerComponent} from './../components/utility/time-picker/time-picker.component'
// import { CoursesComponent } from '../components/courses/courses.component';
// import {DateRangePickerComponent} from './../components/utility/date-range-picker/date-range-picker.component'
// import { NgDatepickerModule } from 'ng2-datepicker';


@NgModule({
  imports: [
    CommonModule,
    FacultyDashboardRoutingModule,FormsModule,ReactiveFormsModule,SharedModule
  ],
  declarations: [EditExamComponent, DashboardComponent, EditLabsComponent]
})
export class FacultyDashboardModule { }
