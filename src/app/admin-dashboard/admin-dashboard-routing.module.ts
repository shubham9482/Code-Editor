import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageCourseComponent } from './manage-course/manage-course.component';
import { AddUserComponent } from './add-user/add-user.component';
import { EditStudentComponent } from './edit-student/edit-student.component';
import { EditFacultyComponent } from './edit-faculty/edit-faculty.component'
import { ManageLabsComponent } from './manage-labs/manage-labs.component';
import { CreateExamComponent } from './create-exam/create-exam.component';
import { EditExamComponent } from './edit-exam/edit-exam.component';
import { CreateChallengeComponent } from './create-challenge/create-challenge.component';
import { EditChallengeComponent } from './edit-challenge/edit-challenge.component';
import { CreateContestComponent } from './create-contest/create-contest.component';
import { EditContestComponent } from './edit-contest/edit-contest.component';
import { ManageStatusComponent } from './manage-status/manage-status.component';
import { AdminAuthGuardService } from '../services/admin-auth-guard.service';

const routes: Routes = [
  {path: '',canActivate:[AdminAuthGuardService],component:AdminDashboardComponent},
  {path: 'manage-course',canActivate:[AdminAuthGuardService],component:ManageCourseComponent},
  {path: 'add-new',canActivate:[AdminAuthGuardService],component:AddUserComponent},
  {path: 'edit-student',canActivate:[AdminAuthGuardService],component:EditStudentComponent},
  {path: 'edit-faculty',canActivate:[AdminAuthGuardService],component:EditFacultyComponent},
  {path: 'manage-labs',canActivate:[AdminAuthGuardService],component:ManageLabsComponent},
  {path: 'create-exam',canActivate:[AdminAuthGuardService],component:CreateExamComponent},
  {path: 'create-challenge',canActivate:[AdminAuthGuardService],component:CreateChallengeComponent},
  {path: 'edit-challenge',canActivate:[AdminAuthGuardService],component:EditChallengeComponent},
  {path: 'create-contest',canActivate:[AdminAuthGuardService],component:CreateContestComponent},
  {path: 'edit-contest',canActivate:[AdminAuthGuardService],component:EditContestComponent},
  {path: 'manage-status',canActivate:[AdminAuthGuardService],component:ManageStatusComponent}
  // {path: 'edit-exam',component:EditExamComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[AdminAuthGuardService]
})
export class AdminDashboardRoutingModule { }
