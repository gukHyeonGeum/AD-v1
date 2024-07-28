import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams, IonSlides, ToastController, NavController } from '@ionic/angular';

import { UserService } from '../../../service/user.service';
import { LikeService } from '../../../service/like.service';

import { ImageViewPage } from '../image-view/image-view.page';
import { LikeCompleteComponent } from '../like-complete/like-complete.component';
import { MessageSendComponent } from '../../modal/message-send/message-send.component';
import { ReportComponent } from '../../modal/report/report.component';
import { AlertProvider } from '../../../service/alert';
import { VerifyService } from '../../../service/verify.service';
import { Storage } from '@ionic/storage';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
	@ViewChild(IonSlides) slides: IonSlides;

  images = 'assets/icon/profile-none.jpg';
	profile_img: any;
	slideIndex = 1;
  userId: any;
  user: any;
  me: any;
  likes: any;
  isLike = false;
  action: any;
  target: any;
  isVerify: any = false;

  constructor(
  	public _modal: ModalController, 
    public navParams: NavParams,
    public us: UserService,
    public ls: LikeService,
    public toast: ToastController,
    public ap: AlertProvider,
    public nav: NavController,
    public verify: VerifyService,
    public storage: Storage,
    public socket: Socket
  ) {
    this.userId = this.navParams.get('id');
    this.target = this.navParams.get('user');

    this.profile_img = { 'height.px': window.innerWidth };

    this.loadProfile();
  }

  ngOnInit() {
    
    this.verify.userVerify().then(res => {
      this.isVerify = res;
      if (this.isVerify) {
        this.us.getMe('profile').subscribe();
        this.us.getUser(this.target._id, 'profile').subscribe();
      } else {
        this.close();
      }
    });

  }

  loadProfile() {
    this.us.getMe().subscribe(res => {
      if (res.success) {
        this.me = res.data;
      }
    });

    this.us.getUser(this.target._id).subscribe(res => {
      if (res.success) {
        this.user = res.data;
      }
    });

    this.us.getIsLike(this.target._id).subscribe(res => {
      if (res.success) {
          this.likes = res;
      }
    });   
  }

  loadDefault(event) {
    event.target.src = 'assets/icon/profile-none.jpg';
  }

  change() {
  	this.slides.getActiveIndex().then(index => {
  		this.slideIndex = index + 1;
  	});
  }

  like() {

    if (this.likes.result.liked) {
      return;
    }

    this.verify.isProfile(this.me).then(res => {
			if (res) {

        if (this.likes.result.isLike) {
          this.toastMsg('이미 좋아요 했습니다.');
          return;
        }
    
        let obj = {
          target_id: this.user
        }
        this.ls.setLike(obj).subscribe(async res => {
          if (res.success) {
            this.likes = res;
    
            if (this.likes.result.liked) {
              this.toastMsg('매치 되었습니다.');
              this.matchModal();
            } else {
              this.toastMsg('좋아요 보냈습니다.');
            }
            this.action = 'like';

            this.socket.emit('badgeRefresh', this.user._id, (res) => { console.log(res) });
          }
        });

      } else {
        return;
      }
    });

  }

  close() {
    this._modal.dismiss(this.action);
  }

  async toastMsg(msg: string) {
    const toast = await this.toast.create({
      message: msg,
      position: 'top',
      duration: 1000
    });
    toast.present();
  }

  async imageViewModal(userId, index) {
    let modal = await this._modal.create({
      component: ImageViewPage,
      componentProps: { id: userId, idx: index }
    });
    return await modal.present();
  }

  async matchModal() {
    let modal = await this._modal.create({
      component: LikeCompleteComponent,
      componentProps: { user: this.me, target: this.user, type: 'request' }
    });
    modal.onDidDismiss().then(detail => {
    	if (detail.data) {
    		this.ModalMessage(this.user, this.me);
    	}
    });
    return await modal.present();
  }

  async ModalMessage(user, me) {
    this.close();
    let modal2 = await this._modal.create({
      component: MessageSendComponent,
      componentProps: { user, me }
    });
    modal2.onDidDismiss().then(detail => {
    	if (detail.data) {
        if (detail.data == 'verify') {
          this.close();
        } else {
          this.action = true;
        }
    	}
    });
    return await modal2.present();
  }

  async ModalReport(user, me) {
    this.close();
    let modal = await this._modal.create({
      component: ReportComponent,
      componentProps: { user, me }
    });
    modal.onDidDismiss().then(detail => {
    	if (detail.data) {
    		this.action = true;
    	}
    });
    return await modal.present();
  }

}
