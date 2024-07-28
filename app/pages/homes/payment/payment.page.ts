import { Component, OnInit } from '@angular/core';

import { InAppPurchase2, IAPProduct, IAPQueryCallback } from '@ionic-native/in-app-purchase-2/ngx';

import { PaymentService } from '../../../service/payment.service';
import { AlertProvider } from '../../../service/alert';
import { UserService } from '../../../service/user.service';
import { Platform, NavController } from '@ionic/angular';
import { LoadingProvider } from '../../../service/loading';
import { CommonProvider } from '../../../service/common';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  items: any;
  me: any;
  lists: any;

  constructor(
    public ps: PaymentService,
    public ap: AlertProvider,
    public us: UserService,
    public store: InAppPurchase2,
    public plt: Platform,
    public loading: LoadingProvider,
    public common: CommonProvider,
    public platform: Platform,
    public nav: NavController
  ) { 

    this.items = [
      {
        productName: '1개월',
        productId: 'h1',
        price: '15000'
      },
      {
        productName: '3개월',
        productId: 'h3',
        price: '37000'
      }
    ];

    if (this.plt.is('cordova')) { 
      this.loading.show(2000);
    }

  }

  priceReplace(str: any) {
    return str.replace(/[^0-9]/g, '');
  }

  ngOnInit() {
    this.us.getMe().subscribe(res => {
      if (res.success) {
        this.me = res.data;
      } else {
				if (res.errCode) {
					this.common.authCheck(res);
				} else {
					this.ap.alert('', { title: '오류', message: res.message});
				}
			}
    });

    this.plt.ready().then(() => {
      if (this.plt.is('cordova')) { 


        if (!this.store.products.length) {
          this.items.forEach(item => {
            this.store.register({
              id: item.productId,
              alias: item.productId,
              type: this.store.CONSUMABLE
            });
          });
        }

        this.items.forEach(item => {
          this.store.when(item.productId).approved(this.onApproved);
          this.store.when(item.productId).registered(this.onRegistered);
          this.store.when(item.productId).updated(this.onUpdated);
          this.store.when(item.productId).cancelled(this.onCancelled);
          this.store.when(item.productId).error(this.onError);
        });

        this.store.error(this.storeError);
        this.store.ready(this.storeReady);

        this.store.refresh();

      }
    });

  }

  error(e) {
    this.ap.alert('', { title: '오류', message: e});
  }

  ionViewDidLeave () {
    if (this.plt.is('cordova')) {
      this.store.off(this.onApproved);
      this.store.off(this.onRegistered);
      this.store.off(this.onUpdated);
      this.store.off(this.onCancelled);
      this.store.off(this.onError);
      this.store.off(this.storeError);
      this.store.off(this.storeReady);
    }
  }

  onApproved:IAPQueryCallback = (p: IAPProduct) => {
    let result = p.transaction;

    let obj = {
      productId: p.id,
      productName: p.title,
      price: p.price,
      transaction: result,
      signature: '',
      receipt: ''
    }

    if (this.platform.is('android')) {
      obj.receipt = JSON.parse(p.transaction.receipt);
      obj.signature = result.signature;
    }

    this.buyProduct(p, obj);

  }

  onRegistered(p: IAPProduct) {
  }

  onUpdated(p: IAPProduct) {
    if (p.loaded && p.valid && p.state === 'approved') {
      p.finish();
    }
  }

  onCancelled(p: IAPProduct) {
  }

  onError:IAPQueryCallback = (error) => {
    this.error('An Error Occured' + JSON.stringify(error));
  }

  storeError:IAPQueryCallback = (err) => {
    this.error('Store Error' + JSON.stringify(err));
  }

  storeReady:IAPQueryCallback = () => {
    this.lists = this.store.products;
    this.loading.hide();
  }


  purchase(productId) {
    
    if (!this.plt.is('cordova')) { return; }
    this.loading.show(2000);
    
    try {
      this.store.order(productId).then((order) => {
        this.loading.hide();
      }).error((e) => {
        this.loading.hide();
      });
    } catch (err) {
    }
  
  }

  buyProduct(p, obj) {
    try {
      this.ps.setPaymentInsert(obj).subscribe(res => {
        if (res.success) {
          p.finish();
          this.ap.alert('', { title: '구매완료!', message: obj.productName.replace(" (앵두 - 등산친구)","") + ' 구매가 완료되었습니다.'});
          this.nav.navigateRoot('/payment/history');
        } else {
          this.ap.alert('', { title: '오류', message: res.message });
        }
      });
    } catch (error) {
    }
  }

  buyProcess(obj) {
    this.ps.setPaymentInsert(obj).subscribe(res => {
      if (res.success) {
        this.ap.alert('', { title: '구매완료!', message: obj.productName + ' 구매가 완료되었습니다.'})
      } else {
        this.ap.alert('', { title: '오류', message: res.message })
      }
    });
  }

  buy(list) {
    this.buyProcess(list);
  }

}
