import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateCardPageRoutingModule } from './update-card-routing.module';

import { UpdateCardPage } from './update-card.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateCardPageRoutingModule
  ],
  declarations: []
})
export class UpdateCardPageModule {}
