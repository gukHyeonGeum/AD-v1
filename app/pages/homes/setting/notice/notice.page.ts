import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonInfiniteScroll, IonRefresher } from '@ionic/angular';
import { ContentComponent } from './content/content.component';
import { CommonService } from 'src/app/service/common.service';
import { CommonProvider } from 'src/app/service/common';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.page.html',
  styleUrls: ['./notice.page.scss'],
})
export class NoticePage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
	@ViewChild(IonRefresher) refresher: IonRefresher;

  private limit = 10;
  private skip = 0;

  lists: any;
  
  constructor(
    public modal: ModalController,
    public cs: CommonService,
    public common: CommonProvider
  ) { 
  }

  ngOnInit() {
    this.getNoticeLists();
  }

  getNoticeLists() {
    this.cs.getNoticeList(this.skip, this.limit).subscribe(res => {
      if (res.success) {

        if (this.skip) {
          this.lists = this.lists.concat(res.data);
          this.infiniteScroll.complete();

          if (res.data.length < this.limit) {
            this.infiniteScroll.disabled = true;
            this.skip = 0;
          }
        } else {
          this.lists = res.data;
          this.refresher.complete();

          if (this.lists.length >= this.limit) {
            this.infiniteScroll.disabled = false;
          } else {
            this.infiniteScroll.disabled = true;
          }
        }
      } else {
        this.common.ap.alert('', { title: '오류', message: res.message});
      }
    });
  }

  loadData() {
  	this.skip = this.skip + this.limit;
		this.getNoticeLists();
  }

  doRefresh() {
  	this.skip = 0;
    this.getNoticeLists();
  }  

  async modalOpen(id: any) {
    let modal = await this.modal.create({
      component: ContentComponent,
      componentProps: { id }
    });
    return await modal.present();
  }

}
