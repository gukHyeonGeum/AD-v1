import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ModalController, NavController, IonInfiniteScroll, IonRefresher } from '@ionic/angular';

import { HttpErrorResponse } from '@angular/common/http';

import { AlertProvider } from '../../../service/alert';
import { UserService } from '../../../service/user.service';
import { LikeService } from '../../../service/like.service';

import { ProfilePage } from '../../modal/profile/profile.page';
import { LikeCompleteComponent } from '../../modal/like-complete/like-complete.component';
import { MessageSendComponent } from '../../modal/message-send/message-send.component';
import { ActivatedRoute } from '@angular/router';
import { CommonProvider } from '../../../service/common';

@Component({
  selector: 'app-like',
  templateUrl: './like.page.html',
  styleUrls: ['./like.page.scss'],
})
export class LikePage implements OnInit {
	@ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
	@ViewChild(IonRefresher) refresher: IonRefresher;


	flag: boolean;
	whichPage = 'send';
	images = 'assets/icon/profile-none.jpg';
	tabs: any;
	public badge: any;
	private user: any;
	private lists: any = [];
	private limit = 10;
	private skip = 0;

  constructor(
  	public ap: AlertProvider,
  	public us: UserService,
  	public ls: LikeService,
  	public modal: ModalController,
  	public nav: NavController,
		public cd: ChangeDetectorRef,
		public activatedRoute: ActivatedRoute,
		public common: CommonProvider
  ) {
		this.tabs = this.activatedRoute.snapshot.paramMap.get('tabs');

		if (this.tabs) this.whichPage = this.tabs;
	}

  ngOnInit() {

  }

  ionViewWillEnter() {
  	this.skip = 0;
  	this.us.getMe().subscribe(res => {
			if (res.success) {
				this.user = res.data;
			} else {
				if (res.errCode) {
					this.common.authCheck(res);
				} else {
					this.ap.alert('', { title: '오류', message: res.message});
				}
			}
		});
		
		this.getLikeLists();
		this.getLikeBadge();
  }
	
	getLikeBadge() {
		this.us.getCountBadge().subscribe(res => {
			if (res.success) {
				this.badge = res.data;
			}
		});
	}

  getLikeLists() {
  	if (!this.skip) this.lists = [];

  	this.ls.getLikeLists(this.whichPage, this.skip, this.limit).subscribe(res => {
  		if (res.success) {
  			if (this.skip) {
					this.lists = this.lists.concat(res.data);
					this.infiniteScroll.complete();

					if (res.data.length < this.limit) {
						this.infiniteScroll.disabled = true;
						this.skip = 0;
					}
				} else {
					this.lists = res.data;
					this.flag = res.flag;
  				this.refresher.complete();

  				if (this.lists.length >= this.limit) {
  					this.infiniteScroll.disabled = false;
  				} else {
  					this.infiniteScroll.disabled = true;
  				}
  				
  				this.cd.detectChanges();
  			}
  		} else {
  			this.ap.alert('', { title: '오류', message: res.message });
  		}
  	}, (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        this.ap.alert('', { title: '오류', message: err.error.message });
      } else {
        this.ap.alert('', { title: '오류', message: err.error });
      }
    });
  }

  segmentChanged(event) {
  	this.skip = 0;
  	this.infiniteScroll.disabled = false;
  	this.flag = false;
  	this.whichPage = event.detail.value;

  	this.getLikeLists();	
  }

  loadData(event) {
  	this.skip = this.skip + this.limit;

  	this.getLikeLists();	
  }

  doRefresh(event) {
  	this.segmentChanged({ detail: { value: this.whichPage } });
  }  

  loadDefault(event) {
    event.target.src = 'assets/icon/profile-none.jpg';
	}

  async ModalProfile(user, target) {
  	if (!user.read && this.user.profile.profile_image && this.whichPage=='receive') {
	  	this.ls.setLikeRead(user).subscribe(res => {
	  		if (res.success) {
					user.read = 1;
					this.badge.likeRequest--;
					this.common.getBadge();
	  		}
	  	});
	  }

    let modal = await this.modal.create({
      component: ProfilePage,
      componentProps: { user: target }
    });

    modal.onDidDismiss().then(detail => {
    	if (detail.data == 'like') {
    		this.whichPage = 'match';
    		this.segmentChanged({ detail: { value: this.whichPage } });
    	}
    });

    return await modal.present();
  }


  async matchModal(list) {

  	if (list.user_id._id == this.user._id && !list.read) {
  		this.ls.setLikeRead({ _id: list._id }).subscribe(res => {
	  		if (res.success) {
					list.read = 1;
					this.badge.likeMatch--;
					this.common.getBadge();
	  		}
	  	});
		}
		
		let params = {};
		let target;

		if (list.user_id._id == this.user._id) {
			params = {
				user: list.user_id, target: list.target_id, type: ''
			}
			target = list.target_id;
		} else {
			params = {
				user: list.target_id, target: list.user_id, type: ''
			}
			target = list.user_id;
		}


    let modal = await this.modal.create({
      component: LikeCompleteComponent,
      componentProps: params 
    });

    modal.onDidDismiss().then(detail => {
    	if (detail.data) {
				if (detail.data == 'message') {
					this.ModalMessage(target, this.user);
				} else if (detail.data == 'profile') {
					this.ModalProfile(this.user, list.target_id);
				}
    	}
    });

    return await modal.present();
  }

  async ModalMessage(user, me) {
    let modal = await this.modal.create({
      component: MessageSendComponent,
      componentProps: { user, me }
    });
    return await modal.present();
  }  
  
}
