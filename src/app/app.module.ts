import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CardDetailsModalComponent } from './card-details-modal/card-details-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateCardPage } from './update-card/update-card.page';
import { FormsModule } from '@angular/forms'; // Assurez-vous que c'est bien importé




@NgModule({
  declarations: [AppComponent, CardDetailsModalComponent,UpdateCardPage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}