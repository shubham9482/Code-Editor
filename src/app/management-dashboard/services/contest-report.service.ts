import { Injectable } from '@angular/core';
import {getApiConfig} from "../management-dashboard_config"
import { AppConfigService } from '../../services/app-config.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ContestReportService {

  constructor(public http: Http, public _appConfigService: AppConfigService) { }

  getManagementContests()
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_CONTESTS'),options).map(res => res.json());
  }

  getManagementContestDetails(contestId)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_CONTEST_DETAIL')+"?contestId="+contestId,options).map(res => res.json());
  }

  getPerformanceReport(contestId)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_PERFORMANCE_REPORT')+"?contestId="+contestId,options).map(res => res.json());
  }

  getProgrammingReport(contestId)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_LANGUAGE_REPORT')+"?contestId="+contestId,options).map(res => res.json());
  }

  getStudentWiseReport(contestId)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_STUDENT_WISE_REPORT')+"?contestId="+contestId,options).map(res => res.json());
  }

  getPerChallengeReport(contestId)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_PER_CHALLENGE_REPORT')+"?contestId="+contestId,options).map(res => res.json());
  }

  getPerChallengeTimeReport(contestId)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_PER_CHALLENGE_TIME_REPORT')+"?contestId="+contestId,options).map(res => res.json());
  }
  
}
