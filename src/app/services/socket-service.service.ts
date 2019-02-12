import { Injectable } from '@angular/core';
import ClusterWS from 'clusterws-client-js/dist';
import { Subject } from 'rxjs';

@Injectable()
export class SocketServiceService {

  socket = new ClusterWS({ url: "ws://crashoverride.dlinkddns.com:2000"}) 
  // console.log(window.location.hostname,window.location.port) window.location.hostname+":443" +window.location.hostname+(window.location.port?":"+window.location.port:"");

  private notificationBroadcastSource = new Subject<any>();
  notificationrBroadcast$ = this.notificationBroadcastSource.asObservable();

  constructor() {
    // console.log(document.cookie)
    this.socket.on('connect', () => {
      this.socket.send("register", JSON.stringify({cookie:document.cookie}));
    });

    this.socket.on('lab', (e) => {
      e=JSON.parse(e)
      e["event"]="lab"
      this.sendNotification(e)
    });

    this.socket.on('contest', (e) => {
      e=JSON.parse(e)
      e["event"]="contest"
      this.sendNotification(e)
    });

    this.socket.on('exam', (e) => {
      e=JSON.parse(e)
      e["event"]="exam"
      this.sendNotification(e)
    });

    
   }

   sendNotification(notification: any) {
    this.notificationBroadcastSource.next(notification);
  }
}
