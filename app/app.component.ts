import { Component, NgZone } from '@angular/core';
import { Device } from '@ionic-native/device/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

import { UserService } from './service/user.service';
import { CommonProvider } from './service/common';
import { AlertProvider } from './service/alert';

import { AppVersion } from '@ionic-native/app-version/ngx';
import { WebIntent } from '@ionic-native/web-intent/ngx';
import { CommonService } from './service/common.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public rootPage;
  private backButtonPressedOnceToExit: boolean = false;
  private pltType: String = '';

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public fcm: FCM,
    public us: UserService,
    public common: CommonProvider,
    public device: Device,
    public ap: AlertProvider,
    public storage: Storage,
    public router: Router,
    public ngZone: NgZone,
    public appVersion: AppVersion,
    public cs: CommonService,
    public webIntent: WebIntent,
    public nav: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      if (this.platform.is('cordova')) {
        if (this.platform.is('android')) {
          this.statusBar.styleLightContent();
          this.pltType = 'android';
        } else {
          this.statusBar.styleDefault();
          this.pltType = 'ios';
        }
        
        this.splashScreen.hide();

        this.appVersion.getVersionCode().then(res => {
          this.cs.getAppVersion(res, this.pltType).subscribe(res => {
            if (res.success) {

              if (this.platform.is('android')) {
                this.ap.alert('', { title: '알림', message: '새로운 버젼이 나왔습니다. </br> 구글플레이로 이동하겠습니다.<br />업데이트가 안될시 삭제 후 다시 설치해주시기 바랍니다.'})
                  .then(alert => {
                    alert.onWillDismiss().then(() => {
                      const options = {
                        action: this.webIntent.ACTION_VIEW,
                        url: 'market://details?id=kr.co.aengdoo.app'
                      }
                      
                      this.webIntent.startActivity(options).then(res => {
                      });
                      
                      navigator['app'].exitApp();
                    });
                  });
              } else if (this.platform.is('ios')) {
                this.ap.alert('', { title: '알림', message: '새로운 버젼이 나왔습니다. </br> 앱스토어로 이동하겠습니다.<br />업데이트가 안될시 삭제 후 다시 설치해주시기 바랍니다.'})
                  .then(alert => {
                    alert.onWillDismiss().then(() => {
                      window.open('https://apps.apple.com/app/id1226401334', '_system');
                      this.splashScreen.show();
                    });
                  });
              }
              
            }
          })
        });
      }

      this.registerHardwareBackButton();
    });

    this.storage.ready().then(() => {
      this.pushToken();
    });
  }

  pushToken() {
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

      this.fcm.getToken().then(token => {
        obj.push_token = token;
        this.storage.get('auth-token').then(token => {
          if (token) {
            obj.token = token;
            this.us.setPushToken(obj).subscribe(() => {});
            this.us.getMe('', token).subscribe(res => {
              if (res.success) {
                this.storage.set('me', res.data).then(() => {});
                let me: any = res.data;
                this.fcm.subscribeToTopic('all');
                this.fcm.subscribeToTopic(me.profile.gender);
              }
            });
          }
        });
      });

      this.fcm.onTokenRefresh().subscribe(token => {
        obj.push_token = token;
        this.storage.get('auth-token').then(token => {
          if (token) {
            obj.token = token;
            this.us.setPushToken(obj).subscribe(() => {});
          }
        });
      });

      this.fcm.onNotification().subscribe(data => {
        if (data.wasTapped) {
          this.ngZone.run(() => {
            if (data.id) {
              var page = [data.landing_page, data.id];
            } else {
              var page = [data.landing_page];
            }
            this.nav.navigateRoot(page);
          });
        } else {
          if (data.id) {
            var url:any = '/' + data.landing_page + '/' + data.id;
          } else {
            var url:any = '/' + data.landing_page;
          }
          if (this.router.url != url) {
            this.common.toastMsgOption(data, 'top', 5000);
          }
        }
      });
    }
  }

  registerHardwareBackButton() {
    this.platform.backButton.subscribe((e) => {
      if (this.backButtonPressedOnceToExit) {
        navigator['app'].exitApp();
      } else {
        this.backButtonPressedOnceToExit = true;
        this.common.toastMsg("'뒤로'버튼을 한번 더 누르시면 종료합니다.", 'bottom', 1500);
        setTimeout(() => {
          this.backButtonPressedOnceToExit = false;
        }, 2000);
      }
    });
  }

}
