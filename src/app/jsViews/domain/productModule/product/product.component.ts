import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Iproduct } from '../../../../interfaces/domain/iproduct';
import { Product, ProductModel } from '../../../../models/domain/product';
import { ProductService } from '../../../../services/domain/product/product.service';
import Swal from 'sweetalert2';
import { Iresponse } from '../../../../interfaces/Iresponse/iresponse';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {


  @ViewChild('createModal') createModal: ElementRef;
  @ViewChild('editModal') editModal: ElementRef;


  createForm: FormGroup;
  editForm: FormGroup;

  _currentPage: number = 1;

  //Permissions
  canCreate: boolean = true;
  canEdit: boolean = true;
  canDelete: boolean = true;


  products = new Array<Product>();
  productModel = new ProductModel;

  constructor(
    private productService: ProductService,
    private modalService: NgbModal,
    private form: FormBuilder,
  ) { }


  ngOnInit(): void {
    this.getAll();
  }


  getAll() {
    this.productService.getAll().subscribe((response: Array<Product>) => {
      this.products = response;
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }


  getById(id: number) {
    this.productService.getById(id).subscribe((response: ProductModel) => {
      this.productModel = response;

      //llenando el modal
      this.editForm = this.form.group({
        description: [this.productModel.Description, Validators.required],
        externalCode: [this.productModel.ExternalCode, Validators.required],
        barCode: [this.productModel.BarCode],
        cost: [this.productModel.Cost, Validators.required],
        price: [this.productModel.Price, Validators.required],
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

    const data: Iproduct = {
      Id: 0,
      Description: form.description,
      FormattedDescription: form.formattedDescription,
      ExternalCode: form.externalCode,
      BarCode: form.barCode,
      Cost: form.cost,
      Price: form.price,
      CreatorUserId: null,
      CreationTime: null,
      LastModifierUserId: null,
      LastModificationTime: null,
      DeleterUserId: null,
      DeletionTime: null,
      IsActive: true,
      IsDeleted: false
    };

    this.productService.create(data).subscribe((response: Iresponse) => {
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

    const data: Iproduct = {
      Id: this.productModel.Id,
      Description: form.description,
      FormattedDescription: form.formattedDescription,
      ExternalCode: form.externalCode,
      BarCode: form.barCode,
      Cost: form.cost,
      Price: form.price,
      CreatorUserId: this.productModel.CreatorUserId,
      CreationTime: this.productModel.CreationTime,
      LastModifierUserId: this.productModel.LastModifierUserId,
      LastModificationTime: this.productModel.LastModificationTime,
      DeleterUserId: this.productModel.DeleterUserId,
      DeletionTime: this.productModel.DeletionTime,
      IsActive: this.productModel.IsActive,
      IsDeleted: this.productModel.IsDeleted
    };

    this.productService.update(data).subscribe((response: Iresponse) => {
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
      title: 'Esta seguro que desea eliminar el producto ?',
      text: "Los cambios no podran ser revertidos!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.value) {
        //delete service
        this.productService.delete(id).subscribe((response: Iresponse) => {
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



  //init create from
  initCreateFrom() {
    this.createForm = this.form.group({
      description: ['', Validators.required],
      externalCode: ['', Validators.required],
      barCode: [''],
      cost: [0, Validators.required],
      price: [0, Validators.required],
    });
  }


  //init edit from
  initEditFrom() {
    this.editForm = this.form.group({
      description: ['', Validators.required],
      externalCode: ['', Validators.required],
      barCode: [''],
      cost: [0, Validators.required],
      price: [0, Validators.required],
    });
  }

}
