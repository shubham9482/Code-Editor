import { Injectable } from '@angular/core';
import { getApiConfig } from "../student-dashboard-config"
import { AppConfigService } from '../../services/app-config.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class SessionService {

  constructor(public http: Http, public _appConfigService: AppConfigService) { }

  enableExamSession(body) {
    let headers = this._appConfigService.getPostHeader(); //
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json });

    return this.http.post(getApiConfig('COURSE_FILTER'), body, options).map(res => res.json());
  }


  getExamQuestions() {
    let headers = this._appConfigService.getGetHeader();// 
    let options = new RequestOptions({ headers: headers,  responseType: ResponseContentType.Json });

    return this.http.get(getApiConfig('GET_EXAM_QUESTION'), options).map(res => res.json());
  }

  submitExam(body) {
    let headers = this._appConfigService.getPostHeader(); //
    let options = new RequestOptions({ headers: headers,  responseType: ResponseContentType.Json });

    return this.http.post(getApiConfig('SUBMIT_EXAMS'), body, options).map(res => res.json());
  }


  getContestSessionChallenges()
  {
    let headers = this._appConfigService.getGetHeader();// 
    let options = new RequestOptions({ headers: headers,  responseType: ResponseContentType.Json });

    return this.http.get(getApiConfig('GET_CONTEST_CHALLENGES'), options).map(res => res.json());
  }

  submitContest(body)
  {
    let headers = this._appConfigService.getPostHeader(); //
    let options = new RequestOptions({ headers: headers,  responseType: ResponseContentType.Json });

    return this.http.post(getApiConfig('SUBMIT_CONTEST'), body, options).map(res => res.json());
  }

  executeContest(body)
  {
    let headers = this._appConfigService.getPostHeader(); //
    let options = new RequestOptions({ headers: headers,  responseType: ResponseContentType.Json });

    return this.http.post(getApiConfig('CONTEST_EXECUTE'), body, options).map(res => res.json());
  }

  getLeaderboard(challengeId,contestId)
  {
    let headers = this._appConfigService.getGetHeader();// 
    let options = new RequestOptions({ headers: headers,  responseType: ResponseContentType.Json });

    return this.http.get(getApiConfig('CONTEST_LEADERBOARD') + "?challengeId=" + challengeId+"&contestId="+contestId, options).map(res => res.json());
  }


  getLabContent()
  {
    let headers = this._appConfigService.getGetHeader();// 
    let options = new RequestOptions({ headers: headers,  responseType: ResponseContentType.Json });

    return this.http.get(getApiConfig('GET_LAB_CONTENT'), options).map(res => res.json());
  }

  submitLab(body)
  {
    let headers = this._appConfigService.getPostHeader(); //
    let options = new RequestOptions({ headers: headers,  responseType: ResponseContentType.Json });

    return this.http.post(getApiConfig('SUBMIT_LAB'), body, options).map(res => res.json());
  }

  getLabSubmissions(labId , number)
  {
    let headers = this._appConfigService.getGetHeader();// 
    let options = new RequestOptions({ headers: headers,  responseType: ResponseContentType.Json });

    return this.http.get(getApiConfig('GET_LAB_SUBMISSIONS') + "?labId="+labId+"&number="+number, options).map(res => res.json());
  }

  executeLab(body)
  {
    let headers = this._appConfigService.getPostHeader(); //
    let options = new RequestOptions({ headers: headers,  responseType: ResponseContentType.Json });

    return this.http.post(getApiConfig('LABS_EXECUTE'), body, options).map(res => res.json());
  }

  endContestSession()
  {
    let headers = this._appConfigService.getGetHeader();// 
    let options = new RequestOptions({ headers: headers,  responseType: ResponseContentType.Json });

    return this.http.get(getApiConfig('END_CONTEST_SESSION'), options).map(res => res.json());
  }

  endLabSession()
  {
    let headers = this._appConfigService.getGetHeader();// 
    let options = new RequestOptions({ headers: headers,  responseType: ResponseContentType.Json });

    return this.http.get(getApiConfig('END_LAB_SESSION'), options).map(res => res.json());
  }
}
