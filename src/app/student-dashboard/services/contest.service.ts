import { Injectable } from '@angular/core';
import {getApiConfig} from "../student-dashboard-config"
import { AppConfigService } from '../../services/app-config.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ContestService {

  constructor(public http: Http, public _appConfigService: AppConfigService) { }

  getUpcomingContests()
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_UPCOMING_CONTESTS'),options).map(res => res.json());
  }

  getFinishedContests()
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_FINISHED_CONTESTS'),options).map(res => res.json());
  }

  getContestLeaderboard(contestId)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_CONTEST_LEADERBOARD')+"?contestId="+contestId,options).map(res => res.json());
  }
}
