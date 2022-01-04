import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { NgbCarouselConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import $ from 'jquery';

import { Router } from '@angular/router';
import { PortadaService } from '../../../services/portada/portada.service';
import { Iresponse } from '../../../interfaces/Iresponse/iresponse';
import { Portada } from '../../../models/portada/portada';
import { NoveltiesByType } from '../../../models/novelty/novelty';
import { CommonService } from './../../../services/common/common.service';
import { RedirectService } from './../../../services/redirect/redirect.service';
import { environment } from '../../../environments/environment';
import { SizeImageNovelty } from './../../../configurations/jsConfig';


@Component({
  selector: 'app-portada',
  templateUrl: './portada.component.html',
  styleUrls: ['./portada.component.css'],
  providers: [NgbCarouselConfig],
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
export class PortadaComponent implements OnInit {


  showNavigationArrows = false;
  showNavigationIndicators = false;

  isLogin: Boolean = false;

  @ViewChild('automaticPublicityModal') automaticPublicityModal: ElementRef;

  coreURL = environment.coreURL;
  img_Width = SizeImageNovelty.width;
  img_height = SizeImageNovelty.height;

  automaticPublicityValue: any;
  automaticPublicityTime: number;
  automaticPublicityTemplates: any;
  isEnabled_AutomaticPublicity: boolean;
  currentOperation: any;
  currentOperationPosition: number;

  portada = new Portada();
  automaticPublicityPortada = new Portada();

  constructor(
    config: NgbCarouselConfig,
    private commonService: CommonService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private modalService: NgbModal,
    private portadaService: PortadaService,
    private redirectService: RedirectService) {

    // customize default values of carousels used by this component tree
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;

  }


  ngOnInit(): void {

    this.currentOperationPosition = JSON.parse(localStorage.getItem('currentOperationPosition'));
    if(this.currentOperationPosition === null){
      localStorage.setItem('currentOperationPosition', `${JSON.stringify(0)}`)
    }

  }


  //Is Enabled Automatic Publicity
  isEnabledAutomaticPublicity(name: string) {
    this.commonService.getConfigurationParameter(name).subscribe((response: any) => {
      this.isEnabled_AutomaticPublicity = response;

      if (this.isEnabled_AutomaticPublicity) {
        this.getAutomaticPublicityTemplates('AutomaticPublicityTemplates');
        this.getTimeAutomaticPublicity('AutomaticPublicityTime');
      }
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }


  //Get Time Automatic Publicity
  getTimeAutomaticPublicity(name: string): any {
    this.commonService.getConfigurationParameter(name).subscribe((response: any) => {
      this.automaticPublicityTime = response;
      this.getAutomaticPublicity();
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }


  //Get Automatic Publicity
  getAutomaticPublicity() {
    setInterval(() => {

      if (location.hash.match('portada')) {

        this.currentOperationPosition = JSON.parse(localStorage.getItem('currentOperationPosition'));

        this.currentOperation = this.automaticPublicityTemplates[this.currentOperationPosition];

        this.openAutomaticPublicityModal(this.currentOperation);

        if (this.currentOperationPosition === this.automaticPublicityTemplates.length - 1) {
          this.currentOperationPosition = 0;
        } else {
          this.currentOperationPosition += 1;
        }

        localStorage.setItem('currentOperationPosition', `${JSON.stringify(this.currentOperationPosition)}`);
      }

    }, this.automaticPublicityTime);

  }


  //Get Automatic Publicity Templates
  getAutomaticPublicityTemplates(name: string) {
    this.commonService.getConfigurationParameter(name).subscribe((response: any) => {
      this.automaticPublicityTemplates = response;
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }

  //Get automatic publicity template
  getAutomaticPublicityTemplate(operation: string) {

    this.portadaService.getTemplateByOperation(operation).subscribe((response: Iresponse) => {
      if (response.Code === '000') {
        this.automaticPublicityPortada = response.Data;
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


  //Get template
  getTemplate(operation: string) {

    this.portadaService.getTemplateByOperation(operation).subscribe((response: Iresponse) => {
      if (response.Code === '000') {
        this.portada = response.Data;
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


  //open automatic publicity modal
  openAutomaticPublicityModal(operation: string) {

    if(window.location.hash.match('portada')){
      this.getAutomaticPublicityTemplate(operation);
      this.modalService.dismissAll();
      this.modalService.open(this.automaticPublicityModal, { size: 'lg', scrollable: true, backdrop: 'static' });
    }
  }

}
