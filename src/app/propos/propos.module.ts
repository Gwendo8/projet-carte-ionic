import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ProposPage } from './propos.page';

import { ProposPageRoutingModule } from './propos-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProposPageRoutingModule
  ],
  declarations: [ProposPage]
})
export class ProposPageModule {}
