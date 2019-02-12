import { Injectable } from '@angular/core';
import {getApiConfig} from "../student-dashboard-config"
import { AppConfigService } from '../../services/app-config.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PracticeService{

  constructor(public http: Http, public _appConfigService: AppConfigService) { }

  getTags(tag)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('PRACTICE_GET_TAGS')+"?tag="+tag,options).map(res => res.json());
  }

  getChallenges(body)
  {
    let headers = this._appConfigService.getPostHeader(); //
    let options = new RequestOptions({ headers: headers,  responseType: ResponseContentType.Json });

    return this.http.post(getApiConfig('PRACTICE_GET_CHALLENGES'), body, options).map(res => res.json());
  }

  getChallenge(challengeId)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('PRACTICE_GET_CHALLENGE')+"?challengeId="+challengeId,options).map(res => res.json());
  }

  executePractice(body)
  {
    let headers = this._appConfigService.getPostHeader(); //
    let options = new RequestOptions({ headers: headers,  responseType: ResponseContentType.Json });

    return this.http.post(getApiConfig('PRACTICE_EXECUTE'), body, options).map(res => res.json());
  }

  submitPractice(body)
  {
    let headers = this._appConfigService.getPostHeader(); //
    let options = new RequestOptions({ headers: headers,  responseType: ResponseContentType.Json });

    return this.http.post(getApiConfig('PRACTICE_SUBMIT'), body, options).map(res => res.json());
  }

  getSubmissions(challengeId,submissionId)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('PRACTICE_GET_SUBMISSIONS')+"?challengeId="+challengeId+"&submissionId="+submissionId,options).map(res => res.json());
  }
}