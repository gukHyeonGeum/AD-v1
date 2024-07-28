import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, NavParams } from '@ionic/angular';

import { UserService } from '../../../../service/user.service';

@Component({
  selector: 'app-post-review',
  templateUrl: './post-review.page.html',
  styleUrls: ['./post-review.page.scss'],
})
export class PostReviewPage implements OnInit {

	user: any;
	images = 'assets/icon/profile-none.jpg';
	info: any;
	private id: any;

  constructor(
  	public nav: NavController,
  	public us: UserService,
  	public modal: ModalController,
  	public navParams: NavParams,
  ) {

  	this.info = this.navParams.data.info;
  	this.id = this.navParams.data.id;

  	if (this.info._id) {
	  	this.info.mName = this.info.mount_name;
	  	this.info.mDate = this.info.invite_time;
	  	this.info.mTime = '';
	  	this.info.mOption = this.info.invite_option;
	  } else {
	  	this.info.mOption = parseInt(this.info.mOption);
	  }



  }

  ngOnInit() {

  	this.us.getMe().subscribe(res => {
  		this.user = res.data;
  	});

  }

  close(flag: any) {
  	this.modal.dismiss(flag);
  }

}
