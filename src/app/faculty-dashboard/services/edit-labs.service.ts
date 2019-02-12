import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AppConfigService } from '../../services/app-config.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { getApiConfig } from '../faculty-dashboard_config'

@Injectable()
export class EditLabsService {

  constructor(public http: Http, public _appConfigService: AppConfigService) { }

  getLabs()
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_ALL_LABS'), options).map(
      res => res.json()
    );
  }

  getLabDetails(id) {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_LAB_DETAILS') + "?labId=" + id, options).map(
      res => res.json()
    );
  }

  getLabKeys(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('GET_LAB_KEYS'), body,
      options).map(res => res.json());
  }

  getStudentsAllocatedToFaculty(id)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('GET_STUDENTS_ALLOCATED_TO_FACULTY')+"?labId="+id, options).map(
      res => res.json()
    );
  }

  allocateStudents(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('ALLOCATE_STUDENTS'), body,
      options).map(res => res.json());
  }

  getLabReport(labId,studentId,submissionId)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('LAB_REPORT')+"?labId="+labId+"&studentId="+studentId+"&submissionId="+submissionId, options).map(
      res => res.json()
    );
  }

  sendNotification(body)
  {
    let headers = this._appConfigService.getPostHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.post(getApiConfig('NOTIFICATION_API'),body,options).map(res => res.json());
  }

  updateAttempts(weekNumber, updatedAttempt, labId, studentId)
  {
    let headers = this._appConfigService.getGetHeader();
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json  });

    return this.http.get(getApiConfig('UPDATE_ATTEMPTS')+"?weekNumber="+weekNumber+"&updatedAttempt="+updatedAttempt+"&labId="+labId+"&studentId="+studentId, options).map(
      res => res.json()
    );
  }
}
