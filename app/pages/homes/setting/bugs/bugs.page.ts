import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertProvider } from '../../../../service/alert';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../../service/common.service';
import { ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-bugs',
  templateUrl: './bugs.page.html',
  styleUrls: ['./bugs.page.scss'],
})
export class BugsPage implements OnInit {

  bugsForm: FormGroup;
  typeText: any;
  type: any;

  constructor(
    public formBuilder: FormBuilder,
    public ap: AlertProvider,
    public activatedRoute: ActivatedRoute,
    public cs: CommonService,
    public toast: ToastController,
    public nav: NavController
  ) { 

    this.type = this.activatedRoute.snapshot.paramMap.get('type');

    if (this.type === 'bugs') {
      this.typeText = {
        title: '오류, 버그 신고하기',
        place: '오류, 버그사항이 있으면 알려주세요',
        button: '신고'
      }
    } else if (this.type === 'partner') {
      this.typeText = {
        title: '제휴문의',
        place: '입력하세요.',
        button: '문의'
      }
    }
    
    
    this.bugsForm = this.formBuilder.group({
      content: ['', Validators.required],
      type: [this.type]
    });
  }

  ngOnInit() {
  }

  submit() {
    let obj = this.bugsForm.value;

    this.cs.setBugsInsert({ type: obj.type, subject: this.typeText.title, body: obj.content }).subscribe(res => {
      if (res.success) {
        this.toastMsg(this.typeText.button + '가 완료되었습니다.');
        this.nav.back();
      } else {
        this.ap.alert('', { title: '오류', message: res.message });
      }
    });

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
