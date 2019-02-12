import { Injectable } from '@angular/core';
import {getApiConfig} from "../management-dashboard_config"
import { AppConfigService } from '../../services/app-config.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ExamReportService {

  constructor(public http: Http, public _appConfigService: AppConfigService) { }

  getExams() {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_ALL_EXAMS'), options).map(
      res => res.json()
    );
  }

  getExamDetail(examId) {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_EXAM_DETAILS')+"?examId="+examId, options).map(
      res => res.json()
    );
  }
}
