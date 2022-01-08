import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//ng-Pagination
import { NgxPaginationModule } from 'ngx-pagination';

//ng-Search
import { Ng2SearchPipeModule } from 'ng2-search-filter';

//spinner
import { NgxSpinnerModule } from "ngx-spinner"

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InventoryRoutingModule } from './inventory-routing';
import { InventoryComponent } from './inventory/inventory/inventory.component';



@NgModule({
  declarations: [

  InventoryComponent],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ]
})
export class InventoryModule { }
