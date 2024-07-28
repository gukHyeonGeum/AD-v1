import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { HttpErrorResponse } from '@angular/common/http';

import { AlertProvider } from '../../service/alert';
import { AuthenticationService } from '../../service/authentication.service';
import { UserService } from '../../service/user.service';
import { CommonProvider } from '../../service/common';
import { PaymentService } from '../../service/payment.service';

@Component({
  selector: 'app-certification',
  templateUrl: './certification.page.html',
  styleUrls: ['./certification.page.scss'],
})
export class CertificationPage implements OnInit {

	certificationForm: FormGroup;
	certNumberForm: FormGroup;

	user: any;
  isSms: any = false;
  randNumber: any;
  view = false;

  constructor(
  	public alertController: AlertController, 
  	public formBuilder: FormBuilder, 
  	public nav: NavController,
  	public storage: Storage,
  	public us: UserService,
  	public auth: AuthenticationService,
		public ap: AlertProvider,
		public cd: ChangeDetectorRef,
		public common: CommonProvider,
		public ps: PaymentService
  ) {
  	this.certificationForm = this.formBuilder.group({
  		phone: ['', [Validators.minLength(10), Validators.required, Validators.pattern('^[0-9]*$')] ]
  	});

  	this.certNumberForm = this.formBuilder.group({
  		certNumber: ['', [Validators.minLength(4), Validators.maxLength(4), Validators.required, Validators.pattern('^[0-9]*$')] ]
  	});		
  }

  ngOnInit() {

  	this.storage.get('phone').then((val) => {
      if (val) {
      	this.nextPage();
      } else {
      	this.view = true;
      }
    });

  }

  pad(n, width, z='') {
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}


  async send() {

  	if (!this.certificationForm.value['phone']) {
  		return false;
  	} else {

	  	const alert = await this.alertController.create({
	  		header: '전화번호 인증',
	  		message: '문자로 인증번호를 보냅니다.',
	  		buttons: [
	  			{
		          text: '취소',
		          role: 'cancel',
		          cssClass: 'secondary',
		          handler: () => {
		          }
		        }, {
		          text: '확인',
		          handler: () => {
								this.certNumberForm.controls.certNumber.patchValue('');

								
								this.us.getIsDeleteUser(this.certificationForm.value['phone'])
                  .subscribe(res => {
										if (res.success) {
											this.storage.set('certHp', this.certificationForm.value['phone']);
											this.isSms = true;
											let data:any = res.data;
											this.randNumber = data.randNumber;
											this.cd.detectChanges();

											if (data.pass) {
												this.certNumberForm.controls.certNumber.patchValue(data.randNumber);
												this.confirmation();
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
		        }
	  		]
	  	});

	  	await alert.present();

	  }
  	
  }

  confirmation() {
  	if (this.randNumber == this.certNumberForm.value['certNumber']) {

			this.storage.get('certHp').then(phone => {
				if (phone == this.certificationForm.value['phone']) {

					this.us.getToken(this.certificationForm.value['phone'])
						.subscribe(res => {
							if (res.success) {
								this.user = res.data;

								this.storage.remove('certHp');
								this.auth.login(res.token)
									.then(() => {
										if (this.user.profile.old_point) {
											this.ps.setPaymentInsert(
												{
													productName: this.user.profile.old_point + '개월',
													productId: 'free' + this.user.profile.old_point,
													price: '0'
												}
											).subscribe(() => {});
										}
									});
								this.auth.setMe(res.data);
								this.common.AuthPushToken(res.token, res.data);

								let now = new Date('2019-08-16 17:00');
								let update = new Date(this.user.updated_at);

								if (now > update) {
									this.nav.navigateRoot(['pages/more/welcome']);
								} else {
									this.nav.navigateRoot('/');
								}
								
							} else {
								if (res.errCode) {
									this.ap.alert('', { title: '오류', message: res.message });
								} else {
									this.common.toastMsg('휴대폰 인증 되었습니다.');
									this.storage.set('phone', this.certificationForm.value['phone']);
									this.storage.remove('certHp');
									this.nav.navigateRoot('user-profile');
								}
							}
						}, (err: HttpErrorResponse) => {
							if (err.error instanceof Error) {
								this.ap.alert('', { title: '오류', message: err.error.message });
							} else {
								this.ap.alert('', { title: '오류', message: err.error });
							}
						});
						
				} else {
					this.ap.alert('', { title: '오류', message: '휴대폰 번호가 인증번호 전송 후 변경되었습니다.' });
				}
			});
  		

  	} else {
			this.ap.alert('', { title: '인증번호 오류', message: '인증번호를 다시 입력하세요.' });
			this.certNumberForm.controls.certNumber.patchValue('');
  	}
  }

  nextPage() {
  	this.nav.navigateRoot('user-profile');
  }

}
