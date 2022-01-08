
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { InventoryComponent } from './inventory/inventory/inventory.component';


const routes: Routes = [
    {
        path: 'inventory',
        component: InventoryComponent,
        data: {
            title: 'Inventario'
        },
    },
]


@NgModule({
    imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})

export class InventoryRoutingModule {

}