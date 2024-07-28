import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ModalController, NavController, IonInfiniteScroll, IonRefresher, ActionSheetController, AlertController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';

import { AlertProvider } from '../../../service/alert';
import { ProfilePage } from '../../modal/profile/profile.page';
import { RoomPage } from './room/room.page';
import { ReportComponent } from '../../modal/report/report.component';

import { UserService } from '../../../service/user.service';
import { MessageService } from '../../../service/message.service';
import { VerifyService } from '../../../service/verify.service';
import { CommonProvider } from '../../../service/common';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {
	@ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
	@ViewChild(IonRefresher) refresher: IonRefresher;

	user: any;
	lists: any = [];
	flag: boolean;
	private limit = 10;
	private skip = 0;	

  constructor(
  	public ap: AlertProvider,
  	public us: UserService,
  	public ms: MessageService,
  	public modal: ModalController,
  	public nav: NavController,
  	public socket: Socket,
		public cd: ChangeDetectorRef,
		public actionSheet: ActionSheetController,
		public verify: VerifyService,
		public common: CommonProvider,
		public alert: AlertController
  ) {

  	this.getMsgList().subscribe(res => {
			let data: any = res;
			
			let idx = this.lists.findIndex(r => { return r.thread_id === data.thread_id });
			let list = this.lists.find(r => { return r.thread_id === data.thread_id });
			list.messages.message = data.message;
			list.messages.type = data.type;
			list.updated_at = data.created_at;
			list.newMsg++;

			this.lists.splice(idx, 1);
			this.lists.splice(0, 0, list);

			this.common.getBadge();
    });

  }

  ngOnInit() {
		this.getMsgLists();
  }

  ionViewWillEnter() {
		this.us.getMe().subscribe(res => {
			if (res.success) {
				this.user = res.data;
				if (this.user.profile.gender == 'male') {
					let now = new Date();
					let expire: any;
					if (this.user.expired_at) {
						expire = new Date(this.user.expired_at);
					} else {
						expire = new Date(this.user.created_at);
					}

					if (now > expire) {
						this.user.expire = true;
					}
				}
			} else {
				if (res.errCode) {
					this.common.authCheck(res);
				} else {
					this.ap.alert('', { title: '오류', message: res.message});
				}
			}
			this.cd.detectChanges();
		});
		
  	
	}

  getMsgLists(type:string='') {
  	if (!this.skip) {
			if (!type)
				this.lists = [];
		}

  	this.ms.getMsgLists(this.skip, this.limit).subscribe(res => {
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

  getMsgList() {
    let observable = new Observable(observer => {
      this.socket.on('putMsgList', (data) => {
        observer.next(data);
      });
    });
    return observable;
  } 

  loadData(event) {
  	this.skip = this.skip + this.limit;
		this.getMsgLists();
  }

  doRefresh(event) {
  	this.skip = 0;
    this.getMsgLists();
  }    

  loadDefault(event) {
    event.target.src = 'assets/icon/profile-none.jpg';
	}

	room(list) {

		this.verify.isExpire().then(res => {
			if (res) {
				list.newMsg = 0;
				this.nav.navigateRoot(['pages/message/room', list.thread_id]);
			}
		});


	}

	block(list: any) {

	}

	alarmOff(list: any) {

	}

	unread(list: any) {

	}

	async chatOut(list: any, index: number) {

		const confirm = await this.alert.create({
			header: '나가기 하시겠습니까?',
      message: '대화내용이 모두 삭제되고<br />채팅목록에서도 삭제됩니다.',
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
						
						this.ms.putChatOut({ thread_id: list.thread_id }).subscribe(res => {
							if (res.success) {
								if (this.lists.length > 1) {
									this.lists.splice(index, 1);
									this.cd.detectChanges();
								} else {
									this.getMsgLists();
								}
								this.common.getBadge();	
							} else {
								this.ap.alert('', { title: '오류', message: res.message});
							}
						});
          }
        }
      ]
    });

    await confirm.present();
		
	}

	async ModalRoom(user) {
    let modal = await this.modal.create({
      component: RoomPage,
      componentProps: { user: this.user }
    });
    return await modal.present();
  }

  async ModalProfile(user) {
    let modal = await this.modal.create({
      component: ProfilePage,
      componentProps: { user }
    });
    return await modal.present();
	} 

	async ModalReport(user, me) {
    let modal = await this.modal.create({
      component: ReportComponent,
      componentProps: { user, me }
    });
    modal.onDidDismiss().then(detail => {
    	if (detail.data) {
    	}
    });
    return await modal.present();
  }

	async msgHold(val, index) {
  	let action = await this.actionSheet.create({
			header: '선택',
      buttons: [
				{
					text: '신고하기',
					icon: 'megaphone',
					handler: () => {
						this.ModalReport(val.target, this.user);
					}
				},
				{
					text: '나가기',
					icon: 'exit',
					handler: () => {
						this.chatOut(val, index);
					}
				},
				{
					text: '취소',
					icon: 'close',
					role: 'cancel',
					handler: () => {
					}
				}
			]
  	});
  	await action.present();
  }

}
