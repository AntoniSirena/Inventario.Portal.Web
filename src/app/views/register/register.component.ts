import { Component, OnInit } from '@angular/core';
import { ExternalService } from '../../services/external/external.service';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Iuser } from '../../interfaces/Iuser/iuser';
import { Iresponse } from '../../interfaces/Iresponse/iresponse';
import { UserType } from '../../models/common/userType/user-type';
import { ValidationsService } from './../../utilities/validation/validations.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent {

  myForm: FormGroup;
  userTypes = new Array<UserType>();

  imgProfile: string = 'assets/img/avatars/UserEmpty.png';

  inputFiles: any;

  constructor(
    private externalService: ExternalService,
    private form: FormBuilder,
    private router: Router,
    private validationsService: ValidationsService,
    ) {

  }

  ngOnInit() {
    this.initMyForm();
    this.getUserTyes()
  }

  //Get user types
  getUserTyes() {
    this.externalService.getUserTypes().subscribe((response: Array<UserType>) => {
      this.userTypes = response;

      this.myForm = this.form.group({
        userName: ['', Validators.required],
        emailAddress: ['', Validators.required],
        password: ['', Validators.required],
        name: ['', Validators.required],
        surName: ['', Validators.required],
        code: [''],
        phoneNumber: ['', Validators.required],
        userTypeId: [this.userTypes.filter(x => x.ShortName === 'Person')[0].Id, Validators.required]
      });
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }

  //Create user
  onSubmit(formValue: any) {

    if (!this.validateInput(formValue.emailAddress, formValue.password)) {
      return
    }

    const user: Iuser = {
      Id: 0,
      UserName: formValue.userName,
      EmailAddress: formValue.emailAddress,
      Password: formValue.password,
      Name: formValue.name,
      SurName: formValue.surName,
      StatusId: 0,
      PersonId: null,
      UserTypeId: formValue.userTypeId,
      Image: null,
      Code: formValue.code,
      PhoneNumber: formValue.phoneNumber,
      CanDoInventory: false,
      LastLoginTime: null,
      LastLoginTimeEnd: null,
      IsOnline: false,
      DiviceIP: null,
      IsActive: true,
      IsDeleted: false,
      CreatorUserId: null,
      CreationTime: null,
      LastModifierUserId: null,
      LastModificationTime: null,
      DeleterUserId: null,
      DeletionTime: null
    };

    this.externalService.createUser(user, this.imgProfile).subscribe((response: Iresponse) => {
      if (response.Code === '000') {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: response.Message,
          showConfirmButton: true,
          timer: 2000
        }).then(() => {
          this.router.navigate(['/login']);
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: response.Message,
          showConfirmButton: true,
          timer: 30000
        });
      }

    },
      error => {
        console.log(JSON.stringify(error));
      });
  }

  goToBack(){
    this.router.navigate(['/login']);
  }

  validateInput(email: string, password: string): boolean {

    if (!this.validationsService.email(email)) {
      Swal.fire({
        icon: 'warning',
        title: "El correo no es válido, favor ingrese un correo válido",
        showConfirmButton: true,
        timer: 10000
      });
      return false;
    }

    if (password.length < 8) {
      Swal.fire({
        icon: 'warning',
        title: "La contraseña debe tener más de 8 caracteres, favor vuelva a ingresarla",
        showConfirmButton: true,
        timer: 10000
      });
      return false;
    }

    return true;
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

  goToPortada() {
    this.router.navigate(['portada']);
  }

  uploadFile(event: any){
    setTimeout(() => {
      this.imgProfile = event.base64;
    }, 500);
  }


  initMyForm(){
    this.myForm = this.form.group({
      userName: ['', Validators.required],
      emailAddress: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required],
      surName: ['', Validators.required],
      code: [''],
      phoneNumber: ['', Validators.required],
      userTypeId: ['', Validators.required]
    });
  }

}
