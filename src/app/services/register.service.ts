import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AppConfigService } from './app-config.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import {getApiConfig} from '../../assets/config/api_config'

@Injectable()
export class RegisterService {

  constructor(public http: Http, public _appConfigService: AppConfigService) { }

  postRegisterData(body) {
    let headers = this._appConfigService.getPostHeader(); // 
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json });

    return this.http.post(getApiConfig('API_REGISTER'), body,    
    options).map(res => res.json());
  }

  // getData(requestbody, requestQuery) {   
  //       const headers = this._appConfigService.getGetHeader();   
  //       const options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json withCredentials: true });   
  //       const body = requestbody
  //       return this.http.get((getApiConfig('API_AUDIT') + '?' + 'fromDate='  
  //         + body.fromDate + '&toDate=' + body.toDate + requestQuery),options)  
  //         .map(res => res.json());
  //     }

      // exportAuditData(fromDate, toDate) {

      //   let headers = this._appConfigService.getPostHeader();   
      //   let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json responseType: ResponseContentType.Blob });   
      //   let body = JSON.stringify({   
      //     "id": "audit_report",    
      //     "format": "xls",   
      //     "user_locale": "en",    
      //     "parameters": {   
      //       "from_date": fromDate, 
      //       "to_date": toDate   
      //     }   
      //   });
      //   return this.http.post(getApiConfig('), body,    
      //     options).map(res => new Blob([res['_body']], { type: 'application/vnd.ms-excel' }));
      // }
}
