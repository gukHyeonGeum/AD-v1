import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController, ToastController } from '@ionic/angular';
import { PaymentService } from '../../../../../service/payment.service';
import { AlertProvider } from '../../../../../service/alert';
import { CommonProvider } from '../../../../../service/common';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  id: any;
  view: any;

  constructor(
    public modal: ModalController,
    public navParams: NavParams,
    public ps: PaymentService,
    public ap: AlertProvider,
    public alert: AlertController,
    public toast: ToastController,
    public cp: CommonProvider
  ) { 
    this.id = this.navParams.get('id');
  }

  ngOnInit() {
    this.ps.getPaymentView(this.id).subscribe(res => {
      if (res.success) {
        this.view = res.data;
      } else {
        this.ap.alert('', { title: '오류', message: res.message });
      }
    });
  }

  close(flag) {
    this.modal.dismiss(flag);
  }

  async cancel(view: any) {

    let dayCount = this.cp.date_diff(new Date(view.created_at), new Date());

    if (dayCount > 7) {
      this.ap.alert('', { title: '알림', message: '구매일로 부터 7일이 경과하여<br />취소가 불가합니다.'});
      return;
    }

    const confirm = await this.alert.create({
      header: '환불요청',
      message: '이용권 구매를 취소 하시겠습니까?',
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

            this.ps.putCancel(view._id).subscribe(res => {
              if (res.success) {
                this.view = res.data;
                this.toastMsg('환불 요청되었습니다.');
              } else {
                this.ap.alert('', { title: '오류', message: res.message });
                return;
              }
            });
            
          }
        }
      ]
    });

    await confirm.present();
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
