import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { GlobalService } from '../global.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoginAuthGuardService implements CanActivate {

  constructor(private router: Router, private globalService: GlobalService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.globalService.getUserRole().map(res => {

      if (res.flag) {
        if (res.entity === 0) {
          this.globalService.setRole(res.entity)
          this.globalService.setName(res.userName)
          this.router.navigate(["/admin-dashboard"])
          return false;
        }
        else if (res.entity === 1) {
          this.globalService.setRole(res.entity)
          this.globalService.setName(res.userName)
          this.router.navigate(["/student-dashboard"])
          return false;
        }
        else if (res.entity === 2) {
          this.globalService.setRole(res.entity)
          this.globalService.setName(res.userName)
          this.router.navigate(["/management-dashboard"])
          return false;
        }
        else if (res.entity === 3) {
          this.globalService.setRole(res.entity)
          this.globalService.setName(res.userName)
          this.router.navigate(["/faculty-dashboard"])
          return false;
        }

      }
      else {
        console.log()
        this.globalService.setRole(4)
        return true;
      }

    },
      error => {
        console.log(error)
        this.globalService.setRole(4)
        return true;
      })


  }

}
