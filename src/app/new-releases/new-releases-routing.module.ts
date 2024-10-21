import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewReleasesPage } from './new-releases.page';

const routes: Routes = [
  {
    path: '',
    component: NewReleasesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewReleasesPageRoutingModule {}
