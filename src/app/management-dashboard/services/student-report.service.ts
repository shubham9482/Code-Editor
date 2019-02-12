import { Injectable } from '@angular/core';
import {getApiConfig} from "../management-dashboard_config"
import { AppConfigService } from '../../services/app-config.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class StudentReportService {

  constructor(public http: Http, public _appConfigService: AppConfigService) { }

  getContestReport(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('GET_STUDENT_CONTEST_REPORT'), body,options).map(res => res.json());
  }

  getCourseReport(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('GET_STUDENT_COURSE_REPORT'), body,options).map(res => res.json());
  }

  getPracticeReport(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('GET_STUDENT_PRACTICE_REPORT'), body,options).map(res => res.json());
  }

  getExamReport(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('GET_STUDENT_EXAM_REPORT'), body,options).map(res => res.json());
  }

  getStudentDetails(rollNo)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_STUDENT_DETAILS')+"?rollNo="+rollNo,options).map(res => res.json());    
  }

  getStudentLabReport(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('GET_LAB_REPORTS'),body,options).map(res => res.json());
  }

  getStudentLabs(studentId)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_STUDENT_LABS')+"?studentId="+studentId,options).map(res => res.json());
  }
}
