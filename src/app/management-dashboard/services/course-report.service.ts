import { Injectable } from '@angular/core';
import {getApiConfig} from "../management-dashboard_config"
import { AppConfigService } from '../../services/app-config.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CourseReportService {

  constructor(public http: Http, public _appConfigService: AppConfigService) { }

  getCourseReport(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('GET_COURSE_REPORT'), body,options).map(res => res.json());
  }

  getCourses()
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_ALL_COURSES'),options).map(res => res.json());
  }

  getDepts()
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_ALL_DEPARTMENTS'),options).map(res => res.json());
  }

  getYears()
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_ALL_YEARS'),options).map(res => res.json());
  }
  sendNotification(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('NOTIFICATION_API'),body,options).map(res => res.json());
  }
}
