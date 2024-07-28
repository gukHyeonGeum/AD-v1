import { Component, OnInit, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { ModalController, NavController, IonInfiniteScroll, IonRefresher } from '@ionic/angular';

import { HttpErrorResponse } from '@angular/common/http';

import { Storage } from '@ionic/storage';

import { AlertProvider } from '../../../service/alert';
import { UserService } from '../../../service/user.service';
import { FriendService } from '../../../service/friend.service';
import { LikeService } from '../../../service/like.service';

import { ProfilePage } from '../../modal/profile/profile.page';
import { MessageSendComponent } from '../../modal/message-send/message-send.component';
import { VerifyService } from '../../../service/verify.service';
import { LoadingProvider } from '../../../service/loading';
import { CommonProvider } from '../../../service/common';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.page.html',
  styleUrls: ['./friend.page.scss'],
})
export class FriendPage implements OnInit {
	@ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
	@ViewChild(IonRefresher) refresher: IonRefresher;

	user: any;
	lists: any = [];
	private limit = 10;
	private skip = 0;
	imgStype: any;
	private images: string = 'assets/icon/profile-none.jpg';

  constructor(
    public ap: AlertProvider,
    public us: UserService,
    public fs: FriendService,
    public ls: LikeService,
    public modal: ModalController,
		public nav: NavController,
		public verify: VerifyService,
		public storage: Storage,
		public common: CommonProvider,
		public loading: LoadingProvider,
		public socket: Socket,
		public cd: ChangeDetectorRef
  ) {
		let imgAutoHeight = (window.innerWidth/2)-20;
		this.imgStype = { 'height.px' : imgAutoHeight };
  }

  ngOnInit() {
		this.getFriend();
  }

  ionViewWillEnter() {
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
	}
	
  getFriend() {

		this.fs.getFriend(this.skip, this.limit).subscribe(res => {
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
						this.refresher.complete();

						if (this.lists.length >= this.limit) {
							this.infiniteScroll.disabled = false;
						} else {
							this.infiniteScroll.disabled = true;
						}
					}
				
			} else {
				this.ap.alert('', { title: '오류', message: res.message });
			}
			this.cd.detectChanges();
		}, (err: HttpErrorResponse) => {
			if (err.error instanceof Error) {
				this.ap.alert('', { title: '오류', message: err.error.message });
			} else {
				this.ap.alert('', { title: '오류', message: err.error });
			}
		});
		

  }

  loadData() {
  	this.skip = this.skip + this.limit;
		this.getFriend();
  }

  doRefresh() {
  	this.skip = 0;
    this.getFriend();
  }  

  profile(id) {
    this.nav.navigateForward(['pages/friend/profile', id]);
  }

  loadDefault(event) {
    event.target.src = this.images;
	}

	like(target) {
		target.like = 1;

		this.verify.isProfile(this.user).then(res => {
			if (res) {
				this.ls.setLike({ target_id: target.target_id._id }).subscribe(res => {
					if (res.success) {
						this.common.toastMsg('좋아요 보냈습니다.');
						this.socket.emit('badgeRefresh', target.target_id._id, (res) => { console.log(res) });						
					} else {
						target.like = 0;
					}
				});
			} else {
				target.like = 0;
				return;
			}
		});
		
	}

	message(id) {
		this.nav.navigateForward(['message/create', id]);
	}	

  ModalProfile(user, index) {

		this.verify.userVerify().then(async res => {
			if (res) {
				this.fs.setFriendRead({ _id: user._id }).subscribe(res => {
					if (res.success) {
						user.read = 1;
					}
				});
		
				let modal = await this.modal.create({
					component: ProfilePage,
					componentProps: { user: user.target_id }
				});
				modal.onDidDismiss().then(detail => {
					if (detail.data) {
						this.lists[index].like = 1;
					}
				});
				return await modal.present();
			}
		})


  }

  async ModalMessage(user, me) {
    let modal = await this.modal.create({
      component: MessageSendComponent,
      componentProps: { user, me }
    });
    return await modal.present();
  }

}
