import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AppConfigService } from '../../services/app-config.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import {getApiConfig} from '../../../assets/config/api_config'

@Injectable()
export class ManageLabsService {

  constructor(public http: Http, public _appConfigService: AppConfigService) { }

  getEntitiesOnLabID(labID,entity) {
    let headers = this._appConfigService.getGetHeader();// 
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json });

    return this.http.get(getApiConfig('GET_ENTITIES_ON_LABID')+"?labId="+labID+"&entity="+entity,options).map(res => res.json());
  }

  getFacultiesOnFilter(body) {
    let headers = this._appConfigService.getPostHeader(); //
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json });

    return this.http.post(getApiConfig('LABS_FILTER'), body, options).map(res => res.json());
  }

  getEntitiesOnFilter(body) {
    let headers = this._appConfigService.getPostHeader(); //
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json });

    return this.http.post(getApiConfig('LABS_FILTER'), body, options).map(res => res.json());
  }

  allocateEntities(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json })

    return this.http.post(getApiConfig("ALLOCATE_ENTITIES_LAB"), body,options).map(res => res.json());
  }
}
