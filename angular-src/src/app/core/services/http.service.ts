import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { ToastyService } from 'ng2-toasty';
import { CookieService, CookieBackendService } from 'ngx-cookie';
import 'rxjs/add/operator/share';

import { RequestOptionsArgs } from '@angular/http/src/interfaces';
import { ActionResponse } from '../../../../../shared/models';
import { ToastyHelperService } from './toasty-helper.service';
import { AppService } from './app.service';

@Injectable()
export class HttpClient {
  private requestsCount = 0;

  constructor(
    private http: Http,
    private appService: AppService,
    private cookieService: CookieService,
    private toastyHelperService: ToastyHelperService
  ) {}

  get(url: string, options?: RequestOptionsArgs, disableErrorToast?: boolean) {
    const observable = this.http
      .get(url, this.generateOptions(options))
      .share();

    this.onRequestStarted(observable, disableErrorToast);
    return observable;
  }

  post(
    url: string,
    data: any,
    options?: RequestOptionsArgs,
    disableErrorToast?: boolean
  ) {
    const observable = this.http
      .post(url, data, this.generateOptions(options))
      .share();

    this.onRequestStarted(observable, disableErrorToast);
    return observable;
  }

  postWithUrlParams(
    url: string,
    data: any,
    options?: RequestOptionsArgs,
    disableErrorToast?: boolean
  ) {
    options = this.generateOptions(options);
    options.headers.append('Content-Type', 'application/x-www-form-urlencoded');

    const body = new URLSearchParams();

    for (const property of Object.keys(data)) {
      body.set(property, data[property]);
    }

    const observable = this.http.post(url, body, options).share();

    this.onRequestStarted(observable, disableErrorToast);
    return observable;
  }

  private generateOptions(options?: RequestOptionsArgs) {
    const newOptions = options || {};
    newOptions.withCredentials = true;

    const headers = newOptions.headers || new Headers({});

    // Add authentication token
    const authToken = this.cookieService.get('auth_token');

    if (authToken) {
      headers.append(`Authorization`, `Token ${authToken}`);
    }

    newOptions.headers = headers;
    return newOptions;
  }

  onRequestStarted(observable, disableErrorToast?: boolean) {
    ++this.requestsCount;
    this.appService.isRequestLoading = true;

    observable.subscribe(
      response => {
        this.onRequestEnded();
      },
      error => {
        this.onRequestEnded();
        console.error(error);

        if (disableErrorToast) {
          return;
        }

        let errorText = error;

        try {
          const errorResponse = JSON.parse(error._body) as ActionResponse<any>;
          if (errorResponse) {
            errorText = errorResponse.error;
          }
        } catch (error) {}

        this.toastyHelperService.showError(
          `An error had occured`,
          `${errorText}`
        );
      }
    );
  }

  onRequestEnded() {
    if (--this.requestsCount === 0) {
      this.appService.isRequestLoading = false;
    }
  }
}
