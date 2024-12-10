import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateCardPage } from './update-card.page';

const routes: Routes = [
  { path: 'update-card/:id', component: UpdateCardPage },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateCardPageRoutingModule {}
