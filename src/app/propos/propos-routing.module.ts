import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProposPage } from './propos.page';

const routes: Routes = [
  {
    path: '',
    component: ProposPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProposPageRoutingModule {}
