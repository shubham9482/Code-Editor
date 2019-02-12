import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AppConfigService } from '../../services/app-config.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import {getApiConfig} from '../../../assets/config/api_config'

@Injectable()
export class AdminDashboardService {

  constructor(public http: Http, public _appConfigService: AppConfigService) { }

  getDetails(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('ENTITY_DETAILS'), body,    
    options).map(res => res.json());
  }

  getNoOfEntities()
  {
    let headers  = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json });
    
    return this.http.get(getApiConfig('NO_OF_ENTITIES'),options).map(
      res=>res.json()
    );
  }

  getCourses()
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_ALL_COURSES'),options).map(res => res.json());
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

  getAllLabs() {
    let headers = this._appConfigService.getGetHeader();// 
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json });

    return this.http.get(getApiConfig('GET_ALL_LABS'),options).map(res => res.json());
  }
}
