import { Component, OnInit, ViewChild, ChangeDetectorRef, NgZone } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { AlertProvider } from '../../service/alert';
import { UserService } from '../../service/user.service';
import { AuthenticationService } from '../../service/authentication.service';
import { CommonProvider } from '../../service/common';
import { PaymentService } from '../../service/payment.service';
import { FriendService } from '../../service/friend.service';
import { InviteService } from '../../service/invite.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

	userProfileForm: FormGroup;
	phone = null;
  nickOverlap = false;
  realOverlap = false;
  private nickOverlapMsg = '';
  private realOverlapMsg = '';
  limitAge: any;
  private alertPopup: any;

  constructor(
    public formBuilder: FormBuilder,
    public storage: Storage,
    public nav: NavController,
    public http: HttpClient,
    public alert: AlertController,
    public us: UserService,
    public ap: AlertProvider,
    public auth: AuthenticationService,
    public cd: ChangeDetectorRef,
    public common: CommonProvider,
    public ps: PaymentService,
    public fs: FriendService,
    public ngZone: NgZone,
    public is: InviteService
  ) {

    let now = new Date();

    this.limitAge = new Date(now.getFullYear()-19,now.getMonth(),now.getDate(),0,0,0,0);

  	this.userProfileForm = this.formBuilder.group({
      phone: ['', Validators.required ],
  		gender: ['', Validators.required ],
  		birth: ['', Validators.required ],
  		area: ['', Validators.required ],
      nickname: ['', Validators.required ],
  		realname: ['', Validators.required ]
  	});
  }

  ngOnInit() {
    this.storage.get('phone').then((val) => {
      if (val) this.userProfileForm.controls.phone.patchValue(val);
      else this.nav.navigateRoot('certification');
    });
  }

  async confirmation() {

    const confirm = await this.alert.create({
      header: '입력 정보가 확실한가요?',
      message: '<div text-center><p>이름, 성별, 생년월일은<br />가입 후 수정이 불가합니다.</p><p margin-top><ion-text color="danger">※ 허위 기재시 서비스 이용이 어려울수 있습니다.</ion-text></p></div>',
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

            const obj = this.userProfileForm.value;

            this.us.setUser(obj).subscribe(res => {

              if (res.success) {
                this.ngZone.run(() => {

                  this.auth.login(res.token)
                    .then(() => {
                      this.ps.setPaymentInsert(
                        {
                          productName: '1개월',
                          productId: 'free1',
                          price: '0'
                        }
                      ).subscribe(() => {});
                      this.fs.setMatchingOne({}).subscribe(() => {});
                      this.is.setSendListUser({}).subscribe(() => {});
                    });

                  this.auth.setMe(res.data);

                  this.common.AuthPushToken(res.token, res.data);

                  this.nav.navigateRoot(['pages/more/welcome']);
                });
              } else {
                if (res.errCode=='1000') {
                  this.nickOverlapMsg = res.message;
                  this.nickOverlap = true;
                  this.cd.detectChanges();
                } else if (res.errCode=='2000') {
                  this.realOverlapMsg = res.message;
                  this.realOverlap = true;
                  this.cd.detectChanges();
                } else {
                  this.ap.showErrorMessage('', res);
                }
              }

            }, (err: HttpErrorResponse) => {
            });

          }
        }
      ]
    });

    await confirm.present();

  }

  nickCheck() {
    this.nickOverlap = false;
  }

  realCheck() {
    this.realOverlap = false;
  }

}
