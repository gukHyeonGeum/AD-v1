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
  is_read: any
}

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  private url = `${appConfig.aengdoo.url}/friend`;

  constructor(
  	private http: HttpClient,
  	private auth: AuthenticationService
  ) { }

  getFriend(skip, limit) {
  	const params = new HttpParams()
			.set('token', this.auth.isToken())
			.set('skip', skip)
			.set('limit', limit);

 	return this.http.get<HttpResponse>(`${this.url}/lists`, { params });
  }

  setFriendRead(obj) {
  	obj.token = this.auth.isToken();
  	return this.http.post<HttpResponse>(`${this.url}/read`, obj, {
      headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
    });
  }

  setMatchingOne(obj) {
  	obj.token = this.auth.isToken();
  	return this.http.post<HttpResponse>(`${this.url}/matchingOne`, obj, {
      headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
    });
  }


}
