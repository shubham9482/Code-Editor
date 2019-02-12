import { Injectable } from '@angular/core';
import {getApiConfig} from "../student-dashboard-config"
import { AppConfigService } from '../../services/app-config.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LabsService {

  constructor(public http: Http, public _appConfigService: AppConfigService) { }

  getSudentLabReport(labId)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('STUDENT_WISE_LAB_REPORT')+"?labId="+labId,options).map(res => res.json());
  }

  getSudentLab()
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_STUDENT_LAB'),options).map(res => res.json());
  }

  getStudentLabReport(submissionId,labId)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('STUDENT_WISE_LAB_REPORT')+"?submissionId="+submissionId+"&labId="+labId,options).map(res => res.json());
  }

  downloadLabReport(body)
  {
    let headers = this._appConfigService.getPostHeader(); //
    let options = new RequestOptions({ headers: headers,  responseType: ResponseContentType.Json });

    return this.http.post(getApiConfig('DOWNLOAD_LAB_REPORT'), body, options).map(res => res.json());
  }
}
