import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Inventory, InventoryModel } from '../../../../../models/domain/inventory';
import { InventoryService } from '../../../../../services/domain/inventory/inventory.service';
import Swal from 'sweetalert2';
import $ from 'jquery';
import { Iinventory } from '../../../../../interfaces/domain/iInventory';
import { Iresponse } from '../../../../../interfaces/Iresponse/iresponse';



@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {


  @ViewChild('createModal') createModal: ElementRef;
  @ViewChild('editModal') editModal: ElementRef;
  @ViewChild('countItemModal') countItemModal: ElementRef;



  createForm: FormGroup;
  editForm: FormGroup;

  _currentPage: number = 1;

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
  openModalCountItem(inventory: Inventory){
    this.currentInventory = inventory;
    this.modalService.open(this.countItemModal, { size:'xl', backdrop: 'static', scrollable: true });
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

}
