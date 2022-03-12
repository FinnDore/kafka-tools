import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProducerComponent } from './producer.component';

const routes: Routes = [
    {
        path: '',
        component: ProducerComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProducerRoutingModule {}
