import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AppConfigService } from '../../services/app-config.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import {getApiConfig} from '../../../assets/config/api_config'

@Injectable()
export class EditUserService {

  constructor(public http: Http, public _appConfigService: AppConfigService) { }

  editStudent(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json });

    return this.http.post(getApiConfig('MODIFY_STUDENT'), body,    
    options).map(res => res.json());
  }

  editFaculty(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json });

    return this.http.post(getApiConfig('MODIFY_FACULTY'), body,    
    options).map(res => res.json());
  }
}
