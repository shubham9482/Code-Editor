import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AppConfigService } from '../../services/app-config.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { getApiConfig } from '../faculty-dashboard_config'

@Injectable()
export class EditExamService {

  constructor(public http: Http, public _appConfigService: AppConfigService) { }

  getAllExams() {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_ALL_EXAMS'), options).map(
      res => res.json()
    );
  }

  getExamDetails(id) {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_EXAM') + "?examId=" + id, options).map(
      res => res.json()
    );
  }

  getQuestionsOnId(body) {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('GET_QUESTION_BY_ID'), body,
      options).map(res => res.json());
  }

  tagSearch(tag)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_QUESTION_BY_TAG') + "?tag=" + tag, options).map(
      res => res.json()
    );
  }

  createQuestion(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('CREATE_QUESTIONS'), body,
      options).map(res => res.json());
  }
  
  updateQuestion(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('UPDATE_QUESTION'), body,
      options).map(res => res.json());
  }

  getStudentsOnFilter(body)
  {
    let headers = this._appConfigService.getPostHeader(); //
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json });

    return this.http.post(getApiConfig('ENTITY_DETAILS'), body, options).map(res => res.json());
  }

  getDepts()
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_ALL_DEPARTMENTS'),options).map(res => res.json());
  }

  getYears()
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_ALL_YEARS'),options).map(res => res.json());
  }

  getDetails(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('ENTITY_DETAILS'), body,    
    options).map(res => res.json());
  }

  updateExam(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('UPDATE_EXAM'), body,    
    options).map(res => res.json());
  }

  sendNotification(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('NOTIFICATION_API'),body,options).map(res => res.json());
  }
}
  // addUser(body)
  // {
  //   let headers = this._appConfigService.getPostHeader();
  //   let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json });

  //   return this.http.post(getApiConfig('ADD_USER'), body,    
  //   options).map(res => res.json());
  // }
