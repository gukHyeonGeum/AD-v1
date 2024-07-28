import { Component, OnInit } from '@angular/core';
import {  NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-post-info',
  templateUrl: './post-info.page.html',
  styleUrls: ['./post-info.page.scss'],
})
export class PostInfoPage implements OnInit {

	send = 'assets/icon/invite-info-send.png';
	heart = 'assets/icon/invite-info-heart.png';

  constructor(
  	private nav: NavController,
  	private modal: ModalController
  ) { }

  ngOnInit() {
  }

  close() {
    this.modal.dismiss();
  }

}
