import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Inventory, InventoryModel, Tariff } from '../../../../../models/domain/inventory';
import { InventoryService } from '../../../../../services/domain/inventory/inventory.service';
import Swal from 'sweetalert2';
import $ from 'jquery';
import { Iinventory } from '../../../../../interfaces/domain/iInventory';
import { Iresponse } from '../../../../../interfaces/Iresponse/iresponse';
import { Product } from './../../../../../models/domain/product';
import { BaseService } from '../../../../../services/base/base.service';
import { environment } from '../../../../../environments/environment';
import { User } from '../../../../../models/profile/profile';
import { Section } from './../../../../../models/domain/inventory';
import { Roles } from '../../../../../configurations/jsConfig';
import { ObjetPaginated } from './../../../../../models/common/pagination';



@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {


  @ViewChild('createModal') createModal: ElementRef;
  @ViewChild('editModal') editModal: ElementRef;
  @ViewChild('countItemModal') countItemModal: ElementRef;
  @ViewChild('showItemModal') showItemModal: ElementRef;
  @ViewChild('showItemsModal') showItemsModal: ElementRef;


  showItemsModalReference: NgbModalRef;
  showItemModalReference: NgbModalRef;

  createForm: FormGroup;
  editForm: FormGroup;
  countItemForm: FormGroup;

  coreURL = environment.coreURL;

  //Permissions
  canCreate: boolean = true;
  canEdit: boolean = true;
  canDelete: boolean = true;
  canCountItem: boolean = true;
  canClosed: boolean = true;
  exportExcel: boolean = true;

  canDoInventory: boolean;

  inventories = new Array<Inventory>();
  inventory = new InventoryModel();
  currentInventory = new Inventory();

  inventoryDetails = new Array<Product>();

  items = new Array<Product>();

  searchItem: string;
  strInputDetail: string;

  message: string;

  userData = new User();

  sections = new Array<Section>();
  tariffs = new Array<Tariff>();

  showProducExistence: boolean;
  originSaveItem: string;
  timerstrInputDetail: any = 0;

  currentUserNameByInventory: string;
  objetPaginated: ObjetPaginated;

  inventoryTotalValue: number = 0;
  CurrentItemsPage: number = 0;

  constructor(
    private inventoryService: InventoryService,
    private modalService: NgbModal,
    private form: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private baseService: BaseService,
  ) { }

  ngOnInit(): void {
    this.getAll();
    this.getSection();
    this.getTariff();
    this.canDoInventory = this.baseService.userData.CanDoInventory;
    this.userData = this.baseService.getUserData();
    this.checkoutPrivileges();
  }


  checkoutPrivileges() {
    if (this.userData.RoleShortName === Roles.SuperAdmin || this.userData.RoleShortName === Roles.Admin || this.userData.RoleShortName === Roles.Empresa) {
      this.showProducExistence = true;
    }
  }

  getAll() {
    this.spinnerService.show();
    this.inventoryService.getAll().subscribe((response: Array<Inventory>) => {
      this.inventories = response;

      this.inventoryTotalValue = 0;

      this.inventories.forEach(x => {
        this.inventoryTotalValue += x.TotalAmount;
      })
      this.spinnerService.hide();
    },
      error => {
        this.spinnerService.hide();
        console.log(JSON.stringify(error));
      });
  }


  getById(id: number) {
    this.inventoryService.getById(id).subscribe((response: InventoryModel) => {
      this.inventory = response;

      //llenando el modal
      this.editForm = this.form.group({
        description: [this.inventory.Description, Validators.required],
      });

      this.modalService.open(this.editModal, { size: 'lg', backdrop: 'static', scrollable: true });

    },
      error => {
        console.log(JSON.stringify(error));
      });
  }


  //get items
  getItems(input: string) {
    this.spinnerService.show();
    this.message = 'Cagando...';
    this.initCountItemFrom();

    this.inventoryService.getItems(input).subscribe((response: Iresponse) => {
      this.spinnerService.hide();
      this.items = response.Data;
      this.searchItem = '';

      if (response.Code === '000') {

        if (this.items.length == 1) {

          this.originSaveItem = "ADD";

          //Llenando count item form
          this.countItemForm = this.form.group({
            cost: [this.items[0].Cost],
            price: [this.items[0].Price],
            quantity: ['', Validators.required],
            sectionId: [this.items[0].SectionId],
            tariffId: [this.items[0].TariffId]
          });

          this.showItemModalReference = this.modalService.open(this.showItemModal, { size: 'lg', backdrop: 'static', scrollable: true });
          this.setFocus_CurrentQuantity();

        } else {

          this.showItemsModalReference = this.modalService.open(this.showItemsModal, { size: 'xl', backdrop: 'static', scrollable: true });
          $("#searchItem").blur();
          this.setFocus_CurrentQuantity();
        }

      } else {
        this.setFocus_SearchItems();
        Swal.fire({
          icon: 'warning',
          title: response.Message,
          showConfirmButton: true,
          timer: 3000
        })
      }

    },
      error => {
        this.spinnerService.hide();
        console.log(JSON.stringify(error));
      });
  }

  getSection() {
    this.inventoryService.getSection().subscribe((response: Array<Section>) => {
      this.sections = response;
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }

  getTariff() {
    this.inventoryService.getTariff().subscribe((response: Array<Tariff>) => {
      this.tariffs = response;
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }


  downloadInventoriesPDF() {
    this.spinnerService.show();
    this.message = 'Cagando...';

    this.inventoryService.downloadInventoryPDF().subscribe((response: any) => {
      this.spinnerService.hide();
    },
      error => {
        this.spinnerService.hide();
        console.log(JSON.stringify(error));
      });
  }

  //get inventory details
  getInventoryDetails() {
    this.spinnerService.show();
    this.message = 'Cagando items...';

    this.inventoryService.getInventoryDetails(this.currentInventory.Id).subscribe((response: Iresponse) => {
      this.inventoryDetails = response.Data;

    },
      error => {

        console.log(JSON.stringify(error));
      });
  }


  //get inventory details
  getInventoryDetails_Paginated() {
    this.spinnerService.show();
    this.message = 'Cagando...';
    this.strInputDetail = '';

    this.inventoryService.getInventoryDetails_Paginated(this.currentInventory.Id).subscribe((response: Iresponse) => {
      this.spinnerService.hide();
      this.objetPaginated = response.Data;
      this.inventoryDetails = this.objetPaginated.Records;
    },
      error => {
        this.spinnerService.hide();
        console.log(JSON.stringify(error));
      });
  }

  //get inventory details
  _getInventoryDetails_Paginated_Next(numbePage?: any) {
    this.inventoryService.getInventoryDetails_Paginated(this.currentInventory.Id, numbePage, this.strInputDetail).subscribe((response: Iresponse) => {
      if (response.Data?.Pagination) {
        this.objetPaginated = response.Data;
        this.inventoryDetails = this.objetPaginated.Records;
      } else {
        this.inventoryDetails = response.Data;
      }
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }

  getInventoryDetails_Paginated_Next(numbePage?: any) {
    clearTimeout(this.timerstrInputDetail);
    this.timerstrInputDetail = setTimeout(() => {
      this.CurrentItemsPage = numbePage;
      this._getInventoryDetails_Paginated_Next(numbePage);
    }, 200);
  }


  //add item to count
  addItemToCount(item: Product) {
    this.showItemsModalReference.close();

    this.originSaveItem = "ADD";

    this.items = new Array<Product>();
    this.items.push(item);

    //Llenando count item form
    this.countItemForm = this.form.group({
      cost: [this.items[0].Cost],
      price: [this.items[0].Price],
      quantity: ['', Validators.required],
      sectionId: [this.items[0].SectionId],
      tariffId: [this.items[0].TariffId]
    });

    this.showItemModalReference = this.modalService.open(this.showItemModal, { size: 'lg', backdrop: 'static', scrollable: true });
    this.setFocus_CurrentQuantity();

  }


  //edit inventory detail
  editInventoryDetail(item: Product) {
    this.items = new Array<Product>();
    this.items.push(item);

    this.originSaveItem = "EDIT";

    //Llenando count item form
    this.countItemForm = this.form.group({
      cost: [this.items[0].Cost],
      price: [this.items[0].Price],
      quantity: ['', Validators.required],
      sectionId: [this.items[0].SectionId],
      tariffId: [this.items[0].TariffId]
    });

    this.showItemModalReference = this.modalService.open(this.showItemModal, { size: 'lg', backdrop: 'static', scrollable: true });
    this.setFocus_CurrentQuantity();

  }


  //delete inventory detail
  deleteInventoryDetail(id: number) {

    Swal.fire({
      title: 'Está seguro que desea eliminar el item ?',
      text: "Los cambios no podran ser revertidos!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.value) {
        //delete service
        this.inventoryService.deleteInventoryDetail(id).subscribe((response: Iresponse) => {
          if (response.Code === '000') {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: response.Message,
              showConfirmButton: true,
              timer: 1500
            }).then(() => {
              this.getInventoryDetails_Paginated();
            });
          } else {
            Swal.fire({
              icon: 'warning',
              title: response.Message,
              showConfirmButton: true,
              timer: 3000
            });
          }
        },
          error => {
            console.log(JSON.stringify(error));
          });

      }
    })
  }

  //save item
  saveItem(form: any) {

    if (form.quantity < 0) {
      Swal.fire({
        icon: 'warning',
        title: 'La cantidad debe ser mayor o igual 0',
        showConfirmButton: true,
        timer: 3000
      });
      return;
    }

    const data: Product = {
      Id: this.items[0].Id,
      Description: null,
      ExternalCode: null,
      BarCode: null,
      OldCost: 0,
      OldPrice: 0,
      Cost: form.cost,
      Price: form.price,
      Reference: '',
      Existence: 0,
      Quantity: form.quantity,
      TotalAmount: 0,
      Difference: 0,
      InventoryId: this.currentInventory.Id,
      InventoryDetailId: this.items[0].InventoryDetailId,
      UserName: null,
      SectionId: form.sectionId,
      TariffId: form.tariffId,
      SectionDescription: null,
      TariffDescription: null,
      Origin: this.originSaveItem,
    };

    this.inventoryService.saveItem(data).subscribe((response: Iresponse) => {
      if (response.Code === '000') {
        this.setFocus_SearchItems();

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: response.Message,
          showConfirmButton: true,
          timer: 300
        }).then(() => {
          this.showItemModalReference.close();
          if (this.originSaveItem === 'ADD') {
            this._getInventoryDetails_Paginated_Next(1);
          } else {
            this._getInventoryDetails_Paginated_Next(this.CurrentItemsPage);
          }
        });
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


  //open create modal
  openCreateModal() {
    this.initCreateFrom();
    this.modalService.open(this.createModal, { size: 'lg', backdrop: 'static', scrollable: true });
  }


  //open edit modal
  openEditModal(id: number) {
    this.initEditFrom();
    this.getById(id);
  }



  //create
  create(form: any) {

    const data: Iinventory = {
      Id: 0,
      Description: form.description,
      StatusId: 0,
      UserId: 0,
      OpenDate: null,
      ClosedDate: null,
      CreatorUserId: null,
      CreationTime: null,
      LastModifierUserId: null,
      LastModificationTime: null,
      DeleterUserId: null,
      DeletionTime: null,
      IsActive: true,
      IsDeleted: false
    };

    this.inventoryService.create(data).subscribe((response: Iresponse) => {
      if (response.Code === '000') {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: response.Message,
          showConfirmButton: true,
          timer: 2000
        }).then(() => {
          this.getAll();
          this.modalService.dismissAll();
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: response.Message,
          showConfirmButton: true,
          timer: 5000
        });
      }
    },
      error => {
        console.log(JSON.stringify(error));
      });

  }


  //edit
  edit(form: any) {

    const data: Iinventory = {
      Id: this.inventory.Id,
      Description: form.description,
      StatusId: this.inventory.StatusId,
      UserId: this.inventory.UserId,
      OpenDate: this.inventory.OpenDate,
      ClosedDate: this.inventory.ClosedDate,
      CreatorUserId: this.inventory.CreatorUserId,
      CreationTime: this.inventory.CreationTime,
      LastModifierUserId: this.inventory.LastModifierUserId,
      LastModificationTime: this.inventory.LastModificationTime,
      DeleterUserId: this.inventory.DeleterUserId,
      DeletionTime: this.inventory.DeletionTime,
      IsActive: this.inventory.IsActive,
      IsDeleted: this.inventory.IsDeleted
    };

    this.inventoryService.update(data).subscribe((response: Iresponse) => {
      if (response.Code === '000') {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: response.Message,
          showConfirmButton: true,
          timer: 2000
        }).then(() => {
          this.getAll();
          this.modalService.dismissAll();
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: response.Message,
          showConfirmButton: true,
          timer: 5000
        });
      }
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }



  //delete
  delete(id: number) {

    Swal.fire({
      title: 'Está seguro que desea eliminar el inventario ?',
      text: "Los cambios no podran ser revertidos!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.value) {
        //delete service
        this.inventoryService.delete(id).subscribe((response: Iresponse) => {
          if (response.Code === '000') {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: response.Message,
              showConfirmButton: true,
              timer: 2000
            }).then(() => {
              this.getAll();
              this.modalService.dismissAll();
            });
          } else {
            Swal.fire({
              icon: 'warning',
              title: response.Message,
              showConfirmButton: true,
              timer: 3000
            });
          }
        },
          error => {
            console.log(JSON.stringify(error));
          });

      }
    })
  }


  //Closed inventory
  closedInventory(id: number) {

    Swal.fire({
      title: 'Está seguro que desea cerrar el inventario ?',
      text: "Los cambios no podran ser revertidos!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar!'
    }).then((result) => {
      if (result.value) {
        //closed service
        this.inventoryService.closedInventory(id).subscribe((response: Iresponse) => {
          if (response.Code === '000') {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: response.Message,
              showConfirmButton: true,
              timer: 2000
            }).then(() => {
              this.getAll();
              this.modalService.dismissAll();
            });
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
    })

  }


  //Open modal CountItem
  openModalCountItem(inventory: Inventory) {
    this.searchItem = '';
    this.currentInventory = inventory;
    this.getInventoryDetails_Paginated();
    this.currentUserNameByInventory = inventory.UserName;

    this.modalService.open(this.countItemModal, { windowClass: 'full-size', backdrop: 'static', scrollable: true });
    this.setFocus_SearchItems();
  }


  //Export to excel
  exportToExcel(url: string, method: string, downloadName: string, data?: any) {

    var xhr = new XMLHttpRequest();
    var _method = method || "GET";
    xhr.open(_method, url, true);
    xhr.responseType = 'blob';
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function (e) {
      if (this.status == 200) {
        var blob = new Blob([this.response], { type: "application/xlsx" });
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        if (downloadName) {
          link.download = downloadName;
        }
        link.click();
      }
    };

    if (data) {
      var _data = typeof data == 'object' ? JSON.stringify(data) : data;
      xhr.send(_data);
    } else {
      xhr.send();
    }

  }


  //init create from
  initCreateFrom() {
    this.createForm = this.form.group({
      description: ['', Validators.required],
    });
  }


  //init edit from
  initEditFrom() {
    this.editForm = this.form.group({
      description: ['', Validators.required],
    });
  }


  //init count item from
  initCountItemFrom() {
    this.countItemForm = this.form.group({
      cost: [''],
      price: [''],
      quantity: ['', Validators.required],
      sectionId: [''],
      tariffId: [''],
    });
  }

  setFocus_SearchItems() {
    $("#searchItem").focus();
  }

  setFocus_CurrentQuantity() {
    $("#currentQuantity").focus();
  }

}
