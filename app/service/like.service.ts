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
  isLike: boolean,
  flag: boolean,
  badge: number
}

@Injectable({
  providedIn: 'root'
})
export class LikeService {

	private url = `${appConfig.aengdoo.url}/like`;

  constructor(
  	private http: HttpClient,
  	private auth: AuthenticationService
  ) { }

  setLike(obj) {
  	obj.token = this.auth.isToken();
  	return this.http.post<HttpResponse>(`${this.url}/insert`, obj, {
      headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
    });
  }

  setLikeRead(obj) {
  	obj.token = this.auth.isToken();
  	return this.http.post<HttpResponse>(`${this.url}/read`, obj, {
      headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
    });
  }

  getLikeLists(tabs, skip, limit) {
  	const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				.set('skip', skip)
 				.set('limit', limit);

 		if (tabs == 'send') {
 			return this.http.get<HttpResponse>(`${this.url}/sendLists`, { params });
 		} else if (tabs == 'receive') {
 			return this.http.get<HttpResponse>(`${this.url}/ReceiveLists`, { params });
 		} else if (tabs == 'match') {
 			return this.http.get<HttpResponse>(`${this.url}/MatchLists`, { params });
 		} else {
 			return;
 		}
  }

}
