import { Injectable } from '@angular/core';
import { getApiConfig } from "../../assets/config/api_config"
import { AppConfigService } from '../services/app-config.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class SessionService {

  constructor(public http: Http, public _appConfigService: AppConfigService) { }

  // enableExamSession(body) {
  //   let headers = this._appConfigService.getPostHeader(); //
  //   let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json });

  //   return this.http.post(getApiConfig('COURSE_FILTER'), body, options).map(res => res.json());
  // }

  enableExamSession(notificationId) {
    let headers = this._appConfigService.getGetHeader();// 
    let options = new RequestOptions({ headers: headers,  responseType: ResponseContentType.Json });

    return this.http.get(getApiConfig('ENABLE_EXAM_SESSION') + "?notificationId=" + notificationId, options).map(res => res.json());
  }

  enableContestSession(notificationId)
  {
    let headers = this._appConfigService.getGetHeader();// 
    let options = new RequestOptions({ headers: headers,  responseType: ResponseContentType.Json });

    return this.http.get(getApiConfig('ENABLE_CONTEST_SESSION') + "?notificationId=" + notificationId, options).map(res => res.json());
  }

  enableLabSession(notificationId,password)
  {
    let body={
      notificationId:notificationId,
      password:password
    }
    let headers = this._appConfigService.getGetHeader();// 
    let options = new RequestOptions({ headers: headers,  responseType: ResponseContentType.Json });

    return this.http.post(getApiConfig('ENABLE_LAB_SESSION') ,body, options).map(res => res.json());
  }

  getAllNotifications()
  {
    let headers = this._appConfigService.getGetHeader();// 
    let options = new RequestOptions({ headers: headers,  responseType: ResponseContentType.Json });

    return this.http.get(getApiConfig('GET_ALL_NOTIFICATIONS'), options).map(res => res.json());
  }
}
