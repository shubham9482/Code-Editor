import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AppConfigService } from '../../services/app-config.service';
// import { getApiConfig } from '../../../assets/config/api_config';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import {getApiConfig} from '../../../assets/config/api_config'

@Injectable()
export class AddUserService {

  constructor(public http: Http, public _appConfigService: AppConfigService) { }

  addUser(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json });

    return this.http.post(getApiConfig('ADD_USER'), body,    
    options).map(res => res.json());
  }

}
