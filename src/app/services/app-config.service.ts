import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Headers } from '@angular/http';



@Injectable()

export class AppConfigService {



  // config to hold api urls
  public apiConfig: any;

  // config to hold text  messages
  public textMessage: any;

  // config to hold image  path
  public imagePath: any;

  // cnfig to hold getHeader
  public header: any;

  // config to hold PostHeader
  public postHeader: any;

  constructor(private http: Http) {

    // this.setImagePath();
    // this.setApiConfig();
    // this.setTextMessageConfig();

  }

  /**
  * Method to get image paths and store in config
  */

  // setImagePath() {

  //   const xhttp = new XMLHttpRequest();
  //   const scope = this;
  //   xhttp.onreadystatechange = function () {
  //     if (this.readyState === 4 && this.status === 200) {
  //       scope.imagePath = JSON.parse(this.responseText);
  //     }
  //   };

  //   xhttp.open('GET', './assets/config/image_path.json' + '?v=' + new Date().getTime(), false);
  //   xhttp.send();
  // }

  /**
  * Method to retrieve the image paths
  * @param key :key for the config
  */

  // getImagePath(key) {
  //   if (this.imagePath) {
  //     return this.imagePath['IMG_BASE'] + this.imagePath[key];
  //   } else {
  //     const scope = this;
  //     return null;
  //   }
  // }

  /**
  * Method to get api Config and store in config
  */

  // setApiConfig() {

  //   const xhttp = new XMLHttpRequest();
  //   const scope = this;
  //   xhttp.onreadystatechange = function () {
  //     if (this.readyState === 4 && this.status === 200) {
  //       scope.apiConfig = JSON.parse(this.responseText);
  //     }
  //   };

  //   xhttp.open('GET', '../../assets/config/api_config.json' + '?v=' + new Date().getTime(), false);
  //   xhttp.send();

  // }
  /**
  * Method to retrieve the api Config
  * @param key :key for the config
  */
  // getApiConfig(key) {

  //   if (this.apiConfig) {
  //     return this.apiConfig['API_BASE'] + this.apiConfig[key];
  //   } else {
  //     return null;
  //   }
  // }

  /**
  * Method to get Text Message Config and store in config
  */

  // setTextMessageConfig() {
  //   const xhttp = new XMLHttpRequest();
  //   const scope = this;
  //   xhttp.onreadystatechange = function () {
  //     if (this.readyState === 4 && this.status === 200) {
  //       scope.textMessage = JSON.parse(this.responseText);
  //     }
  //   };

  //   xhttp.open('GET', './assets/config/text_message.json' + '?v=' + new Date().getTime(), false);
  //   xhttp.send();



  // }

  /**
  * Method to retrieve the Text Message Config
  * @param key :key for the config
  */

  // getTextMessageConfig(key) {
  //   if (this.textMessage) {
  //     return this.textMessage[key];
  //   } else {
  //     return null;
  //   }
  // }

  getGetHeader() {
    return new Headers({
      "token":"lordoftherings=s%3A4vXvgS63IVQre2xuLkm7X0bDC6fs64Ls.GezW48wLbCNKom0WpNJ4eNiJrhjE%2BxsDRgrhkNInVbE",
      'Content-Type':"application/json",
      'Access-Control-Allow-Headers': '"Content-Type","token"',
      "Access-Control-Allow-Origin": "http://localhost:4200",
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });

  }

  getPostHeader() {
    return new Headers({
      "token":"lordoftherings=s%3A4vXvgS63IVQre2xuLkm7X0bDC6fs64Ls.GezW48wLbCNKom0WpNJ4eNiJrhjE%2BxsDRgrhkNInVbE",      
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Access-Control-Allow-Headers': "'Content-Type','token'",
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
    });

  }


}