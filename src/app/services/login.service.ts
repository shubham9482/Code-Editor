import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AppConfigService } from './app-config.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import {getApiConfig} from '../../assets/config/api_config'

@Injectable()
export class LoginService {

  constructor(public http: Http, public _appConfigService: AppConfigService) { }

  login(body)
  {
    let headers = this._appConfigService.getPostHeader(); //
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json});
  
    return this.http.post(getApiConfig('API_POST_LOGIN'), body,    
    options).map(res => res.json());
  }
}
