import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http/http';
import { AlertProvider } from '../../../../service/alert';
import { UserService } from '../../../../service/user.service';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from '../../../../service/authentication.service';

@Component({
  selector: 'app-phone-modify',
  templateUrl: './phone-modify.component.html',
  styleUrls: ['./phone-modify.component.scss']
})
export class PhoneModifyComponent implements OnInit {

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
    public storage: Storage,
    public toast: ToastController,
    public cd: ChangeDetectorRef,
    public auth: AuthenticationService
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
	  		header: '휴대폰번호 인증',
	  		message: '문자로 인증번호를 보냅니다.',
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

                this.us.getIsHp(this.certificationForm.value['phone'])
                  .subscribe(res => {
                    if (res.success) {

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

                    } else {
                      this.ap.alert('', { title: '오류', message: res.message });
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

      this.storage.get('certHp').then(res => {
        if (this.certificationForm.value['phone'] == res) {
          this.us.putUserHp({ hp: this.certificationForm.value['phone'] })
            .subscribe(res => {
              if (res.success) {
                this.us.getToken(this.certificationForm.value['phone']).subscribe(obj => {
                  if (obj.success) {
                    this.auth.authToken.next(obj.token);
                    this.storage.set('auth-token', obj.token);
                    this.me = res.data;
                    this.toastMsg('휴대폰 번호가 변경되었습니다.');
                    this.isSms = false;
                    this.certNumberForm.reset();
                    this.certificationForm.reset();
                    this.storage.remove('certHp');
                  }
                });
              } else {
                this.ap.alert('', { title: '오류', message: res.message });
              }
            });
        } else {
          this.ap.alert('', { title: '오류', message: '변경할 휴대폰 번호가 인증번호 전송 후 변경되었습니다.' });
        }
      }, (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.ap.alert('', { title: '오류', message: err.error.message });
        } else {
          this.ap.alert('', { title: '오류', message: err.error });
        }
      });

  	} else {
  		this.ap.alert('', { title: '인증번호 오류', message: '인증번호를 다시 입력하세요.' });
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
