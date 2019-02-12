import { Injectable } from '@angular/core';
import {getApiConfig} from "../student-dashboard-config"
import { AppConfigService } from '../../services/app-config.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ExamService {

  constructor(public http: Http, public _appConfigService: AppConfigService) { }

  getCompletedExams(examId)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('EXAM_COMPLETED')+"?examId="+examId ,options).map(res => res.json());
  }

  getUpcomingExams()
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('EXAM_UPCOMING'),options).map(res => res.json());
  }
}
