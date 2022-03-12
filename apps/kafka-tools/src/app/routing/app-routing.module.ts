import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { AppRoutes } from './routes.enum';

const routes: Routes = [
    {
        path: AppRoutes.Producer,
        loadChildren: () =>
            import('../features/producer/producer.module').then(
                m => m.ProducerModule
            ),
    },
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
