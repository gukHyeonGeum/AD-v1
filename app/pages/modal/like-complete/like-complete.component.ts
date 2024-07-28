import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, NavController } from '@ionic/angular';

import { ProfilePage } from '../profile/profile.page';
import { CommonProvider } from '../../../service/common';

@Component({
  selector: 'app-like-complete',
  templateUrl: './like-complete.component.html',
  styleUrls: ['./like-complete.component.scss']
})
export class LikeCompleteComponent implements OnInit {

	images = 'assets/icon/profile-none.jpg';
	likeUser: any;
	likeTarget: any;
	likeType: any;

  constructor(
  	public modal: ModalController, 
  	public modalProfile: ModalController, 
  	public navParams: NavParams, 
    public nav: NavController, 
    public common: CommonProvider
  ) {
  	this.likeUser = this.navParams.get('user');
    this.likeTarget = this.navParams.get('target');
    this.likeType = this.navParams.get('type');
  }

  ngOnInit() {
  }

  message(id) {
	}

  close(flag) {
  	this.modal.dismiss(flag);
  }

  async ModalProfile(target) {
    if (this.likeType) {
      return;
    }

    this.close('profile');
  }

}
