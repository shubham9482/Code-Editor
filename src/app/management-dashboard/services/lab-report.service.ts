import { Injectable } from '@angular/core';
import {getApiConfig} from "../management-dashboard_config"
import { AppConfigService } from '../../services/app-config.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LabReportService {

  constructor(public http: Http, public _appConfigService: AppConfigService) { }

  getDepts()
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_ALL_DEPARTMENTS'),options).map(res => res.json());
  }

  getFaculties()
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_ALL_FACULTIES'),options).map(res => res.json());
  }

  getLabs()
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_ALL_LABS'),options).map(res => res.json());
  }

  getLabReports(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('GET_LAB_REPORTS'),body,options).map(res => res.json());
  }

  getStudentLabReport(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('GET_LAB_REPORTS'),body,options).map(res => res.json());
  }

  sendNotification(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('NOTIFICATION_API'),body,options).map(res => res.json());
  }
}
