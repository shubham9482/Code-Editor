import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AppConfigService } from '../../services/app-config.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import {getApiConfig} from '../../../assets/config/api_config'


@Injectable()
export class ManageCourseService {

  constructor(public http: Http, public _appConfigService: AppConfigService) { }

  // getCourses()
  // {
  //   let headers = this._appConfigService.getGetHeader();
  //   let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

  //   return this.http.get(getApiConfig('GET_ALL_COURSES'),options).map(res => res.json());
  // }

  // getDepts()
  // {
  //   let headers = this._appConfigService.getGetHeader();
  //   let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

  //   return this.http.get(getApiConfig('GET_ALL_DEPARTMENTS'),options).map(res => res.json());
  // }

  getStudentsOnFilter(body) {
    let headers = this._appConfigService.getPostHeader(); //
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json });

    return this.http.post(getApiConfig('COURSE_FILTER'), body, options).map(res => res.json());
  }

  getEntitiesOnFilter(body) {
    let headers = this._appConfigService.getPostHeader(); //
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json });

    return this.http.post(getApiConfig('COURSE_FILTER'), body, options).map(res => res.json());
  }

  getEntitiesOnCourseID(courseId,entity) {
    let headers = this._appConfigService.getGetHeader();// 
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json });

    return this.http.get(getApiConfig('GET_ENTITIES_ON_COURSEID')+"?courseId="+courseId+"&entity="+entity,options).map(res => res.json());
  }
  
  allocateEntities(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json })

    return this.http.post(getApiConfig("ALLOCATE_ENTITIES_COURSE"), body,options).map(res => res.json());
  }
}
