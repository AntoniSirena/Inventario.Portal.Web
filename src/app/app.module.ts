
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';

import { DatePipe } from "@angular/common";

//File Reader
import { FctrlxAngularFileReader } from 'fctrlx-angular-file-reader';
import { NgxFileDropModule } from 'ngx-file-drop';

//Text Edit
import { CKEditorModule } from 'ngx-ckeditor';

//ng-Search
import { Ng2SearchPipeModule } from 'ng2-search-filter';

//ng-Pagination
import { NgxPaginationModule } from 'ngx-pagination';

// Marquee
import { NgMarqueeModule } from 'ng-marquee';

//spinner
import { NgxSpinnerModule } from "ngx-spinner"

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//ng-select
import { NgSelectModule } from '@ng-select/ng-select';




//Componets
import { RequestInterceptorService } from '../app/services/requestInterceptor/request-interceptor.service';
import { ProfileComponent } from './jsViews/profile/profile/profile.component';
import { UserComponent } from './jsViews/user/user/user.component';
import { UserRoleComponent } from './jsViews/userRole/user-role/user-role.component';
import { RoleComponent } from './jsViews/role/role/role.component';
import { ConfigurationParameterComponent } from './jsViews/configurationParameter/configuration-parameter/configuration-parameter.component';
import { PersonTypeComponent } from './jsViews/personType/person-type/person-type.component';
import { TemplateComponent } from './jsViews/template/template.component';
import { FileUploadComponent } from './jsViews/fileUpload/file-upload/file-upload.component';
import { MyFilesComponent } from './jsViews/myFiles/my-files/my-files.component';
import { NoveltyComponent } from './jsViews/novelty/novelty/novelty.component';
import { ConfirmPasswordComponent } from './jsViews/confirmPassword/confirm-password/confirm-password.component';
import { SecondFactorAuthenticationComponent } from './jsViews/secondFactorAuthentication/second-factor-authentication/second-factor-authentication.component';
import { EnterpriseComponent } from './jsViews/domain/enterprise/enterprise/enterprise.component';
import { MarketComponent } from './jsViews/domain/market/market/market.component';
import { PortadaModule } from './jsViews/portada/portada/portada-module/portada.module';
import { OrderModule } from './jsViews/domain/order/order.module';
import { LegalInformationModule } from './jsViews/domain/legal-information/legal-information.module';



@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    CKEditorModule,
    NgxFileDropModule,
    FctrlxAngularFileReader,
    NgMarqueeModule,
    NgxSpinnerModule,
    NgSelectModule,
    PortadaModule,
    OrderModule,
    LegalInformationModule,

  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    UserComponent,
    UserRoleComponent,
    RoleComponent,
    ConfigurationParameterComponent,
    PersonTypeComponent,
    TemplateComponent,
    FileUploadComponent,
    MyFilesComponent,
    NoveltyComponent,
    ConfirmPasswordComponent,
    SecondFactorAuthenticationComponent,
    EnterpriseComponent,
    MarketComponent,

  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptorService,
      multi: true
    },
    DatePipe

  ],

  bootstrap: [AppComponent]
})

export class AppModule {

}
