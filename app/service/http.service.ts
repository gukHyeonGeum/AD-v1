import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { appConfig } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

	private url = `${appConfig.aengdoo.url}/user`;

  constructor(
  	private http: HttpClient,
  ) { 

  }
}
