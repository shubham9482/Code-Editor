import { Injectable } from '@angular/core';
import {getApiConfig} from "../management-dashboard_config"
import { AppConfigService } from '../../services/app-config.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PracticeReportService {

  constructor(public http: Http, public _appConfigService: AppConfigService) { }

  getPracticeReport(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('GET_PRACTICE_REPORT'), body,options).map(res => res.json());
  }
  
  sendNotification(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('NOTIFICATION_API'),body,options).map(res => res.json());
  }
}
