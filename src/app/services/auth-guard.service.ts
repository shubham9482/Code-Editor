import { Injectable } from '@angular/core';
import { CanActivate, CanLoad,CanActivateChild } from '@angular/router';
import { Router,ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { GlobalService } from '../global.service';
import { Observable } from 'rxjs/Observable';
import {getApiConfig} from '../../assets/config/api_config'

@Injectable()
export class AuthGuardService implements CanActivate, CanLoad,CanActivateChild {


  constructor(private router: Router, private globalService: GlobalService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean {

    // this.globalService.roleType = 0;
    if(state && state.url=="/")
    {
      this.globalService.setRole(4)
      this.router.navigate(["/login"])
      return false;
    }
    else return this.globalService.getUserRole().map(res => {

      if (res.flag)
      {
        if (res.entity === 0 || res.entity === 1 || res.entity === 2 || res.entity === 3) {
          this.globalService.setRole(res.entity)
          this.globalService.setName(res.userName)
          return true;
        }
      }
      else{
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

  canLoad(): Observable<boolean>|boolean {
    let route: ActivatedRouteSnapshot
    let state: RouterStateSnapshot
    // if(state && state.url=="/")
    // {
    //   this.globalService.setRole(4)
    //   this.router.navigate(["/login"])
    //   return false;
    // }
    return this.canActivate(route,state);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean {
    // if(state && state.url=="/")
    // {
    //   this.globalService.setRole(4)
    //   this.router.navigate(["/login"])
    //   return false;
    // }
    return this.canActivate(route,state);
  }
}
