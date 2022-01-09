import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Inventory, InventoryModel } from '../../../../../models/domain/inventory';
import { InventoryService } from '../../../../../services/domain/inventory/inventory.service';
import Swal from 'sweetalert2';
import $ from 'jquery';
import { Iinventory } from '../../../../../interfaces/domain/iInventory';
import { Iresponse } from '../../../../../interfaces/Iresponse/iresponse';
import { Product } from './../../../../../models/domain/product';



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


  //Permissions
  canCreate: boolean = true;
  canEdit: boolean = true;
  canDelete: boolean = true;
  canCountItem: boolean = true;
  canClosed: boolean = true;
  exportExcel: boolean = true;


  inventories = new Array<Inventory>();
  inventory = new InventoryModel();
  currentInventory = new Inventory();

  inventoryDetails = new Array<Product>();

  items = new Array<Product>();

  searchItem: string;
  timerSearchItem: any = 0;


  constructor(
    private inventoryService: InventoryService,
    private modalService: NgbModal,
    private form: FormBuilder,
    private spinnerService: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.getAll();
  }



  getAll() {
    this.inventoryService.getAll().subscribe((response: Array<Inventory>) => {
      this.inventories = response;
    },
      error => {
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

    this.initCountItemFrom();

    this.inventoryService.getItems(input).subscribe((response: Iresponse) => {
      this.items = response.Data;
      this.searchItem = '';

      if (response.Code === '000') {

        if (this.items.length == 1) {

          //Llenando count item form
          this.countItemForm = this.form.group({
            cost: [this.items[0].Cost, Validators.required],
            price: [this.items[0].Price, Validators.required],
            quantity: ['', Validators.required],
          });

          this.showItemModalReference = this.modalService.open(this.showItemModal, { size: 'lg', backdrop: 'static', scrollable: true });

        } else {

          this.showItemsModalReference = this.modalService.open(this.showItemsModal, { size: 'lg', backdrop: 'static', scrollable: true });
        }

      } else {
        Swal.fire({
          icon: 'warning',
          title: response.Message,
          showConfirmButton: true,
          timer: 2000
        });
      }

    },
      error => {
        console.log(JSON.stringify(error));
      });
  }


  //get items automatic
  getItemsByTime(input: string) {
    clearTimeout(this.timerSearchItem);
    this.timerSearchItem = setTimeout(() => {
      this.getItems(input);
    }, 2000);
  }


  //get inventory details
  getInventoryDetails() {
    this.inventoryService.getInventoryDetails(this.currentInventory.Id).subscribe((response: Iresponse) => {
      this.inventoryDetails = response.Data;
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }


  addItemToCount(item: Product) {
    this.showItemsModalReference.close();

    this.items = new Array<Product>();
    this.items.push(item);
    
    //Llenando count item form
    this.countItemForm = this.form.group({
      cost: [this.items[0].Cost, Validators.required],
      price: [this.items[0].Price, Validators.required],
      quantity: ['', Validators.required],
    });

    this.showItemModalReference = this.modalService.open(this.showItemModal, { size: 'lg', backdrop: 'static', scrollable: true });

  }


  //save item
  saveItem(form: any) {

    if (!form.quantity) {
      Swal.fire({
        icon: 'warning',
        title: 'La cantidad debe ser mayor a 0',
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
      Quantity: form.quantity,
      InventoryId: this.currentInventory.Id,
    };

    this.inventoryService.saveItem(data).subscribe((response: Iresponse) => {
      if (response.Code === '000') {
        console.log(this.showItemsModalReference);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: response.Message,
          showConfirmButton: true,
          timer: 2000
        }).then(() => {
          this.showItemModalReference.close();
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
    this.getInventoryDetails();

    this.modalService.open(this.countItemModal, { size: 'xl', backdrop: 'static', scrollable: true });
  }


  //Export to excel
  exportToExcel(id: number) {
    alert('Funcionalidad en proceso');
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
      cost: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required]
    });
  }


}
