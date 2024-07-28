import { Component, OnInit } from '@angular/core';

import { ViewComponent } from './view/view.component';
import { ModalController } from '@ionic/angular';
import { PaymentService } from '../../../../service/payment.service';
import { AlertProvider } from '../../../../service/alert';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  lists: any;

  constructor(
    public modal: ModalController,
    public ps: PaymentService,
    public ap: AlertProvider
  ) { }

  ngOnInit() {
    this.ps.getPaymentLists().subscribe(res => {
      if (res.success) {
        this.lists = res.data;
      } else {
        this.ap.alert('', { title: '오류', message: res.message });
      }
    })
  }

  async ViewModal(id) {
    let modal = await this.modal.create({
      component: ViewComponent,
      componentProps: { id }
    });
		modal.onDidDismiss().then(detail => {
			if (detail.data) {
			}
    });    
    return await modal.present();
  }  

}
