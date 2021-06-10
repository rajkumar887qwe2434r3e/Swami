import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { PrincipalComponent } from './principal/principal.component';
import { GathererComponent } from './gatherer/gatherer.component';





const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'gatherer',
      component: GathererComponent,
     
    }, {
      path: 'principal',
      component: PrincipalComponent,
    }, {
      path: '',
      redirectTo: 'gatherer',
      pathMatch: 'full',
    }, 
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
