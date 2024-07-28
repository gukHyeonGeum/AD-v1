import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { AccountComponent } from './account/account.component';
import { PhoneModifyComponent } from './phone-modify/phone-modify.component';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  constructor(
    public modal: ModalController
  ) { }

  ngOnInit() {
  }

  async modalOpen(type) {

    let component;

    if (type == 'account') {
      component = AccountComponent;
    } else if (type == 'phoneModify') {
      component = PhoneModifyComponent;
    }

    let modal = await this.modal.create({
      component: component,
    });
    return await modal.present();
  }

}
