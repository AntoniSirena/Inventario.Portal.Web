import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login/login.service';
import { RedirectService } from '../../services/redirect/redirect.service'
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import $ from 'jquery';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Ilogin } from '../../interfaces/Ilogin/ilogin';
import { Iresponse } from '../../interfaces/Iresponse/iresponse';
import { Profile } from '../../models/profile/profile';
import { SystemConfiguration } from '../../Templates/systemConfiguration/system-configuration';
import { ExternalService } from '../../services/external/external.service';
import { Portada } from '../../models/portada/portada';
import { observeOn } from 'rxjs/operators';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .dark-modal .modal-content {
      background-color: #292b2c;
      color: white;
    }
    .dark-modal .close {
      color: white;
    }
    .light-blue-backdrop {
      background-color: #5cb3fd;
    }
  `]
})
export class LoginComponent implements OnInit {

  //constructor
  constructor(
    private loginService: LoginService,
    private redirectService: RedirectService,
    private spinnerService: NgxSpinnerService,
    private externalService: ExternalService,
    private modalService: NgbModal,
    private form: FormBuilder
  ) { }

  loginForm: FormGroup;
  resetPasswordForm: FormGroup;

  profile = new Profile();
  systemConfiguration = new SystemConfiguration();

  valueRegisterButton: string;

  canViewLoginPageDefault = localStorage.getItem('canViewLoginPageDefault') || false;

  bannerA = new Portada();

  buttonResetPass: boolean;
  buttonLogIn: boolean;

  @ViewChild('resetPasswordModal') resetPasswordModal: ElementRef;



  //Init
  ngOnInit() {

    this.loginForm = this.form.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });

    //this.getValueRegisterButton();
    //this.getTemplateBannerA('BannerLogin_A');
    this.buttonResetPass = true;
    this.buttonLogIn = true;
  };



  goPortadaPage() {
    if (!this.canViewLoginPageDefault) {
      this.redirectPortada();
      localStorage.setItem('canViewLoginPageDefault', 'true');
    }
  }

  redirectPortada() {
    this.redirectService.loginUserVisitador();
  }


  //SubmitLogin
  SubmitLogin(loginForm: any) {

    const request: Ilogin = {
      UserName: loginForm.userName,
      Password: loginForm.password,
      EmailAddress: null,
      SecurityCode: '',
      Token2AF: '',
      RefreshToken: false,
    };

    this.buttonLogIn = false;

    this.loginService.authenticate(request).subscribe((response: Iresponse) => {

      if (response.Code === '000') {

        //profile
        this.profile = response.Data;
        localStorage.setItem("profile", `${JSON.stringify(this.profile.Profile)}`);
        localStorage.setItem("personalData", `${JSON.stringify(this.profile.Profile.Person)}`);
        localStorage.setItem("userData", `${JSON.stringify(this.profile.Profile.User)}`);
        localStorage.setItem("token", `${JSON.stringify(this.profile.Profile.User.Token)}`);
        localStorage.setItem("refreshToken", `${JSON.stringify(this.profile.Profile.User.RefreshToken)}`);
        localStorage.setItem("userName", `${JSON.stringify(this.profile.Profile.User.UserName)}`);
        localStorage.setItem("userId", `${JSON.stringify(this.profile.Profile.User.Id)}`);
        localStorage.setItem("canCreate", `${JSON.stringify(this.profile.Profile.User.CanCreate)}`);
        localStorage.setItem("canEdit", `${JSON.stringify(this.profile.Profile.User.CanEdit)}`);
        localStorage.setItem("canDelete", `${JSON.stringify(this.profile.Profile.User.CanDelete)}`);

        localStorage.setItem("isVisitorUser", `${JSON.stringify(this.profile.Profile.User.IsVisitorUser)}`);
        localStorage.setItem('currentMenuTemplate', `${JSON.stringify(this.profile.Profile.User.MenuTemplate)}`);

        //welcome to system
        this.redirectService.welcomeToSystem();

      } else {
        Swal.fire({
          icon: 'warning',
          title: response.Message,
          showConfirmButton: true,
          timer: 10000
        }).then(() => {
          this.buttonLogIn = true;
        });;
      }

    },
      error => {
        this.buttonLogIn = true;
        console.log(JSON.stringify(error));
      });

  }


  register() {
    this.redirectService.register();
  }


  getValueRegisterButton() {
    this.externalService.getValueRegisterButton().subscribe((response: any) => {
      this.valueRegisterButton = response;
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }


  //open reset password modal
  openResetPasswordModal() {
    this.setValueResetPasswordForm();
    this.modalService.open(this.resetPasswordModal, { size: 'sm-lg', backdrop: 'static', scrollable: true });
  }


  //loading Reset Password
  resetPassword(resetPasswordForm: any) {
    const login: Ilogin = {
      UserName: resetPasswordForm.userName,
      Password: resetPasswordForm.password,
      EmailAddress: resetPasswordForm.emailAddress,
      SecurityCode: '',
      Token2AF: '',
      RefreshToken: false,
    };

    this.spinnerService.show();
    this.buttonResetPass = false;

    this.loginService.resetPassword(login).subscribe((response: Iresponse) => {

      this.spinnerService.hide();
      this.buttonResetPass = true;

      if (response.Code === '000') {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: response.Message,
          showConfirmButton: true,
          timer: 8000
        }).then(() => {
          this.modalService.dismissAll();
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: response.Message,
          showConfirmButton: true,
          timer: 10000
        }).then(() => {
          this.buttonResetPass = true;
        });;
      }
    },
      error => {
        this.spinnerService.hide();
        this.buttonResetPass = true;
        console.log(JSON.stringify(error));
      });

  }


  setValueResetPasswordForm() {
    this.resetPasswordForm = this.form.group({
      userName: [''],
      emailAddress: ['', [Validators.required, Validators.email]],
    });
  }


  //Get template banner A
  getTemplateBannerA(operation: string) {
    this.externalService.getTemplateByOperation(operation).subscribe((response: Iresponse) => {
      if (response.Code === '000') {
        this.bannerA = response.Data;
      } else {
        Swal.fire({
          icon: 'warning',
          title: response.Message,
          showConfirmButton: true,
          timer: 4000
        });
      }
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }


}
