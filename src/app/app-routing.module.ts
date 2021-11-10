import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaletteCardComponent } from './palette-card/palette-card.component';

const routes: Routes = [{path:'',component:PaletteCardComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
