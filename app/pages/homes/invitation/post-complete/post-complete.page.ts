import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-post-complete',
  templateUrl: './post-complete.page.html',
  styleUrls: ['./post-complete.page.scss'],
})
export class PostCompletePage implements OnInit {

	images = 'assets/icon/profile-none.jpg';
	filters: any;
	imgStype: any;

  constructor(
  	public nav: NavController,
  	public modal: ModalController,
  	public navParams: NavParams
  ) {
  	this.filters = this.navParams.get('filters');

  	let imgAutoHeight = ((window.innerWidth-32)/3)-16;
  	this.imgStype = { 'height.px' : imgAutoHeight };

  }

  ngOnInit() {
  	// this.nav.navigateBack('pages/invitation/send');
  }

  close() {
  	// this.nav.navigateBack(['pages/invitation', { type: 'post-complete' }]);
  	this.modal.dismiss();
  }

}
