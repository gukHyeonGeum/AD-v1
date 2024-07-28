import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';

import { PictureGuideComponent } from '../picture-guide/picture-guide.component'

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  user: any;
  age: any;

  constructor(
    public _modal: ModalController,
    public nav: NavController,
    public navParams: NavParams
  ) { 
    this.user = this.navParams.get('user');
  }

  ngOnInit() {
  }

  next() {
    this.nav.navigateForward(['pages/more/profile', this.user._id]).then(() => {
    });
    
  }

  close() {
    this._modal.dismiss();
  }

  async pictureGuide() {
    let modal = await this._modal.create({
      component: PictureGuideComponent,
      componentProps: { birth: this.user.profile.birth }
    });
    modal.onDidDismiss().then(detail => {
		});
    return await modal.present();
  }

}
