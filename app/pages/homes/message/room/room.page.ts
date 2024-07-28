import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { NavController, IonContent, IonList, IonTextarea, ActionSheetController, ModalController, IonInfiniteScroll, AlertController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { LoadingProvider } from '../../../../service/loading';
import { FirebaseService } from '../../../../service/firebase.service';

import { ImageViewPage } from '../../../modal/image-view/image-view.page';
import { ProfilePage } from '../../../modal/profile/profile.page';
import { ReportComponent } from '../../../modal/report/report.component';

import { UserService } from '../../../../service/user.service';
import { MessageService } from '../../../../service/message.service';
import { VerifyService } from '../../../../service/verify.service';
import { CommonService } from '../../../../service/common.service';
import { CommonProvider } from '../../../../service/common';
import { AlertProvider } from '../../../../service/alert';

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {
	@ViewChild(IonContent) contentArea: IonContent;
	@ViewChild(IonList, {read:ElementRef}) chatList: ElementRef;
	@ViewChild(IonTextarea) tarea: IonTextarea;
	@ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

	user: any;
	target: any;
	private id: any;
	private type: any;
	message: string = '';
	chats: any = [];
	listLoad: boolean = true;

  private target_participant: any;
  private thumb_image: any;
  private completeMsg: any;
  private getMsg: any = [];
  private chatsMsg: Object[];
	private mutationObserver: MutationObserver;
	private images = 'assets/icon/profile-none.jpg';

  private loadingChk = false;
  private scrollChk = false;

	private limit = 15;
	private skip = 0;	  

	private tabBar = document.getElementById('myTabBar');

  constructor(
  	public navCtrl: NavController, 
  	public http: HTTP, 
  	public socket: Socket, 
  	public el: ElementRef, 
  	public renderer: Renderer2,
  	public actionSheet: ActionSheetController,
  	public firebase: FirebaseService,
  	public modal: ModalController,
  	public activatedRoute: ActivatedRoute,
  	public us: UserService,
  	public ms: MessageService,
		public loading: LoadingProvider,
		public verify: VerifyService,
		public nav: NavController,
		public cs: CommonService,
		public common: CommonProvider,
		public ap: AlertProvider,
		public alert: AlertController
  ) {

		
  	this.id = this.activatedRoute.snapshot.paramMap.get('id');
  	this.type = this.activatedRoute.snapshot.paramMap.get('type');

  	if (this.type == 'room') {
  		this.socket.emit('joinRoom', this.id);
  	}

    this.getMessages().subscribe(message => {
    	this.getMsg = message;
      this.chats.push(this.getMsg);

      this.socket.emit('putMsgRead', { thread_id: this.id, user_id: this.user._id, date: this.getMsg.created_at });
    });

    this.completeMessages().subscribe(obj => {

			var that = this;
			this.completeMsg = obj;
		

			let getId = 'msg-' + this.user._id + '-' + Math.floor(new Date(this.completeMsg.data.created_at).getTime());


    	if (this.completeMsg.success) {

					if (this.el.nativeElement.querySelector('#'+getId)) {
						this.renderer.addClass(this.el.nativeElement.querySelector('#'+getId + ' .spinner'), 'none');
						this.renderer.removeClass(this.el.nativeElement.querySelector('#'+getId + ' .date-field'), 'none');
					}

				if (this.completeMsg.data.type == 'image') {
	    		let id = this.completeMsg.data._id;
	    		let thumbImg = this.thumb_image;

					setTimeout(function() {
						that.thumbnail(thumbImg, id);
					}, 5000);
					
				} else {
				}

    	} else {

					if (this.el.nativeElement.querySelector('#'+getId)) {
						this.renderer.addClass(this.el.nativeElement.querySelector('#'+getId + ' .spinner'), 'none');
						this.renderer.removeClass(this.el.nativeElement.querySelector('#'+getId + ' .refresh'), 'none');
					}
    	}
    });

    this.getMsgRead().subscribe(obj => {
			this.target_participant = obj;
		});
  }

  ngOnInit() {
    this.mutationObserver = new MutationObserver((mutations) => {
  		
  		if (!this.scrollChk) {
      	this.contentArea.scrollToBottom();
  		} else {
 				this.scrollChk = false;
  		}

      if (this.loadingChk) {
				if (this.el.nativeElement.querySelector('.item.me:last-child')) {
      		this.renderer.removeClass(this.el.nativeElement.querySelector('.item.me:last-child .spinner'), 'none');
					this.renderer.addClass(this.el.nativeElement.querySelector('.item.me:last-child .date-field'), 'none');
				}
      }
    });

    this.mutationObserver.observe(this.chatList.nativeElement, {
      childList: true
    });  	
		
  }

  ionViewWillEnter() {

  	this.scrollChk = false;
  	this.infiniteScroll.disabled = true;

  	if (this.tabBar.style.display !== 'none') this.tabBar.style.display = 'none';

		this.verify.isExpire().then(res => {
			if (!res) {
				this.nav.navigateForward(['pages/message']);
			} else {
				this.us.getMe().subscribe(res => {
					this.user = res.data;
					this.socket.emit('putMsgRead', { thread_id: this.id, user_id: this.user._id, date: new Date() });
				});
			}
		});

  	if (this.type == 'create') {
  		this.us.getUser(this.id).subscribe(res => {
  			this.target = res.data;
  		});
  	} else {
  		this.skip = 0;
  		this.getMessage();
  	}
  	
  }

  ionViewWillLeave () {
    if (this.type == 'room') {
    	this.socket.emit('leaveRoom', this.id);
			this.socket.removeAllListeners('message');
			this.socket.removeAllListeners('getMsgRead');
			this.socket.removeAllListeners('completeMessage');
    }

    if (this.tabBar.style.display !== 'flex') this.tabBar.style.display = 'flex';
	}


	focus() {
		setTimeout(() => {
			this.contentArea.scrollToBottom();	
		}, 500);
	}

	blur() {
	}

	
  getMessage() {
  	if (!this.skip) this.chats = [];


		this.ms.getMessage(this.id, this.skip, this.limit).subscribe(res => {

			if (res.success) {
				if (this.skip) {
					res.data.forEach((v) => {
						v.load = 1;
						this.chats.unshift(v);
					});

					this.infiniteScroll.complete();
					if (res.data.length < this.limit) {
						this.infiniteScroll.disabled = true;
						this.skip = 0;
					}
				} else {
					if (res.data.length >= this.limit) {
						this.infiniteScroll.disabled = false;
					} else {
						this.infiniteScroll.disabled = true;
					}

		  		this.chats = res.data.reverse();
		  		this.target_participant = res.participant;
					this.target = res.participant;
				}
				
				this.common.getBadge();
				
			}

		});
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  completeMessages() {
    let observable = new Observable(observer => {
      this.socket.on('completeMessage', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getMsgRead() {
  	let observable = new Observable(observer => {
	  	this.socket.on('getMsgRead', (data) => {
	  		observer.next(data);
	  	});
	  });
  	return observable;
  }

  loadData(event) {
  	this.scrollChk = true;
  	this.skip = this.skip + this.limit;
		this.getMessage();
  }  

  addChat(type){

		let image = '';
		
		if (type == 'image') {
			image = this.message;
    } else {
    	this.tarea.setFocus();
    } 

  	this.loadingChk = true;

  	this.chats.push({
			user: this.user,
			target: this.target.user,
			message: this.message,
			thread_id: this.id,
			image: image,
			type: type,
			created_at: new Date()
  	});

  	let obj = {
  		message: this.message,
  		image: this.message,
      user_id: this.user._id,
      target_id: this.target.user._id,
      thread_id: this.id,
      type: type,
      created_at: new Date()
  	}

		this.socket.emit('sendMessage', obj);    	
    this.message = '';

  }

  refresh(obj, idx) {
		const refreshMsg:any = obj;

		this.message = refreshMsg.message;

		this.addChat(refreshMsg.type);

		this.chats.splice(idx, 1);

  }

  imageLoaded() {
		if (this.loadingChk) {
			this.contentArea.scrollToBottom();
			this.loadingChk = false;
		}

		if (this.listLoad) {
			this.contentArea.scrollToBottom();
			this.listLoad = false;
		}
	}
	

  loadDefault(event) {
		event.target.src = this.images;
	}

	thumbnail(thumb_url, item) {
  	this.firebase.getThumbnail(thumb_url)
  		.then(url => {
  			this.ms.putMsgThumb({ id: item, thumb: url }).subscribe(res => {
					this.renderer.addClass(this.el.nativeElement.querySelector('.item:last-child .spinner'), 'none');
					this.renderer.removeClass(this.el.nativeElement.querySelector('.item:last-child .date-field'), 'none');
  			});
  		});
	}
	
	report() {
		this.ModalReport(this.target.user, this.user);
	}

	async chatOut() {

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
						
						this.ms.putChatOut({ thread_id: this.id }).subscribe(res => {
							if (res.success) {
								this.nav.navigateBack('pages/message');
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

  async imageViewModal(image) {
    const modal = await this.modal.create({
      component: ImageViewPage,
      componentProps: { image: image }
    });
    return await modal.present();
	}
	
	async ModalProfile(user) {
    let modal = await this.modal.create({
      component: ProfilePage,
      componentProps: { user }
		});
		modal.onDidDismiss().then(detail => {
			if (detail.data) {
				this.getMessage();
			}
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

  async attach() {

  	let action = await this.actionSheet.create({
      header: '선택',
      buttons: [{
        text: '사진',
        icon: 'images',
        handler: () => {

          this.firebase.uploadPhotoMessage(this.user._id, 'photo').then((obj) => {
            this.message = obj.url;
            this.thumb_image = obj.thumb_url;
            this.addChat('image');
          });
        }
      }, {
        text: '카메라',
        icon: 'camera',
        handler: () => {

          this.firebase.uploadPhotoMessage(this.user._id, 'camera').then((obj) => {
            this.message = obj.url;
            this.thumb_image = obj.thumb_url;
            this.addChat('image');
          });
        }
      }]
    });
    await action.present();
  }
}
