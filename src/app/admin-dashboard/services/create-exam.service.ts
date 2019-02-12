import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AppConfigService } from '../../services/app-config.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import {getApiConfig} from '../../../assets/config/api_config'

@Injectable()
export class CreateExamService {

  constructor(public http: Http, public _appConfigService: AppConfigService) { }

  tagSearch(tag) {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('TAG_SEARCH') + "?tag=" + tag, options).map(
      res => res.json()
    );
  }

  createQuestion(body) {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('ADD_QUESTION'), body,
      options).map(res => res.json());
  } 

  createExam(examName) {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('CREATE_EXAM')+"?name="+examName,
      options).map(res => res.json());
  }

  getExams() {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_ALL_EXAMS'), options).map(
      res => res.json()
    );
  }

  getExamDetails(examId) {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_EXAM_DETAILS')+"?examId="+examId, options).map(
      res => res.json()
    );
  }

  getAllocatedFacultiesForExam(examId) {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_ALLOCATED_FACULTIES_FOR_EXAM')+"?examId="+examId, options).map(
      res => res.json()
    );
  }

  getQuestions(body) {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('GET_QUESTIONS'), body,
    options).map(res => res.json());
  }

  updateQuestion(body) {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('UPDATE_QUESTION'), body,
    options).map(res => res.json());
  }

  updateExam(body) {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('EDIT_EXAM'), body,
    options).map(res => res.json());
  }

  getEntitiesOnFilter(body) {
    let headers = this._appConfigService.getPostHeader(); //
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json });

    return this.http.post(getApiConfig('EXAMS_FILTER'), body, options).map(res => res.json());
  }

  allocateEntities(body)
  {
    let headers = this._appConfigService.getPostHeader(); //
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json });

    return this.http.post(getApiConfig('ALLOCATE_FACULTIES_EXAMS'), body, options).map(res => res.json());
  }
}
