import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AlertProvider } from '../../../service/alert';
import { CommonService } from '../../../service/common.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  user: any;
  me: any;
  etcText: boolean = false;
  reportForm: FormGroup;
  reportContent: any;

  constructor(
    public navParams: NavParams,
    public modal: ModalController,
    public formBuilder: FormBuilder,
    public ap: AlertProvider,
    public cs: CommonService,
    public toast: ToastController
  ) { 
    this.user = this.navParams.get('user');
    this.me = this.navParams.get('me');
    
    this.reportForm = this.formBuilder.group({
      reportNum: ['1'],
      etcMsg: ['']
    });

    this.reportContent = [
      '', 
      '불쾌감을 주는 언행(욕설, 비방 등)', 
      '사생활 침해', 
      '광고, 홍보성 글', 
      '가짜 프로필 사진', 
      '허위 가입(성별, 나이 등)', 
      '기타'
    ];
  }

  ngOnInit() {
  }

  change(event: any) {
    if (event.detail.value == 99) this.etcText = true;
    else this.etcText = false;
  }

  submit() {

    let obj = this.reportForm.value;
    let etcMsg: String;

    if (obj.reportNum == 99) {
      if (!obj.etcMsg) {
        this.ap.alert('', { title: '알림', message: '기타 내용을 입력하세요.'});
        return;
      }
      etcMsg = obj.etcMsg;
    } else {
      etcMsg = this.reportContent[obj.reportNum];
    }

    this.cs.setReportsInsert({ type: 'report', subject: obj.reportNum, body: etcMsg, target: this.user._id }).subscribe(res => {
      if (res.success) {
        this.toastMsg('신고가 완료되었습니다.');
        this.close(true);
      } else {
        this.ap.alert('', { title: '오류', message: res.message });
      }
    });

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
