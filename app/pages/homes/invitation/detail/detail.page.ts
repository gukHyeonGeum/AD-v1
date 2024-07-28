import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NavController, ModalController, NavParams, AlertController, PopoverController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AlertProvider } from '../../../../service/alert';
import { LoadingProvider } from '../../../../service/loading';
import { InviteService } from '../../../../service/invite.service';
import { UserService } from '../../../../service/user.service';

import { RequestCompletePage } from './request-complete/request-complete.page';
import { RsvpsPopoverComponent } from './rsvps-popover/rsvps-popover.component';
import { PostReviewPage } from '../post-review/post-review.page';
import { ProfilePage } from '../../../modal/profile/profile.page';
import { MessageSendComponent } from '../../../modal/message-send/message-send.component';
import { VerifyService } from '../../../../service/verify.service';

import { PostComponent } from '../post/post.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

	@ViewChild('guide', { read: ElementRef }) guide: ElementRef;

	user: any;
	info: any;
	rsvps: any;
	images = 'assets/icon/profile-none.jpg';
	partner = 'assets/icon/invite-info-heart.png';
	id = null;
	requestChk = 0;
	guideDisplay = false;
	guideDisplayHelp = false;

	rsvpCancel: boolean = false;

	private tabBar = document.getElementById('myTabBar');

  constructor(
  	public nav: NavController,
  	public modal: ModalController,
  	public alert: AlertController,
  	public us: UserService,
  	public is: InviteService,
  	public ap: AlertProvider,
  	public loding: LoadingProvider,
  	public activatedRoute: ActivatedRoute, 
  	public popover: PopoverController, 
		public toast: ToastController,
		public verify: VerifyService
  ) {
  	this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {

  }

  ionViewWillEnter() {

  	this.us.getMe().subscribe(res => {
  		this.user = res.data;
  		this.getDetail();
  	});

  	if (this.tabBar.style.display !== 'none') this.tabBar.style.display = 'none';
  }

  ionViewWillLeave () {
    if (this.tabBar.style.display !== 'flex') this.tabBar.style.display = 'flex';
  }

  guideClose() {
  	this.guideDisplay = false;
  }

  guideHelp() {
  	this.guideDisplayHelp = !this.guideDisplayHelp;
  }

  getDetail() {

  	this.info = '';

  	this.is.getDetail(this.id)
  		.subscribe(res => {
  			if (res.success) {
  				res.data.rsvpsLive = res.rsvp;
  				res.data.partner = res.partner;
  				res.data.is_request = res.is_request;
  				res.data.is_read = res.is_read;

  				this.info = res.data;

  				if (this.user._id == this.info.user_id && this.info.rsvps.length && !this.info.deleted_at && this.info.created_at==this.info.updated_at) {
  					this.guideDisplay = true;
  				}

  				if (this.info.status==2 && this.info.partner) {
	  				if (this.user._id==this.info.user_id || this.user._id==this.info.partner.user._id) {
	  					this.requestComplete(this.info);
	  				}
	  			}

	  			if (this.user._id!=this.info.user_id && !this.info.is_read && !this.info.deleted_at) this.review();

  			} else {

  			}

  		}, (err: HttpErrorResponse) => {

        if (err.error instanceof Error) {
        } else {
        }
      });

  }

  async selected(info, rsvp) {
  	const confirm = await this.alert.create({
      message: '파트너로 선택하시겠습니까?',
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

            info.select_id = rsvp._id;
            info.rsvp_user_id = rsvp.user._id;

            this.is.putSelected(info)
            	.subscribe(res => {

            		if (res.success) {
            			this.getDetail();
            			this.guideClose();
            		} else {
            			this.ap.alert('', { title: '오류', message: res.message });
            		}

            	});
            
          }
        }
      ]
    });

    await confirm.present();

  }

  request(item) {

		this.verify.isExpire().then(async res => {
			if (res) {

				const confirm = await this.alert.create({
					message: '신청하시겠습니까?<br />(다른 회원에게는 비공개)',
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
								this.loding.show();
		
								this.is.setRequest(item)
								.subscribe(async res => {
									this.loding.hide();
	
									if (res.success) {
										
										const toast = await this.toast.create({
											message: '신청되었습니다.',
											position: 'top',
											duration: 1000
										});
										toast.present();
	
										this.getDetail();
										this.guideHelp();
									} else {
										this.ap.alert('', { title: '오류', message: res.message });
									}
	
								}, (err: HttpErrorResponse) => {
									this.loding.hide();
									if (err.error instanceof Error) {
									} else {
									}
								});
							}
						}
					]
				});
		
				await confirm.present();

			} else {
				return;
			}
		}).catch(e => {
		});

  }

  async postModify(info) {
		let modal = await this.modal.create({
			component: PostComponent,
			componentProps: { id: info._id }
		});
		modal.onWillDismiss().then(() => {
			this.getDetail();
		});
		return await modal.present();
  }

  async postEnd(info) {
  	const confirm = await this.alert.create({
      message: '종료 하시겠습니까?',
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

					 	this.is.putInviteEnd(info)
				  		.subscribe(res => {

				  			if (res.success) {
				  				this.back();
				  			} else {
				  				this.ap.alert('', { title: '오류', message: res.message });
				  			}

				  		}, (err: HttpErrorResponse) => {
				        if (err.error instanceof Error) {
				        } else {
				        }
				      });
          }
        }
      ]
    });

    await confirm.present();
  }

  back() {
  	this.nav.navigateBack('pages/invitation');
  }  

  async requestComplete(rsvp) {
  	let modal = await this.modal.create({
      component: RequestCompletePage,
      componentProps: { rsvp }
    });

    modal.onDidDismiss().then(detail => {
    	if (detail.data) {
				if (this.user._id == rsvp.user._id) {
					this.ModalMessage(rsvp.partner.user, this.user);
				} else {
					this.ModalMessage(rsvp.user, this.user);
				}
    	}
    });
    return await modal.present();
  }

  async review() {

  	let review = {
  		mDate: this.info.invite_time,
			mId: this.info._id,
			mName: this.info.mount_name,
			mOption: this.info.invite_option,
			mTime: ''
  	}

  	let modal = await this.modal.create({
      component: PostReviewPage,
      componentProps: { info: this.info }
    });

    modal.onDidDismiss().then(detail => {
    	if (detail.data)
    		this.request(this.info);
    });

    return await modal.present();
  }

  async ModalProfile(user) {
  	if (user._id != this.user._id) {
	    let modal = await this.modal.create({
	      component: ProfilePage,
	      componentProps: { user }
	    });
	    return await modal.present();
	  } else {
	  	return;
	  }
  }

  async ModalMessage(user, me) {
    let modal = await this.modal.create({
      component: MessageSendComponent,
      componentProps: { user, me }
    });
    return await modal.present();
  } 

  async Popover(ev: any, user: any, info: any, rsvp: any) {

  	let obj: any;
  	
    const popover = await this.popover.create({
      component: RsvpsPopoverComponent,
      componentProps: { user, info, rsvp },
      event: ev,
      translucent: true,
      mode: 'ios'
    });

    popover.onWillDismiss().then(detail => {
    	if (detail.data) {
				if (detail.data == 'chat') {
					if (user._id == info.user._id) {
						this.ModalMessage(rsvp.user, user);
					} else {
						this.ModalMessage(info.user, user);
					}
				} else {
					this.getDetail();
				}
			}
    });

    return await popover.present();
  }

  async PopInfo(ev: any) {

    const popover = await this.popover.create({
      component: RsvpsPopoverComponent,
      componentProps: { type: 'info' },
      event: ev,
      translucent: true,
      cssClass: "guide-wrap"
    });

    return await popover.present();
  }

}
