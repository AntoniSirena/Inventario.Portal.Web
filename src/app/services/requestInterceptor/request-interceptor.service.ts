import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseService } from '../../services/base/base.service';
import { RedirectService } from '../../services/redirect/redirect.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class RequestInterceptorService implements HttpInterceptor {

  token: string;
  coreURL;

  constructor(private baseService: BaseService, private redirectService: RedirectService, private router: Router) {
    this.coreURL = environment.coreURL;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.token = JSON.parse(localStorage.getItem('token')) || '';

    let headers = new HttpHeaders();

    if (req.url.match("file/UploadFile")) {

    } else {
      headers = headers.append('content-type', 'application/json');
    }

    if (req.url.match("login")) {

    } else {
      headers = headers.append('Authorization', `${this.token}`);
    }

    const reqclone = req.clone({
      headers
    });

    return next.handle(reqclone).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {

        }
      }, (res: any) => {
        if (res instanceof HttpErrorResponse) {
          if (res.status === 301 || res.status === 302 || res.status === 303) {
            location.href = res.error
          }
          if (res.status === 400) {
            this.redirectService.error400(res.error.Message);
          }
          if (res.status === 401) {
            let refreshToken = JSON.parse(localStorage.getItem('refreshToken'));
            this.redirectService.refreshToken(refreshToken);
          }
          if (res.status === 404) {
            this.redirectService.error404();
          }
          if (res.status === 500) {
            this.redirectService.error500();
          }

        }
      })
    );

  }
}
