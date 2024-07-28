import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PipesModule } from '../../../../pipe/pipes/pipes.module';

import { DetailPage } from './detail.page';
import { RequestCompletePage } from './request-complete/request-complete.page';
import { RsvpsPopoverComponent } from './rsvps-popover/rsvps-popover.component';

const routes: Routes = [
  {
    path: '',
    component: DetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule
  ],
  declarations: [DetailPage, RequestCompletePage, RsvpsPopoverComponent],
  entryComponents: [RequestCompletePage, RsvpsPopoverComponent]
})
export class DetailPageModule {}
