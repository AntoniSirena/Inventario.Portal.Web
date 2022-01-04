import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router';
import { ListenService } from '../../services/listen/listen.service';
import { RedirectService } from '../../services/redirect/redirect.service';


@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {

    isVisitorUser = JSON.parse(localStorage.getItem("isVisitorUser"));

    constructor(private router: Router, private listenService: ListenService, private redirectService: RedirectService) {
    }

    canActivate() {
        let currentHash = window.location.hash;

        if (localStorage.length > 0) {
            return true;
        }else{
            return false;
        }
    }

}
