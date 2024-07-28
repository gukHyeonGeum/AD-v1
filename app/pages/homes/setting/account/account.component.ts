import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http/http';
import { AlertProvider } from '../../../../service/alert';
import { UserService } from '../../../../service/user.service';
import { AuthenticationService } from '../../../../service/authentication.service';
import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  certificationForm: FormGroup;
  certNumberForm: FormGroup;
  isSms: any = false;
  private randNumber: any;
  me: any;

  constructor(
    public modal: ModalController,
    public formBuilder: FormBuilder,
    public alertController: AlertController, 
    public ap: AlertProvider,
    public us: UserService,
    public auth: AuthenticationService,
    public toast: ToastController,
    public storage: Storage,
    public cd: ChangeDetectorRef,
    public fcm: FCM
  ) {
    this.certificationForm = this.formBuilder.group({
      phone: ['', [Validators.minLength(10), Validators.required, Validators.pattern('^[0-9]*$')] ]
    });
    this.certNumberForm = this.formBuilder.group({
      certNumber: ['', [Validators.minLength(4), Validators.maxLength(4), Validators.required, Validators.pattern('^[0-9]*$')]]
    });
  }

  ngOnInit() {
    this.us.getMe().subscribe(res => {
      this.me = res.data;
      this.certificationForm.controls['phone'].setValue(this.me.hp);
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
	  		header: '탈퇴하기 인증',
	  		message: '탈퇴시 2개월동안 재가입 할 수 없습니다.<br /><br />인증을 진행하시겠습니까?',
	  		buttons: [
	  			{
		          text: '취소',
		          role: 'cancel',
		          cssClass: 'secondary',
		          handler: (blah) => {
		          }
		        }, {
		          text: '확인',
		          handler: () => {
                this.us.getIsDeleteUser(this.certificationForm.value['phone'])
                  .subscribe(res => {
										if (res.success) {
                      this.storage.set('certHp', this.certificationForm.value['phone']);
                      this.isSms = true;
											let data:any = res.data;
											this.randNumber = data.randNumber;
											this.cd.detectChanges();
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
          this.us.deleteUser().subscribe(res => {
            if (res.success) {
              this.toastMsg('탈퇴 되었습니다.');
              this.fcm.unsubscribeFromTopic('all');
              this.fcm.unsubscribeFromTopic(this.me.profile.gender);
              this.close(true);
              this.auth.leave();
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
        } else {
					this.ap.alert('', { title: '오류', message: '휴대폰 번호가 인증번호 전송 후 변경되었습니다.' });
				}
      });
  		
  	} else {
      this.ap.alert('', { title: '인증번호 오류', message: '인증번호를 다시 입력하세요.' });
      this.certNumberForm.controls.certNumber.patchValue('');
  	}
  }
  
  close(flag) {
  	this.modal.dismiss(flag);
  }

  async toastMsg(msg: string) {
    const toast = await this.toast.create({
      message: msg,
      position: 'top',
      duration: 1000
    });
    toast.present();
  }
}
