import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PipesModule } from '../../../../pipe/pipes/pipes.module';

import { ProfileManagePage } from './profile-manage.page';


const routes: Routes = [
  {
    path: '',
    component: ProfileManagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProfileManagePage]
})
export class ProfileManagePageModule {}
