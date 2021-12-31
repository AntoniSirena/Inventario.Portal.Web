import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { AuthGuard } from './authorization/authGuard/auth-guard';
import { PortadaComponent } from './jsViews/portada/portada/portada.component';
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
import { ViewMarketComponent } from './jsViews/domain/viewMarket/view-market/view-market.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'portada',
    pathMatch: 'full',
  },
  {
    path: '404',
    canActivate: [AuthGuard],
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    canActivate: [AuthGuard],
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'second-factor-authentication/:token',
    component: SecondFactorAuthenticationComponent,
    data: {
      title: 'Second Factor Authentication'
    }
  },
  {
    path: 'confirm-password/:userName',
    component: ConfirmPasswordComponent,
    data: {
      title: 'Confirm Password'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      
    },
    children: [
      {
        path: 'base',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/base/base.module').then(m => m.BaseModule)
      },
      {
        path: 'buttons',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/buttons/buttons.module').then(m => m.ButtonsModule)
      },
      {
        path: 'charts',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/chartjs/chartjs.module').then(m => m.ChartJSModule)
      },
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'icons',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/icons/icons.module').then(m => m.IconsModule)
      },
      {
        path: 'notifications',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/notifications/notifications.module').then(m => m.NotificationsModule)
      },
      {
        path: 'theme',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/theme/theme.module').then(m => m.ThemeModule)
      },
      {
        path: 'widgets',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/widgets/widgets.module').then(m => m.WidgetsModule)
      },
      {
        path: 'portada',
        loadChildren: () => import('./jsViews/portada/portada/portada-module/portada.module').then(m => m.PortadaModule)
      },
      {
        path: 'order',
        loadChildren: () => import('./jsViews/domain/order/order.module').then(m => m.OrderModule)
      },
      {
        path: 'legalInfo',
        loadChildren: () => import('./jsViews/domain/legal-information/legal-information.module').then(m => m.LegalInformationModule)
      },
      {
        path: 'user',
        canActivate: [AuthGuard],
        component: UserComponent,
        data: {
          title: 'Usuarios'
        }
      },
      {
        path: 'userRole',
        canActivate: [AuthGuard],
        component: UserRoleComponent,
        data: {
          title: 'Asignar rol'
        }
      },
      {
        path: 'role',
        canActivate: [AuthGuard],
        component: RoleComponent,
        data: {
          title: 'Mantenimiento de roles'
        }
      },
      {
        path: 'configuration-parameter',
        canActivate: [AuthGuard],
        component: ConfigurationParameterComponent,
        data: {
          title: 'Mantenimiento de parámetros de configuraciones del sistema'
        }
      },
      {
        path: 'person-type',
        canActivate: [AuthGuard],
        component: PersonTypeComponent,
        data: {
          title: 'Mantenimiento de tipos de personas'
        }
      },

      //domain

      //End domain
     
      {
        path: 'template',
        canActivate: [AuthGuard],
        component: TemplateComponent,
        data: {
          title: 'Plantillas'
        }
      },
      {
        path: 'file-upload',
        canActivate: [AuthGuard],
        component: FileUploadComponent,
        data: {
          title: 'Subir archivos'
        }
      },
      {
        path: 'my-files',
        canActivate: [AuthGuard],
        component: MyFilesComponent,
        data: {
          title: 'Mis archivos'
        }
      },
      {
        path: 'novelties',
        canActivate: [AuthGuard],
        component: NoveltyComponent,
        data: {
          title: 'Novedades'
        }
      },
      {
        path: 'enterprise',
        canActivate: [AuthGuard],
        component: EnterpriseComponent,
        data: {
          title: 'Empresas'
        }
      },

      {
        path: 'market',
        canActivate: [AuthGuard],
        component: MarketComponent,
        data: {
          title: 'Realizas tus operaciones de mercado gratis'
        }
      },

      {
        path: 'viewMarket',
        canActivate: [AuthGuard],
        component: ViewMarketComponent,
        data: {
          title: 'Realizas tus operaciones de mercado gratis'
        }
      },

    ]
  },
  { path: '**', 
  canActivate: [AuthGuard], 
  component: P404Component 
  }

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
exports: [ RouterModule ]
})
export class AppRoutingModule {
  
}
