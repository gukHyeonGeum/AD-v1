import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams, IonInfiniteScroll, IonSearchbar } from '@ionic/angular';

import { CommonService } from '../../../service/common.service';

@Component({
  selector: 'app-search-mount',
  templateUrl: './search-mount.page.html',
  styleUrls: ['./search-mount.page.scss'],
})
export class SearchMountPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonSearchbar) searchbar: IonSearchbar;

	lists: any = [];
  private searchVal: any;
  private result: any;
  flag = false;
  private limit = 15;
  private skip = 0;

  constructor(
  	public modal: ModalController, 
  	public navParams: NavParams,
    public cs: CommonService
  ) {

  }

  ngOnInit() {
    setTimeout(() => {
      this.searchbar.setFocus();  
    }, 500);
  }

  searchMount(event) {

    if (event.detail.value) {

      this.searchVal = event.detail.value;

      this.cs.getFindClub(event.detail.value, this.skip, this.limit).subscribe(res => {
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

            if (this.lists.length >= this.limit) {
              this.infiniteScroll.disabled = false;
            } else {
              this.infiniteScroll.disabled = true;
            }

            if (!this.lists.length) {
              this.flag = true;
            } else {
              this.flag = false;
            }
          }
          
        }
      });
    } else {
      this.lists = [];
    }
  }

  loadData(event) {
    this.skip = this.skip + this.limit;

    this.searchMount({ detail: { value: this.searchVal }});  
  }  

  selected(obj) {
    this.result = obj;
    this.close();
  }

  close() {
    this.modal.dismiss(this.result);
  }

}
