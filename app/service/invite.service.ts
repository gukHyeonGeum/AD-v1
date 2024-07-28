import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

import { appConfig } from '../../config';

interface HttpResponse {
  success: string,
  errCode: string,
  message: string,
  token: string,
  data: any,
  rsvp: any,
  partner: any,
  is_request: boolean,
  is_read: any,
  lists: any,
  flag: boolean
}

@Injectable({
  providedIn: 'root'
})
export class InviteService {

	private url = `${appConfig.aengdoo.url}/invite`;

  constructor(
  	private http: HttpClient,
  	private auth: AuthenticationService
  ) { }

  setInvite(obj) {
  	obj.token = this.auth.isToken();

  	return this.http.post<HttpResponse>(`${this.url}/insert`, obj, {
      headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
    });
  }

  setRequest(obj) {
  	obj.token = this.auth.isToken();

  	return this.http.post<HttpResponse>(`${this.url}/request`, obj, {
      headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
    });
  }

  setSendList(obj) {
  	obj.token = this.auth.isToken();

  	return this.http.post<HttpResponse>(`${this.url}/sendList`, obj, {
      headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
    });
  }
  setSendListUser(obj) {
  	obj.token = this.auth.isToken();

  	return this.http.post<HttpResponse>(`${this.url}/sendListUser`, obj, {
      headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
    });
  }

  putSelected(obj) {
  	obj.token = this.auth.isToken();

  	return this.http.post<HttpResponse>(`${this.url}/selected`, obj, {
      headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
    });
  }

  putReqCanceled(obj) {
  	obj.token = this.auth.isToken();

  	return this.http.post<HttpResponse>(`${this.url}/reqCanceled`, obj, {
      headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
    });
  }

  putInviteModify(obj) {
  	obj.token = this.auth.isToken();

  	return this.http.put<HttpResponse>(`${this.url}/invite`, obj, {
      headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
    });
  }

  putInviteEnd(obj) {
    const params = new HttpParams()
          .set('token', this.auth.isToken())
          .set('status', obj.status);

  	return this.http.delete<HttpResponse>(`${this.url}/invite/${obj._id}`, {
      headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8'),
      params: params
    });
  }

  getInviteLists(tabs, skip, limit, type) {
  	const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				.set('skip', skip)
 				.set('limit', limit)
 				.set('type', type);

 		if (tabs == 'send') {
 			return this.http.get<HttpResponse>(`${this.url}/lists`, { params });
 		} else if (tabs == 'receive') {
 			return this.http.get<HttpResponse>(`${this.url}/receive`, { params });
 		} else {
 			return;
 		}
  }

  getDetail(id) {
  	const params = new HttpParams().set('token', this.auth.isToken());

 		return this.http.get<HttpResponse>(`${this.url}/${id}`, { params });
  }

  getTest() {
  	const params = new HttpParams().set('token', this.auth.isToken());

 		return this.http.get<HttpResponse>(`${this.url}`, { params });
  }

}
