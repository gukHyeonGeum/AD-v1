import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../../../../pipe/pipes/pipes.module';

import { RoomPage } from './room.page';

const routes: Routes = [
  {
    path: '',
    component: RoomPage
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
  declarations: [RoomPage]
})
export class RoomPageModule {}
