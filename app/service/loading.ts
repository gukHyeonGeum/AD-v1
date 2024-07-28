import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable()
export class LoadingProvider {
  
  private spinner = { spinner: 'lines' };
  private loading;

  constructor(
    public loadingController: LoadingController
  ) {
  }

  //Show loading
  async show(dur: number = 0) {
    if (!this.loading) {
      this.loading = await this.loadingController.create({
        spinner: 'lines',
        duration: dur
      });
      await this.loading.present();
    }
  }

  //Hide loading
  hide() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    } else {
      setTimeout(() => {
        if (this.loading) {
          this.loading.dismiss();
          this.loading = null;
        }
      }, 2000);
    }
  }
}
