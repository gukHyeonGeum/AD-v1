import { Injectable } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

@Injectable()
export class AlertProvider {

  constructor(
    public alertCtrl: AlertController,
    public modal: ModalController
  ) {
  }

  async alert(code, res) {

    const alert = await this.alertCtrl.create({
      header: res.title,
      message: res.message,
      buttons: ['확인']
    });
    await alert.present();
    return alert;
    
  }

  async modalOpen(com) {
    let modal = await this.modal.create({
      component: com,
      // componentProps: { id: userId, idx: index }
    });
    return await modal.present();
  }  

  showErrorMessage(code, res) {
    
    switch (code) {
      // Firebase Error Messages
      case 'image/error-image-upload':
        res.title = 'Image Upload Failed!';
        res.message = 'Sorry but we\'ve encountered an error uploading selected image.';
        this.alert(code, res);
      break;
      default:
        res.title = '알림';
        this.alert(code, res);
      break;
    }
  }
}