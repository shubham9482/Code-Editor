import { Injectable } from '@angular/core';
import {getApiConfig} from "../student-dashboard-config"
import { AppConfigService } from '../../services/app-config.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DashboardService {

  constructor(public http: Http, public _appConfigService: AppConfigService) { }

  getCourses()
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_COURSES'),options).map(res => res.json());
  }

  getLeaderBoard(id)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_LEADERBOARD')+'?courseId='+id,options).map(res => res.json());
  }
}
