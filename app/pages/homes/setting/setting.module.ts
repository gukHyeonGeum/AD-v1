import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SettingPage } from './setting.page';
import { AccountComponent } from './account/account.component';
import { PhoneModifyComponent } from './phone-modify/phone-modify.component';

const routes: Routes = [
  {
    path: '',
    component: SettingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SettingPage, AccountComponent, PhoneModifyComponent],
  entryComponents: [AccountComponent, PhoneModifyComponent]
})
export class SettingPageModule {}
