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
  participant: any,
  flag: boolean
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {

	private url = `${appConfig.aengdoo.url}/message`;

  constructor(
  	private http: HttpClient,
  	private auth: AuthenticationService
  ) {

  }

	getMsgLists(skip, limit) {
		const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				.set('skip', skip)
 				.set('limit', limit);

 		return this.http.get<HttpResponse>(`${this.url}/lists`, { params });
  }

  getMessage(thread_id, skip, limit) {
 		const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				.set('thread_id', thread_id)
 				.set('skip', skip)
 				.set('limit', limit);

 		return this.http.get<HttpResponse>(`${this.url}/msg`, { params });	
  }

  putMsgThumb(obj) {
  	obj.token = this.auth.isToken();
		return this.http.post<HttpResponse>(`${this.url}/putMsgThumb`, obj, {
      headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
    });
  }

  putChatOut(obj) {
  	obj.token = this.auth.isToken();
		return this.http.put<HttpResponse>(`${this.url}/chatOut`, obj, {
      headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
    });
  }


}
