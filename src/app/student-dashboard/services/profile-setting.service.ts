import { Injectable } from '@angular/core';
import {getApiConfig} from "../student-dashboard-config"
import { AppConfigService } from '../../services/app-config.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ProfileSettingService {

  constructor(public http: Http, public _appConfigService: AppConfigService) { }

  getProfileDetails()
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_PROFILE_DETAILS'),options).map(res => res.json());
  }

  updateProfileDetails(body)
  {
    let headers = this._appConfigService.getPostHeader(); //
    let options = new RequestOptions({ headers: headers,  responseType: ResponseContentType.Json });

    return this.http.post(getApiConfig('UPDATE_PROFILE_DETAILS'), body, options).map(res => res.json());
  }

  sendNotificationEmail(email)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('NOTIFICATION_EMAIL_UPDATE')+"?email="+email,options).map(res => res.json());
  }

  updateEmail(otp)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('UPDATE_EMAIL')+"?otp="+otp,options).map(res => res.json());
  }
}
