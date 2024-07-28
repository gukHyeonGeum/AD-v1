import { Injectable } from '@angular/core';
import { ToastController, ModalController, Platform, NavController } from '@ionic/angular';
import { AlertProvider } from './alert';
import { FCM } from '@ionic-native/fcm/ngx';
import { Device } from '@ionic-native/device/ngx';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class CommonProvider {
  
  dataBadgeObserver: any;
  dataBadge: Observable<any>;
  data: any;

  constructor(
    public toast: ToastController,
    public ap: AlertProvider,
    public $modal$: ModalController,
    public platform: Platform,
    public fcm: FCM,
    public device: Device,
    public us: UserService,
    public router: Router,
    public auth: AuthenticationService,
    public nav: NavController
  ) {
    this.dataBadge = new Observable(observer => {
      this.dataBadgeObserver = observer;
    });
  }

  setBadge(data:any) {
    this.data = data;
    this.dataBadgeObserver.next(this.data);
  }

  getBadge() {
    this.us.getCountBadge().subscribe(res => {
      if (res.success) this.setBadge(res.data);
    });
  }

  /**
   * @param date1 
   * @param date2 
   */
  date_diff(date1: Date, date2: Date) {
    let dt1 = date1;
    let dt2 = date2;

    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
  }

  firstPicture(me: any) {
    if (!me.profile.profile_image) {
      this.toastMsg('사진이 등록되었습니다.');
      this.ap.alert('', { title: '프로필 작성하기', message: '회원님에게 딱 맞는 등산친구를 추천하려면<br />프로필을 추가해 주세요.'});
    }
  }

  AuthPushToken(token, me) {
    if (this.platform.is('cordova')) {

      let pushType = '';
      if (this.platform.is('android')) {
        pushType = 'gcm';
      } else {
        pushType = 'apns';
      }
      
      let obj: any = {
        device_id: this.device.uuid,
        push_type: pushType
      };

      this.fcm.getToken().then(pushToken => {
        obj.push_token = pushToken;
        obj.token = token;
        this.us.setPushToken(obj).subscribe(() => {});
      });

      this.fcm.subscribeToTopic('all');
      this.fcm.subscribeToTopic(me.profile.gender);

    }
  }

  authCheck(obj: any) {
    if (obj.errCode == '1009') {
      this.ap.alert('', { title: '알림', message: obj.message });
      this.auth.leave();
    }
  }

  ageChange(input: any) {
    if (!input) {
      return;
    } else {
        var birth = input.split("-");
        var today = new Date();
        var year	= today.getFullYear()-1; 
        var month	= today.getMonth()+1;
        var day		= today.getDate();
        var ck		= parseInt(birth[0]);

        if(ck == 0) return "";

        var age = year - ck;
        var tmd = parseInt(month+''+day);
        var bmd = parseInt(birth[1]+''+birth[2]);

        if (tmd >= bmd) {
          age++;
        }

        return age;
    }
  }

  async toastMsg(msg: string, pos: any = 'top', dur: number = 1000) {
    const toast = await this.toast.create({
      message: msg,
      position: pos,
      duration: dur
    });
    toast.present();
  }

  async toastMsgOption(data: any, pos: any = 'top', dur: number = 1000) {
    const toast = await this.toast.create({
      message: data.body,
      position: pos,
      duration: dur,
      color: 'dark',
      translucent: true,
      buttons: [
        {
          side: 'end',
          text: '확인',
          handler: () => {
            if (data.id) {
              var page = [data.landing_page, data.id];
            } else {
              var page = [data.landing_page];
            }
            this.nav.navigateRoot(page);
          }
        }
      ]
    });
    toast.present();
  }

  async ModalProfile(target_id, page) {
    let modal = await this.$modal$.create({
      component: page,
      componentProps: { user: target_id }
    });
    modal.onDidDismiss().then(detail => {
    });
    await modal.present();
  }

}