import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AppConfigService } from './app-config.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import {getApiConfig} from '../../assets/config/api_config'
import { GlobalService } from '../global.service';

@Injectable()
export class CoursesService {

  role;

  constructor(public http: Http, public _appConfigService: AppConfigService, private globalService: GlobalService) {
    this.role=this.globalService.roleType
   }

  // login(body)
  // {
  //   let headers = this._appConfigService.getPostHeader(); //
  //   let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json});
  
  //   return this.http.post(getApiConfig('API_POST_LOGIN'), body,    
  //   options).map(res => res.json());
  // }

  getCourseContent(id)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    if(this.role===1)
    {
      return this.http.get(getApiConfig('GET_STUDENT_COURSE_CONTENT')+"?courseId="+id,
      options).map(res => res.json());
    }
    else if(this.role===3)
    {
      return this.http.get(getApiConfig('GET_COURSE_CONTENT')+"?courseId="+id,
      options).map(res => res.json());
    }
    
  }

  unlockLesson(body)
  {
    let headers = this._appConfigService.getPostHeader(); 
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json });

    if(this.role===1)
    {
      return this.http.post(getApiConfig('UNLOCK_STUDENT_LESSON'), body,
      options).map(res => res.json());
    }
    else if(this.role===3)
    {
      return this.http.post(getApiConfig('UNLOCK_LESSON'), body,
      options).map(res => res.json());
    }
    
  }

  getPracticeChallenges(id,moduleId)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    if(this.role===1)
    {
      return this.http.get(getApiConfig('GET_STUDENT_PRACTICE_CHALLENGES')+"?courseId="+id+"&moduleId="+moduleId,
      options).map(res => res.json());
    }
    else if(this.role===3)
    {
      return this.http.get(getApiConfig('GET_PRACTICE_CHALLENGES')+"?courseId="+id+"&moduleId="+moduleId,
      options).map(res => res.json());
    }
    
  }

  getTestChallenges(id)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    if(this.role===1)
    {
      return this.http.get(getApiConfig('GET_STUDENT_TEST_CHELLENGES')+"?courseId="+id,
      options).map(res => res.json());
    }
    else if(this.role===3)
    {
      return this.http.get(getApiConfig('GET_TEST_CHELLENGES')+"?courseId="+id,
      options).map(res => res.json());
    }
    
  }

  practiceSubmit(body)
  {
    let headers = this._appConfigService.getPostHeader(); 
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json });

    if(this.role===1)
    {
      return this.http.post(getApiConfig('PRACTICE_STUDENT_SUBMIT'), body,
      options).map(res => res.json());
    }
    else if(this.role===3)
    {
      return this.http.post(getApiConfig('PRACTICE_SUBMIT'), body,
      options).map(res => res.json());
    }
    
  }

  testSubmit(body)
  {
    let headers = this._appConfigService.getPostHeader(); 
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json });

    if(this.role===1)
    {
      return this.http.post(getApiConfig('TEST_STUDENT_SUBMIT'), body,
      options).map(res => res.json());
    }
    else if(this.role===3)
    {
      return this.http.post(getApiConfig('TEST_SUBMIT'), body,
      options).map(res => res.json());
    }
    
  }

  unlockModule(courseId)
  {
    let headers = this._appConfigService.getGetHeader(); 
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json });

    if(this.role===1)
    {
      return this.http.get(getApiConfig('UNLOCK_STUDENT_MODULE')+"?courseId="+courseId,
      options).map(res => res.json());
    }
    else if(this.role===3)
    {
      return this.http.get(getApiConfig('UNLOCK_MODULE')+"?courseId="+courseId,
      options).map(res => res.json());
    }
    
  }

  execute(body)
  {
    let headers = this._appConfigService.getPostHeader(); 
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json });

    if(this.role===1)
    {
      return this.http.post(getApiConfig('EXECUTE_STUDENT_CODE'), body,
      options).map(res => res.json());
    }
    else if(this.role===3)
    {
      return this.http.post(getApiConfig('EXECUTE_CODE'), body,
      options).map(res => res.json());
    }
    
  }

  getPracticeSubmissions(challengeId)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    if(this.role===1)
    {
      return this.http.get(getApiConfig('GET_STUDENT_PRACTICE_SUBMISSIONS')+"?challengeId="+challengeId,
      options).map(res => res.json());
    }
    else if(this.role===3)
    {
      return this.http.get(getApiConfig('GET_PRACTICE_SUBMISSIONS')+"?challengeId="+challengeId,
      options).map(res => res.json());
    }
    
  }

  getTestSubmissions(challengeId)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    if(this.role===1)
    {
      return this.http.get(getApiConfig('GET_STUDENT_TEST_SUBMISSIONS')+"?challengeId="+challengeId,
      options).map(res => res.json());
    }
    else if(this.role===3)
    {
      return this.http.get(getApiConfig('GET_TEST_SUBMISSIONS')+"?challengeId="+challengeId,
      options).map(res => res.json());
    }
    
  }
}
