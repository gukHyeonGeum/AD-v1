import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { CommonService } from 'src/app/service/common.service';
import { CommonProvider } from 'src/app/service/common';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  id: number;
  view: any = {
    title: '', body: ''
  };

  constructor(
    public modal: ModalController,
    public navParams: NavParams,
    public cs: CommonService,
    public common: CommonProvider
  ) { 
    this.id = this.navParams.get('id');
  }

  ngOnInit() {
    this.cs.getNoticeContent(this.id).subscribe(res => {
      if (res.success) {
        this.view = res.data;
      } else {
        this.common.ap.alert('', {title:'오류', message:res.message})
      }
    });
  }

  close(flag) {
  	this.modal.dismiss(flag);
  }

}
