import { Injectable } from '@angular/core';
import { AppConfigService } from '../../services/app-config.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';
import {getApiConfig} from '../../../assets/config/api_config'

@Injectable()
export class ContestService {

  constructor(public http: Http, public _appConfigService: AppConfigService) { }

  createChallenge(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('NEW_CHALLENGE'), body,    
    options).map(res => res.json());
  }

  getTag(tagValue)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_TAGS')+"?tag="+tagValue,
      options).map(res => res.json());
  }

  getChallenge(name)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_CHALLENGE')+"?name="+name,
      options).map(res => res.json());
  }

  getChallengeDetails(id)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_CHALLENGE')+"?_id="+id,
      options).map(res => res.json());
  }

  updateChallenge(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('UPDATE_CHALLENGE'), body,    
    options).map(res => res.json());
  }

  createContest(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('CREATE_CONTEST'), body,    
    options).map(res => res.json());
  }

  getContest(name)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_CONTEST')+"?name="+name,
      options).map(res => res.json());
  }

  getContestDetails(id)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_CONTEST')+"?_id="+id,
      options).map(res => res.json());
  }
  updateContest(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('UPDATE_CONTEST'), body,    
    options).map(res => res.json());
  }
  getList(id,listType)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_LIST')+listType+"?contestId="+id,
      options).map(res => res.json());
  }

  unlockStudent(body,listType)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('GET_LIST')+listType, body,    
    options).map(res => res.json());
  }
}
