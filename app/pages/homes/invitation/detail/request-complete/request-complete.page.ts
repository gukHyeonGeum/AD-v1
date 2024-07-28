import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, NavParams } from '@ionic/angular';

import { UserService } from '../../../../../service/user.service';
import { ProfilePage } from '../../../../modal/profile/profile.page';

@Component({
  selector: 'app-request-complete',
  templateUrl: './request-complete.page.html',
  styleUrls: ['./request-complete.page.scss'],
})
export class RequestCompletePage implements OnInit {

	user: any;
	images = 'assets/icon/profile-none.jpg';
	params: any;

  constructor(
  	public nav: NavController,
  	public modal: ModalController,
  	public modalProfile: ModalController,
  	public us: UserService,
  	public navParams: NavParams,
  ) {

  	this.params = this.navParams.data;

  }

  ngOnInit() {

  	this.us.getMe().subscribe(res => {
  		this.user = res.data;
  	});

  }

  close(user) {
  	this.modal.dismiss(user);
	}

	async ModalProfile(target) {
		if (this.user._id != target._id) {
			let modal = await this.modalProfile.create({
				component: ProfilePage,
				componentProps: { user: target }
			});
			return await modal.present();
		}
  }
}
