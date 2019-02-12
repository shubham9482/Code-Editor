import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { GlobalService } from '../global.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CourseTestAuthGuardService implements CanActivate {

  constructor(private router: Router, private globalService: GlobalService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    return this.globalService.getUserRole().map(res => {

      if (res.flag) {
        if (res.entity === 3 || res.entity === 1) {
          this.globalService.setRole(res.entity)
          return true;
        }
        else if (res.entity === 0) {
          this.router.navigate(["/admin-dashboard"])
          return false
        }
        else if (res.entity === 2) {
          this.router.navigate(["/management-dashboard"])
          return false
        }
        else {
          this.globalService.setRole(4)
          this.router.navigate(["/login"])
          return false
        }
      }
      else {
        this.globalService.setRole(4)
        this.router.navigate(["/login"])
        return false;
      }
    },
      error => {
        console.log(error)
        this.globalService.setRole(4)
        this.router.navigate(["/login"])
        return false;
      })
  }
}
