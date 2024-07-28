import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { AuthenticationService } from './authentication.service';
import { appConfig } from '../../config';

interface HttpResponse {
  success: string,
  errCode: string,
  message: string,
  token: string,
  data: any
}

@Injectable({
  providedIn: 'root'
})
export class CommonService {

	private url = `${appConfig.aengdoo.url}/common`;

  constructor(
  	private http: HttpClient,
  	private auth: AuthenticationService
  ) {

  }

  getFindClub(search, skip, limit) {
		const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				.set('search', search)
 				.set('skip', skip)
 				.set('limit', limit);

 		return this.http.get<HttpResponse>(`${this.url}/club/find`, { params });
  }

  getAppVersion(version, type:any = '') {
    const params = new HttpParams()
 				.set('version', version)
 				.set('type', type);
    return this.http.get<HttpResponse>(`${this.url}/app/version`, { params });
  }

  getNoticeList(skip, limit) {
		const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				.set('skip', skip)
 				.set('limit', limit);

 		return this.http.get<HttpResponse>(`${this.url}/notice/lists`, { params });
  }

  getNoticeContent(id:any) {
		const params = new HttpParams()
 				.set('token', this.auth.isToken());

 		return this.http.get<HttpResponse>(`${this.url}/notice/view/${id}`, { params });
  }

  setBugsInsert(obj: any) {
    obj.token = this.auth.isToken();

    return this.http.post<HttpResponse>(`${this.url}/bugs/insert`, obj, {
      headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
    });
  }

  setReportsInsert(obj: any) {
    obj.token = this.auth.isToken();

    return this.http.post<HttpResponse>(`${this.url}/report/insert`, obj, {
      headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
    });
  }

  pushSend(obj) {
    obj.token = this.auth.isToken();
    
    return this.http.post<HttpResponse>(`${this.url}/push/send`, obj, {
      headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
    });
  }

}
