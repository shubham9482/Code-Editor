import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditExamComponent } from './components/edit-exam/edit-exam.component';
import { FacultyAuthGuardService } from '../services/faculty-auth-guard.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditLabsComponent } from './components/edit-labs/edit-labs.component';
// import { CoursesComponent } from '../components/courses/courses.component';

const routes: Routes = [
  {path:'',canActivate:[FacultyAuthGuardService],component:DashboardComponent},  
  {path:'edit-exam',canActivate:[FacultyAuthGuardService],component:EditExamComponent},
  {path:'edit-labs',canActivate:[FacultyAuthGuardService],component:EditLabsComponent},
  // {path:'courses',canActivate:[FacultyAuthGuardService],component:CoursesComponent}    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacultyDashboardRoutingModule { }
