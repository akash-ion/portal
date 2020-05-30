import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  url: string = 'http://localhost/portal';
  constructor(public http: HttpClient) { }

  get(endpoint: string, params?: any, reqOpts?: any) {
	  
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }
    return this.http.get(this.url + '/' + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + '/' + endpoint, body, reqOpts);
  }
  

  getTagUser(search : any){
    let tagUserLlist = [];
    let seq = this.get('searchtag.php/'+search, '');
    // don't have the data yet
    return new Promise(resolve => {
      seq.subscribe((res: any) => {
        tagUserLlist.push(res);
        resolve(tagUserLlist);
      }, err => {
        console.error('ERROR', err);
      });
    });
    return search;
  }

  photoUploader(params){
    console.log(params.value);
      let seq = this.post('upload.php', params.value);
  
      seq.subscribe((res: any) => {
          // If the API returned a successful response, mark the user as logged in
        /* if (res.status == 'success') {
          //this._loggedIn(res);
        } else {
        } */
      }, err => {
        console.error('ERROR', err);
      });
  
        return seq;
    }
  
  doPost(mediaInfo: any) {
    
    console.log(mediaInfo);
    return mediaInfo;
  }

}
