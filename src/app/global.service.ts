import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Http } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { AppConfigService } from './services/app-config.service';
import {getApiConfig} from '../assets/config/api_config'
import { Observable } from 'rxjs/Observable';
import {  Router } from '@angular/router';

@Injectable()
export class GlobalService {

  private loaderBroadcastSource = new Subject<boolean>();
  loaderBroadcast$ = this.loaderBroadcastSource.asObservable();

  private roleBroadcastSource = new Subject<number>();
  roleBroadcast$ = this.roleBroadcastSource.asObservable();

  private nameBroadcastSource = new Subject<string>();
  nameBroadcast$ = this.nameBroadcastSource.asObservable();

  roleType;
  testWindow:Window
  // private courseBroadcastSource = new Subject<Object>();
  // courseBroadcast$ = this.courseBroadcastSource.asObservable();
  // public details;

  constructor(private router: Router,private http: Http, private _appConfigService: AppConfigService) { }

  loader(load: boolean) {
    this.loaderBroadcastSource.next(load);
  }

  getUserRole() {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json });
    return this.http.get(getApiConfig('GET_USER_ROLE'), options).map((res => res.json()));
  }

  setRole(roleType:number)
  {
    this.roleBroadcastSource.next(roleType);
    this.roleType=roleType
  }

  setName(name:string)
  {
    this.nameBroadcastSource.next(name);
  }
  // navigateTocourses(courseId)
  // {
  //   this.router.navigate(['/courses'], { queryParams: { 'courseId': courseId } });    
  // }


  // setCourseDetails(details:Object)
  // {
  //   // this.courseBroadcastSource.next(details)
  //   this.details=details
  // }
}
