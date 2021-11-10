import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // <-Add here

import { AppComponent } from './app.component';
import { PaletteCardComponent } from './palette-card/palette-card.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent,HeaderComponent, PaletteCardComponent],
  imports: [BrowserModule.withServerTransition({ appId: 'serverApp' }), HttpClientModule,AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
