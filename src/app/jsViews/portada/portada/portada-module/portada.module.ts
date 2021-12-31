import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Marquee
import { NgMarqueeModule } from 'ng-marquee';

//spinner
import { NgxSpinnerModule } from "ngx-spinner"

//ng-select
import { NgSelectModule } from '@ng-select/ng-select';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PortadaComponent } from '../portada.component';
import { PortadaRoutingModule } from '../portada-routing';


@NgModule({
  declarations: [
    PortadaComponent,
  ],
  imports: [
    CommonModule,
    PortadaRoutingModule,
    NgMarqueeModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
  ]
})
export class PortadaModule { }
