import { BrowserModule } from '@angular/platform-browser';
import { CdkTableModule } from '@angular/cdk/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AceEditorModule } from 'ng2-ace-editor/dist';

// import {MatSidenavModule} from '@angular/material/sidenav';
// import { AdminDashboardModule } from './admin-dashboard/admin-dashboard.module';
// import { StudentDashboardModule } from './student-dashboard/student-dashboard.module';

// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AppComponent } from './app.component';
import { LogoutComponent } from './components/logout/logout.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
// import { RegistrationComponent } from './components/registration/registration.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { TestComponent } from './components/test/test.component';
import { CoursesComponent } from './components/courses/courses.component';

import { ForgotPasswordService } from './services/forgot-password.service';
import { LoginService } from './services/login.service';
import { RegisterService } from './services/register.service';
import { AppConfigService } from './services/app-config.service';
import { GlobalService } from './global.service';

//Auth Guards
import { AdminAuthGuardService } from './services/admin-auth-guard.service';
import { FacultyAuthGuardService } from './services/faculty-auth-guard.service';
import { ManagementAuthGuardService } from './services/management-auth-guard.service';
import { LoginAuthGuardService } from './services/login-auth-guard.service';
import { StudentAuthGuardService } from './services/student-auth-guard.service';
import { SocketServiceService } from './services/socket-service.service';
import { CourseTestAuthGuardService } from './services/course-test-auth-guard.service';
import { ModalComponent } from './components/utility/modal/modal.component';

// import { DateRangePickerComponent } from './components/utility/date-range-picker/date-range-picker.component';
// import { PasswordValidatorDirective } from './directives/password-validator.directive';
// import { AuthGuardService } from './services/auth-guard.service';

const appRoutes: Routes = [
  { path: '', canActivate: [LoginAuthGuardService], redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', canActivate: [LoginAuthGuardService], component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'courses', canActivate: [CourseTestAuthGuardService], component: CoursesComponent },
  { path: 'test', canActivate: [CourseTestAuthGuardService], component: TestComponent },
  // { path: 'register', component: RegistrationComponent },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'admin-dashboard',
    loadChildren: 'app/admin-dashboard/admin-dashboard.module#AdminDashboardModule',
    canLoad: [AdminAuthGuardService]
  },
  {
    path: 'management-dashboard',
    loadChildren: 'app/management-dashboard/management-dashboard.module#ManagementDashboardModule',
    canLoad: [ManagementAuthGuardService]
  },
  {
    path: 'student-dashboard',
    loadChildren: 'app/student-dashboard/student-dashboard.module#StudentDashboardModule',
    canLoad: [StudentAuthGuardService]
  },
  {
    path: 'faculty-dashboard',
    loadChildren: 'app/faculty-dashboard/faculty-dashboard.module#FacultyDashboardModule',
    canLoad: [FacultyAuthGuardService]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LogoutComponent,
    LoginComponent,
    DashboardComponent,
    // RegistrationComponent,
    ForgotPasswordComponent,
    CoursesComponent,
    TestComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,AceEditorModule,BrowserAnimationsModule, CdkTableModule, RouterModule.forRoot(appRoutes, { useHash: true }), FormsModule, HttpModule, ReactiveFormsModule
  ],
  providers: [AppConfigService, SocketServiceService, GlobalService, CourseTestAuthGuardService, StudentAuthGuardService, ManagementAuthGuardService, AdminAuthGuardService, LoginAuthGuardService, FacultyAuthGuardService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
