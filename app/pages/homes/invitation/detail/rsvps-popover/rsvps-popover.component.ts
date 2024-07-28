import { Component, OnInit } from '@angular/core';
import { AlertController, NavParams, PopoverController, ToastController } from '@ionic/angular';

import { AlertProvider } from '../../../../../service/alert';
import { UserService } from '../../../../../service/user.service';
import { InviteService } from '../../../../../service/invite.service';

@Component({
  selector: 'app-rsvps-popover',
  templateUrl: './rsvps-popover.component.html',
  styleUrls: ['./rsvps-popover.component.scss']
})
export class RsvpsPopoverComponent implements OnInit {

	user: any;
	info: any;
	rsvp: any;
	type: any;

  constructor(
  	public navParams: NavParams,
  	public us: UserService,
  	public is: InviteService,
  	public ap: AlertProvider,
  	public alert: AlertController,
  	public popover: PopoverController,
  	public toast: ToastController
  ) {

  	this.user = this.navParams.data.user;
  	this.info = this.navParams.data.info;
  	this.rsvp = this.navParams.data.rsvp;
  	this.type = this.navParams.data.type;

  }

  ngOnInit() {

  }

  chat() {
		this.close('chat');
  }

  async canceled() {
  	let obj = {
  		invite_id: this.info._id,
  		rsvp_id: this.rsvp._id,
			rsvp_user_id: this.rsvp.user._id,
			status: this.rsvp.status,
			invite_deleted_at: this.info.deleted_at
  	};

  	let msg = '';

  	if (this.rsvp.status == 2) {
  		msg = "매치를";
  	} else {
  		msg = "신청을";
  	}

  	const confirm = await this.alert.create({
      message: msg + ' 취소하시겠습니까?',
      buttons: [
        {
          text: '취소',
          role: 'cancel',
          cssClass: 'tertiary',
          handler: (blah) => {
          }
        }, {
          text: '확인',
          handler: () => {

            this.is.putReqCanceled(obj)
            	.subscribe(async res => {

            		if (res.success) {
            			const toast = await this.toast.create({
							      message: msg + ' 취소했습니다.',
							      position: 'top',
							      duration: 2000
							    });
							    toast.present();

            			this.close(true);
            		} else {

            		}

            	});
            
          }
        }
      ]
    });

    await confirm.present();
  
  }

  close(flag) {
  	this.popover.dismiss(flag);
  }

}
