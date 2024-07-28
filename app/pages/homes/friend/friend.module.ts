import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { PipesModule } from '../../../pipe/pipes/pipes.module';

import { IonicModule } from '@ionic/angular';

import { FriendPage } from './friend.page';

const routes: Routes = [
  {
    path: '',
    component: FriendPage
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
  declarations: [
    FriendPage, 
  ]
})
export class FriendPageModule {}
